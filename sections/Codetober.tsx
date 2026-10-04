"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { CODETOBER_2026, CodetoberProject } from "@/data/codetober";
import { CodetoberState, getCodetoberDay, getCodetoberState, getCodetoberStats, hasDetail, pad2 } from "@/lib/codetober";
import { cx } from "@/lib/utils";
import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";

const EDITION = CODETOBER_2026;
const TOTAL = EDITION.projects.length;

const STATE_LABEL: Record<CodetoberState, string> = {
  shipped: "✓ SHIPPED",
  today: "● TODAY",
  upcoming: "UPCOMING",
  pending: "PENDING",
};

const subscribe = () => () => {};
const getDay = () => getCodetoberDay(EDITION.year);
// The page is prerendered, so the server never knows the date: -1 means "not yet available"
// and keeps the first client render identical to the static HTML.
const getServerDay = () => -1;

function Card({ project, today }: { project: CodetoberProject; today: number }) {
  const state = getCodetoberState(project, today);
  const isToday = project.day === today;
  const shipped = state === "shipped";
  const title = project.title ?? "PROJECT TBD";

  const body = (
    <>
      <div className="flex items-baseline justify-between gap-2 font-meta text-[10px] uppercase tracking-widest">
        <span className="text-accent">OCT {pad2(project.day)}</span>
        <span className="text-muted-fg">
          {pad2(project.day)} / {TOTAL}
        </span>
      </div>
      <div className="mt-6">
        <div className={cx("font-display text-base uppercase leading-tight tracking-tight", !project.title && "text-muted-fg")}>{title}</div>
        {project.description && <p className="mt-2 line-clamp-3 font-meta text-[10px] leading-relaxed text-muted-fg">{project.description}</p>}
        <div className="mt-2 font-meta text-[10px] uppercase tracking-wide text-muted-fg">{project.technologies?.join(" · ") || "—"}</div>
      </div>
      <div className={cx("mt-auto pt-4 font-meta text-[10px] uppercase tracking-widest", shipped || isToday ? "text-accent" : "text-muted-fg")}>
        {STATE_LABEL[state]}
        {shipped && isToday && " · TODAY"}
      </div>
    </>
  );

  return (
    <li aria-current={isToday ? "date" : undefined} className={cx("flex min-h-[9rem] flex-col bg-background", isToday && "ring-1 ring-inset ring-accent")}>
      {hasDetail(project) ? (
        <Link
          href={`/codetober/${pad2(project.day)}`}
          data-cursor="VIEW ↗"
          aria-label={`Day ${pad2(project.day)}: ${title}, shipped. View project log.`}
          className="flex flex-1 flex-col p-4 transition-colors duration-300 hover:bg-background-alt"
        >
          {body}
        </Link>
      ) : (
        <div className="flex flex-1 flex-col p-4">{body}</div>
      )}
    </li>
  );
}

export function Codetober() {
  const today = useSyncExternalStore(subscribe, getDay, getServerDay);
  const stats = getCodetoberStats(EDITION, today);

  return (
    <section id="codetober" className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel index="08" label={`CODETOBER ${EDITION.year}`} />
        <h2 className="mt-6 font-display uppercase leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}>
          {TOTAL} PROJECTS.
          <br />
          {TOTAL} DAYS.
        </h2>
        <p className="mt-6 max-w-lg font-meta text-[12px] leading-relaxed text-muted-fg">
          One small project every day of October. Each one is shipped, then logged here.
        </p>

        <div className="mt-10 max-w-lg">
          <div className="flex items-baseline justify-between gap-4 font-meta text-[10px] uppercase tracking-widest text-muted-fg">
            <span>
              <span className="text-accent">
                {pad2(stats.shipped)} / {stats.total}
              </span>{" "}
              SHIPPED
            </span>
            <span>
              {today >= 1 && today <= TOTAL && `DAY ${pad2(today)} · `}
              {stats.percent}%
            </span>
          </div>
          {/* One tick per day, in calendar order -- the text above carries the meaning. */}
          <div className="mt-3 flex gap-px" aria-hidden="true">
            {EDITION.projects.map((p) => (
              <span key={p.day} className={cx("h-2 flex-1", p.status === "completed" ? "bg-accent" : "bg-border")} />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <ol className="mt-12 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 lg:grid-cols-8">
          {EDITION.projects.map((p) => (
            <Card key={p.day} project={p} today={today} />
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
