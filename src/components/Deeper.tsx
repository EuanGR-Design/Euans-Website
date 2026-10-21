"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import type { Deeper as DeeperData } from "@/projects";

/** True inside a Dig deeper panel, so sections there sit closer together. */
export const InPanel = createContext(false);
export const useInPanel = () => useContext(InPanel);

/**
 * A button under a section that opens the detail behind it in a sheet that
 * slides up from the bottom, so the page itself stays at headline level.
 * `children` is the detail, mounted only while the sheet is open.
 */
export function Deeper({ d, children }: { d: DeeperData; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    // Keep the page behind still while the panel scrolls.
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-10 inline-flex items-center gap-3 rounded-full border border-line bg-raised py-2 pr-2 pl-5 font-medium transition-colors hover:border-fg/30"
      >
        Dig deeper: {d.label}
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-full bg-fg text-bg transition-transform group-hover:translate-x-0.5"
        >
          <ArrowRightIcon className="size-4" />
        </span>
      </button>

      <dialog
        ref={ref}
        aria-label={d.heading}
        onClose={() => setOpen(false)}
        // Clipped rather than hidden: focusing the close button while the
        // sheet is still sliding up would otherwise scroll the dialog itself,
        // leaving the sheet's top above the screen.
        onClick={(e) => {
          // A click on the dimmed backdrop lands on the dialog itself.
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="inset-x-0 top-auto bottom-0 m-0 h-[calc(100dvh-1.25rem)] max-h-none w-full max-w-none overflow-clip bg-transparent p-0 text-fg backdrop:bg-[#1c2463]/45"
      >
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full flex-col rounded-t-3xl bg-bg shadow-[0_-20px_60px_-12px_rgba(42,33,28,0.4)]"
          >
            {/* A grab handle, a cue on phones that the sheet came up from below. */}
            <div aria-hidden className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-fg/15 md:hidden" />
            {/* Closes from the sheet's own top corner, where people reach for it. */}
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-full border border-line bg-bg transition-colors hover:border-fg/30 md:top-4 md:right-4 md:size-11"
            >
              <XMarkIcon aria-hidden className="size-5" />
            </button>
            <div className="border-b border-line pt-2 pb-4 md:pt-5 md:pb-5">
              <div className="container-x pr-16">
                <p className="eyebrow">Dig deeper</p>
                <h2 className="mt-1.5 text-xl leading-tight font-semibold tracking-tight md:text-3xl">{d.heading}</h2>
                {d.body && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-fg/75">{d.body}</p>}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain pb-10">
              <InPanel.Provider value={true}>{children}</InPanel.Provider>
            </div>
          </motion.div>
        )}
      </dialog>
    </>
  );
}
