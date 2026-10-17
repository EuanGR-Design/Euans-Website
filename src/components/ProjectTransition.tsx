"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";

/** Just what the title card needs, so whole projects never reach the client. */
export type CardInfo = {
  slug: string;
  title: string;
  label: string;
  img: { src: string; alt: string } | null;
};

type Box = { x: number; y: number; w: number; h: number; r: number };
type Run = { card: CardInfo; href: string; from: Box };

const Ctx = createContext<((run: Run) => void) | null>(null);

const EASE = [0.76, 0, 0.24, 1] as const;
const toBox = (r: DOMRect, radius = 12): Box => ({ x: r.left, y: r.top, w: r.width, h: r.height, r: radius });

/**
 * Opening a project grows its image from the card you clicked into a
 * full-screen title card, then, once the page has loaded underneath,
 * shrinks it into that page's hero (marked with data-hero="<slug>"). With
 * reduced motion, links just navigate.
 */
export function ProjectTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [run, setRun] = useState<Run | null>(null);
  const [showTitle, setShowTitle] = useState(true);
  const busy = useRef(false);
  const startPath = useRef("");
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const w = useMotionValue(0);
  const h = useMotionValue(0);
  const r = useMotionValue(0);
  const opacity = useMotionValue(1);

  const to = (b: Box, duration: number) =>
    Promise.all([
      animate(x, b.x, { duration, ease: EASE }),
      animate(y, b.y, { duration, ease: EASE }),
      animate(w, b.w, { duration, ease: EASE }),
      animate(h, b.h, { duration, ease: EASE }),
      animate(r, b.r, { duration, ease: EASE }),
    ]);

  const start = useCallback(
    (next: Run) => {
      if (busy.current) return;
      busy.current = true;
      startPath.current = pathRef.current;
      x.set(next.from.x);
      y.set(next.from.y);
      w.set(next.from.w);
      h.set(next.from.h);
      r.set(next.from.r);
      opacity.set(1);
      setShowTitle(true);
      setRun(next);
      router.prefetch(next.href);
    },
    [router, x, y, w, h, r, opacity],
  );

  useEffect(() => {
    if (!run) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    (async () => {
      // 1. Grow to fill the screen, and hold the title card a moment.
      await to({ x: 0, y: 0, w: window.innerWidth, h: window.innerHeight, r: 0 }, 0.7);
      await wait(350);
      if (cancelled) return;

      // 2. Load the project underneath, then find its hero.
      router.push(run.href);
      let hero: Element | null = null;
      for (let t = 0; t < 60 && !cancelled; t++) {
        await wait(50);
        if (pathRef.current === startPath.current) continue;
        hero = document.querySelector(`[data-hero="${run.card.slug}"]`);
        if (hero) break;
      }
      if (cancelled) return;

      // 3. Shrink into the hero, then hand over to the real image.
      if (hero) {
        window.scrollTo(0, 0);
        await wait(60);
        setShowTitle(false);
        await to(toBox(hero.getBoundingClientRect(), parseFloat(getComputedStyle(hero).borderTopLeftRadius) || 0), 0.8);
      }
      await animate(opacity, 0, { duration: hero ? 0.25 : 0.45 });
      if (cancelled) return;
      setRun(null);
      busy.current = false;
    })();

    return () => {
      cancelled = true;
      busy.current = false;
    };
    // `to` only closes over stable motion values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, router, opacity]);

  return (
    <Ctx.Provider value={start}>
      {children}
      {run && (
        <motion.div
          aria-hidden
          className="pointer-events-auto fixed top-0 left-0 z-[95] overflow-hidden bg-tertiary"
          style={{ x, y, width: w, height: h, borderRadius: r, opacity }}
        >
          {run.card.img && (
            <Image src={run.card.img.src} alt="" fill priority sizes="100vw" className="object-cover object-top" />
          )}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={showTitle ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: showTitle ? 0.5 : 0.25, delay: showTitle ? 0.35 : 0 }}
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 text-white md:p-12"
          >
            <p className="eyebrow !text-white/75">{run.card.label}</p>
            <p className="mt-3 text-[clamp(2.5rem,9vw,8rem)] leading-[0.92] font-bold tracking-[-0.045em]">
              {run.card.title}
            </p>
          </motion.div>
        </motion.div>
      )}
    </Ctx.Provider>
  );
}

/**
 * A link to a project that plays the title-card transition. The card's
 * image is whichever element inside it carries data-cover; without one the
 * card grows from the link itself.
 */
export function ProjectLink({
  card,
  href,
  className,
  children,
  ...rest
}: { card: CardInfo; href: string } & Omit<React.ComponentProps<typeof Link>, "href">) {
  const start = useContext(Ctx);
  return (
    <Link
      href={href}
      className={className}
      {...rest}
      onClick={(e) => {
        rest.onClick?.(e);
        if (
          !start ||
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        e.preventDefault();
        const el = e.currentTarget.querySelector("[data-cover]") ?? e.currentTarget;
        start({ card, href, from: toBox(el.getBoundingClientRect(), parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0) });
      }}
    >
      {children}
    </Link>
  );
}
