"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SoftwareProject } from "@/data/software";
import { cx } from "@/lib/utils";

const FIELDS: [keyof SoftwareProject, string][] = [
  ["language", "LANGUAGE"],
  ["frontend", "FRONTEND"],
  ["backend", "BACKEND"],
  ["database", "DATABASE"],
  ["api", "API"],
  ["infrastructure", "INFRASTRUCTURE"],
];

export function SoftwareRow({ project }: { project: SoftwareProject }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left sm:py-8"
        aria-expanded={open}
      >
        <div className="flex items-baseline gap-4 sm:gap-8">
          <span className="font-meta text-[11px] text-muted-fg">{project.index}</span>
          <span
            className="font-display uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.6rem)" }}
          >
            {project.title}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={cx(
              "hidden font-meta text-[10px] uppercase tracking-widest sm:inline",
              project.status === "SHIPPED" && "text-accent",
              project.status === "IN PROGRESS" && "text-foreground",
              project.status === "ARCHIVED" && "text-muted-fg"
            )}
          >
            {project.status}
          </span>
          <span className="font-meta text-[11px] text-muted-fg">{project.year}</span>
          <span className={cx("font-meta text-lg transition-transform duration-300", open && "rotate-45")}>+</span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-6 pb-8 sm:grid-cols-12">
              <p className="font-meta text-[12px] leading-relaxed text-muted-fg sm:col-span-6">{project.description}</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:col-span-6">
                {FIELDS.filter(([key]) => project[key]).map(([key, label]) => (
                  <div key={key} className="flex flex-col border-t border-border pt-2">
                    <dt className="font-meta text-[9px] uppercase tracking-widest text-muted-fg">{label}</dt>
                    <dd className="font-meta text-[11px] text-foreground">{project[key] as string}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
