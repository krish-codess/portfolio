"use client";

import { motion } from "framer-motion";
import { DesignWork } from "@/data/design-works";
import { Meta } from "@/components/typography/Meta";
import { cx } from "@/lib/utils";

const SIZE_CLASSES: Record<DesignWork["size"], string> = {
  large: "sm:col-span-8 aspect-[16/10]",
  medium: "sm:col-span-6 aspect-[4/3]",
  small: "sm:col-span-4 aspect-square",
};

export function DesignTile({ work }: { work: DesignWork }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cx("group relative col-span-1 overflow-hidden border border-border", SIZE_CLASSES[work.size])}
      data-cursor="ZOOM"
    >
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          background: `linear-gradient(155deg, hsl(${work.hue} 55% 88%) 0%, hsl(${work.hue} 45% 68%) 45%, hsl(${work.hue} 40% 30%) 100%)`,
        }}
      />
      <div className="absolute left-4 top-4">
        <Meta className="text-black/60 mix-blend-multiply">PLACEHOLDER VISUAL</Meta>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/55 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div>
          <div className="font-display text-lg uppercase leading-none text-white">{work.title}</div>
          <div className="mt-1 font-meta text-[10px] uppercase tracking-widest text-white/75">{work.medium}</div>
        </div>
        <div className="font-meta text-[10px] text-white/75">{work.year}</div>
      </div>
    </motion.div>
  );
}
