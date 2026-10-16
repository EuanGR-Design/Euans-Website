import { basePath } from "@/lib/basePath";
import { LoopVideo } from "./LoopVideo";

/**
 * A looping clip playing in a browser window on a blue panel, the same shape
 * and style as the Quick Send hero. The window sits smaller than the panel,
 * so the recording is shown near its own size and stays sharp.
 */
export function BrowserFrame({ video }: { video: { src: string; poster: string; label: string } }) {
  return (
    <div
      className="flex aspect-[2400/1688] items-center justify-center overflow-hidden rounded-3xl"
      style={{ background: "linear-gradient(135deg, #5185ff, #4456f6)" }}
    >
      <div className="w-[90%] overflow-hidden rounded-[clamp(8px,1.6vw,22px)] border-2 border-[#79adfc] bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] md:w-[72%]">
        {/* The browser's tab and address bars, from Euan's frame. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${basePath}/work/quick-send/browser-bar.svg`} alt="" width={1440} height={79} className="block h-auto w-full" />
        <div className="relative aspect-video">
          <LoopVideo src={video.src} poster={video.poster} label={video.label} className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
