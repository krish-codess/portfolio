"use client";

import { Project } from "@/data/projects";
import { cx } from "@/lib/utils";

export function ProjectRow({
  project,
  isActive,
  onActivate,
}: {
  project: Project;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      onMouseEnter={onActivate}
      onFocus={onActivate}
      data-cursor="VIEW ↗"
      className="group flex w-full flex-col gap-2 border-b border-border py-6 text-left sm:flex-row sm:items-baseline sm:gap-6 sm:py-8"
    >
      <span className="font-meta text-[11px] text-muted-fg sm:w-10">{project.index}</span>
      <span
        className={cx(
          "font-display uppercase leading-none tracking-tight transition-colors duration-300 sm:flex-1"
        )}
        style={{ fontSize: "clamp(1.8rem, 5vw, 3.2rem)", color: isActive ? "var(--accent)" : "var(--fg)" }}
      >
        {project.title}
      </span>
      <span className="font-meta text-[11px] text-muted-fg sm:w-40">{project.category}</span>
      <span className="font-meta text-[11px] text-muted-fg sm:w-14 sm:text-right">{project.year}</span>
    </button>
  );
}
