import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CODETOBER_2026 } from "@/data/codetober";
import { hasDetail, pad2 } from "@/lib/codetober";
import { GrainOverlay } from "@/components/chrome/GrainOverlay";
import { Meta } from "@/components/typography/Meta";

const EDITION = CODETOBER_2026;

// Only shipped, titled projects get a page; every other /codetober/* URL is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return EDITION.projects.filter(hasDetail).map((p) => ({ day: pad2(p.day) }));
}

const findProject = (day: string) => EDITION.projects.find((p) => hasDetail(p) && pad2(p.day) === day);

export async function generateMetadata({ params }: PageProps<"/codetober/[day]">): Promise<Metadata> {
  const project = findProject((await params).day);
  if (!project) return {};
  return {
    title: `${project.title} — CODETOBER ${EDITION.year}, DAY ${pad2(project.day)}`,
    description: project.description,
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-8">
      <h2 className="font-meta text-[11px] font-normal uppercase tracking-widest text-muted-fg">{label}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const LINK_CLASS = "font-meta text-[11px] uppercase tracking-widest underline-offset-4 hover:text-accent hover:underline";

export default async function CodetoberDayPage({ params }: PageProps<"/codetober/[day]">) {
  const project = findProject((await params).day);
  if (!project) notFound();

  const day = pad2(project.day);

  return (
    <>
      <GrainOverlay />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
        <Link href="/#codetober" className={LINK_CLASS}>
          ← CODETOBER {EDITION.year}
        </Link>

        <header className="mt-12 pb-10">
          <div className="flex items-baseline justify-between gap-4">
            <Meta className="text-accent" dim={false}>
              DAY {day}
            </Meta>
            <Meta>
              OCT {day}, {EDITION.year} · {day} / {EDITION.projects.length} · ✓ SHIPPED
            </Meta>
          </div>
          <h1 className="mt-6 font-display uppercase leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}>
            {project.title}
          </h1>
          {project.description && <p className="mt-6 max-w-lg font-meta text-[12px] leading-relaxed text-muted-fg">{project.description}</p>}
        </header>

        {project.details && (
          <Block label="WHAT I BUILT">
            <p className="max-w-xl whitespace-pre-line leading-relaxed">{project.details}</p>
          </Block>
        )}

        {project.technologies?.length ? (
          <Block label="STACK">
            <ul className="space-y-1 font-meta text-[12px] uppercase tracking-wide">
              {project.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Block>
        ) : null}

        {project.learned && (
          <Block label="WHAT I LEARNED">
            <p className="max-w-xl whitespace-pre-line leading-relaxed">{project.learned}</p>
          </Block>
        )}

        {(project.github || project.demo) && (
          <Block label="LINKS">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className={LINK_CLASS} aria-label={`${project.title} source on GitHub`}>
                  GITHUB →
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className={LINK_CLASS} aria-label={`${project.title} live demo`}>
                  LIVE DEMO →
                </a>
              )}
            </div>
          </Block>
        )}

        {project.image && (
          <Block label="SCREENSHOT">
            {/* width/height only reserve space; h-auto lets any aspect ratio through. */}
            <Image src={project.image} alt={`Screenshot of ${project.title}`} width={1600} height={900} className="h-auto w-full border border-border" />
          </Block>
        )}
      </main>
    </>
  );
}
