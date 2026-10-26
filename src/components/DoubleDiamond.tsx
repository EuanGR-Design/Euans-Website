import type { Block } from "@/projects";

type Stage = Extract<Block, { type: "double-diamond" }>["stages"][number];

/**
 * The four stages of the double diamond, with the first two grouped as the
 * problem and the last two as the solution, and what happened at each.
 */
export function DoubleDiamond({ stages }: { stages: Stage[] }) {
  const groups = [
    { label: "The problem", stages: stages.slice(0, 2) },
    { label: "The solution", stages: stages.slice(2) },
  ];
  return (
    <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-6">
      {groups.map((g, gi) => (
        <div key={g.label}>
          <p className="eyebrow border-b border-line pb-3">{g.label}</p>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2">
            {g.stages.map((s, i) => (
              <li key={s.name} className="border-l-2 border-accent pl-4">
                <p className="text-sm font-semibold text-accent">
                  {gi * 2 + i + 1}. {s.name}
                </p>
                <p className="mt-2 text-xl font-semibold tracking-tight">{s.count}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
