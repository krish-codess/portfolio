"use client";

import { useEffect, useState } from "react";
import { TRACKS } from "@/data/tracks";
import { useAudioPlayer } from "@/lib/hooks/useAudioPlayer";
import { formatTime } from "@/lib/utils";
import { Waveform } from "./Waveform";
import { Meta } from "@/components/typography/Meta";
import { useAudioReactivity } from "@/lib/audio/AudioReactivityContext";

export function AudioPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const track = TRACKS[trackIndex];
  const { isPlaying, currentTime, energy, toggle, reset, duration } = useAudioPlayer(track);
  const { setPlaying } = useAudioReactivity();

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  useEffect(() => {
    setPlaying(isPlaying);
    return () => setPlaying(false);
  }, [isPlaying, setPlaying]);

  const progress = duration ? Math.min(1, currentTime / duration) : 0;

  return (
    <div className="border border-border p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <Meta>CURRENTLY {isPlaying ? "PLAYING" : "PAUSED"}</Meta>
        <Meta>{track.src ? "AUDIO FILE" : "PLACEHOLDER TONE"}</Meta>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <div className="font-display text-3xl uppercase leading-none tracking-tight sm:text-4xl">{track.title}</div>
          <div className="mt-2 font-meta text-[11px] text-muted-fg">{track.artist}</div>
        </div>
        <Waveform energy={energy} isPlaying={isPlaying} />
      </div>

      <div className="mt-8">
        <div className="h-px w-full bg-border">
          <div className="h-px bg-accent transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="mt-2 flex justify-between font-meta text-[10px] tabular-nums text-muted-fg">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <button
          onClick={() => setTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length)}
          aria-label="Previous track"
          className="font-meta text-xs text-muted-fg hover:text-foreground"
        >
          PREV
        </button>
        <button
          onClick={toggle}
          data-cursor={isPlaying ? "PAUSE" : "PLAY ♪"}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-border font-display text-lg"
        >
          {isPlaying ? "II" : "▶"}
        </button>
        <button
          onClick={() => setTrackIndex((i) => (i + 1) % TRACKS.length)}
          aria-label="Next track"
          className="font-meta text-xs text-muted-fg hover:text-foreground"
        >
          NEXT
        </button>
      </div>

      {!track.src && (
        <p className="mt-6 font-meta text-[10px] text-muted-fg">
          No audio file loaded for this track — playing a generated placeholder tone instead. Add a file to
          /public/audio and set `src` in data/tracks.ts to play the real track.
        </p>
      )}
    </div>
  );
}
