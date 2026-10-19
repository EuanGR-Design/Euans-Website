"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import type { Block } from "@/projects";
import { Reveal } from "./motion";

type Flow = Extract<Block, { type: "flow" }>;

/**
 * A wide annotated flow that pans from its first screen to its last as the
 * page scrolls. The section is as tall as the pan needs, with the image held
 * in view while it moves. With reduced motion, or no room to pan, it's a
 * plain sideways scroller.
 */
export function FlowPan({ b, after }: { b: Flow; after?: React.ReactNode }) {
  const reduce = useReducedMotion();
  const outer = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  // How far the image overhangs the screen, in pixels.
  const [overhang, setOverhang] = useState(0);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * overhang);

  useEffect(() => {
    const measure = () => {
      const el = strip.current;
      if (el) setOverhang(Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const img = b.image;
  // Anything that follows the flow, such as notes on how it was built.
  const more = after && <div className="container-x">{after}</div>;
  const heading = (
    <div className="container-x">
      <Reveal>
        {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
        <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{b.heading}</h2>
        {b.body && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>}
      </Reveal>
    </div>
  );

  if (b.figma) {
    return (
      <section className="border-t border-line py-20 md:py-28">
        {heading}
        <div className="container-x mt-12">
          <Reveal>
            <FigmaFlow figma={b.figma} />
          </Reveal>
        </div>
        {more}
      </section>
    );
  }

  if (!img.src) {
    return (
      <section className="border-t border-line py-20 md:py-28">
        {heading}
        <div className="container-x mt-12">
          <div className="flex aspect-[2/1] items-center justify-center rounded-3xl border border-line bg-raised bg-[radial-gradient(var(--line)_1px,transparent_1px)] p-6 text-center [background-size:16px_16px] md:aspect-[4/1]">
            <span className="eyebrow rounded-full border border-line bg-bg px-3 py-1.5">Annotated user flow coming soon</span>
          </div>
        </div>
        {more}
      </section>
    );
  }

  // The image is 70% of the screen's height, so its width sets the pan.
  const picture = (
    <Image
      src={img.src}
      alt={img.alt}
      width={img.w}
      height={img.h}
      sizes={`${Math.round((70 * img.w) / img.h)}vh`}
      className="h-[min(70vh,70svh)] w-auto max-w-none rounded-3xl border border-line bg-raised"
    />
  );

  if (reduce) {
    return (
      <section className="border-t border-line py-20 md:py-28">
        {heading}
        <div className="mt-12 overflow-x-auto px-5 pb-4 md:px-10">{picture}</div>
        {more}
      </section>
    );
  }

  return (
    <section className="border-t border-line pt-20 md:pt-28">
      {heading}
      <div ref={outer} className="relative mt-12" style={{ height: `calc(100vh + ${overhang}px)` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div ref={strip} style={{ x }} className="flex px-5 md:px-10">
            {picture}
          </motion.div>
        </div>
      </div>
      {more && <div className="pb-20 md:pb-28">{more}</div>}
    </section>
  );
}

/**
 * The flow as a live Figma file. It loads on request, so the page doesn't
 * fetch Figma up front and scrolling past doesn't get caught by its zoom.
 * Phones get a link to open it in Figma instead, as the canvas is too
 * fiddly to pan inside a page that small.
 */
function FigmaFlow({ figma }: { figma: NonNullable<Flow["figma"]> }) {
  const [launched, setLaunched] = useState(false);

  return (
    <>
      <div className="relative h-[min(78vh,760px)] overflow-hidden rounded-[1.75rem] md:rounded-panel border border-line bg-raised max-md:h-auto max-md:aspect-[4/3]">
        <AnimatePresence initial={false}>
          {launched ? (
            <motion.iframe
              key="frame"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={figma.embed}
              title="The Quick Send user flow in Figma"
              allow="fullscreen; clipboard-write"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <motion.div
              key="poster"
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(var(--line)_1px,transparent_1px)] p-6 text-center [background-size:16px_16px]"
            >
              {figma.preview && (
                <>
                  <Image
                    src={figma.preview}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 1200px, 100vw"
                    className="scale-105 object-cover"
                  />
                  <div aria-hidden className="absolute inset-0 bg-bg/30" />
                </>
              )}
              <div className="relative">
                <p
                  className={`mx-auto max-w-xs text-sm md:max-w-sm md:text-base ${
                    figma.preview ? "rounded-2xl bg-bg/85 px-4 py-2.5 text-fg/80 shadow-sm backdrop-blur" : "text-muted"
                  }`}
                >
                  <span className="md:hidden">Every screen, from the dashboard to sent, laid out in Figma.</span>
                  <span className="max-md:hidden">Every screen, from the dashboard to sent. Drag to pan and scroll to zoom.</span>
                </p>
                <button
                  type="button"
                  onClick={() => setLaunched(true)}
                  className="mt-6 hidden items-center gap-2.5 rounded-full bg-fg px-6 py-3.5 font-medium text-bg shadow-xl transition-transform hover:scale-[1.04] md:inline-flex"
                >
                  <FigmaIcon />
                  Explore the flow
                </button>
                <a
                  href={figma.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg shadow-xl md:hidden"
                >
                  <FigmaIcon />
                  Open in Figma
                  <ArrowTopRightOnSquareIcon aria-hidden className="size-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <a
        href={figma.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 hidden items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg md:inline-flex"
      >
        Open in Figma
        <ArrowTopRightOnSquareIcon aria-hidden className="size-4" />
      </a>
    </>
  );
}

function FigmaIcon() {
  return (
    <svg aria-hidden width="11" height="16" viewBox="0 0 38 57" fill="currentColor">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" />
    </svg>
  );
}
