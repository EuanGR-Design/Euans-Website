"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowTopRightOnSquareIcon, ChatBubbleLeftEllipsisIcon, PlayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { person } from "@/content";
import { ScaledFrame } from "./Prototype";

const SHOW_EVENT = "show-hero-prototype";
const HERO_ID = "hero-prototype";

// Too small to use inline on phones, where it opens in a new tab instead.
const inline = () => window.matchMedia("(min-width: 768px)").matches;

type Play = { url: string; width: number; screen: [number, number, number, number] };

/**
 * A link to the prototype that, on a laptop or desktop, plays it in the hero
 * instead of leaving the page. Elsewhere it opens in a new tab as usual.
 */
export function PlayLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={(e) => {
        if (!inline() || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        window.dispatchEvent(new Event(SHOW_EVENT));
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById(HERO_ID)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      }}
    >
      {children}
    </a>
  );
}

/**
 * The final prototype, playable inside the browser window of the hero image.
 * `screen` is the window's content area in the image's pixels (x, y, width,
 * height); the prototype renders `width` wide and is scaled down to fill it.
 * The controls sit on the blue below the window, with a way to send feedback.
 */
export function HeroPrototype({ play, image, title }: { play: Play; image: { w: number; h: number }; title: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const show = () => setOn(true);
    window.addEventListener(SHOW_EVENT, show);
    return () => window.removeEventListener(SHOW_EVENT, show);
  }, []);

  const [x, y, w, h] = play.screen;
  const pct = (n: number, of: number) => `${(n / of) * 100}%`;
  const feedback = `mailto:${person.email}?subject=${encodeURIComponent(`Feedback on the ${title} prototype`)}`;
  const pill = "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors lg:h-11 lg:px-5";

  return (
    <>
      <span id={HERO_ID} aria-hidden className="pointer-events-none absolute inset-0" />
      <AnimatePresence>
        {on && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute hidden overflow-hidden bg-white md:block"
            // The window's bottom corners, as a share of its width and height.
            style={{ left: pct(x, image.w), top: pct(y, image.h), width: pct(w, image.w), height: pct(h, image.h), borderRadius: "0 0 2% 2% / 0 0 3% 3%" }}
          >
            <ScaledFrame p={{ url: play.url, width: play.width, height: Math.round((play.width * h) / w) }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute inset-x-0 bottom-0 hidden items-center justify-center gap-3 px-6 text-white md:flex"
        style={{ height: pct(image.h - y - h, image.h) }}
      >
        {on ? (
          <>
            <span className="hidden text-white/85 lg:inline">Spotted something that could be better?</span>
            <a href={feedback} className={`${pill} bg-white text-[#2b3bd6] hover:bg-white/90`}>
              <ChatBubbleLeftEllipsisIcon aria-hidden className="size-4" />
              Send feedback
            </a>
            <a href={play.url} target="_blank" rel="noreferrer" className={`${pill} bg-white/15 hover:bg-white/25`}>
              <ArrowTopRightOnSquareIcon aria-hidden className="size-4" />
              Open in a new tab
            </a>
            <button
              type="button"
              onClick={() => setOn(false)}
              aria-label="Close the prototype"
              className="flex size-10 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25 lg:size-11"
            >
              <XMarkIcon aria-hidden className="size-5" />
            </button>
          </>
        ) : (
          <>
            <span className="text-white/85">Want to test it yourself?</span>
            <button type="button" onClick={() => setOn(true)} className={`${pill} bg-white text-[#2b3bd6] hover:bg-white/90`}>
              <PlayIcon aria-hidden className="size-4" />
              Have a play
            </button>
          </>
        )}
      </div>
    </>
  );
}
