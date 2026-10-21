import type { Block } from "@/projects";

type Stage = Extract<Block, { type: "double-diamond" }>["stages"][number];

/**
 * The double diamond as a band of two diamonds, with what each stage widened
 * out to or narrowed down to underneath. Stacks on small screens, where the
 * diamonds would be too thin to read.
 */
export function DoubleDiamond({ stages }: { stages: Stage[] }) {
  return (
    <div className="mt-12">
      <svg viewBox="0 0 400 90" preserveAspectRatio="none" className="hidden h-28 w-full md:block" aria-hidden>
        {[0, 200].map((x) => (
          <polygon
            key={x}
            points={`${x + 2},45 ${x + 100},3 ${x + 198},45 ${x + 100},87`}
            className="fill-accent-soft stroke-accent"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <line x1="100" y1="3" x2="100" y2="87" className="stroke-accent/40" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        <line x1="300" y1="3" x2="300" y2="87" className="stroke-accent/40" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="grid gap-6 md:mt-6 md:grid-cols-4">
        {stages.map((s, i) => (
          <li key={s.name} className="border-l-2 border-accent pl-4 md:border-l-0 md:pl-0 md:text-center">
            <p className="eyebrow">
              {i + 1}. {s.name}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{s.count}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
