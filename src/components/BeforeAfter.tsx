"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Drag (or use arrow keys) to compare the legacy product with Console.
 * Swap the mock panes for real screenshots once they're exported from Figma.
 */
export function BeforeAfter() {
  const [pos, setPos] = useState(50);

  return (
    <figure className="select-none">
      <div className="relative aspect-[1452/1073] overflow-hidden rounded-3xl border border-line">
        <Image
          src="/work/dashboard.png"
          alt="The Console dashboard: quick actions, document overview, ready-to-send templates and recent activity"
          fill
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="object-cover object-top"
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Before />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-white"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl">
            ⇆
          </div>
        </div>

        <span className="eyebrow absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 text-white/80 backdrop-blur">
          Before
        </span>
        <span className="eyebrow absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-white/80 backdrop-blur">
          Console
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare the legacy product with Console"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-4 text-sm text-muted">
        Drag to compare. Left: an illustrative reconstruction of the legacy app. Right: the Console dashboard, from the Figma source.
      </figcaption>
    </figure>
  );
}

function Before() {
  return (
    <div className="absolute inset-0 bg-[#e9e6dc] p-3 font-[Arial,sans-serif] text-[#333] md:p-5">
      <div className="mb-2 flex items-center gap-2 bg-[#5a6b7a] px-2 py-1.5 text-[10px] text-white md:text-xs">
        <b>LEGALESIGN</b>
        <span className="opacity-70">Home | Documents | Templates | Groups | Account | Help</span>
      </div>
      <div className="grid h-[calc(100%-2.5rem)] grid-cols-[30%_1fr] gap-2">
        <div className="space-y-1 border border-[#bbb] bg-white p-2 text-[9px] md:text-[11px]">
          {["Send a document", "Bulk send", "Templates", "Drafts", "Signed", "Rejected", "Trash", "Reports", "Settings"].map(
            (l) => (
              <div key={l} className="text-[#1a4fa0] underline">
                {l}
              </div>
            ),
          )}
        </div>
        <div className="overflow-hidden border border-[#bbb] bg-white text-[9px] md:text-[11px]">
          <div className="grid grid-cols-4 bg-[#d5d5d5] px-1 py-1 font-bold">
            <span>Title</span>
            <span>Recipient</span>
            <span>Status</span>
            <span>Sent</span>
          </div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`grid grid-cols-4 px-1 py-0.5 ${i % 2 ? "bg-[#f3f3f3]" : ""}`}
            >
              <span>Contract_{1040 + i}.pdf</span>
              <span>user{i}@org.gov</span>
              <span className="text-[#a33]">{i % 3 ? "Pending" : "Signed"}</span>
              <span>0{(i % 9) + 1}/03/2021</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
