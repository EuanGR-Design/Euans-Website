// The case study format set by Quick Send, for the Console projects. A page
// runs through the same sections in the same order. Each one shows a prompt
// until its real block is written, and a project can add sections of its own,
// such as personas or a journey map, alongside any of them.

import type { Block } from "./projects";

export type Section =
  | "clips"
  | "problem"
  | "brief"
  | "versions"
  | "prototypes"
  | "decisions"
  | "handoff"
  | "product"
  | "result"
  | "outcome";

// What goes in each section, and where to see it done in Quick Send.
const prompts: Record<Section, { eyebrow: string; ask: string; hint: string; anchor: string }> = {
  clips: {
    eyebrow: "Up close",
    ask: "The details, straight under the hero.",
    hint: "Short looping clips of the finished product, each on a blue tile, with a principle beneath them.",
    anchor: "up-close",
  },
  problem: {
    eyebrow: "The problem",
    ask: "The problem, in one line.",
    hint: "How you found it (feedback, interviews, user testing, session recordings), then each thing that was wrong beside its fix. The research goes behind a Dig deeper.",
    anchor: "problem",
  },
  brief: {
    eyebrow: "The brief",
    ask: "The goal, in one line.",
    hint: "A preview of the brief that opens full size: background, who it's for, the objective, requirements, what's out of scope and what success looks like.",
    anchor: "the-brief",
  },
  versions: {
    eyebrow: "Versions",
    ask: "From the first screens to the final design.",
    hint: "Every version in the scrubber, with notes pinned on the screen and what feedback changed. How you tested goes behind a Dig deeper.",
    anchor: "25-versions",
  },
  prototypes: {
    eyebrow: "Prototypes",
    ask: "The prototypes users tested.",
    hint: "A card for each clickable prototype, with a screen of its version and a link to try it.",
    anchor: "prototypes",
  },
  decisions: {
    eyebrow: "Key decisions",
    ask: "The decisions that shaped it.",
    hint: "Around six decisions, each with an icon and a line on why.",
    anchor: "key-decisions",
  },
  handoff: {
    eyebrow: "Design-to-dev handoff",
    ask: "Every route mapped, and annotated for the build.",
    hint: "The annotated user flow from Figma, behind a blurred preview, with notes on how each part should be built.",
    anchor: "design-to-dev-handoff",
  },
  product: {
    eyebrow: "Design and product",
    ask: "Bringing design into product decisions.",
    hint: "Where wearing both hats helped: the backlog, scope and the brief, the order of work, and working with the developers.",
    anchor: "design-and-product",
  },
  result: {
    eyebrow: "The result",
    ask: "It in production, start to finish.",
    hint: "A recording of the whole flow, with screen by screen behind a Dig deeper.",
    anchor: "in-production",
  },
  outcome: {
    eyebrow: "The outcome",
    ask: "What changed.",
    hint: "Three points on a blue card, then the before and after numbers.",
    anchor: "the-outcome",
  },
};

const order = Object.keys(prompts) as Section[];

/** A section's prompt, with its heading if that's already known. */
export const todo = (key: Section, heading?: string): Block => {
  const p = prompts[key];
  return { type: "todo", eyebrow: p.eyebrow, heading, ask: p.ask, hint: p.hint, example: `/work/quick-send#${p.anchor}` };
};

/**
 * A page's blocks in the Quick Send format. Give a section its real block,
 * or a list to add sections around it (use `todo` for the section itself
 * until it's written); `heading` keeps the prompt but with a line that's
 * already known; null leaves the section out.
 */
export function caseStudy(
  sections: Partial<Record<Section, Block | Block[] | { heading: string } | null>> = {},
): Block[] {
  return order.flatMap((key): Block[] => {
    const given = sections[key];
    if (given === null) return [];
    if (Array.isArray(given)) return given;
    if (given && "type" in given) return [given];
    return [todo(key, given?.heading)];
  });
}
