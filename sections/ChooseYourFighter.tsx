"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FocusId, FOCUS_META, useFocus } from "@/lib/focus/FocusContext";
import { useAppearance } from "@/lib/theme/AppearanceProvider";
import { DesignModeId } from "@/lib/theme/designModes";
import { Meta } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { cx } from "@/lib/utils";

// Choosing a fighter shifts the DESIGN MODE (not color) -- a real, visible change in the
// site's structural language, while leaving whatever color scheme the visitor already has.
const FOCUS_MODE: Record<FocusId, DesignModeId> = {
  data: "digital",
  code: "terminal",
  design: "editorial",
  music: "nocturne",
};

const OPTIONS: FocusId[] = ["data", "code", "design", "music"];

export function ChooseYourFighter() {
  const { focus, setFocus } = useFocus();
  const { setDesignMode } = useAppearance();

  function choose(id: FocusId) {
    setFocus(id);
    setDesignMode(FOCUS_MODE[id]);
    window.setTimeout(() => {
      document.getElementById(FOCUS_META[id].sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
  }

  return (
    <section className="border-t border-border px-5 py-16 sm:px-8 sm:py-20">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display uppercase leading-none tracking-tight" style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.6rem)" }}>
            WHO ARE YOU HERE FOR?
          </h2>
          <AnimatePresence mode="wait">
            {focus ? (
              <motion.button
                key="reset"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setFocus(null)}
                className="font-meta text-[10px] uppercase tracking-widest text-muted-fg hover:text-accent"
              >
                MODE: {FOCUS_META[focus].label} — RESET ↺
              </motion.button>
            ) : (
              <motion.span key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Meta>PICK ONE, OR IGNORE THIS AND SCROLL</Meta>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {OPTIONS.map((id, i) => {
          const meta = FOCUS_META[id];
          const isActive = focus === id;
          return (
            <Reveal key={id} delay={i * 0.05}>
              <button
                onClick={() => choose(id)}
                data-cursor="OPEN ↗"
                className={cx(
                  "group flex h-full w-full flex-col justify-between gap-6 border p-5 text-left transition-colors duration-300",
                  isActive ? "border-accent" : "border-border hover:border-foreground"
                )}
              >
                <span className="font-meta text-[10px] uppercase tracking-widest text-muted-fg">
                  0{i + 1}
                </span>
                <span
                  className="font-display uppercase leading-none tracking-tight transition-colors duration-300"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: isActive ? "var(--accent)" : "var(--fg)" }}
                >
                  {meta.label}
                </span>
                <span className="font-meta text-[9px] uppercase leading-relaxed text-muted-fg">{meta.description}</span>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
