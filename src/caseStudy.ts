// The case study format set by Quick Send, for the Console projects. A page
// runs through the same sections in the same order. Each one shows a prompt
// until its real block is written, and a project can add sections of its own,
// such as personas or a journey map, alongside any of them.

import type { Block } from "./projects";

export type Section = "problem" | "brief" | "versions" | "prototypes" | "decisions" | "handoff" | "result" | "outcome";

// What goes in each section, and where to see it done in Quick Send.
const prompts: Record<Section, { eyebrow: string; ask: string; hint: string; anchor: string }> = {
  problem: {
    eyebrow: "The problem",
    ask: "The problem, in one line.",
    hint: "One line on how you found it (feedback, interviews, user testing, session recordings), then what users said as cards that turn over to show what they needed. The research and what was wrong go behind a Dig deeper.",
    anchor: "problem",
  },
  brief: {
    eyebrow: "The brief",
    ask: "The goal, in one line.",
    hint: "A line on switching from the product owner hat to the designer's, a preview of the brief that opens full size, and a couple of points on how it came about, such as the backlog and the scope.",
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
    hint: "Around six decisions, each with a short, simplified looping animation of the idea and a line on why. Clips of the finished details go behind a Dig deeper.",
    anchor: "key-decisions",
  },
  handoff: {
    eyebrow: "Design-to-dev handoff",
    ask: "Every route mapped, and annotated for the build.",
    hint: "The annotated user flow from Figma, behind a blurred preview, then a couple of points on how the work was sequenced and kept in step with the developers.",
    anchor: "design-to-dev-handoff",
  },
  result: {
    eyebrow: "Your turn",
    ask: "Try it yourself.",
    hint: "The final prototype to play with, in the same browser window as the hero, with a way to send feedback. The production recording and screen by screen go behind a Dig deeper.",
    anchor: "your-turn",
  },
  outcome: {
    eyebrow: "The outcome",
    ask: "What changed, goal by goal.",
    hint: "Each goal from the brief and what happened to it, then what went beyond the brief, then the before and after numbers.",
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

/**
 * A section planned for a page that isn't in the Quick Send format, such as
 * the skill pieces: what goes there, until its real block is written.
 */
export const slot = (eyebrow: string, ask: string, hint: string, id?: string): Block => ({ type: "todo", id, eyebrow, ask, hint });
