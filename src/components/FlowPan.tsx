"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Block } from "@/projects";
import { Reveal } from "./motion";

type Flow = Extract<Block, { type: "flow" }>;

/**
 * A wide annotated flow that pans from its first screen to its last as the
 * page scrolls. The section is as tall as the pan needs, with the image held
 * in view while it moves. With reduced motion, or no room to pan, it's a
 * plain sideways scroller.
 */
export function FlowPan({ b }: { b: Flow }) {
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
  const heading = (
    <div className="container-x">
      <Reveal>
        {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
        <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{b.heading}</h2>
        {b.body && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg/75">{b.body}</p>}
      </Reveal>
    </div>
  );

  if (!img.src) {
    return (
      <section className="border-t border-line py-20 md:py-28">
        {heading}
        <div className="container-x mt-12">
          <div className="flex aspect-[2/1] items-center justify-center rounded-3xl border border-line bg-raised bg-[radial-gradient(var(--line)_1px,transparent_1px)] p-6 text-center [background-size:16px_16px] md:aspect-[4/1]">
            <span className="eyebrow rounded-full border border-line bg-bg px-3 py-1.5">Annotated user flow coming soon</span>
          </div>
        </div>
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
    </section>
  );
}
