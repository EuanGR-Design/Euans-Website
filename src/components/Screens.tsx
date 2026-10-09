"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { screens } from "@/content";
import { Reveal } from "./motion";

export function Screens() {
  return (
    <div className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Selected screens</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              More from the Figma source.
            </h3>
          </div>
          <p className="max-w-sm text-muted">
            Final designs from the Console epics, built entirely from the
            shared design system.
          </p>
        </Reveal>

        <div className="mt-14 space-y-16 md:space-y-28">
          {screens.map((s, i) => (
            <Screen key={s.src} s={s} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Screen({ s, flip }: { s: (typeof screens)[number]; flip: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const portrait = s.h > s.w;

  return (
    <figure
      ref={ref}
      className="grid items-center gap-8 lg:grid-cols-12"
    >
      <motion.div
        style={{ y }}
        className={`${portrait ? "mx-auto w-full max-w-xs lg:col-span-5" : "lg:col-span-8"} ${
          flip ? "lg:order-2" : ""
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-2xl shadow-accent/10 md:rounded-3xl">
          <Image
            src={s.src}
            alt={`${s.title}: ${s.caption}`}
            width={s.w}
            height={s.h}
            sizes="(min-width: 1024px) 800px, 100vw"
            className="h-auto w-full"
          />
        </div>
      </motion.div>
      <figcaption className={portrait ? "lg:col-span-7" : "lg:col-span-4"}>
        <Reveal>
          <p className="text-2xl font-semibold tracking-tight md:text-3xl">
            {s.title}
          </p>
          <p className="mt-3 leading-relaxed text-muted">{s.caption}</p>
        </Reveal>
      </figcaption>
    </figure>
  );
}
