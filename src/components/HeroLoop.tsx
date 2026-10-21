"use client";

import { basePath } from "@/lib/basePath";
import type { Project } from "@/projects";
import { LoopVideo } from "./LoopVideo";

/**
 * The finished product playing in a browser window on the hero's blue panel,
 * laid out like Euan's video template. The window is sized to the recording,
 * so it fills the window with no gap, and takes most of the panel's width.
 */
export function HeroLoop({ loop, width = "w-[90%]" }: { loop: NonNullable<Project["heroLoop"]>; width?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5185ff, #4456f6)" }}>
      <div className={`${width} overflow-hidden rounded-[clamp(8px,1.6vw,20px)] bg-[#f4f5f8] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)] ring-2 ring-[#79adfc]`}>
        {/* The browser's tab and address bars, from the template. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${basePath}/work/quick-send/browser-bar.svg`} alt="" width={1440} height={79} className="block h-auto w-full" />
        <div className="aspect-[1280/714]">
          <LoopVideo src={loop.src} poster={loop.poster} label={loop.label} className="block h-full w-full object-cover" wrapperClassName="h-full w-full" button={false} />
        </div>
      </div>
    </div>
  );
}
