// Quick Dial: the one shared model. Imported by the Edge Function (Deno), the portfolio widget
// (Next.js) and the Node tests, so it must stay runtime-agnostic: no Deno/Node/DOM APIs, and
// relative imports keep their .ts extension.

export type SourceType = "browser_extension" | "android_companion";
export const SOURCE_TYPES: readonly SourceType[] = ["browser_extension", "android_companion"];

// What the canonical public row can say. OFFLINE / UNAVAILABLE are never stored: the widget
// derives them from freshness and fetch errors, so a silent device can't masquerade as "idle".
export type PublicState = "live" | "paused" | "idle" | "hidden";

export type Policy = "recent" | "priority";

// ---- Freshness (all server time, ms) -----------------------------------------------------
// Devices heartbeat every 30s while playing and every 60s while paused.
export const LIVE_STALE_MS = 90_000;
export const PAUSED_STALE_MS = 180_000;
// A pause this long is treated as over, so an idle tab can't hold "paused" forever.
export const PAUSED_MAX_MS = 15 * 60_000;
// sent_at - observed_at (same device clock, so offset-free). Anything older was queued while
// the device was asleep and must not overwrite newer state.
export const MAX_EVENT_AGE_MS = 60_000;

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX = 20;
export const MAX_BODY_BYTES = 4096;

const LIMITS = { title: 300, artist: 300, album: 300, session_id: 64, url: 1000 };
const MAX_DURATION_MS = 24 * 60 * 60_000;

// ---- Ingest payload (what devices send) ----------------------------------------------------
// owner_id, source_id and source_type are never accepted from the body: they come from the
// device credential. received_at / last_seen_at are server-generated.
export interface IngestPayload {
  event: "update" | "stop";
  session_id: string;
  seq: number;
  observed_at: number; // device ms epoch, untrusted
  sent_at: number; // device ms epoch, untrusted; only used relative to observed_at
  title: string | null;
  artist: string | null;
  album: string | null;
  artwork_url: string | null;
  song_url: string | null;
  is_playing: boolean;
  duration_ms: number | null;
  progress_ms: number | null;
}

const PAYLOAD_KEYS = new Set([
  "event", "session_id", "seq", "observed_at", "sent_at", "title", "artist", "album",
  "artwork_url", "song_url", "is_playing", "duration_ms", "progress_ms",
]);

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function cleanText(v: unknown, field: string, max: number): Result<string | null> {
  if (v === null || v === undefined) return { ok: true, value: null };
  if (typeof v !== "string") return { ok: false, error: `${field} must be a string` };
  // Strip control characters, collapse whitespace.
  // eslint-disable-next-line no-control-regex
  const s = v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (s.length > max) return { ok: false, error: `${field} exceeds ${max} characters` };
  return { ok: true, value: s || null };
}

function intOrNull(v: unknown, field: string, max: number): Result<number | null> {
  if (v === null || v === undefined) return { ok: true, value: null };
  if (typeof v !== "number" || !Number.isInteger(v) || v < 0 || v > max) {
    return { ok: false, error: `${field} must be an integer between 0 and ${max}` };
  }
  return { ok: true, value: v };
}

const ARTWORK_HOSTS = ["googleusercontent.com", "ytimg.com", "ggpht.com"];

// Artwork must be https on a YouTube/Google image host; anything else becomes null.
export function sanitizeArtworkUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > LIMITS.url) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.username || u.password || u.port) return null;
  const host = u.hostname.toLowerCase();
  return ARTWORK_HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) ? u.toString() : null;
}

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

// Any YouTube / YouTube Music watch link is reduced to a canonical music.youtube.com URL that
// carries only the video id. Everything else is rejected (null).
export function canonicalSongUrl(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > LIMITS.url) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.username || u.password || u.port) return null;
  const host = u.hostname.toLowerCase();
  let id: string | null = null;
  if (host === "youtu.be") id = u.pathname.slice(1);
  else if (["music.youtube.com", "www.youtube.com", "youtube.com", "m.youtube.com"].includes(host) && u.pathname === "/watch") {
    id = u.searchParams.get("v");
  }
  return id && VIDEO_ID.test(id) ? `https://music.youtube.com/watch?v=${id}` : null;
}

export function validatePayload(raw: unknown): Result<IngestPayload> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return { ok: false, error: "body must be a JSON object" };
  const o = raw as Record<string, unknown>;
  for (const k of Object.keys(o)) if (!PAYLOAD_KEYS.has(k)) return { ok: false, error: `unknown field: ${k}` };

  if (o.event !== "update" && o.event !== "stop") return { ok: false, error: "event must be 'update' or 'stop'" };
  if (typeof o.session_id !== "string" || !/^[A-Za-z0-9_-]{8,64}$/.test(o.session_id)) {
    return { ok: false, error: "session_id must match [A-Za-z0-9_-]{8,64}" };
  }
  if (typeof o.seq !== "number" || !Number.isSafeInteger(o.seq) || o.seq < 0) return { ok: false, error: "seq must be a non-negative integer" };
  for (const k of ["observed_at", "sent_at"] as const) {
    if (typeof o[k] !== "number" || !Number.isSafeInteger(o[k]) || (o[k] as number) <= 0) return { ok: false, error: `${k} must be a positive integer (ms)` };
  }
  const age = (o.sent_at as number) - (o.observed_at as number);
  if (age < -1000 || age > MAX_EVENT_AGE_MS) return { ok: false, error: "event is too old (stale observation)" };
  if (typeof o.is_playing !== "boolean") return { ok: false, error: "is_playing must be a boolean" };

  const title = cleanText(o.title, "title", LIMITS.title);
  const artist = cleanText(o.artist, "artist", LIMITS.artist);
  const album = cleanText(o.album, "album", LIMITS.album);
  const duration = intOrNull(o.duration_ms, "duration_ms", MAX_DURATION_MS);
  const progress = intOrNull(o.progress_ms, "progress_ms", MAX_DURATION_MS);
  for (const r of [title, artist, album, duration, progress]) if (!r.ok) return r;
  for (const k of ["artwork_url", "song_url"] as const) {
    if (o[k] !== null && o[k] !== undefined && (typeof o[k] !== "string" || (o[k] as string).length > LIMITS.url)) {
      return { ok: false, error: `${k} must be a string of at most ${LIMITS.url} characters` };
    }
  }

  const stop = o.event === "stop";
  const t = (title as { value: string | null }).value;
  const dur = (duration as { value: number | null }).value;
  let prog = (progress as { value: number | null }).value;
  if (prog !== null && dur !== null) prog = Math.min(prog, dur);

  return {
    ok: true,
    value: {
      event: o.event,
      session_id: o.session_id,
      seq: o.seq,
      observed_at: o.observed_at as number,
      sent_at: o.sent_at as number,
      // A stop carries no metadata; nothing is "playing" without a title.
      title: stop ? null : t,
      artist: stop ? null : (artist as { value: string | null }).value,
      album: stop ? null : (album as { value: string | null }).value,
      artwork_url: stop ? null : sanitizeArtworkUrl(o.artwork_url),
      song_url: stop ? null : canonicalSongUrl(o.song_url),
      is_playing: !stop && t !== null && o.is_playing,
      duration_ms: stop ? null : dur,
      progress_ms: stop ? null : prog,
    },
  };
}

// ---- Per-source state (one row per registered device) --------------------------------------
export interface SourceState {
  source_id: string;
  source_type: SourceType;
  session_id: string | null;
  last_seq: number;
  title: string | null;
  artist: string | null;
  album: string | null;
  artwork_url: string | null;
  song_url: string | null;
  is_playing: boolean;
  duration_ms: number | null;
  progress_ms: number | null;
  observed_at: number | null; // device clock, informational only
  received_at: number | null; // server clock
  active_since: number | null; // server time the current playing stretch began
  paused_since: number | null; // server time the current pause began
  stopped: boolean;
}

export function emptySource(source_id: string, source_type: SourceType): SourceState {
  return {
    source_id, source_type, session_id: null, last_seq: -1, title: null, artist: null, album: null,
    artwork_url: null, song_url: null, is_playing: false, duration_ms: null, progress_ms: null,
    observed_at: null, received_at: null, active_since: null, paused_since: null, stopped: true,
  };
}

const trackKey = (s: { title: string | null; artist: string | null; song_url: string | null }) => `${s.title}\u0000${s.artist}\u0000${s.song_url}`;

// Apply one validated event to that source's state. Replays and out-of-order events within a
// session are rejected by seq; a new session_id (device restart) starts a fresh sequence.
export function applyEvent(prev: SourceState, p: IngestPayload, now: number): Result<SourceState> {
  if (p.session_id === prev.session_id && p.seq <= prev.last_seq) return { ok: false, error: "stale_seq" };
  const base = { ...prev, session_id: p.session_id, last_seq: p.seq, observed_at: p.observed_at, received_at: now };
  if (p.event === "stop" || p.title === null) {
    return { ok: true, value: { ...emptySource(prev.source_id, prev.source_type), session_id: p.session_id, last_seq: p.seq, observed_at: p.observed_at, received_at: now } };
  }
  const sameTrack = !prev.stopped && trackKey(prev) === trackKey(p);
  // A progress jump backwards on the same track (repeat/restart) counts as a new stretch.
  const restarted = sameTrack && prev.progress_ms !== null && p.progress_ms !== null && p.progress_ms + 5000 < prev.progress_ms;
  return {
    ok: true,
    value: {
      ...base,
      title: p.title, artist: p.artist, album: p.album, artwork_url: p.artwork_url, song_url: p.song_url,
      is_playing: p.is_playing, duration_ms: p.duration_ms, progress_ms: p.progress_ms, stopped: false,
      active_since: p.is_playing ? (sameTrack && prev.is_playing && !restarted ? prev.active_since : now) : null,
      paused_since: p.is_playing ? null : sameTrack && !prev.is_playing ? prev.paused_since : now,
    },
  };
}

// ---- Coordination ---------------------------------------------------------------------------
export interface Settings {
  sharing_enabled: boolean;
  show_source: boolean;
  policy: Policy;
  priority: SourceType[];
}

export type Reason = "sharing_disabled" | "only_active" | "most_recent_active" | "priority" | "paused" | "stale_last_known" | "nothing_playing";

export interface Selection {
  state: PublicState;
  source: SourceState | null;
  reason: Reason;
}

const isFreshLive = (s: SourceState, now: number) => !s.stopped && s.is_playing && s.title !== null && s.received_at !== null && now - s.received_at <= LIVE_STALE_MS;
const isFreshPaused = (s: SourceState, now: number) =>
  !s.stopped && !s.is_playing && s.title !== null && s.received_at !== null && now - s.received_at <= PAUSED_STALE_MS && s.paused_since !== null && now - s.paused_since <= PAUSED_MAX_MS;

// Deterministic: same inputs -> same pick. Device clocks never participate; only server
// receipt times, the configured priority, and finally source_id as a tie-break.
export function selectCanonical(sources: SourceState[], settings: Settings, now: number): Selection {
  if (!settings.sharing_enabled) return { state: "hidden", source: null, reason: "sharing_disabled" };
  const rank = (s: SourceState) => {
    const i = settings.priority.indexOf(s.source_type);
    return i === -1 ? settings.priority.length : i;
  };
  const byId = (a: SourceState, b: SourceState) => (a.source_id < b.source_id ? -1 : a.source_id > b.source_id ? 1 : 0);
  const recent = (a: SourceState, b: SourceState) => (b.active_since ?? 0) - (a.active_since ?? 0);

  const live = sources.filter((s) => isFreshLive(s, now));
  if (live.length) {
    const sorted = [...live].sort((a, b) =>
      settings.policy === "priority" ? rank(a) - rank(b) || recent(a, b) || byId(a, b) : recent(a, b) || rank(a) - rank(b) || byId(a, b),
    );
    const reason: Reason = live.length === 1 ? "only_active" : settings.policy === "priority" ? "priority" : "most_recent_active";
    return { state: "live", source: sorted[0], reason };
  }

  const paused = sources.filter((s) => isFreshPaused(s, now));
  if (paused.length) {
    const sorted = [...paused].sort((a, b) => (b.received_at ?? 0) - (a.received_at ?? 0) || rank(a) - rank(b) || byId(a, b));
    return { state: "paused", source: sorted[0], reason: "paused" };
  }

  // Nobody fresh. If someone was playing/paused and simply went quiet, keep their last state:
  // its stale_after is already in the past, so the widget shows OFFLINE, not a fake "idle".
  const quiet = sources
    .filter((s) => !s.stopped && s.title !== null && s.received_at !== null)
    .sort((a, b) => (b.received_at ?? 0) - (a.received_at ?? 0) || byId(a, b));
  if (quiet.length) {
    const s = quiet[0];
    const pauseExpired = !s.is_playing && s.paused_since !== null && now - s.paused_since > PAUSED_MAX_MS;
    if (!pauseExpired) return { state: s.is_playing ? "live" : "paused", source: s, reason: "stale_last_known" };
  }
  return { state: "idle", source: null, reason: "nothing_playing" };
}

// ---- Public projection (the only thing anonymous visitors can read) ---------------------------
export interface PublicStatus {
  owner_id: string;
  state: PublicState;
  title: string | null;
  artist: string | null;
  album: string | null;
  artwork_url: string | null;
  song_url: string | null;
  duration_ms: number | null;
  progress_ms: number | null;
  progress_at: string | null; // server time progress_ms was measured
  source_type: SourceType | null; // only when the owner opts in
  last_seen_at: string | null;
  stale_after: string | null; // server time after which live/paused must read as OFFLINE
  updated_at: string;
}

const iso = (ms: number | null) => (ms === null ? null : new Date(ms).toISOString());

export function projectPublic(owner_id: string, sel: Selection, settings: Settings, now: number): PublicStatus {
  const s = sel.source;
  const empty: PublicStatus = {
    owner_id, state: sel.state, title: null, artist: null, album: null, artwork_url: null, song_url: null,
    duration_ms: null, progress_ms: null, progress_at: null, source_type: null, last_seen_at: null, stale_after: null,
    updated_at: iso(now)!,
  };
  if (!s || (sel.state !== "live" && sel.state !== "paused")) return empty;
  const received = s.received_at!;
  const staleAfter = sel.state === "live" ? received + LIVE_STALE_MS : Math.min(received + PAUSED_STALE_MS, (s.paused_since ?? received) + PAUSED_MAX_MS);
  return {
    ...empty,
    title: s.title, artist: s.artist, album: s.album, artwork_url: s.artwork_url, song_url: s.song_url,
    duration_ms: s.duration_ms, progress_ms: s.progress_ms, progress_at: iso(received),
    source_type: settings.show_source ? s.source_type : null,
    last_seen_at: iso(received), stale_after: iso(staleAfter),
  };
}

// ---- Rate limiting (fixed window per device) --------------------------------------------------
export function rateLimit(windowStart: number | null, count: number, now: number): { allowed: boolean; windowStart: number; count: number; retryAfterS: number } {
  if (windowStart === null || now - windowStart >= RATE_LIMIT_WINDOW_MS) return { allowed: true, windowStart: now, count: 1, retryAfterS: 0 };
  if (count >= RATE_LIMIT_MAX) return { allowed: false, windowStart, count, retryAfterS: Math.ceil((windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000) };
  return { allowed: true, windowStart, count: count + 1, retryAfterS: 0 };
}
