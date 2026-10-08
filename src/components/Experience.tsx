"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experience, person } from "@/content";
import { Reveal } from "./motion";

export function Experience() {
  const [open, setOpen] = useState(0);

  return (
    <section id="cv" className="border-t border-line py-24 md:py-40">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow">CV</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              Experience
            </h2>
            <a
              href={person.cv}
              download
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-transform hover:scale-[1.03]"
            >
              Download full CV <span aria-hidden>↓</span>
            </a>
          </Reveal>
        </div>

        <ul className="divide-y divide-line border-y border-line lg:col-span-8">
          {experience.map((e, i) => {
            const isOpen = open === i;
            return (
              <li key={e.role}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`exp-${i}`}
                  className="flex w-full flex-col gap-1 py-6 text-left md:flex-row md:items-baseline md:justify-between"
                >
                  <span>
                    <span className="block text-xl font-semibold md:text-2xl">
                      {e.role}
                    </span>
                    <span className="text-muted">{e.org}</span>
                  </span>
                  <span className="font-mono text-sm text-muted">
                    {e.when} <span aria-hidden>{isOpen ? "−" : "+"}</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`exp-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 leading-relaxed text-fg/75">
                        {e.body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
