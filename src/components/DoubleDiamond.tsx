import type { Block } from "@/projects";

type Stage = Extract<Block, { type: "double-diamond" }>["stages"][number];

// Two squares turned on their corners, side by side, in a 400 by 200 box.
const diamonds = [
  { cx: 100, space: "The problem space" },
  { cx: 300, space: "The solution space" },
];
const half = 98;

/**
 * The double diamond in its usual form: a problem diamond and a solution
 * diamond, each widening out then narrowing in, with the four stages named
 * inside. What happened at each stage is listed underneath.
 */
export function DoubleDiamond({ stages }: { stages: Stage[] }) {
  return (
    <div className="mt-12">
      <svg viewBox="0 -24 400 248" className="mx-auto block w-full max-w-2xl" role="img" aria-label="The double diamond: discover and define the problem, then develop and deliver the solution">
        {diamonds.map((d) => (
          <g key={d.cx}>
            <polygon
              points={`${d.cx - half},100 ${d.cx},${100 - half} ${d.cx + half},100 ${d.cx},${100 + half}`}
              className="fill-accent-soft stroke-accent"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <line x1={d.cx} y1={100 - half} x2={d.cx} y2={100 + half} className="stroke-accent/50" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <text x={d.cx} y={-10} textAnchor="middle" className="fill-muted text-[8px] font-semibold tracking-wider uppercase">
              {d.space}
            </text>
          </g>
        ))}
        {stages.map((s, i) => {
          const x = diamonds[Math.floor(i / 2)].cx + (i % 2 ? 1 : -1) * 44;
          return (
            <g key={s.name}>
              <text x={x} y={96} textAnchor="middle" className="fill-fg text-[12px] font-semibold">
                {s.name}
              </text>
              <text x={x} y={110} textAnchor="middle" className="fill-muted text-[7px]">
                {i % 2 ? "Narrow down" : "Open up"}
              </text>
            </g>
          );
        })}
      </svg>
      <ol className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {stages.map((s, i) => (
          <li key={s.name} className="border-l-2 border-accent pl-4">
            <p className="eyebrow">
              {i + 1}. {s.name}
            </p>
            <p className="mt-2 text-xl font-semibold tracking-tight">{s.count}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
