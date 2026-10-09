"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Block } from "@/projects";

type JourneyData = Extract<Block, { type: "journey" }> & {
  name: string;
  hasPrototype: boolean;
};

/** One project's story as a horizontal, swipeable strip of steps. */
export function Journey({ j }: { j: JourneyData }) {
  const ref = useRef<HTMLOListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 400) + 16), behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          <span className="md:hidden">Swipe through the steps</span>
          <span className="hidden md:inline">Scroll through the steps</span>
          {j.hasPrototype && (
            <>
              {" · "}
              <a href="#prototype" className="text-fg underline underline-offset-4">
                Try the prototype
              </a>
            </>
          )}
        </p>
        <div className="hidden gap-2 md:flex">
          <ArrowButton label="Previous step" onClick={() => scroll(-1)} flip />
          <ArrowButton label="Next step" onClick={() => scroll(1)} />
        </div>
      </div>

      <ol
        ref={ref}
        aria-label={`${j.name}, step by step`}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 md:-mx-10 md:scroll-px-10 md:px-10 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        <li className="flex w-[85%] shrink-0 snap-start flex-col justify-between rounded-3xl bg-accent p-6 text-white sm:w-[60%] md:w-[420px] md:p-8">
          <div>
            <span className="font-mono text-xs text-white/70">01 · Problem</span>
            <p className="mt-6 text-2xl leading-snug font-semibold tracking-tight md:text-3xl">
              {j.problem}
            </p>
          </div>
          <p className="mt-8 border-t border-white/25 pt-4 text-sm text-white/80">
            {j.evidence}
          </p>
        </li>

        {j.steps.map((s, i) => (
          <li
            key={s.stage}
            className="flex w-[85%] shrink-0 snap-start flex-col rounded-3xl border border-line bg-raised sm:w-[60%] md:w-[520px]"
          >
            <div className="relative aspect-[1440/900] overflow-hidden rounded-t-3xl border-b border-line">
              {s.image ? (
                <Image
                  src={s.image}
                  alt={`${j.name}, ${s.stage.toLowerCase()}: ${s.title}`}
                  fill
                  sizes="(min-width: 768px) 520px, 85vw"
                  className="object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(var(--line)_1px,transparent_1px)] [background-size:16px_16px]">
                  <span className="eyebrow rounded-full border border-line bg-bg px-3 py-1.5">
                    {s.stage} frame
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="font-mono text-xs text-accent">
                0{i + 2} · {s.stage}
              </span>
              <p className="mt-3 text-lg font-semibold">{s.title}</p>
              <p className="mt-4 border-l-2 border-accent pl-3 text-sm leading-relaxed text-fg/75">
                <span className="mb-1 block font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                  Decision
                </span>
                <span className={s.written ? "" : "text-muted italic"}>{s.decision}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ArrowButton({
  label,
  onClick,
  flip = false,
}: {
  label: string;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg"
    >
      <span aria-hidden className={flip ? "rotate-180" : ""}>
        →
      </span>
    </button>
  );
}
