import { SITE } from "@/data/site-config";
import { SKILLS } from "@/data/skills";
import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { SystemStatus } from "@/components/SystemStatus";

const META_ROWS: [string, string][] = [
  ["BASED IN", SITE.location],
  ["DISCIPLINE", SITE.discipline],
  ["CURRENTLY", SITE.currently],
  ["INTERESTS", SITE.interests],
];

export function About() {
  return (
    <section id="about" className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel index="09" label="ABOUT" />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="space-y-5 font-display uppercase leading-tight tracking-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}>
              {SITE.aboutParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-12 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-border pt-8 sm:grid-cols-2">
              {META_ROWS.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="font-meta text-[10px] uppercase tracking-widest text-muted-fg">{label}</dt>
                  <dd className="font-meta text-[13px] text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={0.15}>
            <div className="space-y-8">
              {SKILLS.map((group) => (
                <div key={group.category} className="border-t border-border pt-4">
                  <h3 className="font-meta text-[11px] uppercase tracking-widest text-accent">{group.category}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="font-display text-lg uppercase leading-tight tracking-tight text-muted-fg">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8">
              <SystemStatus />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
