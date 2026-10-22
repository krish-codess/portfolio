import type { PublicStatus } from "../../supabase/functions/_shared/quick-dial/model.ts";

// DEVELOPMENT PREVIEW ONLY. Used when the dev server is opened with ?quickdial=<state>; the widget
// refuses to use these in production builds. Never shown as real listening data.
export function previewStatus(kind: string, now: number): PublicStatus | null {
  const base: PublicStatus = {
    owner_id: "owner", state: "live", title: "Preview Track (Fixture)", artist: "Sample Artist", album: "Sample Album",
    artwork_url: null, song_url: null, duration_ms: 214_000, progress_ms: 61_000, progress_at: new Date(now).toISOString(),
    source_type: "browser_extension", last_seen_at: new Date(now).toISOString(), stale_after: new Date(now + 90_000).toISOString(),
    updated_at: new Date(now).toISOString(),
  };
  switch (kind) {
    case "live":
      return base;
    case "paused":
      return { ...base, state: "paused" };
    case "offline":
      return { ...base, last_seen_at: new Date(now - 300_000).toISOString(), stale_after: new Date(now - 210_000).toISOString() };
    case "idle":
      return { ...base, state: "idle", title: null };
    case "hidden":
      return { ...base, state: "hidden" };
    default:
      return null;
  }
}
