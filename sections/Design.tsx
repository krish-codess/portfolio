import { DESIGN_WORKS } from "@/data/design-works";
import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { DesignTile } from "@/components/design/DesignTile";

export function Design() {
  return (
    <section id="design" className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel index="05" label="DESIGN" />
        <h2 className="mt-6 font-display uppercase leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}>
          VISUAL WORK
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-12">
        {DESIGN_WORKS.map((work) => (
          <DesignTile key={work.index} work={work} />
        ))}
      </div>
    </section>
  );
}
