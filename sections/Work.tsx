"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS } from "@/data/projects";
import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { ProjectRow } from "@/components/work/ProjectRow";
import { ProjectPreview } from "@/components/work/ProjectPreview";

export function Work() {
  const [activeSlug, setActiveSlug] = useState(PROJECTS[0]?.slug ?? "");
  const activeProject = PROJECTS.find((p) => p.slug === activeSlug) ?? null;

  return (
    <section id="work" className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel index="02" label="SELECTED WORK" />
      </Reveal>

      <div data-shell="split" className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          {PROJECTS.map((project) => (
            <div key={project.slug}>
              <div onClick={() => setActiveSlug(project.slug)}>
                <ProjectRow project={project} isActive={activeSlug === project.slug} onActivate={() => setActiveSlug(project.slug)} />
              </div>
              <AnimatePresence initial={false}>
                {activeSlug === project.slug && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden lg:hidden"
                  >
                    <div className="pb-6 pl-10 pr-2">
                      <p className="max-w-md font-meta text-[12px] leading-relaxed text-muted-fg">{project.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies.map((t) => (
                          <span key={t} className="font-meta text-[10px] uppercase text-muted-fg">
                            /{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {activeProject && (
            <div className="mt-8 hidden max-w-lg lg:block">
              <p className="font-meta text-[12px] leading-relaxed text-muted-fg">{activeProject.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeProject.technologies.map((t) => (
                  <span key={t} className="font-meta text-[10px] uppercase text-muted-fg">
                    /{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <ProjectPreview project={activeProject} />
        </div>
      </div>
    </section>
  );
}
