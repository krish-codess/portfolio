#!/usr/bin/env node
// Quick Dial owner controls. Talks to the quick-dial Edge Function's /admin route with your admin
// token. Reads QUICK_DIAL_FUNCTION_URL and QUICK_DIAL_ADMIN_TOKEN from the environment, e.g.
//   node --env-file=.env.local integrations/quick-dial-admin/qd.mjs status
import { createHash, randomBytes } from "node:crypto";

const USAGE = `usage: qd <command>
  new-admin-token                       generate an admin token + the hash to store as a secret
  status                                settings, devices, connection state, canonical source
  register <label> <browser|android> [days]   create a device token (shown once)
  revoke <device_id>                    revoke a device and drop its current track
  sharing <on|off>                      off clears the public status and hides the widget
  show-source <on|off>                  show "PC"/"ANDROID" on the public widget
  policy <recent|priority> [browser,android]  multi-device policy (default: recent)
  clear                                 clear the current track for every device`;

const [cmd, ...args] = process.argv.slice(2);

if (cmd === "new-admin-token") {
  const token = "qda_" + randomBytes(32).toString("base64url");
  console.log(`QUICK_DIAL_ADMIN_TOKEN=${token}            # .env.local only, never commit`);
  console.log(`QUICK_DIAL_ADMIN_TOKEN_SHA256=${createHash("sha256").update(token).digest("hex")}   # Edge Function secret`);
  process.exit(0);
}

const url = process.env.QUICK_DIAL_FUNCTION_URL;
const token = process.env.QUICK_DIAL_ADMIN_TOKEN;
if (!cmd || cmd === "help") {
  console.log(USAGE);
  process.exit(cmd ? 0 : 1);
}
if (!url || !token) {
  console.error("Set QUICK_DIAL_FUNCTION_URL and QUICK_DIAL_ADMIN_TOKEN (see .env.example).");
  process.exit(1);
}

const onOff = (v) => {
  if (v !== "on" && v !== "off") throw new Error("expected on|off");
  return v === "on";
};
const TYPES = { browser: "browser_extension", android: "android_companion" };

function body() {
  switch (cmd) {
    case "status":
      return { action: "status" };
    case "register":
      if (!args[0] || !TYPES[args[1]]) throw new Error("register <label> <browser|android> [days]");
      return { action: "register_device", label: args[0], source_type: TYPES[args[1]], ...(args[2] && { expires_in_days: Number(args[2]) }) };
    case "revoke":
      if (!args[0]) throw new Error("revoke <device_id>");
      return { action: "revoke_device", device_id: args[0] };
    case "sharing":
      return { action: "set_sharing", enabled: onOff(args[0]) };
    case "show-source":
      return { action: "set_show_source", enabled: onOff(args[0]) };
    case "policy":
      return { action: "set_policy", policy: args[0], ...(args[1] && { priority: args[1].split(",").map((t) => TYPES[t] ?? t) }) };
    case "clear":
      return { action: "clear" };
    default:
      throw new Error(`unknown command: ${cmd}\n\n${USAGE}`);
  }
}

try {
  const res = await fetch(`${url.replace(/\/$/, "")}/admin`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body()),
  });
  const out = await res.json().catch(() => ({}));
  console.log(JSON.stringify(out, null, 2));
  if (cmd === "register" && res.ok) console.error("\nCopy the token into the device now. It is not stored and cannot be shown again.");
  process.exit(res.ok ? 0 : 1);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
