"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TRIGGER = "gohel";

export function EasterEgg() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(
      "%cDATA × CODE × DESIGN × MUSIC",
      "font-family: monospace; font-size: 12px; letter-spacing: 2px;"
    );
    console.log("%cType 'gohel' anywhere on the page.", "font-family: monospace; font-size: 11px; color: #77736f;");

    let buffer = "";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buffer === TRIGGER) setOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Hidden terminal"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-[#43ff8f]/40 bg-[#07090a] p-6 font-mono text-[12px] text-[#43ff8f]"
          >
            <p>$ whoami</p>
            <p className="mt-1">krish_gohel — data / code / design / music</p>
            <p className="mt-3">$ status</p>
            <p className="mt-1">curious. slightly obsessive. still experimenting.</p>
            <p className="mt-3 text-[#5b6b60]">{"// press esc, or click anywhere, to close"}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
