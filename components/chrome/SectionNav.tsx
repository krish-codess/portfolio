"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS } from "@/data/nav";
import { SITE } from "@/data/site-config";
import { cx } from "@/lib/utils";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SectionNav({ activeId }: { activeId: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeId);

  return (
    <>
      {/* Desktop: fixed right-side rail */}
      <nav
        aria-label="Section navigation"
        className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 border border-border bg-background/85 px-4 py-5 backdrop-blur-sm lg:flex"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group flex items-center gap-3 font-meta text-[11px] uppercase tracking-widest"
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={cx(
                  "transition-colors duration-300",
                  isActive ? "text-foreground" : "text-muted-fg group-hover:text-foreground"
                )}
              >
                {item.label}
              </span>
              <span className="relative h-px w-6 bg-border overflow-hidden">
                {isActive && (
                  <motion.span
                    layoutId="nav-strike"
                    className="rhythm-pulse-target absolute inset-0 bg-accent"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </span>
              <span className={cx("tabular-nums", isActive ? "text-foreground" : "text-muted-fg")}>
                {item.index}
              </span>
            </button>
          );
        })}
        <div className="mt-2 font-meta text-[10px] text-muted-fg tabular-nums">
          {String(activeIndex + 1).padStart(2, "0")} / {String(NAV_ITEMS.length).padStart(2, "0")}
        </div>
      </nav>

      {/* Mobile: an editorial index control, not a hamburger -- doubles as a live
          position indicator (shows the current section number) and the menu trigger. */}
      <div className="fixed right-4 top-4 z-50 lg:hidden">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          className="flex min-w-14 flex-col items-center justify-center gap-0.5 border border-border bg-background/90 px-3 py-2 backdrop-blur"
        >
          <span className="font-meta text-[8px] uppercase tracking-widest text-muted-fg">
            {mobileOpen ? "CLOSE" : "INDEX"}
          </span>
          <span className="font-meta text-sm tabular-nums text-foreground">
            {mobileOpen ? "×" : String(activeIndex + 1).padStart(2, "0")}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background px-8 lg:hidden"
          >
            <ul className="flex flex-col gap-5">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      scrollToSection(item.id);
                    }}
                    className={cx(
                      "flex w-full items-baseline justify-between border-b border-border pb-3 font-display text-3xl uppercase",
                      item.id === activeId ? "text-accent" : "text-foreground"
                    )}
                  >
                    {item.label}
                    <span className="font-meta text-xs text-muted-fg">{item.index}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 font-meta text-[11px] text-muted-fg">{SITE.formula}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
