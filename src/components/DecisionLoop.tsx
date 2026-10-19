"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig, motion } from "framer-motion";
import type { DecisionLoopName } from "@/projects";
import {
  ArrowPathIcon,
  AtSymbolIcon,
  Bars3BottomLeftIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronUpDownIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentPlusIcon,
  ExclamationTriangleIcon,
  HashtagIcon,
  PaperClipIcon,
  PencilIcon,
  PlusCircleIcon,
  PlusIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";

export type { DecisionLoopName };

// Every scene is laid out on a fixed 480x360 stage and scaled to fit, the way
// a prototype is scaled to its frame, so it reads the same at any card width.
const W = 480;
const H = 360;

const INK = "#1d2140";
const MUTED = "#7a809b";
const BAR = "#e4e7f0";
const PRIMARY = "#4556f6";
const SHADOW = "0 12px 30px -12px rgba(20,20,80,0.45)";
const EASE = [0.22, 1, 0.36, 1] as const;

const TINT = {
  blue: { fg: "#4f7bff", bg: "#e9efff" },
  green: { fg: "#2bb673", bg: "#e2f5eb" },
  yellow: { fg: "#f5b52e", bg: "#fdf2d9" },
  purple: { fg: "#9b6bff", bg: "#efe8ff" },
};

type Icon = typeof PlusIcon;

/** One beat of a loop: how long it lasts, and where the cursor is. */
type Step = { ms: number; cursor?: [number, number]; click?: boolean };

type Loop = {
  label: string;
  steps: Step[];
  // The beat shown on its own when motion is reduced: the idea at a glance.
  still: number;
  Scene: (p: { s: number }) => ReactNode;
  // Something the cursor carries while dragging, keyed by beat.
  carry?: (s: number) => ReactNode;
};

/**
 * A small looping animation for one of the Quick Send key decisions: simple
 * white UI on the brand blue, stripped back to the one idea it's making. It
 * only runs while on screen, and shows a single still frame when motion is
 * reduced.
 */
export function DecisionLoop({ name, className = "" }: { name: DecisionLoopName; className?: string }) {
  const loop = LOOPS[name];
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [step, setStep] = useState(0);
  // Read after mount rather than during render, so the static HTML and the
  // first client render agree.
  const [reduce, setReduce] = useState(false);
  const s = reduce ? loop.still : step;

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    ro.observe(el);
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // One timer per beat, and none at all while off screen, so six of these on
  // a page cost nothing until they're looked at.
  useEffect(() => {
    if (reduce || !inView) return;
    const t = setTimeout(() => setStep((n) => (n + 1) % loop.steps.length), loop.steps[step].ms);
    return () => clearTimeout(t);
  }, [step, inView, reduce, loop]);

  const beat = loop.steps[s];

  return (
    <div
      ref={box}
      role="img"
      aria-label={loop.label}
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl ${className}`}
      style={{ background: "linear-gradient(135deg, #5285ff, #4556f6)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 origin-top-left text-left leading-tight select-none"
        style={{
          width: W,
          height: H,
          color: INK,
          transform: `scale(${scale ?? 1})`,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        <MotionConfig transition={{ duration: 0.5, ease: EASE }}>
          {/* Remounted for the still frame, so it appears in place rather
              than animating there. */}
          <loop.Scene key={reduce ? "still" : "live"} s={s} />
          {/* The still frame leaves the cursor out: it would only cover
              the state it's showing. */}
          {beat.cursor && !reduce && (
            <Pointer
              at={beat.cursor}
              step={s}
              click={!!beat.click}
              carry={loop.carry?.(s)}
            />
          )}
        </MotionConfig>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Shared pieces                                                             */
/* ------------------------------------------------------------------------ */

/** An arrow cursor that glides between targets and ripples when it clicks. */
function Pointer({
  at,
  step,
  click,
  carry,
}: {
  at: [number, number];
  step: number;
  click: boolean;
  carry?: ReactNode;
}) {
  return (
    <motion.div
      className="absolute top-0 left-0 z-50"
      initial={false}
      animate={{ x: at[0], y: at[1] }}
      transition={{ duration: 0.6, ease: [0.45, 0, 0.2, 1] }}
    >
      <motion.div initial={false} animate={{ opacity: carry ? 1 : 0, scale: carry ? 1 : 0.9 }} transition={{ duration: 0.2 }}>
        {carry}
      </motion.div>
      {click && (
        <motion.span
          key={step}
          className="absolute -top-4 -left-4 size-8 rounded-full border-2 border-white bg-white/40"
          initial={{ scale: 0.3, opacity: 0.95 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      )}
      <motion.svg
        key={click ? `p${step}` : "p"}
        width="20"
        height="24"
        viewBox="0 0 20 24"
        className="absolute top-0 left-0 -translate-x-[3px] -translate-y-[2px] origin-top-left drop-shadow-[0_2px_3px_rgba(10,10,60,0.35)]"
        initial={click ? { scale: 1 } : false}
        animate={click ? { scale: [1, 0.82, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <path
          d="M3 2v17.5l4.6-4.3 2.9 6.6 3-1.3-2.9-6.5h6.3z"
          fill={INK}
          stroke="white"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

/** A grey bar standing in for a line of text. */
function Bar({ w, h = 7, color = BAR, className = "" }: { w: number | string; h?: number; color?: string; className?: string }) {
  return <span className={`block shrink-0 rounded-full ${className}`} style={{ width: w, height: h, background: color }} />;
}

/** The app window every in-product loop sits in. */
function AppWindow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute overflow-hidden rounded-[14px] bg-[#eff2f8] ${className}`}
      style={{ left: 24, top: 24, width: 432, height: 312, boxShadow: SHADOW }}
    >
      {children}
    </div>
  );
}

/** A document page: a title and a few paragraphs of grey lines. */
function Page({ lines = 4 }: { lines?: number }) {
  const widths = ["92%", "100%", "84%", "96%", "62%", "100%", "88%", "70%", "94%", "80%"];
  return (
    <div className="flex flex-col gap-[9px] px-[18px] pt-[22px]">
      <Bar w="46%" h={10} color="#d3d8e6" className="mb-2" />
      {Array.from({ length: lines }, (_, p) => (
        <div key={p} className="mb-3 flex flex-col gap-[8px]">
          {widths.slice(p * 2, p * 2 + 4).map((w, i) => (
            <Bar key={i} w={w} h={6} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Sheet({ style, children }: { style: React.CSSProperties; children?: ReactNode }) {
  return (
    <div className="absolute overflow-hidden rounded-md bg-white shadow-[0_1px_4px_rgba(20,20,80,0.12)]" style={style}>
      {children}
    </div>
  );
}

/** A field you can place: a tinted icon and its name. */
function Chip({ icon: I, label, tint = TINT.blue, className = "" }: { icon: Icon; label: string; tint?: { fg: string; bg: string }; className?: string }) {
  return (
    <div className={`flex h-full w-full items-center gap-2 rounded-lg border border-[#e3e6ef] bg-white px-2 ${className}`}>
      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md" style={{ background: tint.bg, color: tint.fg }}>
        <I className="size-[13px]" />
      </span>
      <span className="truncate text-[13px] font-medium">{label}</span>
    </div>
  );
}

function Toggle({ on = true }: { on?: boolean }) {
  return (
    <span className="relative block h-[16px] w-[28px] shrink-0 rounded-full" style={{ background: on ? PRIMARY : "#d9dce6" }}>
      <span className="absolute top-[2px] size-[12px] rounded-full bg-white" style={{ left: on ? 14 : 2 }} />
    </span>
  );
}

/** A centred white modal heading, with its close cross. */
function ModalHead({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[15px] font-semibold">{title}</span>
      <XMarkIcon className="size-[16px]" style={{ color: MUTED }} />
    </div>
  );
}

const RECIPIENTS = [
  { name: "Skylar Blake", role: "Signer", tint: TINT.blue },
  { name: "Kira McDowell", role: "Signer", tint: TINT.green },
  { name: "Evelyn Hayes", role: "Witness", tint: TINT.yellow },
];

/* ------------------------------------------------------------------------ */
/* 1. Recipients before fields                                               */
/* ------------------------------------------------------------------------ */

// Rows sit 52px apart, and "Add recipient" sits under the last one.
const recipientCount = [0, 1, 1, 2, 2, 3, 3, 0];
const addButtonAt = (n: number): [number, number] => [236, 46 + 56 + 52 * n + 20];

function RecipientsScene({ s }: { s: number }) {
  const n = recipientCount[s];
  return (
    <>
      {/* The app, out of focus behind the modal. Its fields take each
          recipient's colour as they're added. */}
      <div className="absolute inset-0 opacity-60 blur-[3px]">
        <AppWindow>
          <div className="absolute inset-y-0 left-0 w-[140px] bg-white" />
          <Sheet style={{ left: 172, top: 20, width: 236, height: 320 }}>
            <Page />
          </Sheet>
          {RECIPIENTS.map((r, i) => (
            <motion.div
              key={r.name}
              className="absolute rounded-md border-2 border-dashed"
              style={{ left: 196 + (i % 2) * 104, top: 196 + Math.floor(i / 2) * 50, width: 92, height: 34, background: r.tint.bg, borderColor: r.tint.fg }}
              initial={false}
              animate={{ opacity: i < n ? 1 : 0 }}
            />
          ))}
        </AppWindow>
      </div>
      <div className="absolute inset-0 bg-[#1a2370]/15" />

      <motion.div
        className="absolute overflow-hidden rounded-2xl bg-white"
        style={{ left: 90, top: 46, width: 300, boxShadow: SHADOW }}
        initial={false}
        animate={{ height: 112 + 52 * n }}
      >
        <div className="absolute inset-x-[18px] top-[18px]">
          <ModalHead title="Recipient details" />
        </div>
        {RECIPIENTS.map((r, i) => (
          <motion.div
            key={r.name}
            className="absolute inset-x-[16px] flex h-[44px] items-center gap-3 rounded-xl border border-[#eceef4] px-3"
            style={{ top: 56 + 52 * i }}
            initial={false}
            animate={{ opacity: i < n ? 1 : 0, y: i < n ? 0 : 10, scale: i < n ? 1 : 0.96 }}
            transition={{ duration: 0.4, ease: EASE, delay: i < n ? 0.08 : 0 }}
          >
            <span
              className="flex size-[26px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
              style={{ background: r.tint.bg, color: r.tint.fg }}
            >
              {i + 1}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <span className="text-[14px] font-medium">{r.name}</span>
              <Bar w={96} h={5} />
            </span>
            <span className="rounded-full px-2 py-[2px] text-[11px] font-medium" style={{ background: r.tint.bg, color: r.tint.fg }}>
              {r.role}
            </span>
          </motion.div>
        ))}
        <motion.div
          className="absolute inset-x-[16px] flex h-[40px] items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#b9c2f9] text-[13px] font-semibold"
          style={{ color: PRIMARY }}
          initial={false}
          animate={{ top: 56 + 52 * n }}
        >
          <PlusIcon className="size-[14px]" />
          Add recipient
        </motion.div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------------ */
/* 2. One sidebar                                                            */
/* ------------------------------------------------------------------------ */

// Busy, irregular rows: the clutter the old right-hand panel carried.
const RIGHT_TABS = [
  [70, 52, 80, 44, 64, 76, 38, 58, 66, 48, 72],
  [48, 74, 60, 80, 42, 66, 54, 72, 40, 70, 56],
  [62, 40, 78, 56, 70, 46, 80, 50, 74, 44, 60],
];

function SidebarScene({ s }: { s: number }) {
  const merged = s >= 3 && s <= 5;
  const settled = s === 4 || s === 5;
  const tab = s <= 2 ? s : 0;
  return (
    <AppWindow>
      {/* The document grows into the room the second sidebar gave back. */}
      <motion.div
        className="absolute top-[20px] h-[320px] overflow-hidden rounded-md bg-white shadow-[0_1px_4px_rgba(20,20,80,0.12)]"
        initial={false}
        animate={settled ? { left: 156, width: 252 } : { left: 116, width: 192 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Page />
      </motion.div>

      {/* Left: cluttered before, tidy after. */}
      <motion.div
        className="absolute inset-y-0 left-0 overflow-hidden border-r border-[#eceef4] bg-white"
        initial={false}
        animate={{ width: settled ? 132 : 104 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <motion.div className="absolute inset-0 flex flex-col gap-[7px] p-[10px]" initial={false} animate={{ opacity: settled ? 0 : 1 }}>
          {[0, 1, 2].map((g) => (
            <div key={g} className="mb-[4px] flex flex-col gap-[6px]">
              <Bar w={40 + g * 6} h={6} color="#c9cfdf" />
              {[64, 50, 70, 42].map((w, i) => (
                <div key={i} className="flex items-center gap-[6px]">
                  <span
                    className="size-[12px] shrink-0 rounded-[3px]"
                    style={{ background: (i + g) % 3 === 0 ? TINT.blue.bg : "#e1e5ee" }}
                  />
                  <Bar w={w - g * 6} h={6} color="#dde1ea" />
                </div>
              ))}
            </div>
          ))}
          <div className="mt-auto flex gap-[5px]">
            <Bar w={40} h={18} color="#e1e5ee" />
            <Bar w={40} h={18} color="#e1e5ee" />
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex w-[132px] flex-col gap-[8px] p-[12px]"
          initial={false}
          animate={{ opacity: settled ? 1 : 0, x: settled ? 0 : -8 }}
          transition={{ duration: 0.5, ease: EASE, delay: settled ? 0.25 : 0 }}
        >
          <span className="mb-[2px] text-[13px] font-semibold">Fields</span>
          {[
            { icon: PencilIcon, label: "Signature" },
            { icon: Bars3BottomLeftIcon, label: "Text" },
            { icon: CalendarIcon, label: "Date" },
          ].map((f) => (
            <div key={f.label} className="h-[32px]">
              <Chip icon={f.icon} label={f.label} />
            </div>
          ))}
          <span className="mt-auto flex h-[32px] items-center justify-center rounded-lg text-[13px] font-semibold text-white" style={{ background: PRIMARY }}>
            Send
          </span>
        </motion.div>
      </motion.div>

      {/* Right: slides across and folds into the left. */}
      <motion.div
        className="absolute inset-y-0 z-10 overflow-hidden border-l border-[#eceef4] bg-white"
        initial={false}
        animate={{
          left: merged ? 0 : 320,
          width: merged ? 132 : 112,
          opacity: settled ? 0 : 1,
        }}
        transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1], opacity: { duration: 0.35 } }}
      >
        <motion.div className="absolute inset-x-0 top-0 w-[112px]" initial={false} animate={{ opacity: merged ? 0.3 : 1 }} transition={{ duration: 0.3 }}>
          <div className="relative flex gap-[8px] border-b border-[#eceef4] px-[10px] pt-[12px] pb-[9px]">
            {[22, 26, 20].map((w, i) => (
              <Bar key={i} w={w} h={7} color={i === tab ? PRIMARY : "#d3d8e4"} />
            ))}
            <motion.span
              className="absolute bottom-[-1px] h-[2px] rounded-full"
              style={{ background: PRIMARY }}
              initial={false}
              animate={{ left: [10, 40, 74][tab], width: [22, 26, 20][tab] }}
              transition={{ duration: 0.25 }}
            />
          </div>
          {RIGHT_TABS.map((rows, t) => (
            <motion.div
              key={t}
              className="absolute inset-x-0 top-[34px] flex flex-col gap-[8px] p-[10px]"
              initial={false}
              animate={{ opacity: t === tab ? 1 : 0 }}
              transition={{ duration: 0.15 }}
            >
              {rows.map((w, i) =>
                i % 3 === 1 ? (
                  <div key={i} className="flex items-center justify-between">
                    <Bar w={w * 0.7} h={6} color="#dde1ea" />
                    <Toggle on={(i + t) % 2 === 0} />
                  </div>
                ) : i % 3 === 2 ? (
                  <span key={i} className="block h-[18px] rounded-[5px] border border-[#e3e6ef]" />
                ) : (
                  <Bar key={i} w={w} h={6} color="#dde1ea" />
                ),
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AppWindow>
  );
}

/* ------------------------------------------------------------------------ */
/* 3. Three fields by default                                                */
/* ------------------------------------------------------------------------ */

const FIELDS: { icon: Icon; label: string; keep?: number }[] = [
  { icon: PencilIcon, label: "Signature", keep: 0 },
  { icon: PencilIcon, label: "Initials" },
  { icon: Bars3BottomLeftIcon, label: "Text", keep: 1 },
  { icon: AtSymbolIcon, label: "Email" },
  { icon: CalendarIcon, label: "Date", keep: 2 },
  { icon: ClockIcon, label: "Auto date" },
  { icon: UserIcon, label: "Name" },
  { icon: CheckCircleIcon, label: "Checkbox" },
  { icon: ChevronUpDownIcon, label: "Dropdown" },
  { icon: HashtagIcon, label: "Number" },
  { icon: BuildingOfficeIcon, label: "Company" },
  { icon: PaperClipIcon, label: "Attachment" },
];

function FieldsScene({ s }: { s: number }) {
  const few = s === 1 || s === 2;
  // Card heights for the full grid and the short list, kept centred.
  const h = few ? 250 : 312;
  return (
    <motion.div
      className="absolute overflow-hidden rounded-2xl bg-white"
      style={{ left: 90, width: 300, boxShadow: SHADOW }}
      initial={false}
      animate={{ top: (H - h) / 2, height: h }}
      transition={{ duration: 0.8, ease: EASE, delay: few ? 0.3 : 0 }}
    >
      <div className="absolute inset-x-[18px] top-[18px] flex items-center justify-between">
        <span className="text-[15px] font-semibold">Place fields</span>
        <span className="relative h-[20px] w-[28px] text-[12px] font-semibold" style={{ color: MUTED }}>
          {[12, 3].map((count, i) => (
            <motion.span
              key={count}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-[#f0f2f7]"
              initial={false}
              animate={{ opacity: (i === 1) === few ? 1 : 0 }}
              transition={{ duration: 0.3, delay: few ? 0.3 : 0 }}
            >
              {count}
            </motion.span>
          ))}
        </span>
      </div>
      {FIELDS.map((f, i) => {
        const grid = { left: 18 + (i % 2) * 136, top: 56 + Math.floor(i / 2) * 41, width: 128, height: 33 };
        const kept = f.keep !== undefined;
        const goal = few
          ? kept
            ? { left: 18, top: 56 + f.keep! * 50, width: 264, height: 42, opacity: 1, scale: 1 }
            : { ...grid, opacity: 0, scale: 0.7 }
          : { ...grid, opacity: 1, scale: 1 };
        return (
          <motion.div
            key={f.label}
            className="absolute"
            initial={false}
            animate={goal}
            transition={
              few && !kept
                ? { duration: 0.35, ease: EASE, delay: 0.02 * i }
                : { duration: 0.7, ease: EASE, delay: few ? 0.3 : kept ? 0 : 0.25 + 0.02 * i }
            }
          >
            <Chip icon={f.icon} label={f.label} />
          </motion.div>
        );
      })}
      <motion.span
        className="absolute left-[18px] text-[13px] font-semibold"
        style={{ top: 214, color: PRIMARY }}
        initial={false}
        animate={{ opacity: few ? 1 : 0, y: few ? 0 : 6 }}
        transition={{ duration: 0.4, delay: few ? 0.8 : 0 }}
      >
        More fields
      </motion.span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------ */
/* 4. A panel that follows you                                               */
/* ------------------------------------------------------------------------ */

const PLACE_FIELDS = [
  { icon: PencilIcon, label: "Signature" },
  { icon: Bars3BottomLeftIcon, label: "Text" },
  { icon: CalendarIcon, label: "Date" },
];

/** The sidebar's resting state: the fields you can place. */
function PlaceFields({ extra }: { extra?: ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-[8px] p-[12px]">
      <span className="mb-[2px] text-[13px] font-semibold">Place fields</span>
      {PLACE_FIELDS.map((f) => (
        <div key={f.label} className="h-[34px]">
          <Chip icon={f.icon} label={f.label} />
        </div>
      ))}
      {extra}
    </div>
  );
}

function PanelScene({ s }: { s: number }) {
  const editing = s === 1 || s === 2;
  return (
    <AppWindow>
      <div className="absolute inset-y-0 left-0 w-[150px] overflow-hidden border-r border-[#eceef4] bg-white">
        <motion.div className="absolute inset-0" initial={false} animate={{ opacity: editing ? 0 : 1, x: editing ? -16 : 0 }} transition={{ duration: 0.25, ease: EASE, delay: editing ? 0 : 0.2 }}>
          <PlaceFields
            extra={
              <div className="mt-3 flex flex-col gap-[8px]">
                <Bar w={70} h={6} color="#d9dde8" />
                <Bar w={110} h={6} />
                <Bar w={92} h={6} />
              </div>
            }
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex flex-col gap-[10px] p-[12px]"
          initial={false}
          animate={{ opacity: editing ? 1 : 0, x: editing ? 0 : 16 }}
          transition={{ duration: 0.3, ease: EASE, delay: editing ? 0.2 : 0 }}
        >
          <span className="mb-[2px] flex items-center gap-1 text-[13px] font-semibold">
            <ChevronLeftIcon className="size-[14px]" style={{ color: MUTED }} />
            Edit field
          </span>
          <div className="flex flex-col gap-[5px]">
            <span className="text-[11px] font-medium" style={{ color: MUTED }}>Recipient</span>
            <span className="flex h-[30px] items-center gap-[6px] rounded-lg border border-[#e3e6ef] px-2 text-[12px] font-medium">
              <span className="size-[9px] shrink-0 rounded-full" style={{ background: TINT.blue.fg }} />
              Skylar Blake
              <ChevronUpDownIcon className="ml-auto size-[12px]" style={{ color: MUTED }} />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium">Required</span>
            <Toggle />
          </div>
          <div className="flex flex-col gap-[7px]">
            <span className="text-[11px] font-medium" style={{ color: MUTED }}>Size</span>
            <span className="relative block h-[4px] rounded-full bg-[#e4e7f0]">
              <span className="absolute inset-y-0 left-0 w-[55%] rounded-full" style={{ background: PRIMARY }} />
              <span className="absolute top-1/2 left-[55%] size-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white" style={{ borderColor: PRIMARY }} />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium">Read only</span>
            <Toggle on={false} />
          </div>
        </motion.div>
      </div>

      <Sheet style={{ left: 172, top: 56, width: 238, height: 280 }}>
        <Page lines={2} />
      </Sheet>

      {/* The field on the page, selected while it's being edited. */}
      <motion.div
        className="absolute flex items-center gap-[6px] rounded-md border-2 px-2 text-[12px] font-semibold"
        style={{ left: 196, top: 240, width: 124, height: 40, background: TINT.blue.bg, color: TINT.blue.fg }}
        initial={false}
        animate={{ borderColor: editing ? TINT.blue.fg : "rgba(79,123,255,0.45)", borderStyle: editing ? "solid" : "dashed" }}
        transition={{ duration: 0.2 }}
      >
        <PencilIcon className="size-[13px]" />
        Signature
        {[
          "-top-[5px] -left-[5px]",
          "-top-[5px] -right-[5px]",
          "-bottom-[5px] -left-[5px]",
          "-bottom-[5px] -right-[5px]",
        ].map((pos) => (
          <motion.span
            key={pos}
            className={`absolute size-[8px] rounded-[2px] border-2 bg-white ${pos}`}
            style={{ borderColor: TINT.blue.fg }}
            initial={false}
            animate={{ opacity: editing ? 1 : 0, scale: editing ? 1 : 0.4 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </motion.div>

      {/* The formatting toolbar only exists while a field is selected. */}
      <motion.div
        className="absolute flex h-[34px] items-center gap-[10px] rounded-lg bg-white px-3 text-[13px] font-semibold shadow-[0_4px_14px_-4px_rgba(20,20,80,0.3)]"
        style={{ left: 166, top: 10 }}
        initial={false}
        animate={{ opacity: editing ? 1 : 0, y: editing ? 0 : -12 }}
        transition={{ duration: 0.35, ease: EASE, delay: editing ? 0.15 : 0 }}
      >
        <span className="flex items-center gap-1 rounded-md border border-[#e3e6ef] px-[6px] py-[2px] text-[12px] font-medium">
          Inter
          <ChevronUpDownIcon className="size-[11px]" style={{ color: MUTED }} />
        </span>
        <span className="text-[12px] font-medium">12</span>
        <span className="h-[16px] w-px bg-[#e3e6ef]" />
        <span className="font-bold">B</span>
        <span className="italic">I</span>
        <span className="underline">U</span>
        <span className="h-[16px] w-px bg-[#e3e6ef]" />
        <Bars3BottomLeftIcon className="size-[14px]" />
        <span className="size-[14px] rounded-full" style={{ background: INK }} />
      </motion.div>
    </AppWindow>
  );
}

/* ------------------------------------------------------------------------ */
/* 5. Modals for occasional tasks                                            */
/* ------------------------------------------------------------------------ */

// Window-relative: the sidebar buttons, then the modal's Done button.
const RECIPIENTS_BTN: [number, number] = [24 + 88, 24 + 222 + 17];
const OPTIONS_BTN: [number, number] = [24 + 88, 24 + 262 + 17];
const DONE_BTN: [number, number] = [323, 254];

function ModalsScene({ s }: { s: number }) {
  const open = s === 1 || s === 2 ? "recipients" : s === 5 || s === 6 ? "options" : null;
  const pressed = s === 1 ? 0 : s === 5 ? 1 : -1;
  return (
    <>
      <motion.div className="absolute inset-0" initial={false} animate={{ filter: open ? "blur(2.5px)" : "blur(0px)" }} transition={{ duration: 0.35 }}>
        <AppWindow>
          <div className="absolute inset-y-0 left-0 w-[176px] border-r border-[#eceef4] bg-white">
            <PlaceFields />
            {[
              { icon: UsersIcon, label: "Recipients" },
              { icon: Cog6ToothIcon, label: "Document options" },
            ].map((b, i) => (
              <motion.span
                key={b.label}
                className="absolute inset-x-[12px] flex h-[34px] items-center gap-[7px] rounded-lg border px-[9px] text-[13px] font-medium whitespace-nowrap"
                style={{ top: 222 + i * 40 }}
                initial={false}
                animate={{
                  borderColor: pressed === i ? "#b9c2f9" : "#e3e6ef",
                  backgroundColor: pressed === i ? "#eef0ff" : "#ffffff",
                }}
                transition={{ duration: 0.2 }}
              >
                <b.icon className="size-[14px]" style={{ color: MUTED }} />
                {b.label}
              </motion.span>
            ))}
          </div>
          <Sheet style={{ left: 186, top: 20, width: 224, height: 320 }}>
            <Page />
          </Sheet>
        </AppWindow>
      </motion.div>
      <motion.div className="absolute inset-0 bg-[#1a2370]" initial={false} animate={{ opacity: open ? 0.22 : 0 }} transition={{ duration: 0.35 }} />

      <Modal show={open === "recipients"} title="Recipients">
        {RECIPIENTS.map((r, i) => (
          <div key={r.name} className="flex h-[30px] items-center gap-[10px]">
            <span className="flex size-[22px] items-center justify-center rounded-full text-[11px] font-semibold" style={{ background: r.tint.bg, color: r.tint.fg }}>
              {i + 1}
            </span>
            <span className="text-[13px] font-medium">{r.name}</span>
            <Bar w={52} h={5} className="ml-auto" />
          </div>
        ))}
      </Modal>
      <Modal show={open === "options"} title="Document options">
        {[
          { w: 104, on: true },
          { w: 84, on: false },
          { w: 120, on: true },
        ].map((o, i) => (
          <div key={i} className="flex h-[30px] items-center justify-between">
            <span className="flex flex-col gap-[6px]">
              <Bar w={o.w} h={6} color="#cfd4e2" />
              <Bar w={o.w + 30} h={5} />
            </span>
            <Toggle on={o.on} />
          </div>
        ))}
      </Modal>
    </>
  );
}

function Modal({ show, title, children }: { show: boolean; title: string; children: ReactNode }) {
  return (
    <motion.div
      className="absolute flex flex-col gap-[10px] rounded-2xl bg-white p-[18px]"
      style={{ left: 104, top: 76, width: 272, height: 210, boxShadow: SHADOW }}
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.94, y: show ? 0 : 10 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className="mb-[4px]">
        <ModalHead title={title} />
      </div>
      {children}
      <span className="mt-auto flex h-[30px] w-[70px] items-center justify-center self-end rounded-lg text-[13px] font-semibold text-white" style={{ background: PRIMARY }}>
        Done
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------ */
/* 6. A Send you can't hit by accident                                       */
/* ------------------------------------------------------------------------ */

// Window-relative positions: the Signature chip to drag from, the spot on
// the page it's dropped on, and the Send button.
const CHIP_AT: [number, number] = [24 + 70, 24 + 56];
const DROP_AT: [number, number] = [24 + 208 + 56, 24 + 216 + 19];
const SEND_AT: [number, number] = [24 + 82, 24 + 260 + 20];
const COUNT_FROM = 5;

function SendScene({ s }: { s: number }) {
  const placed = s >= 3 && s <= 10;
  const counting = s >= 5 && s <= 9;
  const sent = s === 10;
  const n = COUNT_FROM - (s - 5);
  return (
    <AppWindow>
      <div className="absolute inset-y-0 left-0 w-[164px] border-r border-[#eceef4] bg-white">
        <PlaceFields />

        {/* What's missing, until it isn't. */}
        <motion.div
          className="absolute inset-x-[12px] flex items-start gap-[6px] rounded-lg border px-[9px] py-[8px] text-[12px] font-medium"
          style={{ top: 196, background: "#fff6e0", borderColor: "#f5d27e", color: "#8a5a00" }}
          initial={false}
          animate={{ opacity: placed ? 0 : 1, y: placed ? 6 : 0 }}
          transition={{ duration: 0.35 }}
        >
          <ExclamationTriangleIcon className="mt-px size-[14px] shrink-0" style={{ color: TINT.yellow.fg }} />
          1 signature field missing
        </motion.div>

        <motion.span
          className="absolute right-[14px] text-[13px] font-semibold"
          style={{ top: 234, color: PRIMARY }}
          initial={false}
          animate={{ opacity: counting ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          Cancel
        </motion.span>

        <motion.span
          className="absolute inset-x-[12px] flex h-[40px] items-center justify-center overflow-hidden rounded-xl text-[15px] font-bold"
          style={{ top: 260 }}
          initial={false}
          animate={{
            backgroundColor: sent ? TINT.green.fg : placed ? PRIMARY : "#e7e9f1",
            color: placed ? "#ffffff" : "#a3a8bd",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="absolute inset-y-0 left-0 bg-white/20"
            initial={false}
            animate={{ width: counting ? `${((s - 4) / COUNT_FROM) * 100}%` : "0%" }}
            transition={{ duration: counting ? 0.45 : 0, ease: "linear" }}
          />
          <span className="relative">
            {sent ? (
              <span className="flex items-center gap-1">
                <CheckIcon className="size-[16px]" />
                Sent
              </span>
            ) : counting ? (
              `Sending in ${n}`
            ) : (
              "Send"
            )}
          </span>
        </motion.span>
      </div>

      <Sheet style={{ left: 186, top: 20, width: 224, height: 320 }}>
        <Page lines={2} />
      </Sheet>
      {/* Where the signature goes, then the signature itself. */}
      <motion.div
        className="absolute rounded-md border-2 border-dashed border-[#d3d8e6]"
        style={{ left: 208, top: 216, width: 112, height: 38 }}
        initial={false}
        animate={{ opacity: placed ? 0 : 1 }}
      />
      <motion.div
        className="absolute flex items-center gap-[6px] rounded-md border-2 border-dashed px-2 text-[12px] font-semibold"
        style={{ left: 208, top: 216, width: 112, height: 38, background: TINT.blue.bg, color: TINT.blue.fg, borderColor: TINT.blue.fg }}
        initial={false}
        animate={{ opacity: placed ? 1 : 0, scale: placed ? 1 : 0.92 }}
        transition={{ duration: 0.2 }}
      >
        <PencilIcon className="size-[13px]" />
        Signature
      </motion.div>
    </AppWindow>
  );
}

/** The chip under the cursor while it's dragged onto the page. */
function SendCarry(s: number) {
  if (s !== 1 && s !== 2) return undefined;
  return (
    <div
      className="absolute flex items-center gap-[6px] rounded-md border-2 px-2 text-[12px] font-semibold shadow-[0_8px_18px_-6px_rgba(20,20,80,0.45)]"
      style={{ left: -56, top: -19, width: 112, height: 38, background: TINT.blue.bg, color: TINT.blue.fg, borderColor: TINT.blue.fg }}
    >
      <PencilIcon className="size-[13px]" />
      Signature
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 7. Send another, without starting over                                    */
/* ------------------------------------------------------------------------ */

const AGAIN_OPTIONS: { icon: Icon; label: string }[] = [
  { icon: DocumentPlusIcon, label: "Same recipients, different document" },
  { icon: UserGroupIcon, label: "Same document, different recipients" },
  { icon: PlusCircleIcon, label: "New send entirely" },
];

// The modal's two sizes, kept centred: "Sent", then the three choices.
const SENT_H = 196;
const CHOOSE_H = 236;
const SEND_ANOTHER_BTN: [number, number] = [289, (H - SENT_H) / 2 + SENT_H - 18 - 17];
const PICK_AT: [number, number] = [262, (H - CHOOSE_H) / 2 + 56 + 52 + 22];

function AgainScene({ s }: { s: number }) {
  const modal = s <= 3;
  const choosing = s >= 1 && s <= 3;
  const picked = s === 3;
  // Same document, different recipients: the people clear, the page stays.
  const cleared = s === 4 || s === 5;
  const h = choosing ? CHOOSE_H : SENT_H;
  return (
    <>
      <motion.div className="absolute inset-0" initial={false} animate={{ filter: modal ? "blur(2.5px)" : "blur(0px)" }} transition={{ duration: 0.35 }}>
        <AppWindow>
          <div className="absolute inset-y-0 left-0 flex w-[164px] flex-col gap-[8px] border-r border-[#eceef4] bg-white p-[12px]">
            <span className="mb-[2px] text-[13px] font-semibold">Recipients</span>
            <div className="relative h-[120px]">
              {RECIPIENTS.map((r, i) => (
                <motion.div
                  key={r.name}
                  className="absolute inset-x-0 flex h-[32px] items-center gap-[8px] rounded-lg border border-[#e3e6ef] px-[7px]"
                  style={{ top: i * 40 }}
                  initial={false}
                  animate={{ opacity: cleared ? 0 : 1, x: cleared ? -10 : 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: cleared ? 0.06 * i : 0.25 + 0.08 * i }}
                >
                  <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold" style={{ background: r.tint.bg, color: r.tint.fg }}>
                    {i + 1}
                  </span>
                  <span className="truncate text-[12px] font-medium">{r.name}</span>
                </motion.div>
              ))}
              <motion.div
                className="absolute inset-x-0 top-0 flex h-[32px] items-center justify-center gap-1 rounded-lg border border-dashed border-[#b9c2f9] text-[12px] font-semibold"
                style={{ color: PRIMARY }}
                initial={false}
                animate={{ opacity: cleared ? 1 : 0 }}
                transition={{ duration: 0.3, delay: cleared ? 0.35 : 0 }}
              >
                <PlusIcon className="size-[13px]" />
                Add recipient
              </motion.div>
            </div>
          </div>
          <Sheet style={{ left: 186, top: 20, width: 224, height: 320 }}>
            <Page lines={2} />
          </Sheet>
          {/* The document's fields stay put, waiting for new people. */}
          {RECIPIENTS.map((r, i) => (
            <motion.div
              key={r.name}
              className="absolute rounded-md border-2 border-dashed"
              style={{ left: 206 + (i % 2) * 100, top: 210 + Math.floor(i / 2) * 46, width: 88, height: 34 }}
              initial={false}
              animate={{ backgroundColor: cleared ? "#f3f4f8" : r.tint.bg, borderColor: cleared ? "#cfd4e2" : r.tint.fg }}
              transition={{ duration: 0.4, delay: cleared ? 0.2 : 0.25 }}
            />
          ))}
        </AppWindow>
      </motion.div>
      <motion.div className="absolute inset-0 bg-[#1a2370]" initial={false} animate={{ opacity: modal ? 0.22 : 0 }} transition={{ duration: 0.35 }} />

      <motion.div
        className="absolute overflow-hidden rounded-2xl bg-white"
        style={{ left: 90, width: 300, boxShadow: SHADOW }}
        initial={false}
        animate={{ top: (H - h) / 2, height: h, opacity: modal ? 1 : 0, scale: modal ? 1 : 0.94 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {/* Sent, with the way to go again. */}
        <motion.div
          className="absolute inset-x-0 top-0 flex flex-col items-center p-[18px]"
          style={{ height: SENT_H }}
          initial={false}
          animate={{ opacity: choosing ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="mt-[2px] flex size-[38px] items-center justify-center rounded-full" style={{ background: TINT.green.bg, color: TINT.green.fg }}>
            <CheckIcon className="size-[20px]" />
          </span>
          <span className="mt-[10px] text-[16px] font-semibold">Sent</span>
          <span className="mt-[4px] text-[12px]" style={{ color: MUTED }}>
            To 3 recipients
          </span>
          <div className="mt-auto flex w-full gap-[8px]">
            <span className="flex h-[34px] w-[90px] items-center justify-center rounded-lg border border-[#e3e6ef] text-[13px] font-semibold">Done</span>
            <span className="flex h-[34px] flex-1 items-center justify-center gap-[6px] rounded-lg text-[13px] font-semibold text-white" style={{ background: PRIMARY }}>
              <ArrowPathIcon className="size-[14px]" />
              Send another
            </span>
          </div>
        </motion.div>

        {/* Three ways to keep going. */}
        <motion.div
          className="absolute inset-x-0 top-0 p-[18px]"
          initial={false}
          animate={{ opacity: choosing ? 1 : 0 }}
          transition={{ duration: 0.25, delay: choosing ? 0.15 : 0 }}
        >
          <ModalHead title="Send another" />
          <div className="mt-[14px] flex flex-col gap-[8px]">
            {AGAIN_OPTIONS.map((o, i) => {
              const on = picked && i === 1;
              return (
                <motion.div
                  key={o.label}
                  className="flex h-[44px] items-center gap-[10px] rounded-xl border px-[10px] text-[13px] font-medium"
                  initial={false}
                  animate={{ borderColor: on ? PRIMARY : "#e3e6ef", backgroundColor: on ? "#eef0ff" : "#ffffff" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="flex size-[24px] shrink-0 items-center justify-center rounded-md" style={{ background: TINT.blue.bg, color: TINT.blue.fg }}>
                    <o.icon className="size-[14px]" />
                  </span>
                  {o.label}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------------ */

const REST: [number, number] = [430, 330];
// Just clear of the Send button, so the countdown on it stays readable.
const ASIDE: [number, number] = [206, 318];

const LOOPS: Record<DecisionLoopName, Loop> = {
  recipients: {
    label: "A Recipient details modal where three people are added one by one, each with their own colour.",
    steps: [
      { ms: 1000, cursor: addButtonAt(0) },
      { ms: 650, cursor: addButtonAt(0), click: true },
      { ms: 650, cursor: addButtonAt(1) },
      { ms: 650, cursor: addButtonAt(1), click: true },
      { ms: 650, cursor: addButtonAt(2) },
      { ms: 750, cursor: addButtonAt(2), click: true },
      { ms: 2200, cursor: REST },
      { ms: 700, cursor: REST },
    ],
    still: 6,
    Scene: RecipientsScene,
  },
  sidebar: {
    label: "A document squeezed between two cluttered sidebars, which merge into one tidy sidebar so the document can grow.",
    steps: [{ ms: 700 }, { ms: 650 }, { ms: 750 }, { ms: 900 }, { ms: 800 }, { ms: 2000 }, { ms: 1000 }],
    still: 5,
    Scene: SidebarScene,
  },
  fields: {
    label: "A grid of twelve field types collapses down to just Signature, Text and Date, with a More fields link.",
    steps: [{ ms: 1800 }, { ms: 1200 }, { ms: 2200 }, { ms: 1100 }],
    still: 2,
    Scene: FieldsScene,
  },
  panel: {
    label: "Selecting a field on the page turns the sidebar into its editor and brings up a formatting toolbar; clicking away puts both back.",
    steps: [
      { ms: 1000, cursor: [318, 284] },
      { ms: 2000, cursor: [318, 284], click: true },
      { ms: 800, cursor: [388, 300] },
      { ms: 1300, cursor: [388, 300], click: true },
      { ms: 700, cursor: REST },
    ],
    still: 1,
    Scene: PanelScene,
  },
  modals: {
    label: "Recipients and Document options buttons in the sidebar each open a modal over the dimmed app, which then closes again.",
    steps: [
      { ms: 900, cursor: RECIPIENTS_BTN },
      { ms: 1500, cursor: RECIPIENTS_BTN, click: true },
      { ms: 650, cursor: DONE_BTN },
      { ms: 650, cursor: DONE_BTN, click: true },
      { ms: 800, cursor: OPTIONS_BTN },
      { ms: 1500, cursor: OPTIONS_BTN, click: true },
      { ms: 650, cursor: DONE_BTN },
      { ms: 900, cursor: DONE_BTN, click: true },
    ],
    still: 1,
    Scene: ModalsScene,
  },
  send: {
    label: "A greyed-out Send button explains a signature field is missing; once one is placed, Send counts down from five with a Cancel option, then shows Sent.",
    steps: [
      { ms: 1000, cursor: CHIP_AT },
      { ms: 300, cursor: CHIP_AT, click: true },
      { ms: 800, cursor: DROP_AT },
      { ms: 700, cursor: DROP_AT },
      { ms: 650, cursor: SEND_AT },
      { ms: 450, cursor: SEND_AT, click: true },
      { ms: 450, cursor: ASIDE },
      { ms: 450, cursor: ASIDE },
      { ms: 450, cursor: ASIDE },
      { ms: 450, cursor: ASIDE },
      { ms: 1700, cursor: REST },
      { ms: 600, cursor: REST },
    ],
    still: 6,
    Scene: SendScene,
    carry: SendCarry,
  },
  again: {
    label: "After sending, Send another offers three ways to go again; choosing the same document clears the recipients but keeps the document and its fields.",
    steps: [
      { ms: 1300, cursor: SEND_ANOTHER_BTN },
      { ms: 1000, cursor: SEND_ANOTHER_BTN, click: true },
      { ms: 700, cursor: PICK_AT },
      { ms: 700, cursor: PICK_AT, click: true },
      { ms: 1100, cursor: REST },
      { ms: 1700, cursor: REST },
      { ms: 900, cursor: REST },
    ],
    still: 3,
    Scene: AgainScene,
  },
};
