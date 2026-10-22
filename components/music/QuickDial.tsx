"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Meta } from "@/components/typography/Meta";
import { cx } from "@/lib/utils";
import { startFeed, type FeedSnapshot } from "@/lib/quick-dial/feed";
import { browserTransport, isConfigured } from "@/lib/quick-dial/client";
import { previewStatus } from "@/lib/quick-dial/fixtures";
import { deriveView, formatAgo, formatTrackTime, type WidgetKind } from "@/lib/quick-dial/view";

const LABEL: Record<WidgetKind, string> = {
  live: "NOW PLAYING",
  paused: "PAUSED",
  idle: "IDLE",
  offline: "OFFLINE",
  unavailable: "UNAVAILABLE",
  hidden: "",
  loading: "TUNING IN",
};

const TICKS = 48;

function useQuickDialFeed(): { snap: FeedSnapshot; preview: string | null; configured: boolean } {
  const [snap, setSnap] = useState<FeedSnapshot>({ status: null, clockOffsetMs: 0, error: false, loaded: false });
  const [preview, setPreview] = useState<string | null>(null);
  const configured = isConfigured();

  useEffect(() => {
    // Dev-only preview fixtures: ?quickdial=live|paused|offline|idle|unavailable|hidden
    const p = process.env.NODE_ENV !== "production" ? new URLSearchParams(window.location.search).get("quickdial") : null;
    if (p) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on mount
      setPreview(p);
      setSnap({ status: previewStatus(p, Date.now()), clockOffsetMs: 0, error: p === "unavailable", loaded: true });
      return;
    }
    if (!configured) return;
    return startFeed(browserTransport(), setSnap, {
      setInterval: (fn, ms) => window.setInterval(fn, ms),
      clearInterval: (id) => window.clearInterval(id as number),
      now: () => Date.now(),
      onVisible: (fn) => {
        const h = () => document.visibilityState === "visible" && fn();
        document.addEventListener("visibilitychange", h);
        return () => document.removeEventListener("visibilitychange", h);
      },
    });
  }, [configured]);

  return { snap, preview, configured };
}

function Dial({ progress, live }: { progress: number | null; live: boolean }) {
  const lit = progress === null ? 0 : Math.round(progress * TICKS);
  return (
    <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
      {Array.from({ length: TICKS }, (_, i) => {
        const a = (i / TICKS) * Math.PI * 2 - Math.PI / 2;
        const on = i < lit;
        return (
          <line
            key={i}
            x1={60 + Math.cos(a) * 53}
            y1={60 + Math.sin(a) * 53}
            x2={60 + Math.cos(a) * (i % 4 === 0 ? 59 : 57)}
            y2={60 + Math.sin(a) * (i % 4 === 0 ? 59 : 57)}
            stroke={on ? "var(--accent)" : "var(--border)"}
            strokeWidth={on && live ? 2 : 1.2}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function FallbackArt() {
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden>
      <rect width="80" height="80" fill="var(--bg-alt)" />
      {[34, 26, 18].map((r) => (
        <circle key={r} cx="40" cy="40" r={r} fill="none" stroke="var(--border)" />
      ))}
      <circle cx="40" cy="40" r="5" fill="var(--accent)" />
    </svg>
  );
}

export function QuickDial() {
  const { snap, preview, configured } = useQuickDialFeed();
  const [now, setNow] = useState(() => Date.now());
  const [brokenArt, setBrokenArt] = useState<string | null>(null);

  const view = deriveView(snap.status, { serverNow: now + snap.clockOffsetMs, error: snap.error, loaded: snap.loaded });

  // Tick fast only while a progress bar is actually moving.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), view.kind === "live" ? 1000 : 15_000);
    return () => window.clearInterval(id);
  }, [view.kind]);

  if (!configured && !preview) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div className="rounded-[var(--radius)] border border-dashed border-border p-4">
        <Meta>QUICK DIAL · NOT CONFIGURED (SEE QUICK_DIAL_SETUP.MD) · DEV ONLY</Meta>
      </div>
    );
  }
  if (view.kind === "hidden") return null;

  const hasTrack = view.kind === "live" || view.kind === "paused" || view.kind === "offline";
  const ratio = view.progressMs !== null && view.durationMs ? view.progressMs / view.durationMs : null;
  const art = view.artworkUrl && view.artworkUrl !== brokenArt ? view.artworkUrl : null;
  const status =
    view.kind === "offline" && view.lastSeenMs !== null
      ? `OFFLINE · LAST REPORT ${formatAgo(view.lastSeenMs)}`
      : view.kind === "idle"
        ? "NOTHING PLAYING RIGHT NOW"
        : view.kind === "unavailable"
          ? "STATUS COULDN'T BE LOADED"
          : LABEL[view.kind];

  return (
    <section
      aria-label="Quick Dial: what Krish is listening to on YouTube Music"
      className="rounded-[var(--radius)] border border-border"
      data-quick-dial-state={view.kind}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
        <h4 className="font-display text-sm uppercase tracking-tight">QUICK DIAL</h4>
        <span className="flex items-center gap-2" role="status" aria-live="polite">
          <span
            className={cx("h-1.5 w-1.5 rounded-full", view.kind === "live" && "qd-live-dot")}
            style={{ background: view.kind === "live" ? "var(--accent)" : view.kind === "paused" ? "var(--fg)" : "var(--muted)" }}
            aria-hidden
          />
          <Meta dim={view.kind !== "live"} className={view.kind === "live" ? "text-accent" : undefined}>
            {preview ? `${LABEL[view.kind] || view.kind} · PREVIEW` : LABEL[view.kind]}
          </Meta>
        </span>
      </div>

      <div className="flex min-h-[148px] items-center gap-5 px-4 py-5 sm:px-5">
        <div className="relative h-[108px] w-[108px] shrink-0">
          <Dial progress={ratio} live={view.kind === "live"} />
          <div className={cx("absolute inset-[14px] overflow-hidden rounded-full border border-border", view.kind === "offline" && "opacity-50 grayscale")}>
            {art ? (
              <Image src={art} alt="" width={80} height={80} unoptimized loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" onError={() => setBrokenArt(art)} />
            ) : (
              <FallbackArt />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {hasTrack ? (
            <>
              <p className={cx("truncate font-display text-lg uppercase leading-tight", view.kind === "offline" && "text-muted-fg")} title={view.title ?? undefined}>
                {view.title}
              </p>
              {view.artist && <p className="mt-1 truncate font-meta text-[11px] uppercase tracking-wide">{view.artist}</p>}
              {view.album && <p className="mt-0.5 truncate font-meta text-[10px] uppercase tracking-wide text-muted-fg">{view.album}</p>}
            </>
          ) : (
            <p className="font-display text-lg uppercase leading-tight text-muted-fg">{view.kind === "loading" ? "…" : "SILENCE."}</p>
          )}
          <p className="mt-3 font-meta text-[10px] uppercase tracking-wide text-muted-fg">{status === LABEL[view.kind] ? "YOUTUBE MUSIC · LISTENING STATUS" : status}</p>
          {view.progressMs !== null && view.durationMs !== null && view.kind !== "offline" && (
            <p className="mt-1 font-meta text-[10px] tabular-nums text-muted-fg">
              {formatTrackTime(view.progressMs)} / {formatTrackTime(view.durationMs)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cx("qd-eq flex h-3 items-end gap-[2px]", view.kind === "live" && "qd-eq-on")} aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="w-[3px]" style={{ background: view.kind === "live" ? "var(--accent)" : "var(--border)", animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
          <Meta className="truncate text-[10px]">
            YT MUSIC{view.source && ` · ${view.source}`}
            {view.lastSeenMs !== null && view.kind !== "offline" && ` · UPDATED ${formatAgo(view.lastSeenMs)}`}
          </Meta>
        </div>
        {hasTrack && view.trackUrl && (
          <a
            href={view.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="OPEN ↗"
            className="shrink-0 font-meta text-[10px] uppercase text-accent underline-offset-4 hover:underline"
            aria-label={`Open ${view.title} on YouTube Music`}
          >
            OPEN TRACK ↗
          </a>
        )}
      </div>
    </section>
  );
}
