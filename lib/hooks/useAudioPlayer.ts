"use client";

import { useEffect, useRef, useState } from "react";
import { Track } from "@/data/tracks";

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  energy: number; // 0..1, drives visualizers
}

// Plays a real file if `track.src` is set. Otherwise synthesizes a soft placeholder tone
// via Web Audio so the player and its visualizer are genuinely functional with zero
// audio assets. Playback only ever starts from an explicit user gesture (toggle()).
export function useAudioPlayer(track: Track) {
  const [state, setState] = useState<AudioPlayerState>({ isPlaying: false, currentTime: 0, energy: 0 });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const startedAtRef = useRef(0);
  const elapsedRef = useRef(0);

  function ensureContext() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
    return audioCtxRef.current;
  }

  function stopSynth() {
    oscRef.current?.stop();
    oscRef.current?.disconnect();
    gainRef.current?.disconnect();
    oscRef.current = null;
    gainRef.current = null;
  }

  function pause() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (track.src && audioElRef.current) {
      elapsedRef.current = audioElRef.current.currentTime;
      audioElRef.current.pause();
    } else if (audioCtxRef.current) {
      elapsedRef.current += audioCtxRef.current.currentTime - startedAtRef.current;
      stopSynth();
    }
    setState((s) => ({ ...s, isPlaying: false, energy: 0 }));
  }

  function tick() {
    const analyser = analyserRef.current;
    let energy = 0;
    if (analyser) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      energy = data.reduce((a, b) => a + b, 0) / data.length / 255;
    }

    let currentTime: number;
    if (track.src && audioElRef.current) {
      currentTime = audioElRef.current.currentTime;
    } else {
      currentTime = elapsedRef.current + (audioCtxRef.current!.currentTime - startedAtRef.current);
    }

    if (currentTime >= track.duration) {
      pause();
      setState((s) => ({ ...s, currentTime: 0 }));
      return;
    }

    setState({ isPlaying: true, currentTime, energy });
    rafRef.current = requestAnimationFrame(tick);
  }

  function play() {
    const ctx = ensureContext();
    if (ctx.state === "suspended") ctx.resume();

    if (track.src) {
      if (!audioElRef.current) {
        const el = new Audio(track.src);
        const source = ctx.createMediaElementSource(el);
        source.connect(analyserRef.current!);
        audioElRef.current = el;
      }
      audioElRef.current.currentTime = elapsedRef.current;
      audioElRef.current.play();
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(196, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 4);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(analyserRef.current!);
      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      startedAtRef.current = ctx.currentTime;
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  function toggle() {
    if (state.isPlaying) pause();
    else play();
  }

  function reset() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    stopSynth();
    audioElRef.current?.pause();
    audioElRef.current = null;
    elapsedRef.current = 0;
    setState({ isPlaying: false, currentTime: 0, energy: 0 });
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopSynth();
      audioElRef.current?.pause();
      audioCtxRef.current?.close();
    };
  }, []);

  return { ...state, toggle, reset, duration: track.duration };
}
