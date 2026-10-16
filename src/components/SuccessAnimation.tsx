"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useAnimate, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

const BLUE = "#4456F6";
const WHITE = "#FFFFFF";
// A stand-in for the Quick Send icon (a chevron with speed lines), drawn in a
// 40×40 box. Swap in the real path from the product when there is one.
const ICON_PATH = [
  "M16 4H26L38 20L26 36H16L28 20Z",
  "M11 12H17L23 20L17 28H11L17 20Z",
  "M5 4H13L15.25 7H7.25Z",
  "M3 10H9L11.25 13H5.25Z",
  "M5.25 27H11.25L9 30H3Z",
  "M7.25 33H15.25L13 36H5Z",
].join("");

const EASE_ELASTIC_OUT = [0.34, 1.56, 0.64, 1] as const;
const EASE_RUBBER_BAND = [0.1, 0.9, 0.2, 1] as const;
// How long the tick stays on screen before the animation plays again.
const HOLD_MS = 1800;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// Random offsets for the icon's struggle, ending back at rest.
const jitter = (n: number) => [...Array.from({ length: n }, () => (Math.random() - 0.5) * 4), 0];

/**
 * The tick at the end of Quick Send's flow: the send icon pops in, the circle
 * grows round it, then stretches as the icon pulls away and snaps back into a
 * tick. Plays while on screen and repeats; with reduced motion it shows the
 * finished tick.
 */
export function SuccessAnimation({ className = "" }: { className?: string }) {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { amount: 0.5 });
  const reduced = useReducedMotion();
  const [showCheck, setShowCheck] = useState(false);
  const clipPathId = useId();
  // The clip path's `d` is set directly, so it never lags a render behind.
  const clipPathRef = useRef<SVGPathElement>(null);

  const r = useMotionValue(0.1);
  const stretch = useMotionValue(0);
  const iconX = useMotionValue(0);
  const iconScale = useMotionValue(0);
  const iconOpacity = useMotionValue(1);
  const rippleOpacity = useMotionValue(0);
  const rippleScale = useMotionValue(1);
  const shakeX = useMotionValue(0);
  const shakeY = useMotionValue(0);
  const finalIconX = useTransform(() => iconX.get() + shakeX.get());

  const pathD = useTransform([r, stretch], ([latestR, s]: number[]) => {
    const cx = 100;
    const cy = 100;
    const radius = Math.max(latestR, 0.1);
    const k = radius * 0.55228;
    return `M ${cx} ${cy - radius}
      C ${cx + k + s / 2} ${cy - radius}, ${cx + radius + s} ${cy - k}, ${cx + radius + s} ${cy}
      C ${cx + radius + s} ${cy + k}, ${cx + k + s / 2} ${cy + radius}, ${cx} ${cy + radius}
      C ${cx - k} ${cy + radius}, ${cx - radius} ${cy + k}, ${cx - radius} ${cy}
      C ${cx - radius} ${cy - k}, ${cx - k} ${cy - radius}, ${cx} ${cy - radius} Z`;
  });

  useEffect(() => {
    const update = (d: string) => clipPathRef.current?.setAttribute("d", d);
    update(pathD.get());
    return pathD.on("change", update);
  }, [pathD]);

  useEffect(() => {
    const finished = () => {
      r.set(60);
      stretch.set(0);
      iconOpacity.set(0);
      iconX.set(500);
      setShowCheck(true);
    };
    if (reduced) {
      finished();
      return;
    }
    if (!inView) return;

    // Each run checks it's still wanted after every step, so scrolling away
    // stops it cleanly.
    let live = true;
    const step = async <T,>(p: PromiseLike<T> | T) => {
      await p;
      if (!live) throw new Error("stopped");
    };

    const run = async () => {
      r.set(0.1);
      stretch.set(0);
      iconX.set(0);
      iconScale.set(0);
      iconOpacity.set(1);
      rippleOpacity.set(0);
      rippleScale.set(1);
      shakeX.set(0);
      shakeY.set(0);
      setShowCheck(false);

      // 1. Pop in
      await step(animate(iconScale, [0, 2.1, 1.5], { duration: 0.6, times: [0, 0.6, 1], ease: EASE_ELASTIC_OUT }));
      await step(wait(100));

      // 2. Grow the circle, with a ripple
      animate(rippleOpacity, [0, 0.3, 0], { duration: 0.4 });
      animate(rippleScale, [1, 1.5], { duration: 0.4 });
      await step(animate(r, 60, { type: "spring", stiffness: 350, damping: 25, mass: 1.5 }));
      iconOpacity.set(0);

      // 3. Anticipation, then the struggle
      await step(animate(iconX, 20, { duration: 0.3, ease: "easeOut" }));
      const struggle = 0.8;
      animate(shakeX, jitter(16), { duration: struggle, ease: "linear" });
      animate(shakeY, jitter(16), { duration: struggle, ease: "linear" });
      await step(
        Promise.all([
          animate(iconX, 120, { duration: struggle, ease: EASE_RUBBER_BAND }),
          animate(stretch, 100, { duration: struggle, ease: EASE_RUBBER_BAND }),
        ]),
      );

      // 4. Release
      animate(iconX, 500, { duration: 0.3, ease: "easeIn" });
      const snap = animate(stretch, 0, { type: "spring", stiffness: 600, damping: 12 });

      // 5. Tick
      await step(wait(50));
      setShowCheck(true);
      animate(rippleOpacity, [0.4, 0], { duration: 0.5 });
      animate(rippleScale, [1, 1.8], { duration: 0.5 });
      await step(snap);
      await step(wait(HOLD_MS));
    };

    (async () => {
      try {
        while (live) await run();
      } catch {
        // Stopped by scrolling away or unmounting.
      }
    })();

    return () => {
      live = false;
      scope.animations.forEach((a) => a.stop());
    };
    // The motion values and `animate` are stable for the component's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  return (
    <div ref={scope} className={className}>
      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" role="img" aria-label="The Quick Send icon turns into a tick once the document is sent">
        <defs>
          <clipPath id={clipPathId}>
            <path ref={clipPathRef} d="" />
          </clipPath>
        </defs>

        {/* Ripple */}
        <motion.circle
          cx="100"
          cy="100"
          r="60"
          stroke={BLUE}
          strokeWidth="2"
          fill="none"
          style={{ opacity: rippleOpacity, scale: rippleScale }}
        />

        {/* The icon on its own, before the circle grows */}
        <g transform="translate(100, 100)">
          <motion.g style={{ scale: iconScale, opacity: iconOpacity }}>
            <g transform="translate(-20, -20)">
              <path d={ICON_PATH} fill={BLUE} />
            </g>
          </motion.g>
        </g>

        {/* The circle, with the icon in white inside it */}
        <g clipPath={`url(#${clipPathId})`}>
          <motion.path d={pathD} fill={BLUE} />
          <motion.g style={{ x: finalIconX, y: shakeY }}>
            <g transform="translate(100, 100)">
              <motion.g style={{ scale: iconScale }}>
                <g transform="translate(-20, -20)">
                  <path d={ICON_PATH} fill={WHITE} />
                </g>
              </motion.g>
            </g>
          </motion.g>
        </g>

        {showCheck && (
          <motion.path
            d="M 70 100 L 90 120 L 130 80"
            fill="transparent"
            stroke={WHITE}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0, opacity: 0, scale: 0.8 }}
            animate={{ pathLength: 1, opacity: 1, scale: 1 }}
            transition={{
              pathLength: { duration: 0.4, ease: "easeOut" },
              opacity: { duration: 0.1 },
              scale: { type: "spring", stiffness: 400, damping: 15 },
            }}
            style={{ originX: 0.5, originY: 0.5 }}
          />
        )}
      </svg>
    </div>
  );
}
