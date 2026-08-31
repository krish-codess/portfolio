import { DATA_FIGURES } from "@/data/data-figures";
import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { DataGallery } from "@/components/dataviz/DataGallery";
import { CorrelationMachine } from "@/components/dataviz/CorrelationMachine";
import { LiveDataLab } from "@/components/LiveDataLab";

export function DataLab({ visitedCount, totalSections }: { visitedCount: number; totalSections: number }) {
  return (
    <section id="data" className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel index="03" label="THE DATA LAB" />
        <h2 className="mt-6 font-display uppercase leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}>
          DATA I DIDN&apos;T
          <br />
          NEED TO COLLECT
        </h2>
        <p className="mt-6 max-w-lg font-meta text-[12px] leading-relaxed text-muted-fg">
          An archive of measurements about things that probably didn&apos;t need measuring. The subjects
          are mundane; the visualizations are the point. Everything below is clearly labeled -- nothing
          is presented as real personal data unless it says so.
        </p>
      </Reveal>

      <div className="mt-12">
        <DataGallery figures={DATA_FIGURES} />
      </div>

      <div className="mt-14">
        <Reveal>
          <CorrelationMachine />
        </Reveal>
      </div>

      <div className="mt-8">
        <Reveal>
          <LiveDataLab visitedCount={visitedCount} totalSections={totalSections} />
        </Reveal>
      </div>
    </section>
  );
}
