// Stand-in until the animations land.
import type { DecisionLoopName } from "@/projects";
export type { DecisionLoopName };
export function DecisionLoop({ name }: { name: DecisionLoopName }) {
  return <div role="img" aria-label={name} className="h-full w-full" style={{ background: "linear-gradient(135deg, #5285ff, #4556f6)" }} />;
}
