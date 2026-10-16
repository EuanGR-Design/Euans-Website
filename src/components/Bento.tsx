"use client";

import type { BentoTile } from "@/projects";
import { Reveal } from "./motion";
import { LoopVideo } from "./LoopVideo";
import { SuccessAnimation } from "./SuccessAnimation";
import { Video } from "./Video";
import { showIteration } from "./IterationScrubber";

type Feature = { src: string; poster: string; label: string; w: number; h: number; title: string; caption: string };

const spans: Record<BentoTile["span"], string> = {
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  one: "",
};

/** One long recording, then a grid of short looping clips. */
export function Bento({ feature, tiles }: { feature?: Feature; tiles: BentoTile[] }) {
  return (
    <div className="space-y-4">
      {feature && (
        <Reveal className="overflow-hidden rounded-3xl border border-line bg-raised shadow-2xl shadow-accent/10">
          <div className="bg-black" style={{ aspectRatio: `${feature.w} / ${feature.h}` }}>
            <Video src={feature.src} poster={feature.poster} label={feature.label} />
          </div>
          <Caption title={feature.title} caption={feature.caption} />
        </Reveal>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t, i) => (
          <Reveal
            key={t.title}
            delay={0.05 * (i % 3)}
            className={`flex flex-col overflow-hidden rounded-3xl border border-line bg-raised ${spans[t.span]}`}
          >
            <Media tile={t} />
            <Caption title={t.title} caption={t.caption} compare={t.compare} grow={t.kind === "note"} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Media({ tile }: { tile: BentoTile }) {
  if (tile.kind === "note") return null;
  const stretch = tile.span === "tall" || tile.fill;
  // Stretching tiles keep their aspect ratio on phones, where there's no row
  // to fill.
  const frame = `relative w-full ${stretch ? "md:min-h-0 md:flex-1 md:!aspect-auto" : ""}`;

  if (tile.kind === "success") {
    return (
      <div className={`${frame} flex items-center justify-center bg-white`} style={{ aspectRatio: tile.aspect }}>
        <SuccessAnimation className="aspect-square h-4/5 max-h-72" />
      </div>
    );
  }

  const fit = tile.fit ?? "cover";
  return (
    <div className={frame} style={{ aspectRatio: tile.aspect, background: tile.bg }}>
      <LoopVideo
        src={tile.src}
        poster={tile.poster}
        label={tile.label}
        className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
        objectPosition={tile.position}
      />
    </div>
  );
}

function Caption({
  title,
  caption,
  compare,
  grow,
}: {
  title: string;
  caption: string;
  compare?: number;
  grow?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 p-5 md:p-6 ${grow ? "flex-1 justify-center md:p-8" : ""}`}>
      <h3 className={`font-semibold tracking-tight ${grow ? "text-2xl" : "text-base"}`}>{title}</h3>
      <p className={`leading-relaxed text-muted ${grow ? "" : "text-sm"}`}>{caption}</p>
      {compare && (
        <button
          type="button"
          onClick={() => showIteration(compare)}
          className="mt-2 self-start text-sm font-medium text-accent hover:underline"
        >
          Compare with version {compare} ↑
        </button>
      )}
    </div>
  );
}
