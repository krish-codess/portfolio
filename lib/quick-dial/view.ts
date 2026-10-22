// Pure view model for the Quick Dial widget: turns the public status row + server clock into what
// the widget shows. No React, so it's unit-tested directly (tests/quick-dial/widget.test.ts).
import { canonicalSongUrl, sanitizeArtworkUrl } from "../../supabase/functions/_shared/quick-dial/model.ts";
import type { PublicStatus } from "../../supabase/functions/_shared/quick-dial/model.ts";

export type WidgetKind = "live" | "paused" | "idle" | "offline" | "unavailable" | "hidden" | "loading";

export interface WidgetView {
  kind: WidgetKind;
  title: string | null;
  artist: string | null;
  album: string | null;
  artworkUrl: string | null; // re-validated client-side; null -> fallback art
  trackUrl: string | null; // direct link, or a YouTube Music search built from title/artist
  progressMs: number | null; // null whenever it can't be trusted
  durationMs: number | null;
  source: "PC" | "ANDROID" | null;
  lastSeenMs: number | null; // ms ago, server time
}

const EMPTY: Omit<WidgetView, "kind"> = {
  title: null, artist: null, album: null, artworkUrl: null, trackUrl: null, progressMs: null, durationMs: null, source: null, lastSeenMs: null,
};

const ms = (s: string | null) => (s ? Date.parse(s) : NaN);

export function trackHref(status: Pick<PublicStatus, "song_url" | "title" | "artist">): string | null {
  const direct = canonicalSongUrl(status.song_url);
  if (direct) return direct;
  if (!status.title) return null;
  const q = [status.title, status.artist].filter(Boolean).join(" ");
  return `https://music.youtube.com/search?q=${encodeURIComponent(q)}`;
}

// serverNow: the database clock (from the quick_dial_status RPC), advanced locally since then.
export function deriveView(status: PublicStatus | null, opts: { serverNow: number; error: boolean; loaded: boolean }): WidgetView {
  if (!opts.loaded && !opts.error) return { kind: "loading", ...EMPTY };
  if (!status) return { kind: opts.error ? "unavailable" : "idle", ...EMPTY };
  if (status.state === "hidden") return { kind: "hidden", ...EMPTY };
  if (status.state === "idle" || !status.title) return { kind: "idle", ...EMPTY };

  const lastSeen = ms(status.last_seen_at);
  const staleAfter = ms(status.stale_after);
  const fresh = Number.isFinite(staleAfter) && opts.serverNow <= staleAfter;
  const kind: WidgetKind = !fresh ? "offline" : status.state === "live" ? "live" : "paused";

  let progressMs: number | null = null;
  const dur = status.duration_ms;
  if (status.progress_ms !== null && (kind === "live" || kind === "paused")) {
    const base = status.progress_ms;
    // Advance only while fresh and playing; stops the moment freshness lapses.
    const elapsed = kind === "live" ? Math.max(0, opts.serverNow - ms(status.progress_at)) : 0;
    const p = base + (Number.isFinite(elapsed) ? elapsed : 0);
    progressMs = Math.max(0, dur !== null ? Math.min(p, dur) : p);
  }

  return {
    kind,
    title: status.title,
    artist: status.artist,
    album: status.album,
    artworkUrl: sanitizeArtworkUrl(status.artwork_url),
    trackUrl: trackHref(status),
    progressMs,
    durationMs: dur,
    source: status.source_type === "browser_extension" ? "PC" : status.source_type === "android_companion" ? "ANDROID" : null,
    lastSeenMs: Number.isFinite(lastSeen) ? Math.max(0, opts.serverNow - lastSeen) : null,
  };
}

export function formatAgo(msAgo: number): string {
  const s = Math.round(msAgo / 1000);
  if (s < 60) return `${s}S AGO`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} MIN AGO`;
  const h = Math.round(m / 60);
  return h < 48 ? `${h} H AGO` : `${Math.round(h / 24)} D AGO`;
}

export function formatTrackTime(msVal: number): string {
  const s = Math.floor(msVal / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
