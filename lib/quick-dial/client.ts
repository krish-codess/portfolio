// Browser transport for the feed: the public RPC for reads (status + server clock) and Supabase
// Realtime for pushes. Uses only the publishable/anon key, which RLS limits to reading the
// public row. supabase-js is loaded lazily so it never touches the initial bundle.
import type { PublicStatus } from "../../supabase/functions/_shared/quick-dial/model.ts";
import type { FeedTransport } from "./feed.ts";

export const QUICK_DIAL_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  owner: process.env.NEXT_PUBLIC_QUICK_DIAL_OWNER_ID ?? "owner",
};

export const isConfigured = () => Boolean(QUICK_DIAL_CONFIG.url && QUICK_DIAL_CONFIG.key);

type Row = PublicStatus & { server_now?: string };

export function browserTransport(): FeedTransport {
  const { url, key, owner } = QUICK_DIAL_CONFIG;
  return {
    async fetchStatus() {
      const res = await fetch(`${url}/rest/v1/rpc/quick_dial_status`, {
        method: "POST",
        headers: { apikey: key, authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({ p_owner_id: owner }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const rows = (await res.json()) as Row[];
      const row = rows[0] ?? null;
      const serverNow = row?.server_now ? Date.parse(row.server_now) : Date.now();
      if (row) delete row.server_now;
      return { status: row, serverNow };
    },
    subscribe(onRow, onHealth) {
      let cancelled = false;
      let cleanup = () => {};
      import("@supabase/supabase-js")
        .then(({ createClient }) => {
          if (cancelled) return;
          const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
          const channel = client
            .channel(`quick-dial:${owner}`)
            .on("postgres_changes", { event: "*", schema: "public", table: "quick_dial_public", filter: `owner_id=eq.${owner}` }, (p) => {
              if (p.new && (p.new as Row).owner_id) onRow(p.new as PublicStatus);
            })
            .subscribe((state) => onHealth(state === "SUBSCRIBED"));
          cleanup = () => {
            void client.removeChannel(channel);
            void client.realtime.disconnect();
          };
        })
        .catch(() => onHealth(false));
      return () => {
        cancelled = true;
        cleanup();
      };
    },
  };
}
