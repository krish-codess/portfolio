"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/projects";
import { Meta } from "@/components/typography/Meta";

function hashHue(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash << 5) - hash + input.charCodeAt(i);
  return Math.abs(hash) % 360;
}

export function ProjectPreview({ project }: { project: Project | null }) {
  return (
    <div className="sticky top-24 hidden lg:block">
      <div className="aspect-[4/3] w-full overflow-hidden border border-border">
        <AnimatePresence mode="wait">
          {project && (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full w-full"
              style={{
                background: `repeating-linear-gradient(135deg, hsl(${hashHue(project.slug)} 40% 30% / 0.16) 0px, hsl(${hashHue(project.slug)} 40% 30% / 0.16) 2px, transparent 2px, transparent 14px), var(--bg-alt)`,
              }}
            >
              <div className="absolute left-4 top-4">
                <Meta>PLACEHOLDER VISUAL</Meta>
              </div>
              <div className="absolute bottom-4 right-4">
                <Meta>FIG. {project.index}</Meta>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
