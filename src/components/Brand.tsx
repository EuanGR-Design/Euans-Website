"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { brand } from "@/content";
import { Reveal, WordReveal } from "./motion";

export function Brand() {
  return (
    <section id="brand" className="border-t border-line bg-[#0c1457]/40 py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Brand · Legalesign · 2021</p>
            </Reveal>
            <h3 className="mt-4 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
              <WordReveal text={brand.heading} />
            </h3>
          </div>
          <Reveal delay={0.2} className="lg:col-span-5">
            <p className="leading-relaxed text-muted">{brand.body}</p>
          </Reveal>
        </div>

        <Swatches />

        <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
          {brand.pages.map((p, i) => (
            <Reveal
              key={p.src}
              delay={0.05 * (i % 2)}
              className={p.span === "wide" ? "md:col-span-2" : ""}
            >
              <figure className="group overflow-hidden rounded-2xl border border-line bg-raised md:rounded-3xl">
                <div className="overflow-hidden">
                  <Image
                    src={p.src}
                    alt={`Legalesign brand guidelines: ${p.title}`}
                    width={1600}
                    height={1131}
                    sizes={
                      p.span === "wide"
                        ? "(min-width: 1280px) 1200px, 100vw"
                        : "(min-width: 768px) 600px, 100vw"
                    }
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>
                <figcaption className="flex items-center justify-between px-5 py-4 text-sm">
                  <span>{p.title}</span>
                  <span className="eyebrow">Guidelines</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The LS Blue scale, rendered live rather than as a picture. */
function Swatches() {
  return (
    <div className="mt-14">
      {/* Trigger on the wrapper: the bars start at zero height, so they'd
          never intersect the viewport themselves. */}
      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true }}
        className="flex overflow-hidden rounded-2xl border border-line md:rounded-3xl"
      >
        {brand.blues.map((hex, i) => (
          <motion.div
            key={hex}
            variants={{ hidden: { scaleY: 0 }, shown: { scaleY: 1 } }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: hex, originY: 1 }}
            className="flex h-28 flex-1 items-end p-1.5 md:h-40 md:p-3"
          >
            <span
              className={`font-mono text-[9px] leading-tight md:text-xs ${
                i < 5 ? "text-[#0c1457]" : "text-white"
              }`}
            >
              {(i + 1) * 10}
              <span className="hidden md:block">{hex}</span>
            </span>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-3 text-sm text-muted">
        Legalesign Brand Blue: ten steps across hues 211–234, shared by the
        logo, illustrations and product UI.
      </p>
    </div>
  );
}
