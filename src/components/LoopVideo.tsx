"use client";

import { useEffect, useRef, useState } from "react";
import { basePath } from "@/lib/basePath";

/**
 * A short silent clip that loops while it's on screen and pauses when it
 * isn't. It only loads once it's close to the viewport. With reduced motion
 * it waits on its poster until played. `src` is an .mp4 with a .webm of the
 * same name beside it.
 */
export function LoopVideo({
  src,
  poster,
  label,
  className = "",
  objectPosition,
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  // null until the viewer chooses; then their choice wins over autoplay.
  const [wantsPlay, setWantsPlay] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const nearObserver = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "400px 0px" });
    const visibleObserver = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    nearObserver.observe(el);
    visibleObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, []);

  const shouldPlay = near && visible && (wantsPlay ?? !reduced);

  useEffect(() => {
    const el = ref.current;
    if (!el || !near) return;
    if (shouldPlay) el.play().catch(() => {});
    else el.pause();
  }, [near, shouldPlay]);

  return (
    <div className="group/video relative h-full w-full">
      <video
        ref={ref}
        poster={`${basePath}${poster}`}
        aria-label={label}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={className}
        style={{ objectPosition }}
      >
        {near && (
          <>
            <source src={`${basePath}${src}`} type="video/mp4" />
            <source src={`${basePath}${src.replace(/\.mp4$/, ".webm")}`} type="video/webm" />
          </>
        )}
      </video>
      <button
        type="button"
        onClick={() => setWantsPlay(!playing)}
        aria-label={playing ? "Pause clip" : "Play clip"}
        className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-black/55 text-white opacity-70 backdrop-blur transition-opacity group-hover/video:opacity-100 hover:bg-black/75 focus-visible:opacity-100"
      >
        {playing ? (
          <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
            <rect x="3" y="2" width="3.5" height="12" rx="1" />
            <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="ml-0.5 size-3.5" fill="currentColor" aria-hidden>
            <path d="M4 2.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 4 2.5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
