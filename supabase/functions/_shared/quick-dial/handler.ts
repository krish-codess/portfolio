// Request handling for the quick-dial Edge Function, written against a small Store interface so
// the exact same code runs on Supabase (index.ts) and in the Node tests (in-memory store).
import {
  emptySource, applyEvent, MAX_BODY_BYTES, projectPublic, rateLimit, selectCanonical, SOURCE_TYPES, validatePayload,
} from "./model.ts";
import type { Policy, PublicStatus, Selection, Settings, SourceState, SourceType } from "./model.ts";

export interface Device {
  id: string;
  owner_id: string;
  label: string;
  source_type: SourceType;
  token_hash: string;
  created_at: number;
  expires_at: number;
  revoked_at: number | null;
  last_seen_at: number | null;
  rate_window_start: number | null;
  rate_window_count: number;
}

export interface Store {
  findDeviceByTokenHash(hash: string): Promise<Device | null>;
  updateDevice(id: string, patch: Partial<Device>): Promise<void>;
  insertDevice(d: Device): Promise<void>;
  listDevices(owner: string): Promise<Device[]>;
  getSettings(owner: string): Promise<Settings>;
  saveSettings(owner: string, s: Settings): Promise<void>;
  getSource(deviceId: string): Promise<SourceState | null>;
  // Sources of devices that are neither revoked nor expired.
  listActiveSources(owner: string, now: number): Promise<SourceState[]>;
  saveSource(owner: string, s: SourceState): Promise<void>;
  deleteSource(deviceId: string): Promise<void>;
  getPublicVersion(owner: string): Promise<number>;
  // Optimistic concurrency: false if someone else wrote first.
  savePublic(status: PublicStatus, expectedVersion: number): Promise<boolean>;
}

export interface Env {
  ownerId: string;
  adminTokenSha256: string | undefined;
  now: () => number;
  randomToken: () => string;
  randomId: () => string;
}

export async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// No Access-Control-Allow-Origin: browsers' web pages can't call this endpoint at all. The
// extension calls it with an explicit host permission; the Android app isn't subject to CORS.
// (CORS is not the auth layer -- the bearer token is.)
const json = (status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...extra } });

async function readJson(req: Request): Promise<{ ok: true; value: unknown } | { ok: false; res: Response }> {
  const len = Number(req.headers.get("content-length") ?? "0");
  if (len > MAX_BODY_BYTES) return { ok: false, res: json(413, { error: "payload too large" }) };
  const text = await req.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return { ok: false, res: json(413, { error: "payload too large" }) };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, res: json(400, { error: "invalid JSON" }) };
  }
}

const bearer = (req: Request) => {
  const m = /^Bearer\s+(\S{20,200})$/.exec(req.headers.get("authorization") ?? "");
  return m ? m[1] : null;
};

// Recompute the canonical row from every active source and write it with a version check,
// retrying if another request wrote in between.
export async function recompute(store: Store, owner: string, now: number): Promise<Selection> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const version = await store.getPublicVersion(owner);
    const settings = await store.getSettings(owner);
    const sources = await store.listActiveSources(owner, now);
    const sel = selectCanonical(sources, settings, now);
    if (await store.savePublic(projectPublic(owner, sel, settings, now), version)) return sel;
  }
  throw new Error("public status write conflict");
}

async function ingest(req: Request, store: Store, env: Env): Promise<Response> {
  const token = bearer(req);
  if (!token) return json(401, { error: "missing device token" });
  const device = await store.findDeviceByTokenHash(await sha256Hex(token));
  const now = env.now();
  if (!device || device.owner_id !== env.ownerId) return json(401, { error: "unknown device" });
  if (device.revoked_at !== null) return json(403, { error: "device revoked" });
  if (device.expires_at <= now) return json(403, { error: "device credential expired" });

  const rl = rateLimit(device.rate_window_start, device.rate_window_count, now);
  await store.updateDevice(device.id, { rate_window_start: rl.windowStart, rate_window_count: rl.count });
  if (!rl.allowed) return json(429, { error: "rate limited" }, { "retry-after": String(rl.retryAfterS) });

  const body = await readJson(req);
  if (!body.ok) return body.res;
  const v = validatePayload(body.value);
  if (!v.ok) return json(422, { error: v.error });

  const settings = await store.getSettings(env.ownerId);
  if (!settings.sharing_enabled) {
    // Nothing is stored while sharing is off; the device should stop publishing.
    await store.updateDevice(device.id, { last_seen_at: now });
    return json(409, { error: "sharing disabled", sharing_enabled: false });
  }

  const prev = (await store.getSource(device.id)) ?? emptySource(device.id, device.source_type);
  const next = applyEvent(prev, v.value, now);
  if (!next.ok) return json(409, { error: next.error });
  await store.saveSource(env.ownerId, next.value);
  await store.updateDevice(device.id, { last_seen_at: now });
  const sel = await recompute(store, env.ownerId, now);
  return json(200, { ok: true, canonical: sel.source?.source_id === device.id, state: sel.state, reason: sel.reason });
}

type AdminBody = { action?: unknown; [k: string]: unknown };

async function admin(req: Request, store: Store, env: Env): Promise<Response> {
  const token = bearer(req);
  if (!env.adminTokenSha256 || !token || !constantTimeEqual(await sha256Hex(token), env.adminTokenSha256.toLowerCase())) {
    return json(401, { error: "unauthorized" });
  }
  const body = await readJson(req);
  if (!body.ok) return body.res;
  const b = (typeof body.value === "object" && body.value !== null ? body.value : {}) as AdminBody;
  const owner = env.ownerId;
  const now = env.now();
  const settings = await store.getSettings(owner);

  switch (b.action) {
    case "status": {
      const devices = await store.listDevices(owner);
      const sources = await store.listActiveSources(owner, now);
      const sel = selectCanonical(sources, settings, now);
      return json(200, {
        settings,
        canonical: { state: sel.state, reason: sel.reason, source_id: sel.source?.source_id ?? null },
        devices: devices.map((d) => {
          const s = sources.find((x) => x.source_id === d.id);
          return {
            id: d.id, label: d.label, source_type: d.source_type,
            created_at: new Date(d.created_at).toISOString(), expires_at: new Date(d.expires_at).toISOString(),
            revoked_at: d.revoked_at && new Date(d.revoked_at).toISOString(),
            last_seen_at: d.last_seen_at && new Date(d.last_seen_at).toISOString(),
            connected: !!s && s.received_at !== null && now - s.received_at <= 180_000 && !s.stopped,
            current: s && !s.stopped ? { title: s.title, artist: s.artist, is_playing: s.is_playing } : null,
          };
        }),
      });
    }
    case "register_device": {
      const label = typeof b.label === "string" ? b.label.trim() : "";
      const type = b.source_type as SourceType;
      const days = b.expires_in_days === undefined ? 180 : Number(b.expires_in_days);
      if (!label || label.length > 60) return json(422, { error: "label must be 1-60 characters" });
      if (!SOURCE_TYPES.includes(type)) return json(422, { error: "source_type must be browser_extension or android_companion" });
      if (!Number.isInteger(days) || days < 1 || days > 730) return json(422, { error: "expires_in_days must be 1-730" });
      const deviceToken = env.randomToken();
      const id = env.randomId();
      await store.insertDevice({
        id, owner_id: owner, label, source_type: type, token_hash: await sha256Hex(deviceToken), created_at: now,
        expires_at: now + days * 86_400_000, revoked_at: null, last_seen_at: null, rate_window_start: null, rate_window_count: 0,
      });
      // The only time the token exists in plaintext. It is never stored or logged.
      return json(201, { device_id: id, token: deviceToken, expires_at: new Date(now + days * 86_400_000).toISOString() });
    }
    case "revoke_device": {
      if (typeof b.device_id !== "string") return json(422, { error: "device_id required" });
      await store.updateDevice(b.device_id, { revoked_at: now });
      await store.deleteSource(b.device_id);
      await recompute(store, owner, now);
      return json(200, { ok: true });
    }
    case "set_sharing": {
      if (typeof b.enabled !== "boolean") return json(422, { error: "enabled must be boolean" });
      await store.saveSettings(owner, { ...settings, sharing_enabled: b.enabled });
      if (!b.enabled) await clearSources(store, owner, now);
      await recompute(store, owner, now);
      return json(200, { ok: true, sharing_enabled: b.enabled });
    }
    case "set_show_source": {
      if (typeof b.enabled !== "boolean") return json(422, { error: "enabled must be boolean" });
      await store.saveSettings(owner, { ...settings, show_source: b.enabled });
      await recompute(store, owner, now);
      return json(200, { ok: true });
    }
    case "set_policy": {
      const policy = b.policy as Policy;
      if (policy !== "recent" && policy !== "priority") return json(422, { error: "policy must be recent or priority" });
      const priority = b.priority === undefined ? settings.priority : (b.priority as SourceType[]);
      if (!Array.isArray(priority) || !priority.every((p) => SOURCE_TYPES.includes(p)) || new Set(priority).size !== priority.length) {
        return json(422, { error: "priority must list distinct source types" });
      }
      await store.saveSettings(owner, { ...settings, policy, priority });
      await recompute(store, owner, now);
      return json(200, { ok: true });
    }
    case "clear": {
      await clearSources(store, owner, now);
      await recompute(store, owner, now);
      return json(200, { ok: true });
    }
    default:
      return json(422, { error: "unknown action" });
  }
}

// Forget every device's current track (keeps seq so old in-flight events stay rejected).
async function clearSources(store: Store, owner: string, now: number) {
  for (const s of await store.listActiveSources(owner, now)) {
    await store.saveSource(owner, { ...emptySource(s.source_id, s.source_type), session_id: s.session_id, last_seq: s.last_seq, received_at: now });
  }
}

export async function handle(req: Request, store: Store, env: Env): Promise<Response> {
  try {
    if (req.method !== "POST") return json(405, { error: "method not allowed" }, { allow: "POST" });
    const path = new URL(req.url).pathname;
    if (path.endsWith("/ingest")) return await ingest(req, store, env);
    if (path.endsWith("/admin")) return await admin(req, store, env);
    return json(404, { error: "not found" });
  } catch (e) {
    console.error("quick-dial error", e instanceof Error ? e.message : e);
    return json(500, { error: "internal error" });
  }
}
