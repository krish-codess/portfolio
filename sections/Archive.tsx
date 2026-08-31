import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { ArchiveList } from "@/components/archive/ArchiveList";

export function Archive() {
  return (
    <section id="archive" className="border-t border-border px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel index="08" label="ARCHIVE" />
        <h2 className="mt-6 font-display uppercase leading-[0.9] tracking-tight" style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)" }}>
          EVERYTHING,
          <br />
          SO FAR.
        </h2>
      </Reveal>

      <div className="mt-10">
        <Reveal>
          <ArchiveList />
        </Reveal>
      </div>
    </section>
  );
}
