"use client";

import { useEffect, useRef } from "react";
import { basePath } from "@/lib/basePath";

/**
 * A silent screen recording that loops, unless the viewer prefers reduced
 * motion. `src` is an .mp4 with a .webm of the same name beside it, for
 * browsers without H.264.
 */
export function Video({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      poster={`${basePath}${poster}`}
      aria-label={label}
      muted
      loop
      playsInline
      controls
      preload="metadata"
      className="h-auto w-full"
    >
      <source src={`${basePath}${src}`} type="video/mp4" />
      <source src={`${basePath}${src.replace(/\.mp4$/, ".webm")}`} type="video/webm" />
    </video>
  );
}
