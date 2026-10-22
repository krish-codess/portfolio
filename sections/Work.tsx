"use client";

import Link from "next/link";
import { MotionConfig } from "framer-motion";
import { PROJECTS, Project } from "@/data/projects";
import { CODETOBER_2026 } from "@/data/codetober";
import { hasDetail, pad2 } from "@/lib/codetober";
import { cx } from "@/lib/utils";
import { Meta, SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { ProjectVisual, VISUAL_CAPTION } from "@/components/work/ProjectVisual";

const LINK_CLASS = "font-meta text-[11px] uppercase tracking-widest underline-offset-4 hover:underline";
const CARD_CLASS = "border border-border transition-colors duration-300 hover:border-[var(--border-strong)]";

const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;

function Figure({ project, className }: { project: Project; className?: string }) {
  return (
    <figure className={cx("flex flex-col bg-[var(--bg-alt)]", className)}>
      <div className="flex-1">
        <ProjectVisual visual={project.visual} />
      </div>
      <figcaption className="flex justify-between gap-4 border-t border-border px-3 py-2 sm:px-4">
        <Meta className="shrink-0 text-[9px]">FIG. {project.index}</Meta>
        <Meta className="text-right text-[9px]">{VISUAL_CAPTION[project.visual]}</Meta>
      </figcaption>
    </figure>
  );
}

function Links({ project }: { project: Project }) {
  const href = project.cta.href ?? `/work/${project.slug}`;
  return (
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
      <Link href={href} data-cursor="VIEW ↗" className={cx(LINK_CLASS, "text-accent")} aria-label={`${project.cta.label.toLowerCase()}: ${project.title}`}>
        {project.cta.label} →
      </Link>
      {project.links.repo && (
        <a href={project.links.repo} target="_blank" rel="noopener noreferrer" data-cursor="CODE ↗" className={LINK_CLASS} aria-label={`${project.title} source code on GitHub`}>
          SOURCE CODE ↗
        </a>
      )}
      {project.links.live && (
        <a href={project.links.live} target="_blank" rel="noopener noreferrer" data-cursor="LIVE ↗" className={LINK_CLASS} aria-label={`${project.title} live demo`}>
          LIVE DEMO ↗
        </a>
      )}
    </div>
  );
}

function Body({ project, size = "md" }: { project: Project; size?: "lg" | "md" }) {
  return (
    <div className="flex flex-col p-5 sm:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <Meta className="text-accent" dim={false}>
          {project.index}
        </Meta>
        <Meta className="text-right">
          {project.category} · {project.year}
        </Meta>
      </div>
      <h3
        className="mt-6 font-display uppercase leading-[0.9] tracking-tight"
        style={{ fontSize: size === "lg" ? "clamp(2.4rem, 6vw, 4.5rem)" : "clamp(1.8rem, 4vw, 2.6rem)" }}
      >
        {project.title}
      </h3>
      <p className="mt-3 font-meta text-[11px] uppercase tracking-widest text-accent">{project.tagline}</p>
      <p className={cx("mt-5 leading-relaxed", size === "lg" ? "max-w-md" : "max-w-sm text-[15px]")}>{project.description}</p>
      <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1" aria-label={`${project.title} technologies`}>
        {project.technologies.map((t) => (
          <li key={t} className="font-meta text-[10px] uppercase text-muted-fg">
            /{t}
          </li>
        ))}
      </ul>
      <Links project={project} />
    </div>
  );
}

function CodetoberCard({ project }: { project: Project }) {
  const modules = (project.modules ?? []).map((t) => CODETOBER_2026.projects.find((p) => p.title === t)).filter((p) => p !== undefined);
  return (
    <article className={cx(CARD_CLASS, "grid lg:grid-cols-12")}>
      <div className="lg:col-span-5">
        <Body project={project} />
      </div>
      <div className="flex flex-col border-t border-border lg:col-span-7 lg:border-l lg:border-t-0">
        <Figure project={project} className="border-b border-border" />
        <ul className="grid flex-1 gap-px bg-[var(--border)] sm:grid-cols-2">
          {modules.map((m) => {
            const href = hasDetail(m) ? `/codetober/${pad2(m.day)}` : (m.github ?? project.links.repo!);
            return (
              <li key={m.day} className="bg-[var(--bg)]">
                <Link href={href} data-cursor="VIEW ↗" className="group/m block h-full p-4 transition-colors hover:bg-[var(--bg-alt)]" aria-label={`Codetober day ${m.day}: ${m.title}`}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-xl uppercase tracking-tight group-hover/m:text-accent">{m.title}</span>
                    <Meta className="text-[10px]">DAY {pad2(m.day)} ✓</Meta>
                  </div>
                  <p className="mt-2 line-clamp-2 font-meta text-[11px] leading-relaxed text-muted-fg">{m.description}</p>
                  <p className="mt-2 font-meta text-[10px] uppercase text-muted-fg">/{m.technologies?.slice(0, 3).join(" /")}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

export function Work() {
  const spark = bySlug("spark-engine");
  const campuspay = bySlug("campuspay");
  const rul = bySlug("jet-engine-rul");
  const codetober = bySlug("codetober-2026");

  return (
    <MotionConfig reducedMotion="user">
      <section id="work" className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionLabel index="02" label="SELECTED WORK" />
        </Reveal>

        <div className="mt-10 space-y-6">
          <Reveal>
            <article className={cx(CARD_CLASS, "grid lg:grid-cols-12")}>
              <Figure project={spark} className="border-b border-border lg:col-span-7 lg:border-b-0 lg:border-r" />
              <div className="lg:col-span-5">
                <Body project={spark} size="lg" />
              </div>
            </article>
          </Reveal>

          <div className="grid gap-6 xl:grid-cols-2">
            <Reveal>
              <article className={cx(CARD_CLASS, "flex h-full flex-col")}>
                <Figure project={campuspay} className="border-b border-border" />
                <Body project={campuspay} />
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <article className={cx(CARD_CLASS, "flex h-full flex-col")}>
                <Body project={rul} />
                <Figure project={rul} className="mt-auto border-t border-border" />
              </article>
            </Reveal>
          </div>

          <Reveal>
            <CodetoberCard project={codetober} />
          </Reveal>
        </div>
      </section>
    </MotionConfig>
  );
}
