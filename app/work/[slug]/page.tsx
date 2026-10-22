import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { GrainOverlay } from "@/components/chrome/GrainOverlay";
import { Meta } from "@/components/typography/Meta";
import { ProjectVisual, VISUAL_CAPTION } from "@/components/work/ProjectVisual";

// Projects whose CTA points elsewhere (Codetober -> its own day pages) get no page here.
export const dynamicParams = false;

const WITH_PAGE = PROJECTS.filter((p) => !p.cta.href);

export function generateStaticParams() {
  return WITH_PAGE.map((p) => ({ slug: p.slug }));
}

const findProject = (slug: string) => WITH_PAGE.find((p) => p.slug === slug);

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = findProject((await params).slug);
  if (!project) return {};
  return { title: `${project.title} — KRISH GOHEL`, description: project.description };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-8">
      <h2 className="font-meta text-[11px] font-normal uppercase tracking-widest text-muted-fg">{label}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="max-w-xl space-y-3 leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="font-meta text-accent" aria-hidden>
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const LINK_CLASS = "font-meta text-[11px] uppercase tracking-widest underline-offset-4 hover:text-accent hover:underline";

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const project = findProject((await params).slug);
  if (!project) notFound();

  return (
    <>
      <GrainOverlay />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
        <Link href="/#work" className={LINK_CLASS}>
          ← SELECTED WORK
        </Link>

        <header className="mt-12 pb-10">
          <div className="flex items-baseline justify-between gap-4">
            <Meta className="text-accent" dim={false}>
              {project.index}
            </Meta>
            <Meta className="text-right">
              {project.category} · {project.year}
            </Meta>
          </div>
          <h1 className="mt-6 font-display uppercase leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}>
            {project.title}
          </h1>
          <p className="mt-4 font-meta text-[11px] uppercase tracking-widest text-accent">{project.tagline}</p>
          <p className="mt-6 max-w-lg leading-relaxed">{project.description}</p>
        </header>

        <figure className="border border-border bg-[var(--bg-alt)]">
          <ProjectVisual visual={project.visual} />
          <figcaption className="border-t border-border px-4 py-2">
            <Meta className="text-[9px]">{VISUAL_CAPTION[project.visual]}</Meta>
          </figcaption>
        </figure>

        {project.role && (
          <Block label="MY ROLE">
            <p className="max-w-xl leading-relaxed">{project.role}</p>
          </Block>
        )}

        <Block label="PROBLEM">
          <p className="max-w-xl leading-relaxed">{project.problem}</p>
        </Block>

        <Block label="WHAT IT DOES">
          <List items={project.highlights} />
        </Block>

        {project.workflow && (
          <Block label="HOW IT FLOWS">
            <ol className="flex flex-wrap items-center gap-2 font-meta text-[11px] uppercase">
              {project.workflow.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-accent" aria-hidden>
                      →
                    </span>
                  )}
                  <span className="border border-border px-2 py-1">{step}</span>
                </li>
              ))}
            </ol>
          </Block>
        )}

        {project.decisions && (
          <Block label="ENGINEERING DECISIONS">
            <List items={project.decisions} />
          </Block>
        )}

        <Block label="EVIDENCE">
          <p className="max-w-xl leading-relaxed">{project.evidence}</p>
        </Block>

        <Block label="STACK">
          <ul className="space-y-1 font-meta text-[12px] uppercase tracking-wide">
            {project.technologies.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Block>

        <Block label="LINKS">
          {project.links.repo || project.links.live ? (
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {project.links.repo && (
                <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className={LINK_CLASS} aria-label={`${project.title} source on GitHub`}>
                  SOURCE CODE ↗
                </a>
              )}
              {project.links.live && (
                <a href={project.links.live} target="_blank" rel="noopener noreferrer" className={LINK_CLASS} aria-label={`${project.title} live demo`}>
                  LIVE DEMO ↗
                </a>
              )}
            </div>
          ) : (
            <Meta>SOURCE IS PRIVATE FOR NOW · NO LIVE DEMO</Meta>
          )}
        </Block>
      </main>
    </>
  );
}
