import { LAB_ENTRIES, LabStatus } from "@/data/lab-notebook";
import { SectionLabel, Meta } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { cx } from "@/lib/utils";

const STATUS_COLOR: Record<LabStatus, string> = {
  ONGOING: "text-foreground",
  "TRYING AGAIN": "text-accent",
  SHIPPED: "text-accent",
  ABANDONED: "text-muted-fg",
};

export function LabNotebook() {
  return (
    <section id="lab" className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel index="07" label="LAB NOTEBOOK" />
        <h2 className="mt-6 font-display uppercase leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)" }}>
          FIELD NOTES
        </h2>
        <p className="mt-6 max-w-lg font-meta text-[12px] leading-relaxed text-muted-fg">
          A running log of things tried while building this site -- including the parts that didn&apos;t
          work. Kept honest on purpose.
        </p>
      </Reveal>

      {/* Kept clear of the far-right edge on purpose -- the fixed section nav is
          vertically centered and would otherwise sit on top of a right-aligned column. */}
      <div className="mt-10 max-w-3xl border-t border-border">
        {LAB_ENTRIES.map((entry, i) => (
          <Reveal key={entry.id} delay={Math.min(i * 0.04, 0.2)}>
            <article className="grid grid-cols-1 gap-3 border-b border-border py-6 font-meta sm:grid-cols-10 sm:gap-6">
              <div className="sm:col-span-2">
                <Meta>{entry.date}</Meta>
              </div>
              <div className="sm:col-span-8">
                <p className="text-[12px] leading-relaxed text-foreground">
                  <span className="text-muted-fg">TRIED — </span>
                  {entry.tried}
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-fg">
                  <span className="text-muted-fg">RESULT — </span>
                  {entry.result}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((t) => (
                      <span key={t} className="text-[9px] uppercase tracking-widest text-muted-fg">
                        /{t}
                      </span>
                    ))}
                  </div>
                  <span className={cx("text-[10px] uppercase tracking-widest", STATUS_COLOR[entry.status])}>
                    · {entry.status}
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
