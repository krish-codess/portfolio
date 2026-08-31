// Real, synthesized drum sounds via the Web Audio API -- no samples, no recordings. Kick and
// tom are pitched sine sweeps; snare, hi-hat, and cymbal are filtered noise bursts of
// different length and cutoff. Playback only ever starts from an explicit user gesture
// (RhythmGrid's play button), so this never violates autoplay policy.

let noiseBufferCache: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBufferCache && noiseBufferCache.sampleRate === ctx.sampleRate) return noiseBufferCache;
  const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noiseBufferCache = buffer;
  return buffer;
}

function noiseHit(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  { freq, type, duration, gain }: { freq: number; type: BiquadFilterType; duration: number; gain: number }
) {
  const src = ctx.createBufferSource();
  src.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + duration);
  src.connect(filter).connect(g).connect(destination);
  src.start(time);
  src.stop(time + duration + 0.05);
}

function tone(
  ctx: AudioContext,
  destination: AudioNode,
  time: number,
  { from, to, duration, gain, type = "sine" }: { from: number; to: number; duration: number; gain: number; type?: OscillatorType }
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, time);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), time + duration);
  g.gain.setValueAtTime(gain, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + duration);
  osc.connect(g).connect(destination);
  osc.start(time);
  osc.stop(time + duration + 0.05);
}

export interface DrumSynth {
  kick(time: number): void;
  snare(time: number): void;
  hihat(time: number): void;
  tom(time: number): void;
  cymbal(time: number): void;
}

export function createDrumSynth(ctx: AudioContext, destination: AudioNode): DrumSynth {
  return {
    kick(time) {
      tone(ctx, destination, time, { from: 150, to: 42, duration: 0.22, gain: 0.9 });
    },
    snare(time) {
      noiseHit(ctx, destination, time, { freq: 1600, type: "highpass", duration: 0.16, gain: 0.55 });
      tone(ctx, destination, time, { from: 190, to: 140, duration: 0.09, gain: 0.25, type: "triangle" });
    },
    hihat(time) {
      noiseHit(ctx, destination, time, { freq: 7500, type: "highpass", duration: 0.055, gain: 0.28 });
    },
    tom(time) {
      tone(ctx, destination, time, { from: 210, to: 95, duration: 0.28, gain: 0.75 });
    },
    cymbal(time) {
      noiseHit(ctx, destination, time, { freq: 6000, type: "highpass", duration: 0.55, gain: 0.22 });
    },
  };
}

export const LANE_SOUND: Record<string, keyof DrumSynth> = {
  kick: "kick",
  snare: "snare",
  hihat: "hihat",
  tom: "tom",
  cymbal: "cymbal",
};
