"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { DecisionLoopName } from "@/projects";
import {
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon,
  ClipboardDocumentListIcon as ClipboardIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  PencilSquareIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HashtagIcon,
  LinkIcon,
} from "@heroicons/react/16/solid";
import { DocumentTextIcon as DocOutlineIcon } from "@heroicons/react/24/outline";

export type { DecisionLoopName };

// Every scene is laid out on a fixed 480x360 stage and scaled to fit, the way
// a prototype is scaled to its frame, so it reads the same at any card width.
const W = 480;
const H = 360;

// The product's own palette, sampled from the production recordings.
const INK = "#3e3f46";
const MUTED = "#757986";
const BAR = "#e6e8ee";
const LINE = "#e3e5ec";
const CANVAS = "#f4f5f8";
const PRIMARY = "#3949f3";
const PRIMARY_OFF = "#93bbfa";
const PRIMARY_SOFT = "#ecf1fe";
const DANGER = "#f03f3c";
const SCRIM = "rgba(26,33,96,0.5)";
const SHADOW = "0 12px 30px -12px rgba(20,20,80,0.45)";
const EASE = [0.22, 1, 0.36, 1] as const;

// Recipient colours, in the order the product hands them out. `fg` is the
// strong colour (field outlines, icons), `bg` the card wash, `pill` the role
// label behind `ink` text, `ring` a selected card's outline, `dot` an avatar.
const TINT = {
  blue: { fg: "#5277e6", bg: "#eef3fe", pill: "#dae7fe", ink: "#283399", ring: "#9bb6f6", dot: "#98b3f2" },
  green: { fg: "#2fcf98", bg: "#ebfef7", pill: "#c6f7e4", ink: "#21654d", ring: "#60efba", dot: "#64ecb6" },
  yellow: { fg: "#eaac19", bg: "#fefaec", pill: "#fdefb8", ink: "#7e3c12", ring: "#f7d554", dot: "#ffdf53" },
  purple: { fg: "#9a6cf0", bg: "#f5f0ff", pill: "#e7dcff", ink: "#55279e", ring: "#c3a6fb", dot: "#c2a5f7" },
};

type Tint = (typeof TINT)["blue"];

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
 * A small looping animation for one of the Quick Send key decisions: the
 * product's own UI on the brand blue, stripped back to the one idea it's
 * making. It only runs while on screen, and shows a single still frame when
 * motion is reduced.
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
          fill="#1d2140"
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
      className={`absolute overflow-hidden rounded-[14px] ${className}`}
      style={{ left: 24, top: 24, width: 432, height: 312, background: CANVAS, boxShadow: SHADOW }}
    >
      {children}
    </div>
  );
}

/** The app's header bar: Exit on the left, the breadcrumb in the middle. */
function AppHeader() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-[20px] items-center border-b bg-white px-[8px]" style={{ borderColor: LINE }}>
      <ChevronLeftIcon className="size-[10px]" style={{ color: MUTED }} />
      <Bar w={16} h={4} color="#d3d6de" className="ml-[2px]" />
      <span className="absolute left-1/2 flex -translate-x-1/2 gap-[4px]">
        <Bar w={58} h={4} color="#c9ccd6" />
        <Bar w={34} h={4} color="#dfe1e7" />
      </span>
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
    <div className="absolute overflow-hidden rounded-[3px] bg-white shadow-[0_1px_4px_rgba(20,20,80,0.12)]" style={style}>
      {children}
    </div>
  );
}

/* Field types --------------------------------------------------------------- */

// Every field type the product has, in the order its Fields panel lists them.
type FieldType =
  | "Signature"
  | "Text"
  | "Signing Date"
  | "Date"
  | "Email"
  | "Initials"
  | "Number"
  | "Dropdown"
  | "Checkbox"
  | "Regex"
  | "File"
  | "Drawn";

/** The product's own field-type icons, from Euan's outline set, on a 24x24 grid. */
const FIELD_ICONS: Record<FieldType, string> = {
  Signature:
    "M2.96 17.95c.32-.59.62-1.16.9-1.7m0 0C10.77 2.71 4.93 1.39 3.78 4.19c-.72 1.75-.98 7.72.08 12.06Zm0 0c.71 2.88 2 5.04 4.13 4.75.72-.1 1.45-.57 2.1-1.26m0 0c1.37-1.44 2.43-3.83 2.43-5.65 0-3.08-2.6-2.99-3.25-1.23-.69 1.85-.45 5.1.82 6.88Zm0 0c.59.82 1.39 1.34 2.43 1.26 1.92-.14 2.04-2.12 2.04-2.12s.4 2 1.94 2.12c1.53.12 1.99-1.53 1.99-1.53s.49 1.83 2.52 1.53",
  Text: "M12 6h6v3m-6-3H6v3m6-3v12m3 0h-3m0 0H9",
  "Signing Date":
    "M8 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M8 5h8M8 5v2m0-2V3m8 2h3m-3 0v2m0-2V3M7 11h9m2.59-2.41a2 2 0 1 1 2.82 2.82L14.83 18H12v-2.83l6.59-6.58Z",
  Date: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z",
  Email:
    "M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-9 9m4.5-1.21A8.96 8.96 0 0 1 12 21",
  Initials:
    "M12.19 5.35l.02-.04c.09-.17.2-.28.09-.12l-.11.16Zm0 0-3.66 6.9C7.68 13.94 8.83 15 9.8 15h3.16s2.81-2.67 4.49-4.49c1.88-2.05 2.98-3.73 2.98-3.73s0 2.17.32 4.35c.24 1.65-1.19 3.87-2.86 3.87h-1.57M12.19 5.35C10.94 7.09 4.81 14.73 3 14.37M21 19H3",
  Number: "M7 20l1.25-5m0 0 1.5-6m-1.5 6H4m4.25 0h6m-4.5-6L11 4m-1.25 5H6m3.75 0h6M13 20l1.25-5m0 0 1.5-6m-1.5 6H18m-2.25-6L17 4m-1.25 5H20",
  Dropdown: "M3 18h17M3 12h17m1-8-2 2-2-2M3.03 6h9.98",
  Checkbox: "M5 13l4 4L19 7",
  Regex: "M10 20 14 4m4 4 4 4-4 4M6 16l-4-4 4-4",
  File: "M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1M8 8l4-4 4 4m-4-4v12",
  Drawn: "M15.23 5.23l3.54 3.54m-2.04-5.04a2.5 2.5 0 1 1 3.54 3.54L6.5 21.04H3v-3.58L16.73 3.73Z",
};

function FieldIcon({ field, className = "" }: { field: FieldType; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={FIELD_ICONS[field]} />
    </svg>
  );
}

/** A field's icon on its tinted, outlined tile. */
function FieldTile({ field, tint = TINT.blue, size = 22 }: { field: FieldType; tint?: Tint; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[5px] border"
      style={{ width: size, height: size, background: tint.bg, borderColor: tint.ring, color: tint.fg }}
    >
      <FieldIcon field={field} className="size-[62%]" />
    </span>
  );
}

/** The six-dot grip on the end of a draggable row. */
function Grip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 6 10" className={`h-[9px] w-[6px] shrink-0 ${className}`} fill="#9a9fac">
      {[0, 1].map((c) => [1, 5, 9].map((r) => <circle key={`${c}${r}`} cx={1 + c * 4} cy={r} r={0.95} />))}
    </svg>
  );
}

/** A field you can place: its tile, its name and a grip, on a white card. */
function Chip({
  field,
  tint = TINT.blue,
  small = false,
  alert,
  className = "",
}: {
  field: FieldType;
  tint?: Tint;
  small?: boolean;
  // Whether it's still needed; left out, the chip has no room for the flag.
  alert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex h-full w-full items-center rounded-lg bg-white shadow-[0_1px_3px_rgba(30,35,70,0.13)] ${small ? "gap-[6px] px-[4px]" : "gap-2 px-[6px]"} ${className}`}
    >
      <FieldTile field={field} tint={tint} size={small ? 16 : 22} />
      <span className={`truncate font-medium ${small ? "text-[10px]" : "text-[13px]"}`}>{field}</span>
      {alert !== undefined && (
        <motion.span
          className="ml-auto flex size-[12px] shrink-0 items-center justify-center rounded-[4px] bg-[#ffe5e6]"
          initial={false}
          animate={{ opacity: alert ? 1 : 0, scale: alert ? 1 : 0.6 }}
          transition={{ duration: 0.25 }}
        >
          <span className="flex size-[8px] items-center justify-center rounded-full text-[6px] font-bold text-white" style={{ background: DANGER }}>
            !
          </span>
        </motion.span>
      )}
      <Grip className={alert === undefined ? "ml-auto" : ""} />
    </div>
  );
}

/** A field placed on the page, in its recipient's colour. */
function PlacedField({ field, tint, style }: { field: FieldType; tint: Tint; style: React.CSSProperties }) {
  return (
    <div
      className="absolute flex items-center rounded-[2px] border-[1.5px] px-[4px] text-[8.5px] font-medium"
      style={{ background: tint.bg, borderColor: tint.fg, color: tint.ink, ...style }}
    >
      {field}
      <span className="absolute top-[-1px] right-[3px] text-[10px] leading-none" style={{ color: DANGER }}>
        *
      </span>
    </div>
  );
}

/** The role label on a recipient card. */
function RolePill({ tint, small = false }: { tint: Tint; small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${small ? "gap-[2px] px-[4px] py-[1px] text-[8px]" : "gap-[3px] px-[7px] py-[2px] text-[11px]"}`}
      style={{ background: tint.pill, color: tint.ink }}
    >
      <FieldIcon field="Signature" className={small ? "size-[8px]" : "size-[11px]"} />
      Signer
    </span>
  );
}

/** A recipient on the sidebar: their role, a name and an email as bars. */
function RecipientCard({
  tint,
  open = false,
  missing = false,
  style,
  children,
}: {
  tint: Tint;
  open?: boolean;
  missing?: boolean;
  style: React.CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className="absolute rounded-[9px]"
      style={{ background: tint.bg, boxShadow: open ? `inset 0 0 0 2px ${tint.ring}` : `inset 0 0 0 1px ${tint.ring}`, ...style }}
    >
      <div className="absolute top-[6px] left-[6px]">
        <RolePill tint={tint} small />
      </div>
      <motion.span
        className="absolute top-[8px] right-[7px] size-[4px] rounded-full"
        style={{ background: DANGER }}
        initial={false}
        animate={{ opacity: missing ? 1 : 0 }}
      />
      <Bar w={50} h={4} color={tint.ink} className="absolute top-[25px] left-[7px] opacity-60" />
      <Bar w={70} h={3} color={tint.fg} className="absolute top-[33px] left-[7px] opacity-50" />
      {children}
    </div>
  );
}

/** "Required" until every signer has a signature field, then "Ready". */
function StatusPill({ ready }: { ready: boolean }) {
  return (
    <span className="relative block h-[13px] w-[48px]">
      <motion.span
        className="absolute inset-y-0 right-0 flex items-center gap-[3px] rounded-full px-[4px] text-[7.5px] font-semibold"
        style={{ background: "#ffecee", color: "#d4302e" }}
        initial={false}
        animate={{ opacity: ready ? 0 : 1 }}
      >
        <span className="flex size-[8px] items-center justify-center rounded-full text-[6px] text-white" style={{ background: DANGER }}>
          1
        </span>
        Required
      </motion.span>
      <motion.span
        className="absolute inset-y-0 right-0 flex items-center gap-[2px] rounded-full px-[5px] text-[7.5px] font-semibold"
        style={{ background: "#d6f8ea", color: "#1f7a57" }}
        initial={false}
        animate={{ opacity: ready ? 1 : 0 }}
      >
        Ready
        <CheckIcon className="size-[8px]" />
      </motion.span>
    </span>
  );
}

/** The left panel's frame: a white card floating on the canvas. */
function SidePanel({ children }: { children: ReactNode }) {
  return (
    <div className="absolute overflow-hidden rounded-[12px] border bg-white shadow-[0_2px_8px_-2px_rgba(20,20,80,0.1)]" style={{ left: 8, top: 28, width: 132, bottom: 8, borderColor: LINE }}>
      {children}
    </div>
  );
}

const DEFAULT_FIELDS: FieldType[] = ["Signature", "Text", "Date"];

/**
 * The sidebar's resting state, Recipients & Fields: the selected recipient
 * open with the fields to place for them, the others folded away.
 */
function RecipientsAndFields({ missing = false }: { missing?: boolean }) {
  return (
    <>
      <div className="absolute inset-x-[8px] top-[8px] flex items-center justify-between">
        <Bar w={58} h={6} color="#c9ccd6" />
        <StatusPill ready={!missing} />
      </div>
      <Bar w={96} h={3} className="absolute top-[24px] left-[8px]" />
      <RecipientCard tint={TINT.blue} open missing={missing} style={{ left: 6, right: 6, top: 34, height: 133 }}>
        {DEFAULT_FIELDS.map((f, i) => (
          <div key={f} className="absolute inset-x-[5px] h-[22px]" style={{ top: 45 + i * 27 }}>
            <Chip field={f} small alert={missing && i === 0} />
          </div>
        ))}
      </RecipientCard>
      <RecipientCard tint={TINT.green} style={{ left: 6, right: 6, top: 173, height: 43 }} />
      <RecipientCard tint={TINT.yellow} style={{ left: 6, right: 6, top: 222, height: 43 }} />
    </>
  );
}

// The page every in-product loop shares, and the signature lines on it.
// The page fills the canvas beside the sidebar; Send floats over its corner.
const PAGE = { left: 150, top: 34, width: 272 };
const SIGN_ROWS = [186, 216, 246];

/** The document, with a signing line for each recipient. */
function DocPage() {
  return (
    <Sheet style={{ ...PAGE, height: 300 }}>
      <Page lines={2} />
      {/* The Signatures heading. */}
      <Bar w={44} h={4} color="#cfd3dd" className="absolute top-[172px] left-[10px]" />
      {SIGN_ROWS.map((y) => (
        <div key={y} className="absolute inset-x-[10px]" style={{ top: y }}>
          <span className="absolute inset-x-0 top-[16px] h-px bg-[#d5d8e0]" />
          <Bar w={46} h={3} className="absolute top-[20px] left-0" />
        </div>
      ))}
    </Sheet>
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
              className="absolute rounded-[3px] border-2"
              style={{ left: 196 + (i % 2) * 104, top: 196 + Math.floor(i / 2) * 50, width: 92, height: 34, background: r.tint.bg, borderColor: r.tint.fg }}
              initial={false}
              animate={{ opacity: i < n ? 1 : 0 }}
            />
          ))}
        </AppWindow>
      </div>
      <div className="absolute inset-0 bg-[#1a2160]/15" />

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
            style={{ top: 56 + 52 * i, boxShadow: `inset 3px 0 0 ${r.tint.fg}` }}
            initial={false}
            animate={{ opacity: i < n ? 1 : 0, y: i < n ? 0 : 10, scale: i < n ? 1 : 0.96 }}
            transition={{ duration: 0.4, ease: EASE, delay: i < n ? 0.08 : 0 }}
          >
            <span
              className="flex size-[26px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold"
              style={{ background: r.tint.pill, color: r.tint.ink }}
            >
              {i + 1}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <span className="text-[14px] font-medium">{r.name}</span>
              <Bar w={96} h={5} />
            </span>
            <span className="rounded-full px-2 py-[2px] text-[11px] font-medium" style={{ background: r.tint.pill, color: r.tint.ink }}>
              {r.role}
            </span>
          </motion.div>
        ))}
        <motion.div
          className="absolute inset-x-[16px] flex h-[40px] items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#b4c3f7] text-[13px] font-semibold"
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
        className="absolute top-[20px] h-[320px] overflow-hidden rounded-[3px] bg-white shadow-[0_1px_4px_rgba(20,20,80,0.12)]"
        initial={false}
        animate={settled ? { left: 156, width: 252 } : { left: 116, width: 192 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Page />
      </motion.div>

      {/* Left: cluttered before, tidy after. */}
      <motion.div
        className="absolute inset-y-0 left-0 overflow-hidden border-r bg-white"
        style={{ borderColor: LINE }}
        initial={false}
        animate={{ width: settled ? 132 : 104 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <motion.div className="absolute inset-0 flex flex-col gap-[7px] p-[10px]" initial={false} animate={{ opacity: settled ? 0 : 1 }}>
          {[0, 1, 2].map((g) => (
            <div key={g} className="mb-[4px] flex flex-col gap-[6px]">
              <Bar w={40 + g * 6} h={6} color="#c9ccd6" />
              {[64, 50, 70, 42].map((w, i) => (
                <div key={i} className="flex items-center gap-[6px]">
                  <span
                    className="size-[12px] shrink-0 rounded-[3px]"
                    style={{ background: (i + g) % 3 === 0 ? TINT.blue.pill : "#e3e5eb" }}
                  />
                  <Bar w={w - g * 6} h={6} color="#dfe1e7" />
                </div>
              ))}
            </div>
          ))}
          <div className="mt-auto flex gap-[5px]">
            <Bar w={40} h={18} color="#e3e5eb" />
            <Bar w={40} h={18} color="#e3e5eb" />
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex w-[132px] flex-col gap-[8px] p-[12px]"
          initial={false}
          animate={{ opacity: settled ? 1 : 0, x: settled ? 0 : -8 }}
          transition={{ duration: 0.5, ease: EASE, delay: settled ? 0.25 : 0 }}
        >
          <span className="mb-[2px] text-[13px] font-semibold">Fields</span>
          {DEFAULT_FIELDS.map((f) => (
            <div key={f} className="h-[28px]">
              <Chip field={f} small />
            </div>
          ))}
          {/* Document options and Manage recipients, as the real panel ends. */}
          {[0, 1].map((i) => (
            <span key={i} className={`flex h-[26px] items-center justify-center rounded-full border ${i === 0 ? "mt-auto" : ""}`} style={{ borderColor: "#d9dce4" }}>
              <Bar w={[58, 64][i]} h={5} color="#c9ccd6" />
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Right: slides across and folds into the left. */}
      <motion.div
        className="absolute inset-y-0 z-10 overflow-hidden border-l bg-white"
        style={{ borderColor: LINE }}
        initial={false}
        animate={{
          left: merged ? 0 : 320,
          width: merged ? 132 : 112,
          opacity: settled ? 0 : 1,
        }}
        transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1], opacity: { duration: 0.35 } }}
      >
        <motion.div className="absolute inset-x-0 top-0 w-[112px]" initial={false} animate={{ opacity: merged ? 0.3 : 1 }} transition={{ duration: 0.3 }}>
          <div className="relative flex gap-[8px] border-b px-[10px] pt-[12px] pb-[9px]" style={{ borderColor: LINE }}>
            {[22, 26, 20].map((w, i) => (
              <Bar key={i} w={w} h={7} color={i === tab ? PRIMARY : "#d3d6de"} />
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
                    <Bar w={w * 0.7} h={6} color="#dfe1e7" />
                    <Toggle on={(i + t) % 2 === 0} />
                  </div>
                ) : i % 3 === 2 ? (
                  <span key={i} className="block h-[18px] rounded-[5px] border" style={{ borderColor: LINE }} />
                ) : (
                  <Bar key={i} w={w} h={6} color="#dfe1e7" />
                ),
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AppWindow>
  );
}

function Toggle({ on = true }: { on?: boolean }) {
  return (
    <span className="relative block h-[16px] w-[28px] shrink-0 rounded-full" style={{ background: on ? PRIMARY : "#d9dce4" }}>
      <span className="absolute top-[2px] size-[12px] rounded-full bg-white" style={{ left: on ? 14 : 2 }} />
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* 3. Three fields by default                                                */
/* ------------------------------------------------------------------------ */

// Every field type, two to a row as the old panel showed them all at once.
// `keep` is the slot each of the default three ends up in.
const ALL_FIELDS: { field: FieldType; keep?: number }[] = [
  { field: "Signature", keep: 0 },
  { field: "Text", keep: 1 },
  { field: "Signing Date" },
  { field: "Date", keep: 2 },
  { field: "Email" },
  { field: "Initials" },
  { field: "Number" },
  { field: "Dropdown" },
  { field: "Checkbox" },
  { field: "Regex" },
  { field: "File" },
  { field: "Drawn" },
];

// Field rows sit 36px apart inside the recipient's card, two columns wide
// while every type shows.
const ROW_AT = (slot: number) => 58 + slot * 36;
const FIELDS_W = 380;
const COL_W = (FIELDS_W - 24 - 20 - 10) / 2;

function FieldsScene({ s }: { s: number }) {
  const few = s === 1 || s === 2;
  // Panel and card heights for the full list and the short one, kept centred.
  const card = few ? ROW_AT(3) + 32 : ROW_AT(6) + 4;
  const h = 44 + card + 12;
  return (
    <motion.div
      className="absolute overflow-hidden rounded-2xl bg-white"
      style={{ left: (W - FIELDS_W) / 2, width: FIELDS_W, boxShadow: SHADOW }}
      initial={false}
      animate={{ top: (H - h) / 2, height: h }}
      transition={{ duration: 0.8, ease: EASE, delay: few ? 0.3 : 0 }}
    >
      <span className="absolute top-[16px] left-[16px] text-[15px] font-semibold">Recipients &amp; Fields</span>

      {/* The recipient the fields are being placed for. */}
      <motion.div
        className="absolute inset-x-[12px] top-[44px] rounded-[12px]"
        style={{ background: TINT.blue.bg, boxShadow: `inset 0 0 0 2px ${TINT.blue.ring}` }}
        initial={false}
        animate={{ height: card }}
        transition={{ duration: 0.8, ease: EASE, delay: few ? 0.3 : 0 }}
      >
        <div className="absolute top-[10px] left-[10px]">
          <RolePill tint={TINT.blue} />
        </div>
        <Bar w={92} h={6} color={TINT.blue.ink} className="absolute top-[34px] left-[11px] opacity-60" />
        <Bar w={126} h={4} color={TINT.blue.fg} className="absolute top-[45px] left-[11px] opacity-50" />

        {ALL_FIELDS.map((f, i) => {
          const kept = f.keep !== undefined;
          const grid = { top: ROW_AT(Math.floor(i / 2)), left: 10 + (i % 2) * (COL_W + 10), width: COL_W };
          const goal = few
            ? kept
              ? { top: ROW_AT(f.keep!), left: 10, width: COL_W * 2 + 10, opacity: 1, scale: 1 }
              : { ...grid, opacity: 0, scale: 0.9 }
            : { ...grid, opacity: 1, scale: 1 };
          return (
            <motion.div
              key={f.field}
              className="absolute h-[30px]"
              initial={false}
              animate={goal}
              transition={
                few && !kept
                  ? { duration: 0.35, ease: EASE, delay: 0.02 * i }
                  : { duration: 0.7, ease: EASE, delay: few ? 0.3 : kept ? 0 : 0.25 + 0.02 * i }
              }
            >
              <Chip field={f.field} />
            </motion.div>
          );
        })}

        <motion.span
          className="absolute left-[14px] flex items-center gap-[6px] text-[12px] font-medium"
          style={{ top: ROW_AT(3) + 4, color: MUTED }}
          initial={false}
          animate={{ opacity: few ? 1 : 0, y: few ? 0 : 6 }}
          transition={{ duration: 0.4, delay: few ? 0.8 : 0 }}
        >
          <span className="size-0 border-y-[4px] border-l-[6px] border-y-transparent" style={{ borderLeftColor: MUTED }} />
          More field types
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------ */
/* 4. A panel that follows you                                               */
/* ------------------------------------------------------------------------ */

// Page-relative spots: the Text field that gets selected, and its size.
const TEXT_FIELD = { left: 76, top: SIGN_ROWS[0], width: 58, height: 15 };
const TEXT_FIELD_AT: [number, number] = [24 + PAGE.left + TEXT_FIELD.left + 30, 24 + PAGE.top + TEXT_FIELD.top + 9];
const PAGE_BLANK_AT: [number, number] = [24 + PAGE.left + 96, 24 + PAGE.top + 132];

/** The sidebar while a field is selected: that field's Content editor. */
function FieldEditor() {
  return (
    <div className="absolute inset-0 p-[8px]">
      <div className="flex h-[18px] items-center gap-[5px]">
        <span className="flex size-[16px] items-center justify-center rounded-[4px]" style={{ background: PRIMARY_SOFT, color: PRIMARY }}>
          <Bars3BottomLeftIcon className="size-[10px]" />
        </span>
        <span className="text-[11px] font-semibold">Content</span>
        <span className="ml-auto flex size-[15px] items-center justify-center rounded-[4px] border" style={{ borderColor: "#d9dce4" }}>
          <XMarkIcon className="size-[9px]" style={{ color: MUTED }} />
        </span>
      </div>

      {/* Content, Placement, Dimensions. */}
      <div className="mt-[8px] flex h-[16px] rounded-[5px] border p-[1px]" style={{ background: CANVAS, borderColor: LINE }}>
        {[22, 28, 30].map((w, i) => (
          <span key={i} className="flex flex-1 items-center justify-center rounded-[4px]" style={{ background: i === 0 ? "#e1e9fd" : "transparent" }}>
            <Bar w={w} h={3} color={i === 0 ? PRIMARY : "#c3c7d1"} />
          </span>
        ))}
      </div>

      <EditorLabel top={52} label="Field type" />
      <div
        className="absolute inset-x-[8px] flex h-[22px] items-center gap-[6px] rounded-[6px] border border-dashed px-[4px] text-[10px] font-medium"
        style={{ top: 72, background: "#f6f8ff", borderColor: "#a9bdf6" }}
      >
        <FieldTile field="Text" size={15} />
        Text
      </div>

      <EditorLabel top={104} label="Assignee" />
      <div
        className="absolute inset-x-[8px] flex h-[20px] items-center gap-[5px] rounded-[6px] border px-[5px]"
        style={{ top: 124, background: CANVAS, borderColor: LINE, color: TINT.blue.ink }}
      >
        <FieldIcon field="Signature" className="size-[9px]" />
        <Bar w={44} h={4} color="#b9bdc8" />
        <span className="ml-auto flex size-[13px] items-center justify-center rounded-[3px] border bg-white" style={{ borderColor: "#d9dce4" }}>
          <ArrowsRightLeftIcon className="size-[8px]" style={{ color: MUTED }} />
        </span>
      </div>

      <EditorLabel top={154} label="Field label" />
      <div className="absolute inset-x-[8px] flex h-[20px] items-center rounded-[6px] border bg-white px-[6px]" style={{ top: 174, borderColor: "#dfe2ea" }}>
        <Bar w={72} h={4} />
      </div>

      <span
        className="absolute inset-x-[8px] bottom-[34px] flex h-[20px] items-center justify-center gap-[4px] rounded-full border text-[9.5px] font-medium"
        style={{ borderColor: "#d9dce4" }}
      >
        <DocumentDuplicateIcon className="size-[9px]" style={{ color: MUTED }} />
        Duplicate
      </span>
      <span
        className="absolute inset-x-[8px] bottom-[8px] flex h-[20px] items-center justify-center gap-[4px] rounded-full border text-[9.5px] font-medium"
        style={{ borderColor: "#f3a5a4", color: "#e2403d" }}
      >
        <TrashIcon className="size-[9px]" />
        Delete
      </span>
    </div>
  );
}

/** A small editor section label, with a grey line of help under it. */
function EditorLabel({ top, label }: { top: number; label: string }) {
  return (
    <div className="absolute left-[9px]" style={{ top }}>
      <span className="block text-[9px] font-semibold">{label}</span>
      <Bar w={64} h={3} className="mt-[3px]" />
    </div>
  );
}

function PanelScene({ s }: { s: number }) {
  const editing = s === 1 || s === 2;
  return (
    <AppWindow>
      <AppHeader />
      <SidePanel>
        <motion.div className="absolute inset-0" initial={false} animate={{ opacity: editing ? 0 : 1, x: editing ? -16 : 0 }} transition={{ duration: 0.25, ease: EASE, delay: editing ? 0 : 0.2 }}>
          <RecipientsAndFields />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: editing ? 1 : 0, x: editing ? 0 : 16 }}
          transition={{ duration: 0.3, ease: EASE, delay: editing ? 0.2 : 0 }}
        >
          <FieldEditor />
        </motion.div>
      </SidePanel>

      <DocPage />
      <PlacedField field="Signature" tint={TINT.blue} style={{ left: PAGE.left + 10, top: PAGE.top + SIGN_ROWS[0], width: 58, height: 15 }} />
      <PlacedField field="Signature" tint={TINT.green} style={{ left: PAGE.left + 10, top: PAGE.top + SIGN_ROWS[1], width: 58, height: 15 }} />
      <PlacedField field="Signature" tint={TINT.yellow} style={{ left: PAGE.left + 10, top: PAGE.top + SIGN_ROWS[2], width: 58, height: 15 }} />

      {/* The Text field, selected while it's being edited. */}
      <motion.div
        className="absolute"
        style={{ left: PAGE.left + TEXT_FIELD.left, top: PAGE.top + TEXT_FIELD.top, width: TEXT_FIELD.width, height: TEXT_FIELD.height }}
        initial={false}
        animate={{ scale: editing ? 1.04 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <PlacedField field="Text" tint={TINT.blue} style={{ inset: 0 }} />
        <motion.span
          className="absolute -inset-[3px] rounded-[3px] border-[1.5px]"
          style={{ borderColor: PRIMARY }}
          initial={false}
          animate={{ opacity: editing ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
        {["top-1/2 -right-[5px] h-[8px] w-[4px] -translate-y-1/2", "left-1/2 -bottom-[5px] h-[4px] w-[10px] -translate-x-1/2"].map((pos) => (
          <motion.span
            key={pos}
            className={`absolute rounded-[1px] ${pos}`}
            style={{ background: PRIMARY }}
            initial={false}
            animate={{ opacity: editing ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </motion.div>

      {/* Send, ready, in its corner: every signer has a signature. */}
      <div className="absolute rounded-[12px] bg-white p-[3px] shadow-[0_4px_14px_-4px_rgba(20,20,80,0.28)]" style={SEND}>
        <span className="flex h-[26px] items-center justify-center gap-[5px] rounded-[9px] text-[10.5px] font-semibold text-white" style={{ background: PRIMARY }}>
          Send Document
          <ChevronRightIcon className="size-[12px]" />
        </span>
      </div>

      {/* The formatting toolbar only exists while a field is selected. */}
      <motion.div
        className="absolute flex h-[24px] items-center gap-[7px] rounded-[9px] border bg-white px-[6px] text-[10px] font-semibold shadow-[0_4px_14px_-4px_rgba(20,20,80,0.3)]"
        style={{ left: PAGE.left - 6, top: 26, borderColor: LINE }}
        initial={false}
        animate={{ opacity: editing ? 1 : 0, y: editing ? 0 : -10 }}
        transition={{ duration: 0.35, ease: EASE, delay: editing ? 0.15 : 0 }}
      >
        <span className="flex h-[16px] items-center gap-[3px] rounded-[4px] border px-[4px] text-[9px] font-medium" style={{ borderColor: LINE }}>
          12
          <ChevronDownIcon className="size-[8px]" style={{ color: MUTED }} />
        </span>
        <span className="h-[12px] w-px" style={{ background: LINE }} />
        <span className="font-bold">B</span>
        <span className="font-serif italic">I</span>
        <span className="underline">U</span>
        <span className="h-[12px] w-px" style={{ background: LINE }} />
        <span className="flex size-[16px] items-center justify-center rounded-[4px]" style={{ background: PRIMARY_SOFT, color: PRIMARY }}>
          <Bars3BottomLeftIcon className="size-[10px]" />
        </span>
        <Bars3Icon className="size-[10px]" style={{ color: MUTED }} />
      </motion.div>
    </AppWindow>
  );
}

/* ------------------------------------------------------------------------ */
/* 5. Modals for occasional tasks                                            */
/* ------------------------------------------------------------------------ */

/** The sidebar's resting state, as shapes: a heading and the fields you can place. */
function PlaceFields() {
  return (
    <div className="flex h-full flex-col gap-[8px] p-[12px]">
      <Bar w={74} h={7} color="#c9ccd6" className="mt-[3px] mb-[7px]" />
      {DEFAULT_FIELDS.map((f, i) => (
        <div key={f} className="flex h-[34px] items-center gap-[8px] rounded-lg bg-white px-[6px] shadow-[0_1px_3px_rgba(30,35,70,0.13)]">
          <FieldTile field={f} />
          <Bar w={[54, 34, 40][i]} h={5} />
        </div>
      ))}
    </div>
  );
}

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
          <div className="absolute inset-y-0 left-0 w-[176px] border-r bg-white" style={{ borderColor: LINE }}>
            <PlaceFields />
            {[
              { icon: UsersIcon, label: "Recipients" },
              { icon: Cog6ToothIcon, label: "Document options" },
            ].map((b, i) => (
              <motion.span
                key={b.label}
                className="absolute inset-x-[12px] flex h-[34px] items-center justify-center gap-[7px] rounded-full border px-[11px] text-[13px] font-medium whitespace-nowrap"
                style={{ top: 222 + i * 40 }}
                initial={false}
                animate={{
                  borderColor: pressed === i ? "#9bb6f6" : "#d9dce4",
                  backgroundColor: pressed === i ? PRIMARY_SOFT : "#ffffff",
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
      <motion.div className="absolute inset-0 bg-[#1a2160]" initial={false} animate={{ opacity: open ? 0.3 : 0 }} transition={{ duration: 0.35 }} />

      <Modal show={open === "recipients"} title="Recipients">
        {RECIPIENTS.map((r, i) => (
          <div key={r.name} className="flex h-[30px] items-center gap-[10px]">
            <span className="flex size-[22px] items-center justify-center rounded-full text-[11px] font-semibold" style={{ background: r.tint.pill, color: r.tint.ink }}>
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
              <Bar w={o.w} h={6} color="#cfd2db" />
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

// The Send card in the header's top-right corner, window-relative; its
// popover opens downwards out of the same card.
const SEND = { left: 300, top: 28, width: 124 };
// Stage spots: Send (over its chevron, so the label and the popover stay
// readable), and the empty signing line the signature goes on.
const SEND_AT: [number, number] = [24 + SEND.left + 108, 24 + SEND.top + 13];
const SIGN_AT: [number, number] = [24 + PAGE.left + 40, 24 + PAGE.top + SIGN_ROWS[0] + 9];
const COUNT_FROM = 5;
const TICK = 650;

/** The quick-send mark: a chevron with speed lines. */
function SendMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={className}>
      <path d="M10 5h4.2l6.3 7-6.3 7H10l6.3-7z" />
      <path d="M6.6 9.2h2.6l2.5 2.8-2.5 2.8H6.6l2.5-2.8z" />
      <path d="M3 6.2h3.6l.9 1.2H3.9zM3 17.8h3.6l.9-1.2H3.9z" />
    </svg>
  );
}

function SendScene({ s }: { s: number }) {
  const placed = s >= 3 && s <= 10;
  const counting = s >= 5 && s <= 9;
  const sending = s === 10;
  const n = COUNT_FROM - (s - 5);
  // Which popover is open under the button, if any.
  const pop = s === 1 ? "missing" : s === 4 ? "ready" : counting ? "pending" : null;
  // How much of the countdown has run, a beat at a time.
  const run = counting ? (s - 4) / COUNT_FROM : 0.04;
  return (
    <AppWindow>
      <AppHeader />
      <SidePanel>
        <RecipientsAndFields missing={!placed} />
      </SidePanel>

      <DocPage />
      <PlacedField field="Signature" tint={TINT.green} style={{ left: PAGE.left + 10, top: PAGE.top + SIGN_ROWS[1], width: 58, height: 15 }} />
      <PlacedField field="Signature" tint={TINT.yellow} style={{ left: PAGE.left + 10, top: PAGE.top + SIGN_ROWS[2], width: 58, height: 15 }} />
      {/* The first signer's line, empty until the signature lands on it. */}
      <motion.div
        className="absolute rounded-[2px] border border-dashed"
        style={{ left: PAGE.left + 10, top: PAGE.top + SIGN_ROWS[0], width: 58, height: 15, borderColor: TINT.blue.ring }}
        initial={false}
        animate={{ opacity: placed ? 0 : s === 2 ? 1 : 0.6 }}
      />
      <motion.div
        className="absolute"
        style={{ left: PAGE.left + 10, top: PAGE.top + SIGN_ROWS[0], width: 58, height: 15 }}
        initial={false}
        animate={{ opacity: placed ? 1 : 0, scale: placed ? 1 : 0.85 }}
        transition={{ duration: 0.25 }}
      >
        <PlacedField field="Signature" tint={TINT.blue} style={{ inset: 0 }} />
      </motion.div>

      {/* Send, top right, with the popover that grows out of its card. */}
      <motion.div
        className="absolute overflow-hidden rounded-[12px] bg-white shadow-[0_4px_14px_-4px_rgba(20,20,80,0.28)]"
        style={SEND}
        initial={false}
        animate={{ height: pop ? 78 : 32 }}
        transition={{ duration: 0.35, ease: EASE, delay: pop === "missing" || pop === "ready" ? 0.4 : 0 }}
      >
        <motion.span
          className="absolute inset-x-[3px] top-[3px] flex h-[26px] items-center justify-center gap-[5px] overflow-hidden rounded-[9px] border text-[10.5px] font-semibold"
          initial={false}
          animate={{
            backgroundColor: counting ? PRIMARY_SOFT : placed ? PRIMARY : PRIMARY_OFF,
            borderColor: counting ? PRIMARY : "rgba(0,0,0,0)",
            color: counting ? PRIMARY : "#ffffff",
          }}
          transition={{ duration: 0.3 }}
        >
          {counting ? (
            `Cancel ${n}s`
          ) : (
            <>
              Send Document
              <ChevronRightIcon className="size-[12px]" />
            </>
          )}
          {/* The countdown fills the button from the left; the label turns
              white where the fill has reached it. */}
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-white"
            style={{ background: PRIMARY }}
            initial={false}
            animate={{ clipPath: `inset(0 ${(1 - run) * 100}% 0 0)`, opacity: counting ? 1 : 0 }}
            transition={{ clipPath: { duration: counting ? TICK / 1000 : 0, ease: "linear" }, opacity: { duration: 0.2 } }}
          >
            {counting && `Cancel ${n}s`}
          </motion.span>
        </motion.span>

        {(
          [
            { key: "missing", title: "Signature required", body: "Add one for every signer" },
            { key: "ready", title: "Ready to send", body: null },
            { key: "pending", title: "Pending send…", body: "Cancel before it goes" },
          ] as const
        ).map((p) => (
          <motion.div
            key={p.key}
            className="absolute inset-x-[9px] top-[37px]"
            initial={false}
            animate={{ opacity: pop === p.key ? 1 : 0 }}
            transition={{ duration: 0.25, delay: pop === p.key ? (p.key === "pending" ? 0.1 : 0.55) : 0 }}
          >
            <span className="block text-[10.5px] font-semibold">{p.title}</span>
            {p.body ? (
              <span className="mt-[3px] block text-[8.5px]" style={{ color: MUTED }}>
                {p.body}
              </span>
            ) : (
              // Who it's going to: the three recipients, in their colours.
              <span className="mt-[4px] flex items-center gap-[5px] text-[8.5px]" style={{ color: MUTED }}>
                <span className="flex">
                  {[TINT.blue, TINT.green, TINT.yellow].map((t, i) => (
                    <span key={i} className="-ml-[3px] size-[11px] rounded-full border-[1.5px] border-white first:ml-0" style={{ background: t.dot }} />
                  ))}
                </span>
                To 3 recipients
              </span>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Once the countdown runs out: on its way. */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-[10px]"
        style={{ background: CANVAS }}
        initial={false}
        animate={{ opacity: sending ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.span
          className="flex size-[46px] items-center justify-center rounded-full"
          style={{ background: PRIMARY }}
          initial={false}
          animate={{ scale: sending ? 1 : 0.7 }}
        >
          <SendMark className="size-[26px]" />
        </motion.span>
        <span className="text-[15px] font-semibold">Sending…</span>
      </motion.div>
    </AppWindow>
  );
}

/* ------------------------------------------------------------------------ */
/* 7. Send another, without starting over                                    */
/* ------------------------------------------------------------------------ */

const AGAIN_OPTIONS = ["Same document, different recipients", "Same recipients, different document", "New send entirely"];

// The success card and the dialog over it, both centred in the window.
const CARD = { left: 122, top: 40, width: 236, height: 280 };
const DIALOG = { left: 125, top: 82, width: 230, height: 196 };
const SEND_ANOTHER_AT: [number, number] = [CARD.left + 12 + 54, CARD.top + 246 + 12];
const OPTION_AT = (i: number): [number, number] => [DIALOG.left + 112, DIALOG.top + 68 + i * 30 + 13];
const CONTINUE_AT: [number, number] = [DIALOG.left + 168, DIALOG.top + 164 + 12];

function AgainScene({ s }: { s: number }) {
  const sent = s >= 1;
  const dialog = s >= 2 && s <= 6;
  const picked = s >= 4 ? 1 : 0;
  // Same recipients, different document: on to choosing the new file.
  const upload = s === 7;
  return (
    <AppWindow>
      {/* The last step: the send's summary, and the way to go again. */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: upload ? 0 : 1, filter: dialog ? "blur(2px)" : "blur(0px)" }}
        transition={{ duration: 0.35 }}
      >
        <div className="absolute rounded-[14px] bg-white shadow-[0_6px_20px_-8px_rgba(20,20,80,0.25)]" style={{ ...CARD, left: CARD.left - 24, top: CARD.top - 24 }}>
          <span className="absolute top-[16px] left-1/2 flex size-[36px] -translate-x-1/2 items-center justify-center rounded-full" style={{ background: PRIMARY }}>
            <motion.span className="absolute" initial={false} animate={{ opacity: sent ? 0 : 1, scale: sent ? 0.6 : 1 }} transition={{ duration: 0.25 }}>
              <SendMark className="size-[20px]" />
            </motion.span>
            <motion.span className="absolute text-white" initial={false} animate={{ opacity: sent ? 1 : 0, scale: sent ? 1 : 0.4 }} transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}>
              <CheckIcon className="size-[20px]" />
            </motion.span>
          </span>
          <span className="absolute inset-x-0 top-[60px] text-center text-[15px] font-bold">
            <motion.span className="absolute inset-x-0" initial={false} animate={{ opacity: sent ? 0 : 1 }}>
              Sending…
            </motion.span>
            <motion.span className="absolute inset-x-0" initial={false} animate={{ opacity: sent ? 1 : 0 }}>
              Sent!
            </motion.span>
          </span>
          <div className="absolute inset-x-0 top-[84px] flex flex-col items-center gap-[4px]">
            <Bar w={170} h={4} />
            <Bar w={120} h={4} />
          </div>

          {/* Document name, recipients, status. */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="absolute inset-x-[12px] flex h-[16px] items-center rounded-[5px] border px-[6px]" style={{ top: 102 + i * 20, background: CANVAS, borderColor: "#eceef2" }}>
              <Bar w={[50, 42, 30][i]} h={3} color="#c9ccd6" />
              <span className="absolute left-[118px] flex items-center">
                {i === 0 && <Bar w={48} h={4} color="#a9adb8" />}
                {i === 1 && <span className="rounded-[3px] bg-[#e3e5eb] px-[3px] text-[7.5px] font-semibold">3</span>}
                {i === 2 && (
                  <span className="flex items-center gap-[3px] rounded-full px-[5px] py-px text-[7px] font-medium" style={{ background: "#c7f0ff", color: "#1a6f93" }}>
                    <span className="size-[3px] rounded-full bg-[#2ab6ec]" />
                    In progress
                  </span>
                )}
              </span>
            </div>
          ))}

          {/* Each recipient, and where their copy has got to. */}
          {[TINT.blue, TINT.green, TINT.yellow].map((t, i) => (
            <div key={i} className="absolute inset-x-[14px] flex h-[18px] items-center gap-[6px]" style={{ top: 172 + i * 22 }}>
              <span className="flex size-[16px] items-center justify-center rounded-[5px]" style={{ background: t.dot, color: t.ink }}>
                <FieldIcon field="Signature" className="size-[9px]" />
              </span>
              <span className="flex flex-col gap-[3px]">
                <Bar w={[46, 38, 42][i]} h={3} color="#a9adb8" />
                <Bar w={[64, 56, 60][i]} h={3} />
              </span>
              <span className="h-px flex-1 bg-[#eceef2]" />
              <span className="rounded-full border px-[4px] text-[7px] font-medium" style={{ borderColor: "#c9ccd6", color: MUTED }}>
                {i === 0 ? "Emailed" : "Scheduled"}
              </span>
            </div>
          ))}

          <span className="absolute inset-x-0 top-[238px] h-px bg-[#eceef2]" />
          <motion.span
            className="absolute top-[246px] left-[12px] flex h-[24px] w-[104px] items-center justify-center gap-[4px] rounded-[7px] border text-[9.5px] font-medium"
            initial={false}
            animate={{ borderColor: s === 1 || s === 2 ? "#9bb6f6" : "#d9dce4", backgroundColor: s === 2 ? PRIMARY_SOFT : "#ffffff" }}
            transition={{ duration: 0.2 }}
          >
            Send another
            <ArrowPathIcon className="size-[9px]" style={{ color: MUTED }} />
          </motion.span>
          <span className="absolute top-[246px] right-[12px] flex h-[24px] w-[104px] items-center justify-center gap-[4px] rounded-[7px] text-[9.5px] font-medium text-white" style={{ background: PRIMARY }}>
            Track on listings
            <ArrowRightIcon className="size-[9px]" />
          </span>
        </div>
      </motion.div>
      <motion.div className="absolute inset-0" style={{ background: SCRIM }} initial={false} animate={{ opacity: dialog ? 1 : 0 }} transition={{ duration: 0.35 }} />

      {/* What would you like to send? */}
      <motion.div
        className="absolute rounded-[14px] bg-white"
        style={{ ...DIALOG, left: DIALOG.left - 24, top: DIALOG.top - 24, boxShadow: SHADOW }}
        initial={false}
        animate={{ opacity: dialog ? 1 : 0, scale: dialog ? 1 : 0.94, y: dialog ? 0 : 8 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <span className="absolute inset-x-0 top-[16px] text-center text-[13px] font-semibold">What would you like to send?</span>
        <div className="absolute inset-x-0 top-[38px] flex flex-col items-center gap-[4px]">
          <Bar w={150} h={3} />
          <Bar w={100} h={3} />
        </div>
        {AGAIN_OPTIONS.map((label, i) => {
          const on = picked === i;
          return (
            <motion.div
              key={label}
              className="absolute inset-x-[12px] flex h-[26px] items-center gap-[7px] rounded-[7px] border px-[7px] text-[9.5px]"
              style={{ top: 68 + i * 30 }}
              initial={false}
              animate={{
                backgroundColor: on ? PRIMARY_SOFT : (s === 3 && i === 1 ? "#eceef2" : CANVAS),
                borderColor: on ? "#8fb0f7" : "#e6e8ee",
                color: on ? "#1f2a8f" : "#55575f",
              }}
              transition={{ duration: 0.2 }}
            >
              <span className="flex size-[11px] shrink-0 items-center justify-center rounded-full border" style={{ borderColor: on ? "#4d6ff0" : "#d3d6de", background: on ? "#70a2ff" : "#ffffff" }} />
              {label}
            </motion.div>
          );
        })}
        <span className="absolute inset-x-0 top-[156px] h-px bg-[#eceef2]" />
        <span className="absolute top-[164px] left-[12px] flex h-[24px] w-[98px] items-center justify-center rounded-[7px] border text-[10px] font-medium" style={{ borderColor: "#d9dce4" }}>
          Cancel
        </span>
        <motion.span
          className="absolute top-[164px] right-[12px] flex h-[24px] w-[98px] items-center justify-center rounded-[7px] text-[10px] font-semibold text-white"
          initial={false}
          animate={{ backgroundColor: s === 6 ? "#2c3bd6" : PRIMARY }}
          transition={{ duration: 0.2 }}
        >
          Continue
        </motion.span>
      </motion.div>

      {/* The next step: a new file for the same people. */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={false}
        animate={{ opacity: upload ? 1 : 0, y: upload ? 0 : 8 }}
        transition={{ duration: 0.4, ease: EASE, delay: upload ? 0.2 : 0 }}
      >
        <svg viewBox="0 0 40 40" fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" className="size-[44px]">
          <path d="M8 4h16l6 6v8M8 4v30h12" stroke="#1d2140" />
          <path d="M12 12h9M12 16h12M12 20h8" stroke="#1d2140" />
          <path d="M23 31.5a4.5 4.5 0 0 1 1-8.9 5.5 5.5 0 0 1 10.6 1.4 3.8 3.8 0 0 1-.6 7.5M29 25v9M26 28l3-3 3 3" stroke={PRIMARY} />
        </svg>
        <span className="mt-[10px] text-[13px] font-semibold">Drag and drop a file, or</span>
        <span className="mt-[8px] flex h-[24px] items-center rounded-[7px] px-[12px] text-[10px] font-semibold text-white" style={{ background: PRIMARY }}>
          Browse your device
        </span>
        <div className="mt-[10px] flex flex-col items-center gap-[4px]">
          <Bar w={180} h={3} />
          <Bar w={130} h={3} />
        </div>
      </motion.div>
    </AppWindow>
  );
}

/* ------------------------------------------------------------------------ */
/* Drafts                                                                    */
/* ------------------------------------------------------------------------ */

// Drafts' own colours, sampled from the production recordings.
const PREP = { bg: "#fbefc7", ink: "#8f5d14" };
const SELECTED = "#7b9ef5";

/** Drafts' frame: the header, then the breadcrumbs and the to-do list. */
function DraftsChrome({ crumbs, done = false, count = 12 }: { crumbs: string[]; done?: boolean; count?: number }) {
  return (
    <>
      <AppHeader />
      <div className="absolute inset-x-0 top-[20px] flex h-[22px] items-center gap-[5px] border-b px-[10px] text-[8.5px] font-medium" style={{ borderColor: LINE, color: PRIMARY }}>
        <HomeIcon className="size-[10px]" />
        {crumbs.map((c, i) => (
          <span key={c} className="flex items-center gap-[5px]" style={{ color: i === crumbs.length - 1 ? PRIMARY : MUTED }}>
            {i > 0 && <ChevronRightIcon className="size-[8px]" style={{ color: MUTED }} />}
            {c}
          </span>
        ))}
        <TodoButton done={done} count={count} className="ml-auto" />
      </div>
    </>
  );
}

/** The to-do list's button: a clipboard with a count, or a tick when all's ready. */
function TodoButton({ done = false, count = 12, className = "" }: { done?: boolean; count?: number; className?: string }) {
  return (
    <span className={`relative flex items-center gap-[3px] ${className}`}>
      <motion.span
        className="flex size-[15px] items-center justify-center rounded-[4px]"
        initial={false}
        animate={{ backgroundColor: done ? "#d6f8ea" : "#fde58a", color: done ? "#1f7a57" : "#6b4a07" }}
        transition={{ duration: 0.3, delay: done ? 1 : 0 }}
      >
        {done ? <CheckIcon className="size-[10px]" /> : <ClipboardIcon className="size-[10px]" />}
      </motion.span>
      <motion.span
        className="absolute -top-[4px] left-[10px] flex h-[9px] min-w-[9px] items-center justify-center rounded-full px-[2px] text-[6px] font-bold text-white"
        style={{ background: DANGER }}
        initial={false}
        animate={{ opacity: done ? 0 : 1, scale: done ? 0.5 : 1 }}
        transition={{ duration: 0.3, delay: done ? 1 : 0 }}
      >
        {count}
      </motion.span>
      <ChevronDownIcon className="size-[8px]" style={{ color: MUTED }} />
    </span>
  );
}

/** "Preparation Required", or "Ready to Send" once a document is done. */
function PrepPill({ ready = false, delay = 0 }: { ready?: boolean; delay?: number }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={String(ready)}
        className="rounded-full px-[4px] py-[1px] text-[6.5px] font-medium whitespace-nowrap"
        style={ready ? { background: "#d6f8ea", color: "#1f7a57" } : { background: PREP.bg, color: PREP.ink }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: ready ? delay : 0 }}
      >
        {ready ? "Ready to Send" : "Preparation Required"}
      </motion.span>
    </AnimatePresence>
  );
}

const BATCH = [
  { name: "Property Inspection Report", pages: 3 },
  { name: "Tenancy Agreement", pages: 4 },
  { name: "Inventory and Key Handover", pages: 2 },
];

// Who's on each document, as the details panel lists them.
const PARTICIPANTS = [
  [
    { n: "S", who: "You", role: "Sender", fields: 5 },
    { n: "01", who: "Landlord", role: "Signer", fields: 2, tint: TINT.blue },
    { n: "02", who: "Tenant 1", role: "Signer", fields: 4, tint: TINT.green },
    { n: "03", who: "Tenant 2", role: "Signer", fields: 4, tint: TINT.yellow },
  ],
  [
    { n: "S", who: "You", role: "Sender", fields: 6 },
    { n: "01", who: "Landlord", role: "Signer", fields: 3, tint: TINT.blue },
    { n: "02", who: "Tenant 1", role: "Signer", fields: 5, tint: TINT.green },
    { n: "03", who: "Tenant 2", role: "Signer", fields: 5, tint: TINT.yellow },
    { n: "04", who: "Witness", role: "Witness", fields: 2, tint: TINT.purple },
  ],
];

// The list sits centred until a document is selected, then moves over and
// narrows to make room for the details panel. Window-relative.
const LIST = { closed: { left: 76, width: 280 }, open: { left: 10, width: 244 } };
const ROW_TOP = 112;
const ROW_H = 40;
// Stage spots: a row's name, with the list centred or moved over.
const DOC_AT = (i: number, open: boolean): [number, number] => [24 + (open ? LIST.open.left : LIST.closed.left) + 96, 24 + ROW_TOP + 11 + i * ROW_H];

/** The batch's documents, each with its status and a Prepare button. */
function BatchList({ open = false, selected = null, ready = [] }: { open?: boolean; selected?: number | null; ready?: boolean[] }) {
  const at = open ? LIST.open : LIST.closed;
  return (
    <motion.div className="absolute top-[42px] bottom-0" initial={false} animate={{ left: at.left, width: at.width }} transition={{ duration: 0.55, ease: EASE }}>
      <div className="mt-[10px] flex items-center justify-between">
        <span className="text-[15px] font-semibold">Batch Overview</span>
        <span className="flex size-[16px] items-center justify-center rounded-[4px] border bg-white" style={{ borderColor: LINE }}>
          <EllipsisVerticalIcon className="size-[10px]" style={{ color: MUTED }} />
        </span>
      </div>
      <Bar w={130} h={4} className="mt-[6px]" />
      <span className="mt-[10px] block text-[9px] font-semibold">Albert House move-in pack</span>
      <div className="absolute inset-x-0 overflow-visible rounded-[8px] border bg-white" style={{ top: ROW_TOP - 42, height: ROW_H * 3, borderColor: LINE }}>
        {BATCH.map((d, i) => (
          <div key={d.name} className="absolute inset-x-0 flex items-center gap-[7px] px-[8px]" style={{ top: i * ROW_H, height: ROW_H, borderTop: i ? `1px solid ${LINE}` : undefined }}>
            <motion.span
              className="pointer-events-none absolute -inset-[1px] rounded-[8px]"
              initial={false}
              animate={{ boxShadow: `inset 0 0 0 ${selected === i ? 1.5 : 0}px ${SELECTED}` }}
              transition={{ duration: 0.25 }}
            />
            <span className="flex size-[20px] shrink-0 items-center justify-center rounded-[5px] bg-[#eef0f4]">
              <DocOutlineIcon className="size-[11px]" style={{ color: MUTED }} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="truncate text-[9.5px] font-medium">{d.name}</span>
              <span className="flex items-center gap-[3px] text-[7px]" style={{ color: MUTED }}>
                {d.pages} pgs · <PrepPill ready={ready[i]} delay={0.1 + i * 0.3} />
              </span>
            </span>
            <span className="flex h-[19px] shrink-0 items-center rounded-[5px] px-[8px] text-[8.5px] font-semibold text-white" style={{ background: PRIMARY }}>
              Prepare
            </span>
            <XMarkIcon className="size-[10px] shrink-0" style={{ color: MUTED }} />
          </div>
        ))}
      </div>
      <div
        className="absolute inset-x-0 flex h-[22px] items-center justify-center gap-[3px] rounded-[7px] border border-dashed bg-white text-[8px] font-medium"
        style={{ top: ROW_TOP - 42 + ROW_H * 3 + 8, borderColor: "#d3d6de", color: INK }}
      >
        <PlusIcon className="size-[9px]" />
        Add Document
      </div>
      <div className="absolute inset-x-0 flex items-center gap-[6px] text-[8px] font-medium" style={{ top: ROW_TOP - 42 + ROW_H * 3 + 44 }}>
        <span className="rounded-[5px] border px-[7px] py-[4px]" style={{ borderColor: LINE, color: "#c3c6cf" }}>
          Reset Draft
        </span>
        <span className="ml-auto rounded-[5px] border bg-white px-[7px] py-[4px]" style={{ borderColor: "#d3d6de" }}>
          Save a Copy
        </span>
        <span className="rounded-[5px] px-[9px] py-[4px] text-white" style={{ background: PRIMARY_OFF }}>
          Save
        </span>
      </div>
    </motion.div>
  );
}

/** The details panel: everything a document already holds, without opening it. */
function DetailsPanel({ doc }: { doc: number }) {
  const d = BATCH[doc];
  return (
    <div className="absolute inset-0 px-[10px]">
      <div className="mt-[12px] flex items-center justify-between">
        <span className="text-[11.5px] font-semibold">Document Details</span>
        <span className="flex items-center gap-[3px] rounded-[5px] border bg-white px-[5px] py-[2px] text-[7.5px] font-medium" style={{ borderColor: "#d3d6de" }}>
          <PencilSquareIcon className="size-[8px]" />
          Edit
        </span>
      </div>
      <span className="mt-[8px] block text-[6.5px]" style={{ color: MUTED }}>
        Template
      </span>
      <div className="relative mt-[3px] h-[74px] rounded-[7px] bg-[#e9ebf0]">
        <span className="absolute top-[5px] left-[5px] rounded-full bg-white px-[4px] py-[1px] text-[6px] font-medium">Page 1 / {d.pages}</span>
        <div className="absolute top-[8px] left-1/2 flex h-[60px] w-[46px] -translate-x-1/2 flex-col gap-[3px] bg-white px-[5px] pt-[6px] shadow-[0_1px_3px_rgba(20,20,80,0.15)]">
          <Bar w="70%" h={2.5} color="#cdd1dc" className="mx-auto mb-[2px]" />
          {[90, 100, 80, 96, 70, 88].map((w, i) => (
            <Bar key={i} w={`${w}%`} h={1.5} />
          ))}
        </div>
      </div>
      <div className="mt-[6px] flex items-center justify-between">
        <span className="truncate text-[8.5px] font-semibold">{d.name}</span>
        <span className="shrink-0 rounded-full bg-[#eceef3] px-[4px] py-[1px] text-[6.5px] font-medium">{d.pages} pages</span>
      </div>
      <span className="mt-[9px] block text-[7.5px] font-semibold" style={{ color: MUTED }}>
        Participants & Fields
      </span>
      <div className="mt-[4px] flex flex-col gap-[3px]">
        {PARTICIPANTS[doc].map((p) => (
          <div key={p.n} className="flex h-[15px] items-center gap-[4px] rounded-[5px] border bg-white px-[3px] text-[7px]" style={{ borderColor: LINE }}>
            <span
              className="flex h-[10px] min-w-[13px] items-center justify-center rounded-[3px] text-[6px] font-semibold"
              style={{ background: p.tint?.pill ?? "#eceef3", color: p.tint?.ink ?? MUTED }}
            >
              {p.n}
            </span>
            <span className="font-medium">{p.who}</span>
            <span style={{ color: MUTED }}>{p.role}</span>
            <span
              className="ml-auto rounded-[3px] px-[3px] text-[6.5px] font-medium"
              style={{ background: p.tint?.pill ?? "#eceef3", color: p.tint?.ink ?? INK }}
            >
              {p.fields} Fields
            </span>
          </div>
        ))}
      </div>
      <span className="mt-[9px] block text-[7.5px] font-semibold" style={{ color: MUTED }}>
        Recipients
      </span>
      <div className="mt-[4px] flex flex-wrap gap-[3px]">
        {PARTICIPANTS[doc].slice(1).map((p) => (
          <span key={p.n} className="flex items-center gap-[3px] rounded-full border bg-white py-[1px] pr-[4px] pl-[2px] text-[6.5px]" style={{ borderColor: LINE }}>
            <span className="rounded-full px-[3px] text-[5.5px] font-semibold" style={{ background: p.tint?.pill, color: p.tint?.ink }}>
              {p.n}
            </span>
            {p.who}
            <span style={{ color: p.tint?.fg }}>No details</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function DetailsScene({ s }: { s: number }) {
  const open = s >= 2 && s <= 4;
  const doc = s >= 4 ? 1 : 0;
  return (
    <AppWindow>
      <DraftsChrome crumbs={["Batch Overview"]} />
      <BatchList open={open} selected={open ? doc : null} />
      <motion.div
        className="absolute top-[42px] right-0 bottom-0 overflow-hidden border-l bg-[#f7f8fa]"
        style={{ width: 162, borderColor: LINE }}
        initial={false}
        animate={{ x: open ? 0 : 170, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div key={doc} className="absolute inset-0" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <DetailsPanel doc={doc} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AppWindow>
  );
}


/* Drilling in and out ------------------------------------------------------ */

// Stage spots: a document's Prepare button, and the first breadcrumb.
const PREPARE_AT = (i: number): [number, number] => [24 + LIST.closed.left + 231, 24 + ROW_TOP + 20 + i * ROW_H];
const CRUMB_AT: [number, number] = [78, 55];

const SECTIONS = [
  { name: "Document Name", ready: true },
  { name: "Underlying File", ready: true },
  { name: "Template Preparation", ready: true },
  { name: "Field Content", ready: false },
  { name: "Recipient Details", ready: false },
];

/** A document's overview: its sections as cards, each with a status. */
function DocOverview() {
  return (
    <div className="absolute top-[42px] bottom-0" style={{ left: LIST.closed.left, width: LIST.closed.width }}>
      <div className="mt-[10px] flex items-center gap-[7px]">
        <span className="flex size-[16px] items-center justify-center rounded-full border bg-white" style={{ borderColor: LINE }}>
          <ChevronLeftIcon className="size-[9px]" style={{ color: MUTED }} />
        </span>
        <span className="text-[15px] font-semibold">Document Overview</span>
      </div>
      <Bar w={150} h={4} className="mt-[6px] ml-[23px]" />
      <div className="mt-[12px] flex flex-col gap-[6px]">
        {SECTIONS.map((c) => (
          <div key={c.name} className="flex h-[34px] items-center gap-[7px] rounded-[8px] border bg-white px-[8px]" style={{ borderColor: LINE }}>
            <span className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-[#eef0f4]">
              <DocOutlineIcon className="size-[10px]" style={{ color: MUTED }} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
              <span className="flex items-center gap-[4px] text-[9px] font-semibold">
                {c.name}
                {!c.ready && <PrepPill />}
              </span>
              <Bar w={110} h={3} />
            </span>
            {c.ready ? (
              <span className="flex items-center gap-[3px] rounded-[5px] border bg-white px-[6px] py-[3px] text-[8px] font-medium" style={{ borderColor: "#d3d6de" }}>
                <PencilSquareIcon className="size-[8px]" />
                Edit
              </span>
            ) : (
              <span className="rounded-[5px] px-[7px] py-[4px] text-[8px] font-semibold text-white" style={{ background: PRIMARY }}>
                Prepare
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DrillScene({ s }: { s: number }) {
  const deep = s === 2 || s === 3;
  return (
    <AppWindow>
      <DraftsChrome crumbs={deep ? ["Batch Overview", "Tenancy Agreement"] : ["Batch Overview"]} />
      <motion.div className="absolute inset-0" initial={false} animate={{ x: deep ? -40 : 0, opacity: deep ? 0 : 1 }} transition={{ duration: 0.45, ease: EASE }}>
        <BatchList />
      </motion.div>
      <motion.div className="absolute inset-0" initial={false} animate={{ x: deep ? 0 : 40, opacity: deep ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }}>
        <DocOverview />
      </motion.div>
    </AppWindow>
  );
}

/* The to-do list ------------------------------------------------------------ */

// The dropdown hangs from the to-do button. Window-relative; rows are stage spots.
const TODO = { right: 8, top: 40, width: 196 };
const TODO_AT: [number, number] = [427, 55];
const TODO_ROW_AT = (i: number): [number, number] => [24 + 432 - TODO.right - 80, 24 + TODO.top + 52 + i * 28];

type TodoLevel = "docs" | "sections" | "issues" | "done";

/** One line of the to-do list: what's wrong, and where it is. */
function TodoRow({ title, note, warn = false, chevron = true }: { title: string; note: string; warn?: boolean; chevron?: boolean }) {
  return (
    <div className="flex h-[26px] items-center gap-[5px] rounded-[6px] px-[5px]">
      {warn && <ExclamationTriangleIcon className="size-[9px] shrink-0" style={{ color: DANGER }} />}
      <span className="flex min-w-0 flex-1 flex-col gap-[1px]">
        <span className="truncate text-[8px] font-semibold">{title}</span>
        <span className="truncate text-[6.5px]" style={{ color: warn ? DANGER : MUTED }}>
          {note}
        </span>
      </span>
      {chevron && <ChevronRightIcon className="size-[9px] shrink-0" style={{ color: MUTED }} />}
    </div>
  );
}

const TODO_LEVELS: Record<Exclude<TodoLevel, "done">, { crumb?: string; count: string; rows: { title: string; note: string; warn?: boolean }[] }> = {
  docs: {
    count: "12 Items",
    rows: [
      { title: "Property Inspection Report", note: "10 items required" },
      { title: "Tenancy Agreement", note: "1 item required" },
      { title: "Inventory and Key Handover", note: "1 item required" },
    ],
  },
  sections: {
    crumb: "Property Inspection Report",
    count: "10 Items",
    rows: [
      { title: "Field Content", note: "4 items require attention", warn: true },
      { title: "Recipient Details", note: "6 items require attention", warn: true },
    ],
  },
  issues: {
    crumb: "Property Inspection Report / Recipient Details",
    count: "6 Issues",
    rows: [
      { title: "First Name", note: "First name for Landlord is a required field", warn: true },
      { title: "Last Name", note: "Last name for Landlord is a required field", warn: true },
      { title: "Email", note: "Email for Landlord is a required field", warn: true },
    ],
  },
};

function TodoDropdown({ level }: { level: TodoLevel | null }) {
  return (
    <motion.div
      className="absolute z-10 overflow-hidden rounded-[10px] border bg-white"
      style={{ right: TODO.right, top: TODO.top, width: TODO.width, borderColor: LINE, boxShadow: SHADOW, transformOrigin: "top right" }}
      initial={false}
      animate={{ opacity: level ? 1 : 0, scale: level ? 1 : 0.94, y: level ? 0 : -4 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div key={level ?? "none"} className="p-[8px]" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3, ease: EASE }}>
          {level === "done" ? (
            <div className="flex flex-col items-center gap-[4px] py-[14px] text-center">
              <CheckCircleIcon className="size-[22px]" style={{ color: "#22b07d" }} />
              <span className="text-[9.5px] font-semibold">All Documents Ready to Send</span>
              <span className="text-[7px]" style={{ color: MUTED }}>
                Nothing left to prepare.
              </span>
            </div>
          ) : (
            level && (
              <>
                <span className="block h-[9px] truncate text-[6.5px]" style={{ color: PRIMARY }}>
                  {TODO_LEVELS[level].crumb}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-semibold">Required Actions</span>
                  <span className="rounded-full px-[4px] py-[1px] text-[6.5px] font-semibold" style={{ background: PREP.bg, color: PREP.ink }}>
                    {TODO_LEVELS[level].count}
                  </span>
                </div>
                <Bar w={110} h={3} className="mt-[4px] mb-[6px]" />
                {TODO_LEVELS[level].rows.map((r) => (
                  <TodoRow key={r.title} {...r} chevron={level !== "issues"} />
                ))}
              </>
            )
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

const TODO_STEPS: (TodoLevel | null)[] = [null, null, "docs", "docs", "sections", "sections", "issues", "issues", null, null, "done", null];

function TodoScene({ s }: { s: number }) {
  const allReady = s >= 9;
  return (
    <AppWindow>
      <DraftsChrome crumbs={["Batch Overview"]} done={allReady} />
      <BatchList ready={allReady ? [true, true, true] : []} />
      <TodoDropdown level={TODO_STEPS[s]} />
    </AppWindow>
  );
}

/* Link Field Content -------------------------------------------------------- */

const ADDRESS = "14 Albert House, Kensington Gardens Sq";
const FIELD_INPUT_AT: [number, number] = [24 + 90, 24 + 131];
const LINK_AT: [number, number] = [24 + 206, 24 + 150];
const LINK_MODAL = { left: 106, top: 92, width: 220 };
const LINK_FIELDS_AT: [number, number] = [24 + LINK_MODAL.left + 182, 24 + LINK_MODAL.top + 104];

/** A sender field: its type and label, then the box to fill. */
function SenderField({ icon: Icon, type, label, top, value, children }: { icon: typeof LinkIcon; type: string; label: string; top: number; value?: ReactNode; children?: ReactNode }) {
  return (
    <div className="absolute inset-x-0" style={{ top }}>
      <div className="flex items-center gap-[3px]">
        <span className="flex items-center gap-[3px] rounded-[4px] bg-[#eceef3] px-[4px] py-[1px] text-[7px] font-medium" style={{ color: MUTED }}>
          <Icon className="size-[7px]" />
          {type}
          <span className="opacity-50">|</span>
          <span style={{ color: INK }}>{label}</span>
        </span>
        {children}
      </div>
      <div className="mt-[4px] flex h-[18px] items-center rounded-[5px] border bg-white px-[6px] text-[7.5px]" style={{ borderColor: "#d9dce4" }}>
        {value ?? <span style={{ color: "#b3b7c2" }}>Content Required</span>}
      </div>
    </div>
  );
}

/** The document beside the fields, with the address filling in as it's typed. */
function FieldPreview({ typed }: { typed: boolean }) {
  return (
    <Sheet style={{ left: 250, top: 54, width: 168, height: 220 }}>
      <div className="flex flex-col gap-[5px] px-[12px] pt-[14px]">
        <Bar w="60%" h={5} color="#cdd1dc" className="mx-auto mb-[6px]" />
        <Bar w="40%" h={3} color="#cdd1dc" />
        <div className="relative h-[12px] rounded-[2px] border" style={{ borderColor: "#9bb6f6", background: "#f3f6ff" }}>
          <motion.span
            className="absolute inset-y-0 left-[3px] flex items-center overflow-hidden text-[5.5px] whitespace-nowrap"
            initial={false}
            animate={{ width: typed ? "92%" : "0%" }}
            transition={{ duration: typed ? 1.2 : 0.2, ease: "linear" }}
          >
            {ADDRESS}
          </motion.span>
        </div>
        {[100, 92, 84, 100, 70, 96, 88, 60, 100, 90, 76].map((w, i) => (
          <Bar key={i} w={`${w}%`} h={2.5} />
        ))}
      </div>
    </Sheet>
  );
}

function LinkFieldScene({ s }: { s: number }) {
  const typed = s >= 2;
  const modal = s === 4 || s === 5;
  const linked = s >= 6;
  return (
    <>
      <motion.div className="absolute inset-0" initial={false} animate={{ filter: modal ? "blur(2px)" : "blur(0px)" }} transition={{ duration: 0.3 }}>
        <AppWindow>
          <DraftsChrome crumbs={["Batch Overview", "Tenancy Agreement", "Field Content"]} />
          <div className="absolute top-[42px] bottom-0 left-[14px]" style={{ width: 222 }}>
            <span className="mt-[10px] block text-[14px] font-semibold">Field Content</span>
            <Bar w={150} h={4} className="mt-[5px]" />
            <div className="mt-[8px] flex items-center gap-[4px] text-[7px]">
              <span className="rounded-full border bg-white px-[5px] py-[2px]" style={{ borderColor: LINE, color: MUTED }}>
                Filling fields for: <span style={{ color: INK }}>Sender</span>
              </span>
              <span className="rounded-full px-[4px] py-[1px] font-semibold" style={{ background: "#ffecee", color: "#d4302e" }}>
                {typed ? 3 : 4} Required
              </span>
            </div>
            <SenderField
              icon={Bars3BottomLeftIcon}
              type="Text"
              label="Property Address"
              top={66}
              value={
                typed ? (
                  <motion.span className="overflow-hidden whitespace-nowrap" initial={{ width: 0 }} animate={{ width: "auto" }} transition={{ duration: 1.2, ease: "linear" }}>
                    {ADDRESS}
                  </motion.span>
                ) : undefined
              }
            >
              <motion.span
                className="ml-auto rounded-[4px] px-[4px] py-[1px] text-[6.5px] font-semibold"
                style={{ background: "#dae7fe", color: "#283399" }}
                initial={false}
                animate={{ opacity: linked ? 1 : 0, scale: linked ? 1 : 0.8 }}
              >
                Linked
              </motion.span>
            </SenderField>
            <div className="absolute inset-x-0 flex items-center justify-between text-[6.5px]" style={{ top: 105, color: MUTED }}>
              <span>{linked ? "Field content linked across 3 documents." : "Same field found in 3 documents."}</span>
              <span className="flex items-center gap-[2px] font-medium" style={{ color: PRIMARY }}>
                <LinkIcon className="size-[7px]" />
                {linked ? "Break Field Link" : "Link Field Content"}
              </span>
            </div>
            <SenderField icon={CalendarIcon} type="Date" label="Move-in Date" top={124} />
            <SenderField icon={HashtagIcon} type="Number" label="Monthly Rent" top={164} />
            <div className="absolute inset-x-0 flex items-center justify-between text-[8px] font-medium" style={{ top: 238 }}>
              <span style={{ color: MUTED }}>Reset Field Content</span>
              <span className="flex items-center gap-[3px] rounded-[5px] px-[8px] py-[4px] text-white" style={{ background: PRIMARY }}>
                <CheckIcon className="size-[8px]" />
                Done
              </span>
            </div>
          </div>
          <FieldPreview typed={typed} />
        </AppWindow>
      </motion.div>
      <motion.div className="absolute inset-0 bg-[#1a2160]" initial={false} animate={{ opacity: modal ? 0.3 : 0 }} transition={{ duration: 0.3 }} />
      <motion.div
        className="absolute rounded-[12px] bg-white p-[12px]"
        style={{ ...LINK_MODAL, boxShadow: SHADOW }}
        initial={false}
        animate={{ opacity: modal ? 1 : 0, scale: modal ? 1 : 0.94, y: modal ? 0 : 8 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <div className="flex items-center gap-[5px]">
          <span className="flex size-[16px] items-center justify-center rounded-[5px]" style={{ background: PRIMARY_SOFT, color: PRIMARY }}>
            <LinkIcon className="size-[9px]" />
          </span>
          <span className="text-[11px] font-semibold">Link Field Content</span>
        </div>
        <p className="mt-[8px] text-[7.5px] leading-snug" style={{ color: MUTED }}>
          Save time by automatically linking Sender Fields across multiple Documents. All matching fields will initially adopt the value entered in this field.
        </p>
        <div className="mt-[12px] flex justify-end gap-[5px] text-[8px] font-medium">
          <span className="rounded-[5px] border px-[8px] py-[4px]" style={{ borderColor: "#d3d6de" }}>
            Cancel
          </span>
          <span className="rounded-[5px] px-[8px] py-[4px] text-white" style={{ background: PRIMARY }}>
            Link Fields
          </span>
        </div>
      </motion.div>
      <Toast show={linked} text="Field linked across 3 documents" />
    </>
  );
}

/** The green note in the corner that confirms a change. */
function Toast({ show, text }: { show: boolean; text: string }) {
  return (
    <motion.div
      className="absolute flex items-center gap-[5px] rounded-[7px] border bg-white px-[8px] py-[5px] text-[8px] font-medium"
      style={{ left: 36, bottom: 62, borderColor: "#bfeedc", boxShadow: "0 6px 16px -8px rgba(20,20,80,0.35)" }}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
      transition={{ duration: 0.35, ease: EASE, delay: show ? 0.25 : 0 }}
    >
      <CheckCircleIcon className="size-[10px]" style={{ color: "#22b07d" }} />
      {text}
    </motion.div>
  );
}

/* Manage Linked Fields ------------------------------------------------------ */

const MANAGE = { left: 84, top: 18, width: 312, height: 324 };
const MANAGE_AT = (x: number, y: number): [number, number] => [MANAGE.left + x, MANAGE.top + y];
const LINK_BTN_AT = MANAGE_AT(268, 187);
const PICK_AT = MANAGE_AT(70, 219);
const CONFIRM_AT = MANAGE_AT(278, 255);

/** One shared label in Manage Linked Fields: its value in every document. */
function LinkGroup({
  icon: Icon,
  type,
  label,
  docs,
  linked,
  top,
  children,
}: {
  icon: typeof LinkIcon;
  type: string;
  label: string;
  docs: { name: string; value: string | null }[];
  linked: boolean;
  top: number;
  children?: ReactNode;
}) {
  return (
    <motion.div className="absolute inset-x-[12px] overflow-hidden rounded-[8px] border bg-white" style={{ top, borderColor: LINE }} layout transition={{ duration: 0.4, ease: EASE }}>
      <div className="flex h-[20px] items-center gap-[4px] border-b px-[6px] text-[7.5px]" style={{ borderColor: LINE }}>
        <span className="flex items-center gap-[2px] rounded-[3px] bg-[#eceef3] px-[3px] text-[6.5px]" style={{ color: MUTED }}>
          <Icon className="size-[7px]" />
          {type}
        </span>
        <span className="font-semibold">{label}</span>
        <span className="text-[6.5px]" style={{ color: MUTED }}>
          {linked ? `Linked across ${docs.length} Documents` : `Found in ${docs.length} Documents`}
        </span>
        <motion.span
          className="ml-auto rounded-[4px] px-[4px] py-[1px] text-[6.5px] font-semibold"
          initial={false}
          animate={{ backgroundColor: linked ? "#dae7fe" : "#eceef3", color: linked ? "#283399" : MUTED }}
        >
          {linked ? "Linked" : "Unlinked"}
        </motion.span>
      </div>
      {docs.map((d) => (
        <div key={d.name} className="flex h-[13px] items-center gap-[4px] border-b bg-[#f7f8fa] px-[6px] text-[6.5px]" style={{ borderColor: LINE }}>
          <DocOutlineIcon className="size-[8px]" style={{ color: MUTED }} />
          <span className="font-medium">{d.name}</span>
          <span style={{ color: MUTED }}>
            · Value: <span style={{ color: d.value ? INK : MUTED }}>{d.value ?? "No Value Entered"}</span>
          </span>
          <LinkIcon className="ml-auto size-[7px]" style={{ color: linked ? PRIMARY : "#c3c6cf" }} />
        </div>
      ))}
      {children}
    </motion.div>
  );
}

function Radio({ on, label }: { on: boolean; label: string }) {
  return (
    <motion.div
      className="flex h-[14px] items-center gap-[5px] rounded-[5px] border px-[5px] text-[7px]"
      initial={false}
      animate={{ borderColor: on ? "#9bb6f6" : LINE, backgroundColor: on ? PRIMARY_SOFT : "#f7f8fa" }}
    >
      <span className="flex size-[7px] items-center justify-center rounded-full border" style={{ borderColor: on ? PRIMARY : "#c3c6cf" }}>
        <motion.span className="size-[4px] rounded-full" style={{ background: PRIMARY }} initial={false} animate={{ scale: on ? 1 : 0 }} />
      </span>
      {label}
    </motion.div>
  );
}

function ManageScene({ s }: { s: number }) {
  const picking = s >= 2 && s <= 5;
  const picked = s >= 4;
  const linked = s >= 6;
  const date = "01/12/2026";
  return (
    <>
      <div className="absolute inset-0 blur-[2px]">
        <AppWindow>
          <DraftsChrome crumbs={["Batch Overview", "Inventory and Key Handover", "Field Content"]} />
          <div className="absolute top-[52px] left-[14px] w-[222px]">
            <Bar w={90} h={9} color="#c9ccd6" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="mt-[14px] flex flex-col gap-[4px]">
                <Bar w={80} h={5} />
                <span className="block h-[18px] rounded-[5px] border bg-white" style={{ borderColor: "#d9dce4" }} />
              </div>
            ))}
          </div>
          <Sheet style={{ left: 250, top: 54, width: 168, height: 220 }}>
            <Page lines={3} />
          </Sheet>
        </AppWindow>
      </div>
      <div className="absolute inset-0 bg-[#1a2160]/30" />
      <div className="absolute overflow-hidden rounded-[14px] bg-white" style={{ ...MANAGE, boxShadow: SHADOW }}>
        <div className="flex items-center justify-between px-[12px] pt-[12px]">
          <span className="text-[12px] font-semibold">Manage Linked Fields</span>
          <XMarkIcon className="size-[11px]" style={{ color: MUTED }} />
        </div>
        <div className="mt-[8px] border-l-2 px-[10px] py-[5px] text-[7px]" style={{ background: PRIMARY_SOFT, borderColor: PRIMARY, color: "#283399" }}>
          Link fields with the same label across Documents so content only needs to be entered once.
        </div>
        <LinkGroup
          icon={Bars3BottomLeftIcon}
          type="Text"
          label="Property Address"
          linked
          top={62}
          docs={BATCH.map((d) => ({ name: d.name, value: "14 Albert House, Kensington…" }))}
        />
        <LinkGroup
          icon={CalendarIcon}
          type="Date"
          label="Move-in Date"
          linked={linked}
          top={128}
          docs={[
            { name: "Tenancy Agreement", value: date },
            { name: "Inventory and Key Handover", value: linked ? date : null },
          ]}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {picking ? (
              <motion.div key="pick" className="flex flex-col gap-[3px] px-[6px] py-[6px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="flex h-[12px] items-center gap-[4px] text-[7.5px] font-semibold">
                  Select Linked Value
                  <span className="text-[6px] font-normal" style={{ color: MUTED }}>
                    The value every document will use.
                  </span>
                </span>
                <Radio on={false} label="No Value (Leave Blank)" />
                <Radio on={picked} label={date} />
                <Radio on={false} label="Enter Linked Value" />
                <div className="mt-[1px] flex h-[16px] items-center justify-end gap-[4px] text-[7px] font-medium">
                  <span className="rounded-[4px] border px-[6px] py-[2px]" style={{ borderColor: "#d3d6de" }}>
                    Cancel
                  </span>
                  <motion.span className="rounded-[4px] px-[6px] py-[2px] text-white" initial={false} animate={{ backgroundColor: picked ? PRIMARY : PRIMARY_OFF }}>
                    Confirm
                  </motion.span>
                </div>
              </motion.div>
            ) : (
              <motion.div key={linked ? "linked" : "link"} className="flex h-[26px] items-center gap-[4px] px-[6px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="flex flex-col">
                  <span className="text-[7px] font-semibold">{linked ? "2 Fields Linked" : "Available to Link"}</span>
                  <span className="text-[6px]" style={{ color: MUTED }}>
                    {linked ? "Editing linked fields will update all Documents." : "Once linked, editing any one updates them all."}
                  </span>
                </span>
                {linked ? (
                  <span className="ml-auto rounded-[4px] border px-[5px] py-[2px] text-[7px] font-medium" style={{ borderColor: "#d3d6de" }}>
                    Break Links
                  </span>
                ) : (
                  <span className="ml-auto flex items-center gap-[2px] rounded-[4px] px-[6px] py-[3px] text-[7px] font-semibold text-white" style={{ background: PRIMARY }}>
                    <LinkIcon className="size-[7px]" />
                    Link Fields
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </LinkGroup>
        <div className="absolute inset-x-0 bottom-0 flex justify-end gap-[5px] border-t px-[12px] py-[8px] text-[8px] font-medium" style={{ borderColor: LINE }}>
          <span className="rounded-[5px] border px-[8px] py-[3px]" style={{ borderColor: "#d3d6de" }}>
            Cancel
          </span>
          <span className="rounded-[5px] px-[9px] py-[3px] text-white" style={{ background: PRIMARY }}>
            Done
          </span>
        </div>
      </div>
      <Toast show={linked} text="Fields linked successfully" />
    </>
  );
}

/* ------------------------------------------------------------------------ */

/* Drafts, low detail ------------------------------------------------------ */
// The same screens with the words taken out: bars for text, colour for
// state, so each loop shows one idea and nothing to read.

const READY = { bg: "#e9ebf0", fg: "#c3c7d1" };
const FIXED = { bg: "#e3f9ef", fg: "#2fb985" };
const WARN = { bg: "#fdf3d2", fg: "#e0a21a", line: "#f6dc8a" };
const ALERT = { bg: "#fdecec", fg: "#e5484d", line: "#f7c3c4" };

/** The frame with no words: header, crumbs and the to-do button. */
function LoFiChrome({ done = false, delay = 0 }: { done?: boolean; delay?: number }) {
  return (
    <>
      <AppHeader />
      <div className="absolute inset-x-0 top-[20px] flex h-[22px] items-center gap-[5px] border-b px-[10px]" style={{ borderColor: LINE }}>
        <HomeIcon className="size-[10px]" style={{ color: PRIMARY }} />
        <Bar w={34} h={4} color="#c8d3fb" />
        <ChevronRightIcon className="size-[8px]" style={{ color: MUTED }} />
        <Bar w={46} h={4} color="#c8d3fb" />
        <span className="relative ml-auto">
          <motion.span
            className="flex size-[15px] items-center justify-center rounded-[4px]"
            initial={false}
            animate={{ backgroundColor: done ? "#d6f8ea" : "#fde58a", color: done ? "#1f7a57" : "#6b4a07" }}
            transition={{ duration: 0.3, delay: done ? delay : 0 }}
          >
            {done ? <CheckIcon className="size-[10px]" /> : <ClipboardIcon className="size-[10px]" />}
          </motion.span>
          <motion.span
            className="absolute -top-[3px] -right-[3px] size-[7px] rounded-full"
            style={{ background: DANGER }}
            initial={false}
            animate={{ opacity: done ? 0 : 1, scale: done ? 0.4 : 1 }}
            transition={{ duration: 0.3, delay: done ? delay : 0 }}
          />
        </span>
      </div>
    </>
  );
}

/** A section card: icon, a title bar, its status and its button. */
function LoFiRow({ ready, delay = 0, title }: { ready: boolean; delay?: number; title: number }) {
  const t = { duration: 0.35, delay: ready ? delay : 0 };
  return (
    <div className="flex h-[28px] items-center gap-[8px] rounded-[7px] border bg-white px-[9px]" style={{ borderColor: LINE }}>
      <span className="size-[13px] shrink-0 rounded-[4px]" style={{ background: "#e9ebf1" }} />
      <Bar w={title} h={5} color="#d5d8e0" />
      <motion.span
        className="h-[8px] w-[34px] rounded-full"
        initial={false}
        animate={{ backgroundColor: ready ? READY.bg : WARN.bg }}
        transition={t}
      />
      <motion.span
        className="ml-auto h-[15px] w-[38px] rounded-[5px] border"
        initial={false}
        animate={{ backgroundColor: ready ? "#ffffff" : PRIMARY, borderColor: ready ? LINE : PRIMARY }}
        transition={t}
      />
    </div>
  );
}

const SECTION_TITLES = [70, 58, 96, 64, 84, 90, 76];
// Sections the draft's owner has already set up, so they're ready from the start.
const PRESET = [0, 1, 2, 5, 6];
const SECTION_ROW = (i: number): [number, number] => [24 + 395, 24 + 64 + i * 33 + 15];

function SectionsScene({ s }: { s: number }) {
  const ready = (i: number) => (s >= 1 && PRESET.includes(i)) || (i === 3 && s >= 3) || (i === 4 && s >= 5);
  return (
    <AppWindow>
      <LoFiChrome done={s >= 5} delay={0.6} />
      <div className="absolute top-[50px] left-[16px] flex items-center gap-[6px]">
        <span className="flex size-[12px] items-center justify-center rounded-full border" style={{ borderColor: LINE }}>
          <ChevronLeftIcon className="size-[8px]" style={{ color: MUTED }} />
        </span>
        <Bar w={110} h={8} color="#c9ccd6" />
      </div>
      <div className="absolute inset-x-[16px] top-[64px] flex flex-col gap-[5px]">
        {SECTION_TITLES.map((w, i) => (
          <LoFiRow key={i} title={w} ready={ready(i)} delay={s === 1 ? 0.15 * PRESET.indexOf(i) : 0} />
        ))}
      </div>
    </AppWindow>
  );
}

/** A message that says what's wrong, with the button that fixes it. */
function LoFiAlert({ show, fixed, tone, style }: { show: boolean; fixed: boolean; tone: typeof WARN; style: React.CSSProperties }) {
  const c = fixed ? { bg: FIXED.bg, fg: FIXED.fg, line: "#b7ecd5" } : tone;
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className="absolute flex items-center gap-[7px] overflow-hidden rounded-[7px] border px-[9px]"
          style={style}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 28, backgroundColor: c.bg, borderColor: c.line }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.span initial={false} animate={{ color: c.fg }} className="shrink-0">
            {fixed ? <CheckCircleIcon className="size-[12px]" /> : <ExclamationTriangleIcon className="size-[12px]" />}
          </motion.span>
          <span className="flex flex-col gap-[4px]">
            <Bar w={120} h={4} color={fixed ? "#a9e4c9" : tone === WARN ? "#f1d58a" : "#f2b4b6"} />
            <Bar w={80} h={4} color={fixed ? "#c8eedc" : tone === WARN ? "#f6e3ad" : "#f7cfd0"} />
          </span>
          <motion.span
            className="ml-auto h-[14px] w-[40px] rounded-[5px]"
            initial={false}
            animate={{ backgroundColor: fixed ? "#b7ecd5" : tone.fg, opacity: fixed ? 0.6 : 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const BANNER_TOP = 64;
const BANNER_FIX: [number, number] = [24 + 395, 24 + BANNER_TOP + 14];
const CARD_FIX: [number, number] = [24 + 387, 24 + 150 + 14];

function AlertsScene({ s }: { s: number }) {
  const banner = s >= 1 && s < 4;
  const inline = s >= 1 && s < 7;
  // The cards move down while the banner is in, then back up once it's gone.
  const shift = banner ? 34 : 0;
  return (
    <AppWindow>
      <LoFiChrome done={s >= 7} delay={0.3} />
      <div className="absolute top-[50px] left-[16px]">
        <Bar w={110} h={8} color="#c9ccd6" />
      </div>
      <LoFiAlert show={banner} fixed={s >= 3} tone={WARN} style={{ left: 16, right: 16, top: BANNER_TOP }} />
      <motion.div className="absolute inset-x-[16px] flex flex-col gap-[5px]" style={{ top: 64 }} initial={false} animate={{ y: shift }}>
        <LoFiRow title={70} ready />
        <div className="relative rounded-[7px] border bg-white px-[9px] pt-[8px]" style={{ borderColor: LINE }}>
          <div className="flex items-center gap-[8px]">
            <span className="size-[13px] shrink-0 rounded-[4px]" style={{ background: "#e9ebf1" }} />
            <Bar w={96} h={5} color="#d5d8e0" />
            <motion.span className="h-[8px] w-[34px] rounded-full" initial={false} animate={{ backgroundColor: inline ? WARN.bg : READY.bg }} />
          </div>
          <div className="mt-[8px] flex gap-[8px] pb-[8px]">
            <span className="h-[34px] w-[26px] rounded-[3px] border" style={{ borderColor: LINE, background: "#fafbfc" }} />
            <span className="flex flex-col gap-[5px] pt-[3px]">
              <Bar w={140} h={4} />
              <Bar w={100} h={4} />
              <Bar w={120} h={4} />
            </span>
          </div>
          <motion.div initial={false} animate={{ height: inline ? 34 : 0 }} className="relative overflow-hidden">
            <LoFiAlert show={inline} fixed={s >= 6} tone={ALERT} style={{ left: 0, right: 0, top: 0 }} />
          </motion.div>
        </div>
        <LoFiRow title={64} ready />
        <LoFiRow title={84} ready />
      </motion.div>
    </AppWindow>
  );
}

// Three documents side by side, each with the same field near the top.
const DOC_X = [12, 152, 292];
const DOC_TOP = 54;
const FIELD_Y = 46;
const TYPE_AT: [number, number] = [24 + DOC_X[0] + 60, 24 + DOC_TOP + FIELD_Y + 10];
const LINK_BTN: [number, number] = [24 + DOC_X[0] + 112, 24 + DOC_TOP + FIELD_Y - 7];

function TypeOnceScene({ s }: { s: number }) {
  const typed = s >= 2;
  const linked = s >= 4;
  return (
    <AppWindow>
      <LoFiChrome />
      {DOC_X.map((x, d) => {
        const filled = d === 0 ? typed : s >= 5;
        return (
          <div key={x} className="absolute rounded-[8px] border bg-white" style={{ left: x, top: DOC_TOP, width: 128, height: 240, borderColor: LINE }}>
            <div className="flex items-center gap-[6px] px-[10px] pt-[10px]">
              <DocOutlineIcon className="size-[13px]" style={{ color: MUTED }} />
              <Bar w={[60, 48, 70][d]} h={5} color="#d5d8e0" />
            </div>
            {[0, 1, 2].map((f) => {
              const top = FIELD_Y - 10 + f * 48;
              const main = f === 0;
              return (
                <div key={f} className="absolute inset-x-[10px]" style={{ top }}>
                  <div className="flex h-[10px] items-center justify-between">
                    <Bar w={[44, 36, 50][f]} h={4} color="#dadde4" />
                    {main && d === 0 && (
                      <motion.span initial={false} animate={{ color: linked ? PRIMARY : MUTED }}>
                        <LinkIcon className="size-[9px]" />
                      </motion.span>
                    )}
                  </div>
                  <motion.div
                    className="relative mt-[4px] flex h-[18px] items-center rounded-[5px] border bg-white px-[6px]"
                    initial={false}
                    animate={{
                      borderColor: main && linked ? "#9bb6f6" : main && d === 0 && s >= 2 && !linked ? PRIMARY : LINE,
                      backgroundColor: main && linked ? PRIMARY_SOFT : "#ffffff",
                    }}
                  >
                    {main && (
                      <motion.span
                        className="block h-[4px] rounded-full"
                        style={{ background: INK }}
                        initial={false}
                        animate={{ width: filled ? 72 : 0 }}
                        transition={{ duration: d === 0 ? 1 : 0.5, ease: d === 0 ? "linear" : EASE, delay: d === 0 ? 0 : 0.35 * d }}
                      />
                    )}
                    {main && (
                      <motion.span
                        className="absolute -top-[5px] right-[4px] flex size-[11px] items-center justify-center rounded-full text-white"
                        style={{ background: PRIMARY }}
                        initial={false}
                        animate={{ opacity: linked && filled ? 1 : 0, scale: linked && filled ? 1 : 0.4 }}
                        transition={{ duration: 0.3, delay: linked && filled ? (d === 0 ? 0 : 0.35 * d + 0.3) : 0 }}
                      >
                        <LinkIcon className="size-[7px]" />
                      </motion.span>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        );
      })}
      {/* The link itself, drawn between the documents. */}
      <svg className="absolute inset-0" width={432} height={312} fill="none">
        {[0, 1].map((i) => (
          <motion.path
            key={i}
            d={`M${DOC_X[i] + 128 - 10} ${DOC_TOP + FIELD_Y + 13} H${DOC_X[i + 1] + 10}`}
            stroke={PRIMARY}
            strokeWidth={2}
            strokeDasharray="3 3"
            initial={false}
            animate={{ pathLength: linked ? 1 : 0, opacity: linked ? 1 : 0 }}
            transition={{ duration: 0.4, delay: linked ? 0.35 * i : 0 }}
          />
        ))}
      </svg>
    </AppWindow>
  );
}

const REST: [number, number] = [430, 330];

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
    label: "A recipient's list of six field types collapses down to just Signature, Text and Date, with More field types tucked underneath.",
    steps: [{ ms: 1800 }, { ms: 1200 }, { ms: 2200 }, { ms: 1100 }],
    still: 2,
    Scene: FieldsScene,
  },
  panel: {
    label: "Selecting a Text field on the page turns the Recipients & Fields sidebar into that field's Content editor and brings up a formatting toolbar; clicking the page puts both back.",
    steps: [
      { ms: 1100, cursor: TEXT_FIELD_AT },
      { ms: 2400, cursor: TEXT_FIELD_AT, click: true },
      { ms: 800, cursor: PAGE_BLANK_AT },
      { ms: 1300, cursor: PAGE_BLANK_AT, click: true },
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
    label: "Hovering the greyed-out Send Document button explains a signature is required; once a signature field is placed it says it's ready, and clicking it counts down from five with a Cancel option before sending.",
    steps: [
      { ms: 900, cursor: [250, 190] },
      { ms: 1900, cursor: SEND_AT },
      { ms: 800, cursor: SIGN_AT },
      { ms: 900, cursor: SIGN_AT, click: true },
      { ms: 1700, cursor: SEND_AT },
      { ms: TICK, cursor: SEND_AT, click: true },
      { ms: TICK, cursor: SEND_AT },
      { ms: TICK, cursor: SEND_AT },
      { ms: TICK, cursor: SEND_AT },
      { ms: TICK, cursor: SEND_AT },
      { ms: 1500, cursor: REST },
    ],
    still: 7,
    Scene: SendScene,
  },
  again: {
    label: "On the Sent screen, Send another opens a choice of the same document to different recipients, the same recipients with a different document, or a new send; picking the second goes straight to choosing a new file.",
    steps: [
      { ms: 1000, cursor: REST },
      { ms: 1000, cursor: SEND_ANOTHER_AT },
      { ms: 1100, cursor: SEND_ANOTHER_AT, click: true },
      { ms: 900, cursor: OPTION_AT(1) },
      { ms: 900, cursor: OPTION_AT(1), click: true },
      { ms: 650, cursor: CONTINUE_AT },
      { ms: 500, cursor: CONTINUE_AT, click: true },
      { ms: 2000, cursor: REST },
    ],
    still: 4,
    Scene: AgainScene,
  },
  details: {
    label: "Selecting a document in the batch slides the list over and opens a details panel with its template, pages and participants; selecting another swaps the panel to that document, and selecting it again closes the panel.",
    steps: [
      { ms: 800, cursor: REST },
      { ms: 700, cursor: DOC_AT(0, false) },
      { ms: 2000, cursor: DOC_AT(0, false), click: true },
      { ms: 700, cursor: DOC_AT(1, true) },
      { ms: 2200, cursor: DOC_AT(1, true), click: true },
      { ms: 1400, cursor: DOC_AT(1, true), click: true },
      { ms: 900, cursor: REST },
    ],
    still: 4,
    Scene: DetailsScene,
  },
  drill: {
    label: "Prepare on a document in the batch opens its overview, with every section as a card that says if it needs preparing; the Batch Overview breadcrumb goes straight back.",
    steps: [
      { ms: 800, cursor: REST },
      { ms: 700, cursor: PREPARE_AT(1) },
      { ms: 2400, cursor: PREPARE_AT(1), click: true },
      { ms: 800, cursor: CRUMB_AT },
      { ms: 1800, cursor: CRUMB_AT, click: true },
    ],
    still: 2,
    Scene: DrillScene,
  },
  todo: {
    label: "The to-do list drills from the documents in the batch, to a document's sections, to the exact fields still missing; once everything is prepared it turns green and says all documents are ready to send.",
    steps: [
      { ms: 700, cursor: REST },
      { ms: 600, cursor: TODO_AT },
      { ms: 1400, cursor: TODO_AT, click: true },
      { ms: 600, cursor: TODO_ROW_AT(0) },
      { ms: 1400, cursor: TODO_ROW_AT(0), click: true },
      { ms: 600, cursor: TODO_ROW_AT(1) },
      { ms: 2000, cursor: TODO_ROW_AT(1), click: true },
      { ms: 600, cursor: TODO_AT },
      { ms: 900, cursor: TODO_AT, click: true },
      { ms: 2200, cursor: [400, 120] },
      { ms: 2400, cursor: TODO_AT, click: true },
      { ms: 800, cursor: TODO_AT, click: true },
    ],
    still: 6,
    Scene: TodoScene,
  },
  linkField: {
    label: "Typing a property address into a sender field fills it on the document; the field notes it's found in three documents, and Link Field Content, confirmed in a dialog, links it so it fills everywhere.",
    steps: [
      { ms: 700, cursor: REST },
      { ms: 600, cursor: FIELD_INPUT_AT },
      { ms: 1700, cursor: FIELD_INPUT_AT, click: true },
      { ms: 700, cursor: LINK_AT },
      { ms: 1500, cursor: LINK_AT, click: true },
      { ms: 600, cursor: LINK_FIELDS_AT },
      { ms: 2800, cursor: LINK_FIELDS_AT, click: true },
      { ms: 800, cursor: REST },
    ],
    still: 6,
    Scene: LinkFieldScene,
  },
  manageLinks: {
    label: "Manage Linked Fields lists every label shared across the documents with its value in each; linking the Move-in Date asks which value to keep, and picking the one already entered fills it in both documents.",
    steps: [
      { ms: 900, cursor: REST },
      { ms: 700, cursor: LINK_BTN_AT },
      { ms: 1200, cursor: LINK_BTN_AT, click: true },
      { ms: 600, cursor: PICK_AT },
      { ms: 900, cursor: PICK_AT, click: true },
      { ms: 600, cursor: CONFIRM_AT },
      { ms: 2800, cursor: CONFIRM_AT, click: true },
      { ms: 900, cursor: REST },
    ],
    still: 6,
    Scene: ManageScene,
  },
  sections: {
    label: "Seven section cards, most already set up and marked ready, and the two that need the sender being prepared one after the other.",
    steps: [
      { ms: 900, cursor: REST },
      { ms: 1700, cursor: REST },
      { ms: 750, cursor: SECTION_ROW(3) },
      { ms: 750, cursor: SECTION_ROW(3), click: true },
      { ms: 700, cursor: SECTION_ROW(4) },
      { ms: 2000, cursor: SECTION_ROW(4), click: true },
      { ms: 900, cursor: REST },
    ],
    still: 1,
    Scene: SectionsScene,
  },
  alerts: {
    label: "A warning banner and an error inside a card appear, and each is fixed with the button beside it, until the to-do list turns green.",
    steps: [
      { ms: 700, cursor: REST },
      { ms: 1200, cursor: REST },
      { ms: 750, cursor: BANNER_FIX },
      { ms: 900, cursor: BANNER_FIX, click: true },
      { ms: 600, cursor: BANNER_FIX },
      { ms: 750, cursor: CARD_FIX },
      { ms: 900, cursor: CARD_FIX, click: true },
      { ms: 1900, cursor: REST },
      { ms: 700, cursor: REST },
    ],
    still: 1,
    Scene: AlertsScene,
  },
  typeOnce: {
    label: "A field is typed into on one document and linked, and the same field fills itself in on two more documents.",
    steps: [
      { ms: 800, cursor: REST },
      { ms: 700, cursor: TYPE_AT },
      { ms: 1300, cursor: TYPE_AT, click: true },
      { ms: 700, cursor: LINK_BTN },
      { ms: 700, cursor: LINK_BTN, click: true },
      { ms: 2200, cursor: REST },
      { ms: 900, cursor: REST },
    ],
    still: 5,
    Scene: TypeOnceScene,
  },
};
