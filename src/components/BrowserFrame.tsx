import { basePath } from "@/lib/basePath";
import { LoopVideo } from "./LoopVideo";

/**
 * A looping clip playing in a browser window on a blue panel, laid out like
 * Euan's video template and the same shape as the Quick Send hero. The window
 * sits smaller than the panel, so the recording is shown near its own size
 * and stays sharp. The play button sits on the panel, clear of the screen.
 */
export function BrowserFrame({ video }: { video: { src: string; poster: string; label: string } }) {
  return (
    <div
      className="relative flex aspect-[2143/1507] items-center justify-center overflow-hidden rounded-3xl"
      style={{ background: "linear-gradient(135deg, #5185ff, #4456f6)" }}
    >
      <div className="w-[88%] overflow-hidden rounded-[clamp(8px,1.6vw,20px)] bg-[#f4f5f8] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)] ring-2 ring-[#79adfc] md:w-[67.2%]">
        {/* The browser's tab and address bars, from the template. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${basePath}/work/quick-send/browser-bar.svg`} alt="" width={1440} height={79} className="block h-auto w-full" />
        <div className="aspect-video">
          <LoopVideo
            src={video.src}
            poster={video.poster}
            label={video.label}
            className="block h-full w-full object-contain"
            wrapperClassName="h-full w-full"
            buttonClassName="right-3 bottom-3 md:right-5 md:bottom-5"
          />
        </div>
      </div>
    </div>
  );
}
