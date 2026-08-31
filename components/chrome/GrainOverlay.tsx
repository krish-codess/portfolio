"use client";

import { useEffect, useRef } from "react";

// Generates a small noise tile once (cheap, one-time canvas draw) and reuses it as a
// repeating CSS background — no per-frame redraw, no large PNG asset.
export function GrainOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx || !ref.current) return;

    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    const url = canvas.toDataURL();
    ref.current.style.backgroundImage = `url(${url})`;
  }, []);

  return <div ref={ref} className="grain-layer" aria-hidden="true" />;
}
