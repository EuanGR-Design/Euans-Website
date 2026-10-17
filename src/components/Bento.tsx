"use client";

import type { BentoTile } from "@/projects";
import { Reveal } from "./motion";
import { LoopVideo } from "./LoopVideo";
import { Video } from "./Video";
import { showIteration } from "./IterationScrubber";

type Feature = { src: string; poster: string; label: string; w: number; h: number; title: string; caption: string };

const spans: Record<BentoTile["span"], string> = {
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  full: "md:col-span-2 lg:col-span-3",
  one: "",
};

/**
 * One long recording, then a grid of short looping clips. `bare` shows the
 * clips alone, with no captions or play buttons.
 */
export function Bento({ feature, tiles, bare }: { feature?: Feature; tiles: BentoTile[]; bare?: boolean }) {
  return (
    <div className="space-y-4">
      {feature && (
        <Reveal className="overflow-hidden rounded-3xl border border-line bg-raised">
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
            className={`group/tile relative flex flex-col overflow-hidden rounded-3xl border border-line bg-raised ${spans[t.span]}`}
          >
            {t.kind === "note" ? (
              <Caption title={t.title} caption={t.caption} compare={t.compare} grow />
            ) : (
              <>
                <Media tile={t} bare={bare} />
                {!bare && <Overlay title={t.title} caption={t.caption} compare={t.compare} />}
              </>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Media({ tile, bare }: { tile: BentoTile; bare?: boolean }) {
  if (tile.kind === "note") return null;
  // Stretching tiles keep their aspect ratio on phones, where there's no row
  // to fill. `fill` waits for three columns, where the rows are planned; in
  // two, two filling tiles could share a row and leave it no height.
  const stretch =
    tile.span === "tall"
      ? "md:min-h-0 md:flex-1 md:!aspect-auto"
      : tile.fill
        ? "lg:min-h-0 lg:flex-1 lg:!aspect-auto"
        : "";
  const frame = `relative w-full ${stretch}`;

  const fit = tile.fit ?? "cover";
  return (
    <div className={frame} style={{ aspectRatio: tile.aspect, background: tile.bg }}>
      <LoopVideo
        src={tile.src}
        poster={tile.poster}
        label={tile.label}
        className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
        objectPosition={tile.position}
        button={!bare}
      />
    </div>
  );
}

/**
 * A clip's words, in a frosted panel along its bottom edge. With a mouse it
 * stays hidden until the tile is hovered or focused, so the clip leads; on
 * touch screens only the title shows.
 */
function Overlay({ title, caption, compare }: { title: string; caption: string; compare?: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 transition-[opacity,translate] duration-300 group-focus-within/tile:translate-y-0 group-focus-within/tile:opacity-100 group-hover/tile:translate-y-0 group-hover/tile:opacity-100 md:inset-x-3 md:bottom-3 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0">
      <div className="pointer-events-auto inline-block max-w-full rounded-2xl bg-bg/80 px-4 py-3 shadow-lg backdrop-blur-md md:px-5 md:py-4">
        <h3 className="text-sm font-semibold tracking-tight md:text-base">{title}</h3>
        <p className="mt-1 hidden text-sm leading-snug text-fg/75 [@media(hover:hover)]:block">{caption}</p>
        {compare && (
          <button
            type="button"
            onClick={() => showIteration(compare)}
            className="mt-2 hidden text-sm font-medium text-accent-ink hover:underline [@media(hover:hover)]:block"
          >
            Compare with version {compare}
          </button>
        )}
      </div>
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
      <p className={`leading-relaxed text-muted ${grow ? "max-w-2xl" : "text-sm"}`}>{caption}</p>
      {compare && (
        <button
          type="button"
          onClick={() => showIteration(compare)}
          className="mt-2 self-start text-sm font-medium text-accent-ink hover:underline"
        >
          Compare with version {compare}
        </button>
      )}
    </div>
  );
}
