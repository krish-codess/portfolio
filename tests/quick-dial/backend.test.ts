import { test } from "node:test";
import assert from "node:assert/strict";
import { handle, sha256Hex } from "../../supabase/functions/_shared/quick-dial/handler.ts";
import { LIVE_STALE_MS, PAUSED_MAX_MS, RATE_LIMIT_MAX, canonicalSongUrl, sanitizeArtworkUrl, validatePayload } from "../../supabase/functions/_shared/quick-dial/model.ts";
import { memoryStore, testEnv } from "./memory-store.ts";

const ADMIN = "qda_admin_token_for_tests_only_000000000000";

async function setup() {
  const clock = { t: 1_800_000_000_000 };
  const m = memoryStore();
  const env = testEnv(clock, await sha256Hex(ADMIN));
  const call = (path: string, token: string | null, body: unknown, method = "POST") =>
    handle(
      new Request(`http://x/functions/v1/quick-dial/${path}`, {
        method,
        headers: { "content-type": "application/json", ...(token && { authorization: `Bearer ${token}` }) },
        body: method === "POST" ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
      }),
      m.store,
      env,
    );
  const register = async (source_type: string, label = "dev") => {
    const r = await call("admin", ADMIN, { action: "register_device", label, source_type });
    assert.equal(r.status, 201);
    return (await r.json()) as { device_id: string; token: string };
  };
  let seq = 0;
  const event = (over: Record<string, unknown> = {}) => ({
    event: "update", session_id: "session-aaaa", seq: ++seq, observed_at: clock.t, sent_at: clock.t,
    title: "Song", artist: "Artist", album: "Album", artwork_url: "https://lh3.googleusercontent.com/abc=w120",
    song_url: "https://music.youtube.com/watch?v=dQw4w9WgXcQ&list=RD", is_playing: true, duration_ms: 200_000, progress_ms: 10_000, ...over,
  });
  return { clock, m, call, register, event };
}

test("authorized update is accepted and becomes the canonical public status", async () => {
  const { m, call, register, event } = await setup();
  const d = await register("browser_extension");
  const r = await call("ingest", d.token, event());
  assert.equal(r.status, 200);
  assert.equal(m.pub.state, "live");
  assert.equal(m.pub.title, "Song");
  assert.equal(m.pub.song_url, "https://music.youtube.com/watch?v=dQw4w9WgXcQ");
  assert.equal(m.pub.source_type, null, "source hidden unless the owner opts in");
});

test("missing or unknown tokens are rejected", async () => {
  const { m, call, event } = await setup();
  assert.equal((await call("ingest", null, event())).status, 401);
  assert.equal((await call("ingest", "qd_not_a_real_token_000000000000", event())).status, 401);
  assert.equal(m.pub.state, "hidden");
});

test("admin routes reject device tokens and wrong admin tokens", async () => {
  const { call, register } = await setup();
  const d = await register("browser_extension");
  assert.equal((await call("admin", d.token, { action: "status" })).status, 401);
  assert.equal((await call("admin", "qda_wrong_admin_token_000000000000", { action: "clear" })).status, 401);
});

test("invalid payloads are rejected", async () => {
  const { call, register, event } = await setup();
  const d = await register("browser_extension");
  for (const bad of [event({ seq: -1 }), event({ is_playing: "yes" }), event({ owner_id: "evil" }), event({ duration_ms: 1.5 }), event({ session_id: "x" })]) {
    assert.equal((await call("ingest", d.token, bad)).status, 422);
  }
  assert.equal((await call("ingest", d.token, "{not json")).status, 400);
  assert.equal((await call("ingest", d.token, null, "GET")).status, 405);
});

test("oversized metadata and bodies are rejected", async () => {
  const { call, register, event } = await setup();
  const d = await register("browser_extension");
  assert.equal((await call("ingest", d.token, event({ title: "x".repeat(301) }))).status, 422);
  assert.equal((await call("ingest", d.token, event({ album: "x".repeat(5000) }))).status, 413);
});

test("revoked and expired devices are rejected", async () => {
  const { clock, call, register, event, m } = await setup();
  const a = await register("browser_extension");
  await call("ingest", a.token, event());
  assert.equal(m.pub.state, "live");
  await call("admin", ADMIN, { action: "revoke_device", device_id: a.device_id });
  assert.equal(m.pub.state, "idle", "revoking drops that device's track");
  assert.equal((await call("ingest", a.token, event())).status, 403);

  const b = await register("android_companion");
  clock.t += 181 * 86_400_000; // default credential lifetime is 180 days
  assert.equal((await call("ingest", b.token, event({ observed_at: clock.t, sent_at: clock.t }))).status, 403);
});

test("old and replayed events cannot overwrite newer state", async () => {
  const { clock, call, register, event, m } = await setup();
  const pc = await register("browser_extension");
  const phone = await register("android_companion");
  await call("ingest", pc.token, event({ title: "Old track", seq: 10 }));
  // Replay / out-of-order within the same session.
  assert.equal((await call("ingest", pc.token, event({ title: "Older", seq: 9 }))).status, 409);
  clock.t += 5_000;
  await call("ingest", phone.token, event({ title: "New track", session_id: "phone-sess-1", seq: 1, observed_at: clock.t, sent_at: clock.t }));
  assert.equal(m.pub.title, "New track");
  // The PC wakes from sleep and flushes an observation made long ago: rejected by age,
  // judged only from its own clock difference (sent_at - observed_at).
  clock.t += 600_000;
  const r = await call("ingest", pc.token, event({ title: "Old track", seq: 11, observed_at: clock.t - 300_000, sent_at: clock.t }));
  assert.equal(r.status, 422);
  assert.equal(m.pub.title, "New track");
});

test("most recently started source wins when both play; priority policy overrides", async () => {
  const { clock, call, register, event, m } = await setup();
  const pc = await register("browser_extension");
  const phone = await register("android_companion");
  await call("ingest", pc.token, event({ title: "PC song" }));
  clock.t += 2_000;
  await call("ingest", phone.token, event({ title: "Phone song", session_id: "phone-sess-1", observed_at: clock.t, sent_at: clock.t }));
  assert.equal(m.pub.title, "Phone song");
  // A PC heartbeat for the same track must not steal it back (no flip-flopping).
  clock.t += 30_000;
  await call("ingest", pc.token, event({ title: "PC song", observed_at: clock.t, sent_at: clock.t, progress_ms: 40_000 }));
  assert.equal(m.pub.title, "Phone song");

  await call("admin", ADMIN, { action: "set_policy", policy: "priority", priority: ["browser_extension", "android_companion"] });
  assert.equal(m.pub.title, "PC song");
  const status = await (await call("admin", ADMIN, { action: "status" })).json();
  assert.equal(status.canonical.reason, "priority");
  assert.equal(status.canonical.source_id, pc.device_id);
});

test("a source that stops reporting is published as stale, never extended", async () => {
  const { clock, call, register, event, m } = await setup();
  const pc = await register("browser_extension");
  const phone = await register("android_companion");
  await call("ingest", pc.token, event({ title: "PC song" }));
  const staleAfter = Date.parse(m.pub.stale_after!);
  assert.equal(staleAfter, clock.t + LIVE_STALE_MS);
  // PC goes silent. Later the phone reports it's idle: PC is no longer fresh, and its last
  // state is kept with a past stale_after (widget shows OFFLINE), not relabelled as idle/live.
  clock.t += LIVE_STALE_MS + 1;
  await call("ingest", phone.token, event({ title: null, is_playing: false, session_id: "phone-sess-1", observed_at: clock.t, sent_at: clock.t }));
  assert.equal(m.pub.state, "live");
  assert.ok(Date.parse(m.pub.stale_after!) < clock.t, "stale_after stays in the past");
});

test("a pause cannot be held open forever by heartbeats", async () => {
  const { clock, call, register, event, m } = await setup();
  const pc = await register("browser_extension");
  await call("ingest", pc.token, event({ is_playing: false }));
  assert.equal(m.pub.state, "paused");
  for (let t = 0; t < PAUSED_MAX_MS + 120_000; t += 60_000) {
    clock.t += 60_000;
    await call("ingest", pc.token, event({ is_playing: false, observed_at: clock.t, sent_at: clock.t }));
  }
  assert.equal(m.pub.state, "idle");
});

test("explicit stop clears the track", async () => {
  const { call, register, event, m } = await setup();
  const pc = await register("browser_extension");
  await call("ingest", pc.token, event());
  await call("ingest", pc.token, event({ event: "stop" }));
  assert.equal(m.pub.state, "idle");
  assert.equal(m.pub.title, null);
});

test("disabling sharing clears the public status and blocks ingestion", async () => {
  const { call, register, event, m } = await setup();
  const pc = await register("browser_extension");
  await call("ingest", pc.token, event());
  await call("admin", ADMIN, { action: "set_sharing", enabled: false });
  assert.equal(m.pub.state, "hidden");
  assert.equal(m.pub.title, null);
  assert.equal(m.sources.get(pc.device_id)?.title, null, "private per-device state is cleared too");
  const r = await call("ingest", pc.token, event());
  assert.equal(r.status, 409);
  assert.equal(m.pub.state, "hidden");
  await call("admin", ADMIN, { action: "set_sharing", enabled: true });
  assert.equal(m.pub.state, "idle", "re-enabling does not resurrect the old track");
});

test("show_source exposes only the source type", async () => {
  const { call, register, event, m } = await setup();
  const pc = await register("browser_extension");
  await call("admin", ADMIN, { action: "set_show_source", enabled: true });
  await call("ingest", pc.token, event());
  assert.equal(m.pub.source_type, "browser_extension");
  assert.ok(!JSON.stringify(m.pub).includes(pc.device_id), "device id never reaches the public row");
});

test("per-device rate limit", async () => {
  const { call, register, event } = await setup();
  const pc = await register("browser_extension");
  let last = 0;
  for (let i = 0; i <= RATE_LIMIT_MAX; i++) last = (await call("ingest", pc.token, event())).status;
  assert.equal(last, 429);
});

test("URL restrictions", () => {
  assert.equal(canonicalSongUrl("javascript:alert(1)"), null);
  assert.equal(canonicalSongUrl("https://evil.com/watch?v=dQw4w9WgXcQ"), null);
  assert.equal(canonicalSongUrl("http://music.youtube.com/watch?v=dQw4w9WgXcQ"), null);
  assert.equal(canonicalSongUrl("https://youtu.be/dQw4w9WgXcQ"), "https://music.youtube.com/watch?v=dQw4w9WgXcQ");
  assert.equal(sanitizeArtworkUrl("https://evil.com/a.jpg"), null);
  assert.equal(sanitizeArtworkUrl("https://googleusercontent.com.evil.com/a.jpg"), null);
  assert.equal(sanitizeArtworkUrl("data:image/png;base64,AAA"), null);
  assert.ok(sanitizeArtworkUrl("https://i.ytimg.com/vi/x/hqdefault.jpg"));
  // Invalid URLs are dropped, not stored; the rest of the payload still validates.
  const v = validatePayload({ event: "update", session_id: "abcdefgh", seq: 1, observed_at: 1, sent_at: 1, title: "t", artist: null, album: null, artwork_url: "https://evil.com/x", song_url: "nope", is_playing: true, duration_ms: null, progress_ms: null });
  assert.ok(v.ok && v.value.artwork_url === null && v.value.song_url === null);
});
