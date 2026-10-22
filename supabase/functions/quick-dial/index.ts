// Supabase Edge Function entry: POST /quick-dial/ingest (device token) and /quick-dial/admin
// (owner token). SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected by Supabase at runtime;
// the service-role key exists only here, never in the extension, the app or the website.
import { createClient } from "npm:@supabase/supabase-js@2.117.1";
import { handle } from "../_shared/quick-dial/handler.ts";
import type { Device, Store } from "../_shared/quick-dial/handler.ts";
import type { PublicStatus, Settings, SourceState } from "../_shared/quick-dial/model.ts";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ms = (v: string | null) => (v === null ? null : Date.parse(v));
const iso = (v: number | null | undefined) => (v === null || v === undefined ? null : new Date(v).toISOString());

function must<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}

type Row = Record<string, unknown>;

const toDevice = (r: Row): Device => ({
  id: r.id as string,
  owner_id: r.owner_id as string,
  label: r.label as string,
  source_type: r.source_type as Device["source_type"],
  token_hash: r.token_hash as string,
  created_at: ms(r.created_at as string)!,
  expires_at: ms(r.expires_at as string)!,
  revoked_at: ms(r.revoked_at as string | null),
  last_seen_at: ms(r.last_seen_at as string | null),
  rate_window_start: ms(r.rate_window_start as string | null),
  rate_window_count: r.rate_window_count as number,
});

const toSource = (r: Row): SourceState => ({
  source_id: r.device_id as string,
  source_type: r.source_type as SourceState["source_type"],
  session_id: r.session_id as string | null,
  last_seq: Number(r.last_seq),
  title: r.title as string | null,
  artist: r.artist as string | null,
  album: r.album as string | null,
  artwork_url: r.artwork_url as string | null,
  song_url: r.song_url as string | null,
  is_playing: r.is_playing as boolean,
  duration_ms: r.duration_ms as number | null,
  progress_ms: r.progress_ms as number | null,
  observed_at: ms(r.observed_at as string | null),
  received_at: ms(r.received_at as string | null),
  active_since: ms(r.active_since as string | null),
  paused_since: ms(r.paused_since as string | null),
  stopped: r.stopped as boolean,
});

const devicePatch = (p: Partial<Device>): Row => {
  const out: Row = {};
  for (const [k, v] of Object.entries(p)) {
    out[k] = ["created_at", "expires_at", "revoked_at", "last_seen_at", "rate_window_start"].includes(k) ? iso(v as number | null) : v;
  }
  return out;
};

const store: Store = {
  async findDeviceByTokenHash(hash) {
    const data = must(await db.from("quick_dial_devices").select("*").eq("token_hash", hash).maybeSingle());
    return data ? toDevice(data) : null;
  },
  async updateDevice(id, patch) {
    must(await db.from("quick_dial_devices").update(devicePatch(patch)).eq("id", id));
  },
  async insertDevice(d) {
    must(await db.from("quick_dial_devices").insert(devicePatch(d)));
  },
  async listDevices(owner) {
    return must(await db.from("quick_dial_devices").select("*").eq("owner_id", owner).order("created_at")).map(toDevice);
  },
  async getSettings(owner) {
    const r = must(await db.from("quick_dial_settings").select("*").eq("owner_id", owner).single());
    return { sharing_enabled: r.sharing_enabled, show_source: r.show_source, policy: r.policy, priority: r.priority } as Settings;
  },
  async saveSettings(owner, s) {
    must(await db.from("quick_dial_settings").update({ ...s, updated_at: new Date().toISOString() }).eq("owner_id", owner));
  },
  async getSource(deviceId) {
    const data = must(await db.from("quick_dial_sources").select("*").eq("device_id", deviceId).maybeSingle());
    return data ? toSource(data) : null;
  },
  async listActiveSources(owner, now) {
    const rows = must(
      await db
        .from("quick_dial_sources")
        .select("*, quick_dial_devices!inner(revoked_at, expires_at)")
        .eq("owner_id", owner)
        .is("quick_dial_devices.revoked_at", null)
        .gt("quick_dial_devices.expires_at", new Date(now).toISOString()),
    );
    return rows.map(toSource);
  },
  async saveSource(owner, s) {
    must(
      await db.from("quick_dial_sources").upsert({
        device_id: s.source_id, owner_id: owner, source_type: s.source_type, session_id: s.session_id, last_seq: s.last_seq,
        title: s.title, artist: s.artist, album: s.album, artwork_url: s.artwork_url, song_url: s.song_url,
        is_playing: s.is_playing, duration_ms: s.duration_ms, progress_ms: s.progress_ms,
        observed_at: iso(s.observed_at), received_at: iso(s.received_at), active_since: iso(s.active_since),
        paused_since: iso(s.paused_since), stopped: s.stopped,
      }),
    );
  },
  async deleteSource(deviceId) {
    must(await db.from("quick_dial_sources").delete().eq("device_id", deviceId));
  },
  async getPublicVersion(owner) {
    return Number(must(await db.from("quick_dial_public").select("version").eq("owner_id", owner).single()).version);
  },
  async savePublic(status: PublicStatus, expectedVersion) {
    const rows = must(
      await db
        .from("quick_dial_public")
        .update({ ...status, version: expectedVersion + 1 })
        .eq("owner_id", status.owner_id)
        .eq("version", expectedVersion)
        .select("owner_id"),
    );
    return rows.length === 1;
  },
};

const randomToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return "qd_" + btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

Deno.serve((req) =>
  handle(req, store, {
    ownerId: Deno.env.get("QUICK_DIAL_OWNER_ID") ?? "owner",
    adminTokenSha256: Deno.env.get("QUICK_DIAL_ADMIN_TOKEN_SHA256"),
    now: () => Date.now(),
    randomToken,
    randomId: () => crypto.randomUUID(),
  }),
);
