import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { RhythmGrid } from "@/components/music/RhythmGrid";
import { PlaylistList } from "@/components/music/PlaylistList";

export function Music() {
  return (
    <section
      id="music"
      className="border-t border-border bg-background px-5 py-20 text-foreground transition-colors duration-500 sm:px-8 sm:py-28"
    >
      <Reveal>
        <SectionLabel index="04" label="MUSIC" />
        <h2
          className="rhythm-pulse-target mt-6 font-display uppercase leading-[0.9] tracking-tight"
          style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}
        >
          I PLAY DRUMS.
          <br />I LISTEN TO EVERYTHING.
        </h2>
        <p className="mt-6 max-w-lg font-meta text-[12px] leading-relaxed text-muted-fg">
          Not a producer, not a DAW, not a discography. Just a drummer with wide taste and a
          playlist for every mood. The pattern below is synthesized live in your browser --
          press play to actually hear it.
        </p>
      </Reveal>

      <div data-shell="split" className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <RhythmGrid />
          </Reveal>
        </div>
        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <PlaylistList />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
