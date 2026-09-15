"use client";

import { Project } from "@/data/projects";
import { cx } from "@/lib/utils";
import { useAppearance } from "@/lib/theme/AppearanceProvider";

// One Project object, five row grammars. Swiss reads as a measured info-design block,
// Terminal as an inspected command, Archive as a footnoted entry, Kinetic reveals its
// metadata only on hover/focus, and Editorial (the default) stays the oversized magazine
// spread this row started as.
export function ProjectRow({
  project,
  isActive,
  onActivate,
}: {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
}) {
  const { designMode } = useAppearance();
  const titleColor = isActive ? "var(--accent)" : "var(--fg)";

  if (designMode === "swiss") {
    return (
      <button
        onMouseEnter={onActivate}
        onFocus={onActivate}
        data-cursor="VIEW ↗"
        className="grid w-full grid-cols-12 gap-x-3 gap-y-1 border-b border-border py-5 text-left"
      >
        <span className="col-span-2 font-meta text-[11px] tabular-nums text-muted-fg sm:col-span-1">{project.index}</span>
        <span
          className="col-span-10 font-display uppercase leading-none tracking-tight transition-colors duration-200 sm:col-span-6"
          style={{ fontSize: "clamp(1.3rem, 3.2vw, 1.9rem)", color: titleColor }}
        >
          {project.title}
        </span>
        <span className="col-span-6 col-start-3 font-meta text-[10px] uppercase tracking-wide text-muted-fg sm:col-span-3 sm:col-start-8">
          {project.category}
        </span>
        <span className="col-span-6 text-right font-meta text-[10px] uppercase tracking-wide text-muted-fg sm:col-span-2">
          {project.year}
        </span>
      </button>
    );
  }

  if (designMode === "terminal") {
    return (
      <button
        onMouseEnter={onActivate}
        onFocus={onActivate}
        data-cursor="INSPECT"
        className="flex w-full flex-col gap-1 border-b border-border py-5 text-left font-meta"
      >
        <span className="text-[11px] uppercase tracking-wide text-muted-fg">
          <span className="text-accent">$</span> project inspect {project.slug}
        </span>
        <span
          className="mt-1 uppercase leading-none tracking-tight transition-colors duration-200"
          style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", color: titleColor }}
        >
          {project.title}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-fg">
          TYPE {project.category} · YEAR {project.year}
        </span>
      </button>
    );
  }

  if (designMode === "archive") {
    return (
      <button
        onMouseEnter={onActivate}
        onFocus={onActivate}
        data-cursor="VIEW ↗"
        className="flex w-full items-baseline gap-4 border-b border-border py-5 text-left"
      >
        <span className="font-meta text-[10px] text-muted-fg">[{project.index}]</span>
        <span
          className="flex-1 font-display leading-tight transition-colors duration-200"
          style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", color: titleColor }}
        >
          {project.title}
        </span>
        <span className="hidden font-meta text-[10px] italic text-muted-fg sm:inline">
          {project.category}, {project.year}
        </span>
      </button>
    );
  }

  if (designMode === "kinetic") {
    return (
      <button
        onMouseEnter={onActivate}
        onFocus={onActivate}
        data-cursor="OPEN ↗"
        className="group flex w-full items-baseline justify-between gap-4 border-b border-border py-6 text-left"
      >
        <span
          className="font-display uppercase leading-none tracking-tight transition-colors duration-200"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3.2rem)", color: titleColor }}
        >
          {project.title}
        </span>
        <span className="flex shrink-0 items-center gap-3 font-meta text-[10px] uppercase tracking-wide text-muted-fg opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      onMouseEnter={onActivate}
      onFocus={onActivate}
      data-cursor="VIEW ↗"
      className={cx(
        "group flex w-full flex-col gap-2 border-b border-border py-6 text-left sm:flex-row sm:items-baseline sm:gap-6 sm:py-8"
      )}
    >
      <span className="font-meta text-[11px] text-muted-fg sm:w-10">{project.index}</span>
      <span
        className="font-display uppercase leading-none tracking-tight transition-colors duration-300 sm:flex-1"
        style={{ fontSize: "clamp(1.8rem, 5vw, 3.2rem)", color: titleColor }}
      >
        {project.title}
      </span>
      <span className="font-meta text-[11px] text-muted-fg sm:w-40">{project.category}</span>
      <span className="font-meta text-[11px] text-muted-fg sm:w-14 sm:text-right">{project.year}</span>
    </button>
  );
}
