"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Deeper as DeeperData } from "@/projects";

/** True inside a Dig deeper panel, so sections there sit closer together. */
export const InPanel = createContext(false);
export const useInPanel = () => useContext(InPanel);

/**
 * A button under a section that opens the detail behind it in a side panel,
 * so the page itself stays at headline level. `children` is the detail,
 * mounted only while the panel is open.
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
          →
        </span>
      </button>

      <dialog
        ref={ref}
        aria-label={d.heading}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // A click on the dimmed backdrop lands on the dialog itself.
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-[min(1120px,100vw)] overflow-hidden bg-transparent p-0 text-fg backdrop:bg-black/45 md:max-w-[min(1120px,92vw)]"
      >
        {open && (
          <motion.div
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col bg-bg shadow-2xl md:rounded-l-3xl"
          >
            <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-5 md:px-10 md:py-7">
              <div>
                <p className="eyebrow">Dig deeper</p>
                <h2 className="mt-2 text-2xl leading-tight font-semibold tracking-tight md:text-4xl">{d.heading}</h2>
                {d.body && <p className="mt-3 max-w-2xl leading-relaxed text-fg/75">{d.body}</p>}
              </div>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-xl transition-colors hover:border-fg/30"
              >
                <span aria-hidden>×</span>
              </button>
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
