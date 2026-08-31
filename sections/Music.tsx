import { TRACKS } from "@/data/tracks";
import { SectionLabel } from "@/components/typography/Meta";
import { Reveal } from "@/components/typography/Reveal";
import { AudioPlayer } from "@/components/music/AudioPlayer";
import { formatTime } from "@/lib/utils";

export function Music() {
  return (
    <section
      id="music"
      data-theme="nocturne"
      className="border-t border-border bg-background px-5 py-20 text-foreground transition-colors duration-500 sm:px-8 sm:py-28"
    >
      <Reveal>
        <SectionLabel index="06" label="SOUND / MUSIC" />
        <h2
          className="audio-pulse-target mt-6 font-display uppercase leading-[0.9] tracking-tight"
          style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}
        >
          MADE OF TIME,
          <br />
          ORGANIZED.
        </h2>
        <p className="mt-6 max-w-md font-meta text-[12px] leading-relaxed text-muted-fg">
          Music is not a footnote here. Press play — nothing plays until you do.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <AudioPlayer />
          </Reveal>
        </div>
        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <div className="border border-border">
              {TRACKS.map((t, i) => (
                <div key={t.id} className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <span className="font-meta text-[11px] text-muted-fg">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="font-display text-base uppercase leading-none">{t.title}</div>
                      <div className="mt-1 font-meta text-[10px] text-muted-fg">{t.artist}</div>
                    </div>
                  </div>
                  <span className="font-meta text-[10px] tabular-nums text-muted-fg">{formatTime(t.duration)}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
