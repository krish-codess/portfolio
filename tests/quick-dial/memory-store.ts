import type { Device, Env, Store } from "../../supabase/functions/_shared/quick-dial/handler.ts";
import type { PublicStatus, Settings, SourceState } from "../../supabase/functions/_shared/quick-dial/model.ts";

// In-memory Store with the same semantics as the Supabase-backed one in index.ts.
export function memoryStore(owner = "owner") {
  const devices = new Map<string, Device>();
  const sources = new Map<string, SourceState>();
  let settings: Settings = { sharing_enabled: true, show_source: false, policy: "recent", priority: ["browser_extension", "android_companion"] };
  let pub: PublicStatus & { version: number } = {
    owner_id: owner, state: "hidden", title: null, artist: null, album: null, artwork_url: null, song_url: null, duration_ms: null,
    progress_ms: null, progress_at: null, source_type: null, last_seen_at: null, stale_after: null, updated_at: new Date(0).toISOString(), version: 0,
  };
  const store: Store = {
    async findDeviceByTokenHash(h) {
      return [...devices.values()].find((d) => d.token_hash === h) ?? null;
    },
    async updateDevice(id, p) {
      const d = devices.get(id);
      if (d) devices.set(id, { ...d, ...p });
    },
    async insertDevice(d) {
      devices.set(d.id, d);
    },
    async listDevices() {
      return [...devices.values()];
    },
    async getSettings() {
      return settings;
    },
    async saveSettings(_o, s) {
      settings = s;
    },
    async getSource(id) {
      return sources.get(id) ?? null;
    },
    async listActiveSources(_o, now) {
      return [...sources.values()].filter((s) => {
        const d = devices.get(s.source_id);
        return d && d.revoked_at === null && d.expires_at > now;
      });
    },
    async saveSource(_o, s) {
      sources.set(s.source_id, s);
    },
    async deleteSource(id) {
      sources.delete(id);
    },
    async getPublicVersion() {
      return pub.version;
    },
    async savePublic(s, v) {
      if (pub.version !== v) return false;
      pub = { ...s, version: v + 1 };
      return true;
    },
  };
  return { store, devices, sources, get pub() { return pub; }, get settings() { return settings; } };
}

export function testEnv(clock: { t: number }, adminHash?: string): Env {
  let n = 0;
  return {
    ownerId: "owner",
    adminTokenSha256: adminHash,
    now: () => clock.t,
    randomToken: () => `qd_test_token_${++n}_xxxxxxxxxxxxxxxxxxxxxxxx`,
    randomId: () => `device-${n + 1}`,
  };
}
