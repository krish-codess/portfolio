// Live status feed: initial fetch, Realtime subscription, fallback polling while Realtime is
// down, refresh on tab focus, and full cleanup. Transport is injected so it's testable.
import type { PublicStatus } from "../../supabase/functions/_shared/quick-dial/model.ts";

export const FALLBACK_POLL_MS = 25_000;

export interface FeedSnapshot {
  status: PublicStatus | null;
  clockOffsetMs: number; // serverNow - Date.now() at last fetch
  error: boolean;
  loaded: boolean;
}

export interface FeedTransport {
  fetchStatus(): Promise<{ status: PublicStatus | null; serverNow: number }>;
  // Calls onRow for every pushed update and onHealth(true/false) as the channel connects/drops.
  // Returns an unsubscribe function.
  subscribe(onRow: (row: PublicStatus) => void, onHealth: (ok: boolean) => void): () => void;
}

export interface FeedTimers {
  setInterval(fn: () => void, ms: number): unknown;
  clearInterval(id: unknown): void;
  now(): number;
  onVisible?(fn: () => void): () => void;
}

export function startFeed(t: FeedTransport, onChange: (s: FeedSnapshot) => void, timers: FeedTimers): () => void {
  let snap: FeedSnapshot = { status: null, clockOffsetMs: 0, error: false, loaded: false };
  let stopped = false;
  let poll: unknown = null;
  const emit = (patch: Partial<FeedSnapshot>) => {
    if (stopped) return;
    snap = { ...snap, ...patch };
    onChange(snap);
  };

  const refresh = async () => {
    try {
      const { status, serverNow } = await t.fetchStatus();
      emit({ status, clockOffsetMs: serverNow - timers.now(), error: false, loaded: true });
    } catch {
      // Keep the last known row (its stale_after still governs freshness), flag the error.
      emit({ error: true, loaded: true });
    }
  };

  const startPolling = () => {
    if (poll === null && !stopped) poll = timers.setInterval(refresh, FALLBACK_POLL_MS);
  };
  const stopPolling = () => {
    if (poll !== null) timers.clearInterval(poll);
    poll = null;
  };

  void refresh();
  startPolling(); // until Realtime confirms it's connected
  const unsubscribe = t.subscribe(
    (row) => emit({ status: row, error: false, loaded: true }),
    (ok) => {
      if (ok) {
        stopPolling();
        void refresh(); // catch anything missed while disconnected
      } else startPolling();
    },
  );
  const offVisible = timers.onVisible?.(() => void refresh());

  return () => {
    stopped = true;
    stopPolling();
    unsubscribe();
    offVisible?.();
  };
}
