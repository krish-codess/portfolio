"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;
let currentTime = 0;

function tick() {
  currentTime = Date.now();
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (!intervalId) {
    currentTime = Date.now();
    intervalId = setInterval(tick, 1000);
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot() {
  return currentTime;
}

function getServerSnapshot() {
  return 0;
}

// Returns the current epoch ms, ticking once per second via one shared interval for every
// subscriber. Returns 0 before the client has mounted (server snapshot) -- callers treat
// 0 as "not yet available" to keep SSR output stable. The snapshot is cached and only
// updated by the interval itself, per the useSyncExternalStore contract -- calling
// Date.now() directly inside getSnapshot would return a new value on every read and
// force an infinite re-render loop.
export function useClock(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
