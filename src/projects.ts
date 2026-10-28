import type { CardInfo } from "./components/ProjectTransition";
import type { IconName } from "./components/Icon";
// Every project on the site, and what each case study page shows.
// Pages are built from `blocks`, top to bottom. Images live in public/.

import { oldDims } from "./oldImageSizes";
import { quickSendInProduction, quickSendIterations, quickSendPrototypeCards, quickSendTesting } from "./quickSend";
import { caseStudy, slot, todo } from "./caseStudy";
import { supportObjectives, supportPersonas, supportPriorities, supportShortlist, supportStoryMaps, supportThemes, supportUserStories } from "./supportHub";

export type Era = "university" | "freelance" | "legalesign";

export const eras: { id: Era; label: string; when: string; blurb: string }[] = [
  {
    id: "legalesign",
    label: "Legalesign",
    when: "2021 – Present",
    blurb: "Design lead, and more recently product owner, for an enterprise e-signature platform.",
  },
  {
    id: "freelance",
    label: "Freelance",
    when: "2019 – 2020",
    blurb: "Branding and visual identity for a range of clients.",
  },
  {
    id: "university",
    label: "Glasgow School of Art",
    when: "2015 – 2020",
    blurb: "BDes (Hons) Product Design: research, prototyping and systems thinking.",
  },
];

// `src: null` shows a labelled slot until the image is added. `ref` notes
// which file from the old portfolio export it should be.
export type Img = {
  src: string | null;
  w: number;
  h: number;
  alt: string;
  caption?: string;
  ref?: string;
};

type JourneyStep = {
  stage: "Research" | "Ideation" | "Iteration" | "Handoff" | "Shipped";
  title: string;
  decision: string;
  image: string | null;
  // False while `decision` is still a prompt rather than real copy.
  written: boolean;
};

// One cell of a bento block. `span` sets its shape from tablet width up:
// "wide" takes two columns, "tall" two rows, "full" the whole row, "one" a
// single cell. A tall tile stretches to its rows instead of keeping its
// aspect ratio, and so does one with `fill` once there are three columns.
// `compare` is the version on the page's iterations scrubber that the tile
// can jump to.
export type BentoTile = {
  title: string;
  caption: string;
  span: "wide" | "tall" | "full" | "one";
  fill?: boolean;
  compare?: number;
} & (
  | {
      kind: "video";
      src: string;
      poster: string;
      label: string;
      // Shape on phones, and on wider screens unless the tile fills its row.
      aspect: string;
      // "cover" crops from `position` to fill the frame; "contain" letterboxes
      // on `bg`, which should match the recording's own background.
      fit?: "cover" | "contain";
      position?: string;
      bg?: string;
    }
  // Just the words, for a point the clips around it make.
  | { kind: "note" }
);

// The animations Key decisions can show (src/components/DecisionLoop.tsx).
export type DecisionLoopName = "recipients" | "sidebar" | "fields" | "panel" | "modals" | "send" | "again";

// A few short points with icons, under a section's main content.
export type Notes = { icon: IconName; title: string; body: string }[];

// `draft: true` shows the copy as a muted prompt until the real words are in.
// More detail behind a section, opened in a panel so the page stays short.
export type DirectionStatus = "Shipped" | "Partly" | "Designed" | "Not built" | "Cut";

export type PersonaCard = {
  name: string;
  label: string;
  age: number;
  role: string;
  bio: string;
  quote: string;
  goals: string[];
  frustrations: string[];
  tech: "Low" | "Medium" | "High";
  help: string[];
  mvp?: boolean;
};

// Must have is the MVP; should and could have were scoped for later versions.
export type StoryPriority = "must" | "should" | "could" | "wont";
export type StoryTasks = {
  title: string;
  priority?: StoryPriority;
  steps: { title: string; stories: { text: string; mvp?: boolean; priority?: StoryPriority }[] }[];
}[];

// `full` is everything mapped for a persona; `cut` is the same map after the
// tasks that weren't needed for a first release were taken out.
export type StoryMap = { persona: string; label: string; full: StoryTasks; cut: StoryTasks };

export type UserStories = {
  persona: string;
  label: string;
  groups: { title: string; stories: { text: string; mvp?: boolean }[] }[];
};

export type Deeper = { label: string; heading: string; body?: string; blocks: Block[] };

export type Block =
  | { type: "text"; eyebrow?: string; heading: string; body: string[]; draft?: boolean }
  // `loop` swaps an item's icon for a short animation of the idea (Key decisions).
  | {
      type: "points";
      eyebrow?: string;
      heading: string;
      items: { title: string; body: string; icon?: IconName; loop?: DecisionLoopName }[];
      deeper?: Deeper;
    }
  // What users said, as cards that turn over to show what they needed.
  | { type: "voices"; id?: string; eyebrow: string; heading: string; body?: string; items: { quote: string; need: string }[]; deeper?: Deeper }
  | { type: "image"; image: Img }
  // A silent screen recording from public/, with a still from it as the poster.
  // `id` lets other parts of the page link to it, as #id.
  | { type: "video"; id?: string; eyebrow?: string; heading: string; body?: string; src: string; poster: string; label: string; deeper?: Deeper }
  // Looping clips of the live product in a grid, under one longer recording
  // with controls. See BentoTile.
  | {
      type: "bento";
      id?: string;
      eyebrow?: string;
      // Leave out to run the clips straight on from the hero.
      heading?: string;
      body?: string;
      feature?: { src: string; poster: string; label: string; w: number; h: number; title: string; caption: string };
      tiles: BentoTile[];
      // Clips only: no captions or play buttons.
      bare?: boolean;
      // A CSS background for every tile, with the clip inset on it like the
      // hero card.
      surface?: string;
      // Each clip on its own white card with a shadow, so it stands out from
      // the page.
      lifted?: boolean;
      // A prompt under the grid to scroll on into the story.
      cue?: { label: string; href: string };
      // A short principle under the clips, with a quote that backs it up.
      principle?: { eyebrow?: string; heading: string; body: string[]; quote?: { text: string; by: string; url: string; logo?: "linear" } };
    }
  | { type: "gallery"; eyebrow?: string; heading: string; images: Img[] }
  // A low-fidelity pass at a flow: grey-box screens joined by the moves
  // between them (`next` and `back` label the way on and the way back from
  // each screen), with numbered pins on shared parts. Pin n matches notes[n-1].
  | {
      type: "skeleton";
      id?: string;
      eyebrow?: string;
      heading: string;
      body?: string;
      screens: {
        name: string;
        crumbs: string[];
        rows: { label: string; status?: "prepare" | "ready" }[];
        panel?: boolean;
        // A round back button before the title, once drilled in.
        backButton?: boolean;
        // Where the screen's extra actions and dialogs open, right of the title.
        more?: string;
        // A message under the title, above the work it's about.
        banner?: string;
        secondary: string[];
        primary: string;
        next?: string;
        back?: string;
        marks?: { crumbs?: number; backButton?: number; todo?: number; more?: number; banner?: number; rows?: number; panel?: number; actions?: number };
      }[];
      notes: { title: string; body: string }[];
    }
  // Every rule a feature has to honour, drawn as a knot that pulls straight
  // into the sections that own them as the page scrolls. `links` joins rules
  // that affect each other; `before` and `after` caption the two ends.
  | {
      type: "untangle";
      id?: string;
      eyebrow?: string;
      heading: string;
      body?: string;
      stats?: { value: string; label: string }[];
      groups: { name: string; items: string[] }[];
      links: [string, string][];
      before: string;
      after: string;
      deeper?: Deeper;
    }
  // How a feature is put together: levels you drill into, left to right,
  // and the ways back out underneath. See LogicMap.
  | {
      type: "logic-map";
      id?: string;
      eyebrow?: string;
      heading: string;
      body?: string;
      // Ways of being in the feature that change what every level does.
      modes?: { label: string; body: string }[];
      levels: { name: string; note: string; items: { label: string; opens?: string }[] }[];
      out: { label: string; body: string }[];
      note?: string;
    }
  // Parts of a feature down the side, the states each can be in across the
  // top. A null cell is a state that part can't reach. `tone` colours the
  // columns that warn or block.
  | {
      type: "state-matrix";
      id?: string;
      eyebrow?: string;
      heading: string;
      body?: string;
      columns: { name: string; tone?: "warn" | "block" }[];
      rows: { name: string; cells: (string | null)[] }[];
      note?: string;
    }
  | {
      type: "comparison";
      eyebrow?: string;
      heading: string;
      // Leave a side null until its screenshot exists (2400×1337 to match the
      // others). `missing` explains a before that never existed.
      items: {
        id: string;
        label: string;
        before: string | null;
        after: string | null;
        caption: string;
        missing?: { title: string; body: string };
      }[];
    }
  | {
      type: "journey";
      problem: string;
      evidence: string;
      steps: JourneyStep[];
    }
  | {
      type: "prototype";
      eyebrow?: string;
      url: string;
      heading: string;
      body: string;
      width: number;
      height: number;
    }
  // The final prototype to play with, in the same browser window as the
  // hero image (see Project.play for `play`).
  | {
      type: "play";
      id?: string;
      eyebrow: string;
      heading: string;
      body?: string;
      image: Img;
      play: { url: string; width: number; screen: [number, number, number, number] };
      deeper?: Deeper;
    }
  // A section of the case study format that's still to be written: what
  // goes there, and a link to where Quick Send does it (src/caseStudy.ts).
  | { type: "todo"; id?: string; eyebrow: string; heading?: string; ask: string; hint: string; example?: string }
  | { type: "timeline"; eyebrow?: string; heading: string; items: { when: string; title: string; body: string; tags: string[] }[] }
  | { type: "brand" }
  // A video player (Vimeo, Adobe) or another embeddable page, shown 16:9.
  | { type: "embed"; eyebrow?: string; heading: string; body?: string; items: { url: string; title: string; caption?: string }[] }
  // Blocks used by the Legalesign stage pages (src/process.ts).
  | { type: "quotes"; eyebrow?: string; heading: string; items: { quote: string; who: string }[]; draft?: boolean }
  | {
      type: "personas";
      eyebrow?: string;
      heading: string;
      body?: string;
      items: { name: string; role: string; goals: string; frustrations: string }[];
      draft?: boolean;
      deeper?: Deeper;
    }
  // Full persona cards, one shown at a time from a row of everyone.
  | { type: "persona-cards"; eyebrow?: string; heading: string; body?: string; items: PersonaCard[]; deeper?: Deeper }
  // A user story map per persona: tasks across, steps under them, stories
  // below, with the MVP line drawn through each step.
  | { type: "story-map"; eyebrow?: string; heading: string; body?: string; maps: StoryMap[]; deeper?: Deeper }
  | { type: "user-stories"; eyebrow?: string; heading: string; body?: string; items: UserStories[]; deeper?: Deeper }
  // Shortlisted directions weighed against weighted objectives. `meets`
  // holds the indexes of the directions that meet each objective.
  | {
      type: "objectives";
      eyebrow?: string;
      heading: string;
      body?: string;
      directions: string[];
      // `top` marks the objectives leadership put first.
      items: { objective: string; weight: number; meets: number[]; top?: boolean }[];
      // Weights at or above this count as high value. Defaults to 8.
      high?: number;
      deeper?: Deeper;
    }
  // Shortlisted options side by side with their scores, and the call made.
  | {
      type: "shortlist";
      eyebrow?: string;
      heading: string;
      body?: string;
      items: { title: string; tag: string; stats: { label: string; value: string }[]; chosen?: boolean }[];
      call: string;
      deeper?: Deeper;
    }
  // The double diamond: what each stage widened or narrowed to.
  | { type: "double-diamond"; eyebrow?: string; heading: string; body?: string; stages: { name: string; count: string; body: string }[] }
  // Directions grouped into themes, each with what happened to it.
  | {
      type: "themes";
      eyebrow?: string;
      heading: string;
      body?: string;
      items: { title: string; body: string; directions: { title: string; status: DirectionStatus }[] }[];
      // Show what happened to each direction. Defaults to true.
      statuses?: boolean;
      deeper?: Deeper;
    }
  // Opportunities ranked by score, with value and effort shown as bars.
  | {
      type: "priorities";
      eyebrow?: string;
      heading: string;
      body?: string;
      // `value` is left out where the source never scored it. `status` is
      // what happened to the direction in the end.
      items: { title: string; value?: number; effort: number; status: DirectionStatus; note?: string }[];
      // Column names and the top of each scale, as the source scored them.
      value: { label: string; max: number };
      effort: { label: string; max: number };
      deeper?: Deeper;
    }
  | {
      type: "journey-map";
      eyebrow?: string;
      heading: string;
      body?: string;
      stages: string[];
      // One row per lane, one cell per stage.
      lanes: { label: string; cells: string[] }[];
      draft?: boolean;
    }
  // Side-by-side cards per finding. `labels` names the columns (two, or three
  // with `then`), and defaults to "We found" and "So the design had to".
  | {
      type: "insights";
      eyebrow?: string;
      heading: string;
      labels?: string[];
      // Show the first of each as a quote from users.
      quotes?: boolean;
      items: { found: string; so: string; then?: string }[];
      draft?: boolean;
    }
  // Big, short statements to scan: a heading, a line or two, and optionally
  // the fix it led to and a screenshot beside it.
  | {
      type: "callouts";
      id?: string;
      eyebrow?: string;
      heading: string;
      body?: string;
      items: { title: string; body: string; fix?: string; image?: Img; icon?: IconName }[];
      // How the items are laid out. Cards by default.
      look?: "cards" | "statements" | "goals" | "fixes" | "split";
      deeper?: Deeper;
    }
  // Clickable prototypes side by side, each with a screen of its version
  // and links to open it.
  | {
      type: "prototypes";
      eyebrow?: string;
      heading: string;
      body?: string;
      note?: string;
      items: { version: number; title: string; body: string; image: Img; links: { label: string; url: string }[] }[];
    }
  // A few lines on the project and a list of what I did on it.
  | { type: "overview"; eyebrow?: string; heading: string; body: string; did: string[] }
  // The flow step by step: a short looping clip of each step, playing in a
  // browser window on a blue panel the shape of the hero.
  | {
      type: "screens";
      eyebrow?: string;
      heading: string;
      body?: string;
      items: { title: string; body: string; video: { src: string; poster: string; label: string } }[];
    }
  // A wide annotated flow that pans sideways as the page scrolls. With no
  // `src` it shows a slot until the image is added.
  | {
      type: "flow";
      eyebrow?: string;
      heading: string;
      body?: string;
      image: Img;
      // A Figma file to embed on larger screens, linked on phones. `preview`
      // is a blurred image of the file, shown behind the button until it loads.
      figma?: { embed: string; url: string; preview?: string };
      notes?: Notes;
    }
  // A brief: a bold one-line summary, beside a preview of the brief as a
  // sheet of paper that opens full size.
  | {
      type: "brief";
      id?: string;
      eyebrow?: string;
      heading: string;
      body?: string;
      // What the sheet itself says.
      title: string;
      meta: { label: string; value: string }[];
      sections: { label: string; body?: string; items?: { title: string; body: string; icon?: IconName }[] }[];
      // A CSS background for the panel the preview sits on.
      surface?: string;
      // Said under the preview and above the full brief, when the sheet is
      // a stand-in for a brief that can't be shown.
      recreation?: string;
      notes?: Notes;
      deeper?: Deeper;
    }
  // How a design was tested: one round as a loop of steps, then every
  // version as a small screen, grouped by how it was put in front of people.
  // `marked` versions get a badge, such as the clickable prototypes.
  | {
      type: "testing";
      eyebrow?: string;
      heading: string;
      body?: string;
      cycle: { icon: IconName; title: string; body: string }[];
      repeat: string;
      bands: { label: string; title: string; body: string; screens: { version: number; image: Img; marked?: boolean }[] }[];
      mark?: string;
    }
  // The ending: big statements of what changed, then any numbers.
  | {
      type: "outcome";
      eyebrow?: string;
      heading: string;
      // `goal` is what the item answers from the brief, shown above it.
      items: { title: string; body: string; icon?: IconName; goal?: string }[];
      stats?: { value: string; label: string }[];
      // A CSS background that sets it apart as a card, in place of the
      // closing band.
      surface?: string;
      // A prompt for numbers that haven't been added yet.
      todo?: string;
    }
  | {
      type: "options";
      eyebrow?: string;
      heading: string;
      items: { title: string; body: string; image: Img | null; chosen?: boolean }[];
      draft?: boolean;
    }
  | {
      type: "rounds";
      eyebrow?: string;
      heading: string;
      // `title` names the round, for example which versions it covers.
      items: { title?: string; heard: string; changed: string; image: Img | null }[];
      draft?: boolean;
    }
  | { type: "stats"; eyebrow?: string; heading: string; items: { value: string; label: string }[]; draft?: boolean }
  // Screens oldest to newest, stepped through with a scrubber. Leave out
  // `stage`, `change` or `feedback` until they're written.
  | {
      type: "iterations";
      eyebrow?: string;
      heading: string;
      body?: string;
      // `pins` mark where on the screen things changed, in percent of the frame.
      // `prototype` offers clickable prototypes of that version in a card. An
      // image with no `src` shows a placeholder until the screen is added.
      items: {
        image: Img;
        stage?: string;
        change?: string;
        feedback?: string;
        pins?: { x: number; y: number; note: string }[];
        prototype?: { title?: string; body: string; links: { label: string; url: string }[] };
      }[];
      deeper?: Deeper;
    };

export type Project = {
  slug: string;
  era: Era;
  title: string;
  // One line for cards.
  summary: string;
  // Leave out if unknown.
  year?: string;
  role: string;
  tags: string[];
  // What I did on it, shown on the home page's timeline. Falls back to `tags`.
  contribution?: string[];
  cover: Img | null;
  // The big image at the top of the project page, which the full-screen
  // title card shrinks into on the way in. Falls back to the cover.
  hero?: Img;
  featured?: boolean;
  // Coming-soon projects show as a card but have no page yet.
  comingSoon?: boolean;
  // Cards link here instead of to a page of their own.
  href?: string;
  intro: string;
  // A case study told as a story opens with the problem in one big
  // statement, then a line on my role, where the work sat and what it
  // achieved. Projects without a statement show `intro` instead, and ones
  // without a role line show `intro` under the statement.
  statement?: string;
  roleStatement?: string;
  // Buttons beside the role line, such as a prototype to try or a video to
  // watch. A link starting with # jumps down the page; others open a new tab.
  // `play` marks the prototype link, which plays it in the hero on desktop.
  // `card` shows it as a small picture of the hero beside the title, with a
  // drawn arrow and the label, instead of a button.
  actions?: { label: string; href: string; icon: IconName; play?: boolean; card?: boolean }[];
  // A prototype to play inside the hero image's browser window. `screen` is
  // the window's content area in the image's pixels: x, y, width, height.
  play?: { url: string; width: number; screen: [number, number, number, number] };
  // A short silent loop of the finished product, playing in a browser window
  // on the hero's blue panel, sized to the recording.
  heroLoop?: { src: string; poster: string; label: string };
  context?: { label: string; value: string }[];
  impact?: { value: string; label: string }[];
  // Which project to suggest next, and why. Defaults to the next in the list.
  next?: { slug: string; label: string };
  // A prompt under the hero to scroll on into the story.
  scrollCue?: string;
  blocks: Block[];
};

// An image from the old portfolio export (images/<ref>), served from
// public/work/old/<ref>.
const shot = (ref: string, alt: string, caption?: string): Img => {
  const [w, h] = oldDims[ref];
  return { src: `/work/old/${ref}`, w, h, alt, caption, ref };
};

// Where every Legalesign case study sits, in the hero's facts.
const legalesignContext = (forWhom: string, role: string) => [
  { label: "Company", value: "Legalesign, in-house" },
  { label: "Product", value: "B2B e-signature product" },
  { label: "For", value: forWhom },
  { label: "My role", value: role },
];

const dashboard: Img = {
  src: "/work/dashboard.png",
  w: 1452,
  h: 1073,
  alt: "The Console dashboard: quick actions, document overview, ready-to-send templates and team activity",
};

const editorHero: Img = {
  src: "/work/heroes/editor.webp",
  w: 2400,
  h: 1688,
  alt: "The Template Editor in a browser: participant fields on the left and a signature field being placed on a tenancy agreement",
};

// The blue behind the Quick Send hero, for the sections that echo it.
const quickSendBlue = "linear-gradient(135deg, #5285ff, #4556f6)";

const quickSendHero: Img = {
  src: "/work/heroes/quick-send.webp",
  w: 2400,
  h: 1688,
  alt: "Quick Send in a browser: colour-coded recipients on the left, their signature fields on the document and a countdown to cancel the send",
};

// A short loop of one step of the Quick Send recording.
const qsStep = (name: string, label: string) => ({
  src: `/work/quick-send/steps/${name}.mp4`,
  poster: `/work/quick-send/steps/${name}-poster.jpg`,
  label,
});

export const projects: Project[] = [
  {
    // Console is told across the Legalesign pages (src/process.ts), so its
    // card leads there instead of to a page of its own.
    slug: "console",
    era: "legalesign",
    title: "Rebuilding Legalesign",
    summary: "The whole product rebuilt as Console, on a design system I built from scratch.",
    year: "2021 – Present",
    role: "Design lead, product owner",
    tags: ["Product design", "Design systems", "Product ownership"],
    cover: dashboard,
    featured: true,
    href: "/work/legalesign",
    intro: "",
    blocks: [],
  },
  {
    slug: "quick-send",
    era: "legalesign",
    title: "Quick Send",
    summary: "A streamlined first send that cut trial bounce and churn.",
    role: "Designer, product owner",
    tags: ["Onboarding", "Conversion", "UX"],
    contribution: ["Product ownership", "Research", "UX/UI design", "Prototyping", "User testing", "Dev handoff"],
    cover: quickSendHero,
    hero: quickSendHero,
    intro:
      "A send flow built around trial users, with an editor customers can embed in their own products at its centre.",
    statement:
      "I designed one focused flow that cuts trial bounce and gets new users sending, first time.",
    // The statement says it all; the story below fills in the rest.
    roleStatement: "",
    actions: [{ label: "Try the final prototype", href: "https://peach-comma-28912996.figma.site", icon: "CursorArrowRays", play: true, card: true }],
    heroLoop: {
      src: "/work/quick-send/hero-loop.mp4",
      poster: "/work/quick-send/hero-loop-poster.jpg",
      label: "Quick Send sped up, from the dashboard through upload, recipients and fields to sent",
    },
    context: [
      { label: "Company", value: "Legalesign, in-house" },
      { label: "Product", value: "B2B e-signature product" },
      { label: "For", value: "Trial and new users" },
      { label: "My role", value: "Designer, product owner" },
    ],
    next: { slug: "template-editor", label: "See how Compose powers the Template Editor too." },
    blocks: [
      {
        type: "voices",
        id: "problem",
        eyebrow: "The problem",
        heading: "Sending a document was harder than it should be.",
        body: "Most trials ended before a first send. Feedback, interviews, user testing and session recordings all pointed at the send flow, and at trial and new users. This is what they told us.",
        // Paraphrased from what users said again and again.
        items: [
          { quote: "I just wanted to send a document.", need: "One flow from upload to Send, with a clear start and end." },
          { quote: "Where do I even start sending?", need: "Send to start the flow, not lead to a dead end until they'd made a template." },
          { quote: "Why do I have to make a template first?", need: "To send without one, then reuse the document or people next time." },
          { quote: "Where did my document go after I uploaded it?", need: "A clear next step after upload, straight into the send flow." },
          { quote: "There's too much going on. Too many options.", need: "Only what the step they're on needs, with everything else a click away." },
          { quote: "I just need to get this signed quickly.", need: "The shortest path from upload to Send, with nothing in the way." },
          { quote: "It's a one-off. I don't need it saved.", need: "The document deleted after sending, so nothing private is kept to go to the wrong person later." },
          { quote: "I don't want my team using or editing my templates.", need: "One-off sends kept out of the shared library, so the team's templates stay the right ones." },
        ],
        deeper: {
          label: "the research",
          heading: "The research behind it.",
          body: "How I found the problem through feedback, interviews, user testing and session recordings, what was wrong with the old flow, and the assumptions that turned out wrong.",
          blocks: [
            {
              type: "points",
              eyebrow: "My approach",
              heading: "How I led the research.",
              items: [
                { icon: "InboxStack", title: "Feedback into themes", body: "In-app feedback landed in a Jira channel. I grouped it into shared pain points." },
                { icon: "ChatBubbleLeftRight", title: "Interviews and testing with real users", body: "Video calls with trial and new users, set up by their account managers, and every version tested with them. One of the main sources of feedback." },
                { icon: "VideoCamera", title: "Watching real sessions", body: "I clipped Hotjar recordings where people hit dead ends, made U-turns or rage-clicked." },
                { icon: "Flag", title: "Goals before features", body: "Most feedback wasn't about bits of UI. It showed goals going unmet, so I defined those first." },
              ],
            },
            {
              type: "points",
              eyebrow: "What was wrong",
              heading: "Four problems in the old send flow.",
              items: [
                { icon: "DocumentDuplicate", title: "Template first, send second", body: "To send anything, you first had to make a template. Clicking Send led to an empty template picker." },
                { icon: "ArrowsSplit", title: "No clear start or end", body: "Sending was four steps in four places: upload, find it, make a template, then send." },
                { icon: "Squares2X2", title: "Information overload, which caused decision paralysis", body: "Two sidebars showed every recipient, field and control at the same time." },
                { icon: "AdjustmentsHorizontal", title: "Power features for everyone", body: "Everything power users needed sat in front of people who just wanted to send." },
              ],
            },
            {
              type: "insights",
              eyebrow: "Dead ends",
              heading: "What we assumed, and what we found.",
              labels: ["We assumed", "We found", "They needed"],
              items: [
                {
                  found: "One-off senders were occasional, low-value users.",
                  so: "Many were lawyers and other professionals: high-value customers our workflow didn't fit.",
                  then: "Software that fits them: send it, then have it done and out of mind.",
                },
                {
                  found: "Quick Send only needed a signature field.",
                  so: "Most people place more than one field. A one-field shortcut just added a step.",
                  then: "Signature, text and date by default, with more in team settings.",
                },
                {
                  found: "People could skip placing fields altogether.",
                  so: "Senders need signers to sign in specific places.",
                  then: "Placing fields made quick, not removed.",
                },
                {
                  found: "A quick send went to one person.",
                  so: "People wanted to send to several at once.",
                  then: "Recipients first, up to 12, each in their own colour.",
                },
              ],
            },
          ],
        },
      },
      {
        type: "brief",
        eyebrow: "The brief",
        surface: quickSendBlue,
        heading: "Get a new user from sign‑up to a sent document in their first session.",
        body: "As the product owner, I gathered the evidence and wrote the brief. Then I switched hats to design it.",
        recreation: "A simplified recreation of the brief. The original stayed with Legalesign.",
        notes: [
          { icon: "QueueList", title: "Insights from every direction", body: "Hotjar recordings, my clips of pain points, user interviews, and what sales and support heard. It all fed the insights, and the insights fed the opportunity." },
          { icon: "UserGroup", title: "Scope, set together", body: "I defined what Quick Send would and wouldn't do with sales, engineering and leadership." },
        ],
        title: "Quick Send",
        meta: [
          { label: "Owner", value: "Euan Robertson, product and design" },
          { label: "For", value: "Trial and new users" },
          { label: "Sits beside", value: "The existing upload, template and send flow" },
        ],
        sections: [
          {
            label: "Background",
            body: "Most trials end before a first send, and feedback, interviews and session recordings all point at the send flow.",
          },
          {
            label: "Who it's for",
            body: "People who want to upload a document and send it for signature, without setting up a template first.",
          },
          { label: "Objective", body: "More trial users sending their first document in their first session." },
          {
            label: "Requirements",
            items: [
              { icon: "HandRaised", title: "No barriers", body: "A first send in the first session, with nothing to set up first." },
              { icon: "ArrowLongRight", title: "One clean flow", body: "Upload, recipients, fields, sent." },
              { icon: "Eye", title: "A clear next step", body: "Nothing left to guess at any point." },
              { icon: "Bolt", title: "Power when needed", body: "The full editor, revealed only on demand." },
            ],
          },
          {
            label: "Out of scope",
            body: "Changing the existing upload, template and send flow. It stays as it is for the people who rely on it.",
          },
          { label: "Success looks like", body: "More trials reaching a first send, and fewer dead ends and U-turns in session recordings." },
        ],
      },
      {
        type: "iterations",
        eyebrow: "25 versions",
        heading: "From Figma screens to prototypes to the final design.",
        body: "Versions 1 to 14 were screens I shared for feedback. From version 15, users tried clickable prototypes. Nothing was built until the design settled. It plays through on its own; drag the bar, use the arrows or swipe to take over.",
        items: quickSendIterations,
        deeper: {
          label: "how I tested",
          heading: "How each version was tested.",
          blocks: [quickSendTesting],
        },
      },
      {
        type: "prototypes",
        eyebrow: "Prototypes",
        heading: "Prototypes close enough to build from.",
        body: "From version 15, users tested high-fidelity prototypes that worked like the real thing. They matched the final design so closely that the developers built from them, alongside the annotated user flows. Front-end developers found them especially useful.",
        note: "Best on a laptop or desktop. They're prototypes, so not every path is wired up.",
        items: quickSendPrototypeCards,
      },
      {
        type: "points",
        eyebrow: "Key decisions",
        heading: "The decisions that shaped it.",
        items: [
          { icon: "Users", loop: "recipients", title: "Recipients before fields", body: "Add people first, and it's obvious who each field is for." },
          { icon: "ViewColumns", loop: "sidebar", title: "One sidebar", body: "Two cluttered sidebars became one, leaving more room for the document and narrow enough to embed." },
          { icon: "ListBullet", loop: "fields", title: "Three fields by default", body: "Signature, text and date, instead of all twelve field types at once. Admins can change the set." },
          { icon: "CursorArrowRays", loop: "panel", title: "A panel that follows you", body: "Select a field and the sidebar becomes its editor, with formatting along the top. Click the page to go back to placing fields." },
          { icon: "Window", loop: "modals", title: "Modals for occasional tasks", body: "Recipients and document options stay out of the way until needed." },
          { icon: "ShieldCheck", loop: "send", title: "A Send you can't hit by accident", body: "Bold, explains what's missing, and counts down before sending." },
          { loop: "again", title: "Send another, without starting over", body: "The same document to new people, or new documents to the same people, straight from the end of a send. A small feature that saved a lot of time." },
        ],
      },
      {
        ...quickSendInProduction,
        id: "up-close",
        eyebrow: "What went live",
        heading: "How it actually turned out.",
        bare: true,
        lifted: true,
        principle: {
          eyebrow: "How I work",
          heading: "The fine details, and the big picture.",
          body: [
            "On their own, the small details of a UI hardly register: how a menu opens, where a field lands, how a countdown feels. Added together, they're why a product feels refined, even when you can't say why. You know it when you use it.",
            "I bring that care to everything I design, like these clips. As the product owner, I also know when to step back to the big picture: the requirements have to be met, and some details wait for a later release. I wear both hats, and I know when each one is needed.",
          ],
          quote: {
            text: "One small thing that you won't see or think about but will hopefully feel.",
            by: "Andreas Eldh at Linear, on the invisible details in its menus",
            url: "https://linear.app/now/invisible-details",
            logo: "linear",
          },
        },
        body: undefined,
        feature: undefined,
        tiles: quickSendInProduction.tiles.filter((t) => t.kind !== "note"),
      },
      {
        type: "flow",
        eyebrow: "Design-to-dev handoff",
        heading: "Every route mapped, and annotated for the build.",
        body: "The full user flow, from the dashboard to sent, with every route and contingency mapped. High fidelity, with annotations on every step, function and feature: how each should behave, its interaction states, and anything that isn't obvious from the screens alone. The developers built from it alongside the prototypes.",
        image: { src: null, w: 54268, h: 4623, alt: "The annotated Quick Send user flow, screen by screen" },
        figma: {
          embed: "https://embed.figma.com/design/908pAUCNH0GwKBsGkxnN5i/Quick-Send-Flow?node-id=0-1&embed-host=share",
          url: "https://www.figma.com/design/908pAUCNH0GwKBsGkxnN5i/Quick-Send-Flow?node-id=0-1",
          preview: "/work/quick-send/flow-preview.webp",
        },
        notes: [
          { icon: "InboxStack", title: "Linked where the devs work", body: "The design file and the flow were linked from every Jira ticket, so the developers always found the right file, in the place they already worked." },
          { icon: "UserGroup", title: "Design and engineering aligned", body: "Regular sessions with the developers settled dependencies and trade-offs early, so we stayed on the same page throughout." },
        ],
      },
      {
        type: "play",
        id: "your-turn",
        eyebrow: "Your turn",
        heading: "Try it yourself.",
        body: "The final prototype, the one the developers built from. Have a play, and send me any feedback.",
        image: quickSendHero,
        play: { url: "https://peach-comma-28912996.figma.site", width: 1440, screen: [398, 359, 1603, 1057] },
        deeper: {
          label: "the production recording",
          heading: "Quick Send in production.",
          body: "The whole flow as it works in production, start to finish, then each step on its own.",
          blocks: [
            {
              type: "video",
              heading: "Upload, add recipients, place fields, send.",
              src: "/work/quick-send/send-flow.mp4",
              poster: "/work/quick-send/send-flow-poster.jpg",
              label: "Screen recording of sending a document with Quick Send, from upload to sent",
            },
            {
              type: "screens",
              eyebrow: "How it works",
              heading: "From the dashboard to sent, in seven steps.",
              items: [
                { title: "Start", body: "Quick Send leads the dashboard. One click starts the flow.", video: qsStep("01-start", "Clicking Quick Send on the dashboard") },
                { title: "Upload", body: "Drop in a document, or several PDFs to merge into one.", video: qsStep("02-upload", "A document uploading, with a progress bar across the top") },
                { title: "Recipients", body: "Add who it's going to, up to 12 people, each in their own colour.", video: qsStep("03-recipients", "Adding recipients in the Recipient Details window") },
                { title: "Fields", body: "Drag each person's fields onto the document. Alerts show what's still missing.", video: qsStep("04-fields", "Dragging a signature field and a date field onto a tenancy agreement") },
                { title: "Send", body: "Send counts down for five seconds, so a mistaken click can be cancelled.", video: qsStep("05-send", "Clicking Send Document, which counts down with a Cancel button") },
                { title: "Sending", body: "See who it went to and where it's up to.", video: qsStep("06-sending", "The Sending screen animating into Example Doc Sent") },
                { title: "What next", body: "Send another with the same document or people, or track it on the dashboard.", video: qsStep("07-track", "Opening Send Another, then Track on Listings, which opens the Sent page") },
              ],
            },
          ],
        },
      },
      {
        type: "outcome",
        eyebrow: "The outcome",
        heading: "What changed, goal by goal.",
        surface: quickSendBlue,
        items: [
          { goal: "The objective", icon: "PaperAirplane", title: "First sends stopped being a problem.", body: "Trial users went from struggling to reach a first send to sending in their first session. Quick Send was the main driver." },
          { goal: "No barriers", icon: "HandRaised", title: "Nothing to set up first.", body: "No template to make, nothing left in the library after sending, and nothing the rest of the team can see." },
          { goal: "One clean flow", icon: "ArrowLongRight", title: "Decluttered, and easier to follow.", body: "Users found it far more intuitive and sent without needing help, so support queries went down." },
          { goal: "Beyond the brief", icon: "UserPlus", title: "Smoother onboarding, cleaner demos.", body: "New users got going faster, and the whole flow, upload to sent, is short enough to show in a sales demo." },
          { goal: "Beyond the brief", icon: "Beaker", title: "A safe test for Compose.", body: "I saw that Quick Send could run on Compose, a mode of the new editor component. Launching it as a beta got the component real feedback before it went into the new template editor, a high-risk part of the app we couldn't afford to break." },
          { goal: "Beyond the brief", icon: "PuzzlePiece", title: "One component, in more places.", body: "The same component now runs the redesigned template editor, and customers embed Compose in their own products." },
        ],
        // Placeholder numbers, to be swapped for the real ones.
        stats: [
          { value: "+42%", label: "more trials sending a document in their first session" },
          { value: "−35%", label: "fewer support queries about sending" },
          { value: "< 5 min", label: "typical time from upload to sent" },
        ],
      },
    ],
  },
  {
    slug: "getting-unstuck",
    era: "legalesign",
    title: "Getting Unstuck",
    summary: "What should happen when a user hits a problem? Fifteen answers, one priority, and the ticket tracking I designed.",
    year: "2025",
    role: "Lead designer, joint product owner",
    tags: ["Discovery", "Product strategy", "Ticket tracking"],
    cover: null,
    intro:
      "Research into what users do when something goes wrong: report it, fix it themselves or work out what to do next. I found fifteen ways to help, turned them into a roadmap, and narrowed it to the ticket tracking I then designed.",
    statement: "What should happen when a user hits a problem?",
    context: legalesignContext("Daily users, team and enterprise admins", "Lead designer, joint product owner"),
    // Told as a double diamond: what was wrong, how wide the research went,
    // how one direction was chosen, and how it was built.
    blocks: caseStudy({
      problem: [
        {
          type: "voices",
          id: "problem",
          eyebrow: "The problem",
          heading: "When users hit a problem, there was no good next step.",
          body: "They couldn't easily report it, fix it themselves or tell what to do next. So support spent its days answering questions people could have answered alone, enterprise customers couldn't see whether we met their SLA, and admins couldn't see what their team was stuck on. There was no obvious fix, so I started with research.",
          // Paraphrased from what the support team heard again and again.
          items: [
            { quote: "I have no idea what I'm doing.", need: "Help they can find inside Console, starting with the most common questions." },
            { quote: "What does this option even mean?", need: "Answers about what a setting does, without leaving the page they're on." },
            { quote: "Something unexpected happened.", need: "A way to report it, with the details support needs captured for them." },
            { quote: "Has my ticket been escalated? When?", need: "Every ticket's status in one place, and a way to raise its priority." },
            { quote: "I'd rather not talk to anyone.", need: "To solve it themselves first, with a person as the last step, not the first." },
            { quote: "I need to see my team's tickets and chase them.", need: "A team view of every ticket, and escalation on someone else's behalf." },
            { quote: "How many tickets, and how fast were they answered?", need: "Ticket counts and response and resolution times for any period, in the product." },
            { quote: "Is Legalesign keeping to our SLA?", need: "Those times set against the SLA agreed for each priority." },
          ],
          deeper: {
            label: "the research",
            heading: "What getting help looked like.",
            body: "From a discovery workshop with the support team and the developers, run with a second designer.",
            blocks: [
            {
              type: "journey-map",
              eyebrow: "Journey map",
              heading: "What happened when something went wrong.",
              stages: ["Gets stuck", "Looks for help", "Asks support", "Waits", "Gets an answer"],
              body: "The road from getting stuck to getting an answer. Every stage either left the product or left the user waiting.",
              lanes: [
                {
                  label: "Touchpoint",
                  cells: ["Console", "Help articles on the website", "Email, phone or chat", "Their inbox", "A link from support"],
                },
                {
                  label: "Doing",
                  cells: [
                    "Hits an option they don't understand, or an error.",
                    "Searches the website's help articles, outside Console.",
                    "Emails, calls or starts a chat, and explains the problem.",
                    "Checks their inbox, then chases.",
                    "Follows a link to an article support picked for them.",
                  ],
                },
                {
                  label: "Thinking",
                  cells: [
                    "I have no idea what I'm doing.",
                    "There's so much here, and none of it is about my problem.",
                    "I'd rather not have to talk to someone.",
                    "Has anyone picked this up? Is it escalated?",
                    "Was that the fix, or will it happen again?",
                  ],
                },
                {
                  label: "Pain point",
                  cells: [
                    "Nothing in the product explains what went wrong.",
                    "Leaving the app breaks their flow, and the articles have no search.",
                    "Support has to ask questions to understand the problem.",
                    "No way to see a ticket's status or raise its priority.",
                    "Admins have no record to report on, so stats are made by hand.",
                  ],
                },
              ],
              draft: true,
            },
              {
                type: "insights",
                eyebrow: "What we found",
                heading: "How support worked, and what it meant for the design.",
                items: [
                  {
                    found: "To understand a case, support pieced it together from the CRM, Slack and past tickets.",
                    so: "Capture the user, team, organisation, page, time and error codes with every ticket.",
                  },
                  {
                    found: "Support thought about 30% of questions could have been answered by documentation alone.",
                    so: "Put help before the ticket form, starting with the most common questions.",
                  },
                  {
                    found: "Some customers will do anything to avoid talking to a person, and nobody wanted a chatbot.",
                    so: "Make self-service and a clear form the way in, with no bot in between.",
                  },
                  {
                    found: "Enterprise support stats were made by hand, whenever a customer asked.",
                    so: "Build ticket counts and response and resolution times into the product.",
                  },
                  {
                    found: "Users wanted to know whether their issue had been escalated, and when.",
                    so: "Show each ticket's status and priority, and let people raise it.",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "double-diamond",
          eyebrow: "My approach",
          heading: "Understand the problem first, then design the solution.",
          stages: [
            { name: "Discover", count: "15 directions", body: "Everything a user might do when they hit a problem, and every way we might help, in four clusters." },
            { name: "Define", count: "1 problem to solve", body: "Every direction weighed against goals I set with the CEO and leadership. Ticket tracking won." },
            { name: "Develop", count: "Stories and flows", body: "Ticket tracking mapped story by story for three personas, then designed." },
            { name: "Deliver", count: "An MVP", body: "Scoped down to what mattered most, and released." },
          ],
        },
        {
          type: "persona-cards",
          eyebrow: "Discover",
          heading: "Six people who need help in different ways.",
          body: "From the daily user to procurement. Three of them would become the MVP.",
          items: supportPersonas,
        },
        {
          type: "themes",
          eyebrow: "Directions",
          heading: "Fifteen ways we could help, in four clusters.",
          body: "I cast the net wide on purpose, for anything that might solve one of the problems, or several.",
          items: supportThemes,
          statuses: false,
        },
        {
          type: "shortlist",
          eyebrow: "Define",
          heading: "Four made the shortlist. Ticket tracking went first.",
          body: "Taking on product ownership, I worked with the CEO and leadership to set the business's objectives and weight each out of 10, then scored every direction against them.",
          items: supportShortlist,
          call: "The help centre scored highest overall, but ticket tracking met all three of the goals leadership put first: enterprise KPIs, the SLA and UK enterprise sales. So it went first, and the help centre was planned for later on the roadmap.",
          deeper: {
            label: "the scoring",
            heading: "How the four were scored.",
            body: "Every objective, its weight out of 10, and which directions met it. The three top priorities are marked.",
            blocks: [
              {
                type: "objectives",
                heading: "Four directions against 23 objectives.",
                ...supportObjectives,
              },
              {
                type: "priorities",
                heading: "All fifteen, in the order of execution that became the roadmap.",
                items: supportPriorities,
                value: { label: "Objectives met", max: 15 },
                effort: { label: "Effort, out of 10", max: 10 },
              },
            ],
          },
        },
        {
          type: "points",
          eyebrow: "The roadmap",
          heading: "One plan for every department.",
          items: [
            { icon: "NumberedList", title: "An order of execution", body: "All fifteen directions ranked by value and effort, so the quick wins went first." },
            { icon: "ViewColumns", title: "A roadmap across departments", body: "Design, development, support and marketing, each with their part, sprint by sprint." },
            { icon: "ArrowsSplit", title: "A place for every direction", body: "Ticket tracking first, the help centre later on the roadmap, error messages with the developers, and tooltips added every sprint." },
          ],
        },
      ],
      brief: {
        type: "brief",
        eyebrow: "The brief",
        heading: "Let customers get help and track it inside Console, and give enterprise admins the numbers.",
        body: "With ticket tracking chosen, I wrote its brief as product owner, then picked up the design.",
        recreation: "A simplified recreation of the brief. The original stayed with Legalesign.",
        title: "Ticket Tracking MVP",
        meta: [
          { label: "Owner", value: "Euan Robertson, design and product" },
          { label: "For", value: "Daily users, team admins and enterprise admins" },
          { label: "Built as", value: "A standalone support microsite" },
        ],
        sections: [
          { label: "Objective", body: "Help, tickets and support stats in Console, so customers can see where their issue is and admins can report on it." },
          {
            label: "Requirements",
            items: [
              { icon: "MagnifyingGlass", title: "Help first", body: "The most common questions, search and the onboarding video." },
              { icon: "PencilSquare", title: "Tickets with context", body: "Title, description and priority, with the details support needs captured." },
              { icon: "Eye", title: "Status at a glance", body: "Every ticket's status, and updates by email and in the app." },
              { icon: "HandRaised", title: "Escalation", body: "Raise a ticket's priority, for yourself or for your team." },
              { icon: "ListBullet", title: "Support stats", body: "Ticket counts and response and resolution times, by team, for any period." },
              { icon: "ShieldCheck", title: "The right people only", body: "Team and organisation views for admins with permission, exportable for audits." },
            ],
          },
          {
            label: "Out of scope",
            body: "Custom dashboards, automated escalation rules, Slack alerts, chatbots and contextual tooltips, until the MVP has been used.",
          },
          { label: "Success looks like", body: "Enterprise stats no longer made by hand, and fewer follow-ups asking where a ticket has got to." },
        ],
      },
      versions: [
        {
          type: "story-map",
          eyebrow: "Develop",
          heading: "Every story mapped, then cut down for the MVP.",
          body: "A map for each of the three personas ticket tracking served. I mapped the whole picture first, then sorted every task and story into must, should, could and won't have. Must have became the MVP. The rest was scoped for later versions, ready to build if customers asked for it.",
          maps: supportStoryMaps,
        },
        {
          type: "user-stories",
          eyebrow: "Product owner",
          heading: "From user stories to sprint tickets.",
          body: "I wrote the user stories for each persona and grouped them by feature, then marked the ones the MVP needed. As product owner I turned those into the Jira tickets the developers built from, and as the designer they were my list of what every screen had to do.",
          items: supportUserStories,
        },
        todo("versions"),
      ],
      outcome: [
        {
          type: "outcome",
          eyebrow: "The outcome",
          heading: "Ticket tracking shipped, and the research set the roadmap.",
          items: [
            { goal: "Designed and led by me", icon: "QueueList", title: "Ticket tracking", body: "The MVP shipped: customers raise tickets, follow their status and escalate them, and admins see their team's. It did the job, so the later versions stayed in the backlog, scoped and ready." },
            { goal: "My recommendation, built later on the roadmap", icon: "MagnifyingGlass", title: "A help centre", body: "One place for help that used to be scattered, now live." },
            { goal: "Started here, added every sprint", icon: "CursorArrowRays", title: "Tooltips and guided tours", body: "Help where people need it, across the product." },
            { goal: "From the feedback theme", icon: "PaperAirplane", title: "Bug reports and feature requests", body: "Sent from inside the product, straight to support and the team's Jira channel." },
          ],
          todo: "Numbers to add: ticket volume, response and resolution times, or how many questions the help centre now answers.",
        },
        {
          type: "text",
          eyebrow: "What I learned",
          heading: "Put the priorities in the numbers.",
          body: [
            "The scoring put the help centre first, and leadership's priorities put ticket tracking first. The call was right, but the numbers didn't show it. Next time I'd weight the business's top goals so the score and the decision agree.",
          ],
        },
      ],
    }),
  },
  {
    // Told as a skill piece about prototyping for testing, with the editor
    // itself as the example.
    slug: "template-editor",
    era: "legalesign",
    title: "Prototyping for Testing",
    summary: "A prototype that ran its own user tests: a guided tour, A/B switches and feedback, all in one link.",
    role: "Design lead, product owner",
    tags: ["Prototyping", "User testing", "A/B testing"],
    contribution: ["Prototyping", "Test design", "A/B testing", "UX/UI design", "Dev handoff"],
    cover: editorHero,
    hero: editorHero,
    featured: true,
    intro:
      "The Template Editor, where senders place fields on a document and assign them to recipients, rebuilt with a prototype that testers could run on their own from one link.",
    statement: "I built a prototype that ran its own user tests, and it led the build.",
    actions: [{ label: "Try the prototype", href: "https://love-model-19724475.figma.site/", icon: "CursorArrowRays", play: true }],
    // The hero uses the same browser frame as Quick Send's.
    play: { url: "https://love-model-19724475.figma.site/", width: 1440, screen: [398, 359, 1603, 1057] },
    context: legalesignContext("Senders preparing documents", "Design lead, product owner"),
    blocks: [
      slot(
        "The challenge",
        "A full rebuild of the editor had to be tested before any of it was built.",
        "In two or three lines: the editor had to do everything the old ones did, so the risk was in the detail. Why a static file or a moderated session wasn't enough, and why the prototype had to stand on its own.",
      ),
      {
        type: "video",
        id: "built-to-test-itself",
        eyebrow: "Built to test itself",
        heading: "Testers ran it alone, from one link.",
        body: "The prototype opened on its own introduction: what the editor is for, the three things to look at, and a written testing script. Start Testing docked a checklist beside the editor, so nobody needed me in the room.",
        src: "/work/template-editor/intro.mp4",
        poster: "/work/template-editor/intro-poster.jpg",
        label: "The prototype's introduction modal, with tabs for the introduction, testing script, feedback and feature flags, and a Start Testing button",
      },
      {
        type: "video",
        id: "the-checklist",
        eyebrow: "The checklist",
        heading: "Goals, not instructions.",
        body: "23 tasks in five groups, from getting oriented to validating a finished document. Each one says what to try, such as making the document bigger, not where to click, so we saw whether people found it themselves. A note made clear the checklist wasn't part of the product.",
        src: "/work/template-editor/tour.mp4",
        poster: "/work/template-editor/tour-poster.jpg",
        label: "The test checklist docked beside the editor, with tasks ticked off as they're completed",
      },
      {
        type: "video",
        id: "a-b-inside-the-prototype",
        eyebrow: "A/B inside the prototype",
        heading: "Switch a feature, then say which is better.",
        body: "Three feature flags let testers flip between Version A and Version B on the same document: where the participant picker sits, whether a newly placed field is selected straight away, and whether the page glows in the selected participant's colour.",
        src: "/work/template-editor/ab-toggle.mp4",
        poster: "/work/template-editor/ab-toggle-poster.jpg",
        label: "Feature flags switched to Version B: the participant picker floats above the document and the page glows in the participant's colour, then switched back to Version A",
      },
      {
        type: "video",
        id: "feedback-without-taking-data",
        eyebrow: "Feedback without taking data",
        heading: "So realistic that testers wouldn't use real documents.",
        body: "So it came filled with a mock tenancy agreement. The nine-question survey lives inside the prototype, and Download Results saves the answers as a PDF in the browser. Nothing was sent anywhere: testers chose to send the file back to us.",
        src: "/work/template-editor/feedback.mp4",
        poster: "/work/template-editor/feedback-poster.jpg",
        label: "The feedback survey being filled in, ending on the Download Results button",
      },
      {
        type: "prototype",
        eyebrow: "Try it",
        url: "https://love-model-19724475.figma.site/",
        heading: "Run the test yourself.",
        body: "The same prototype testers used, with the tour, the switches and the survey built in.",
        width: 1440,
        height: 900,
      },
      slot(
        "What it changed",
        "The prototype led the build.",
        "Two or three things the testing changed, and how developers worked from the prototype as the spec, as with Quick Send.",
      ),
      slot(
        "The editor",
        "The UI rework, in short.",
        "One paragraph and a before and after of the editor itself. The rebuild matched every feature of the old editors, so this stays short and points to the Rebuilding Legalesign page.",
      ),
    ],
  },
  {
    slug: "mobile-signing",
    era: "legalesign",
    title: "Mobile Signing",
    summary: "Signing on a phone, rebuilt mobile-first and designed to AAA accessibility.",
    role: "Design lead",
    tags: ["Mobile UI", "Prototyping", "Accessibility"],
    cover: null,
    intro:
      "The signing experience rebuilt for phones. The features and users were already defined, so this was a UI rework, tested through an interactive prototype.",
    statement: "Signing on a phone, rebuilt mobile-first.",
    context: legalesignContext("Recipients signing on their phones", "Design lead"),
    blocks: [
      slot(
        "The problem",
        "Signing on a phone was an afterthought.",
        "Two lines: what was wrong on mobile, and why AAA accessibility mattered for these users.",
      ),
      slot(
        "Key screens",
        "The flow, screen by screen.",
        "Four to six key screens in phone frames, each with one line on the decision behind it.",
      ),
      slot(
        "Try it",
        "The interactive prototype.",
        "The prototype embedded in a phone frame so people can play with it. Add its link and it can use the same prototype block as Quick Send.",
      ),
      slot(
        "Accessibility",
        "Designed to AAA.",
        "Two or three points on what AAA asked of the design: contrast, target sizes, screen readers, focus order.",
      ),
    ],
  },
  {
    // Drafts and Signer Lobby together, as a skill piece about complex rules
    // and flows. Signer Lobby's card leads here.
    slug: "drafts",
    era: "legalesign",
    title: "Untangling Complex Logic",
    summary: "Drafts and Signer Lobby: the rules, states and flows behind two of the most complex parts of Console.",
    role: "Design lead, product owner",
    tags: ["Systems thinking", "Complex flows", "Requirements"],
    cover: { src: "/work/drafts-v2-cover.png", w: 800, h: 566, alt: "Drafts V2 Figma file cover" },
    intro:
      "Two features where the hard part was the logic, not the screens: Drafts, which lets admins pre-fill and lock down sending for their teams, and Signer Lobby, which shows each recipient the right state for their documents.",
    statement: "Making two of Console's most complex features feel simple.",
    context: legalesignContext("Admins, senders and recipients", "Design lead, product owner"),
    blocks: [
      {
        type: "text",
        eyebrow: "The problem",
        heading: "Enterprise teams needed control over how their documents were sent.",
        body: [
          "Customer after customer asked for the same thing: a way to set a send up once and have their team reuse it, exactly as intended, every time. Larger organisations run complex workflows, with several documents, fixed signers, set orders and rules about who can change what, and our send flow couldn't hold any of it.",
          "It was a missing part of the product. Without it we couldn't win or keep the enterprise customers whose workflows depended on it, including some moving to us from other e-signature products. Drafts was about growing what Legalesign could do for them.",
        ],
      },
      {
        type: "points",
        eyebrow: "Drafts",
        heading: "Admins set it up once. Senders just fill it in.",
        items: [
          {
            title: "A saved send",
            body: "An admin saves a draft of how a send should go: the template, how many recipients, each recipient's presets, and the send settings.",
            icon: "AdjustmentsHorizontal",
          },
          {
            title: "Filled in, or left open",
            body: "Any part can be filled in ahead of time or left for the sender, so a draft can be almost ready to go or just a starting point.",
            icon: "PencilSquare",
          },
          {
            title: "Less to fill in",
            body: "Everyday senders pick a draft and complete only what's left, inside the limits the admin set.",
            icon: "PaperAirplane",
          },
          {
            title: "Flexible by design",
            body: "An admin can leave a sender just one thing to fill in, or open up every setting for detailed sends. One feature fits many workflows instead of the one it started with.",
            icon: "Squares2X2",
          },
        ],
      },
      {
        type: "brief",
        id: "drafts-brief",
        eyebrow: "The brief",
        heading: "Flexible but controlled. Powerful but safe.",
        body: "I wrote the brief as product owner: a modular way to set up a send, built once by an admin and reused by everyone else, replacing the old one-way template, send and draft flow.",
        recreation: "A simplified recreation of the brief I wrote. The original stayed with Legalesign.",
        title: "Modular send configuration",
        meta: [
          { label: "Owner", value: "Euan Robertson, design and product" },
          { label: "For", value: "Enterprise admins and everyday senders" },
          { label: "Replaces", value: "The linear template, send and draft flow" },
        ],
        sections: [
          {
            label: "Background",
            body: "Customers kept asking for a send they could set up once and reuse across their team without mistakes. Enterprise teams with complex workflows needed it to meet their own requirements, and without it they couldn't choose us. Our flow ran one way, from template to send to draft, and couldn't hold a send that was partly set up.",
          },
          {
            label: "Objective",
            body: "Let admins set up any send, from one document to a batch, part by part, save it and share it with their team. Let senders finish what's left and send it, without ever changing the saved draft.",
          },
          {
            label: "Who it's for",
            items: [
              { icon: "AdjustmentsHorizontal", title: "Admins and draft owners", body: "Build the draft in editing mode: the documents, presets, recipients and options. Decide what's filled in and what's left open." },
              { icon: "PaperAirplane", title: "Everyday senders", body: "Use the draft in sending mode. Fill in only what's left, change what they need for this send, and send." },
            ],
          },
          {
            label: "Scope",
            items: [
              { icon: "QueueList", title: "Single, multi-document and batch", body: "Documents can be reordered, and a batch has its own name and Enforce Ordering." },
              { icon: "Squares2X2", title: "Seven sections per document", body: "Name, file, template, field content, recipient details, recipient options and document options, each prepared on its own." },
              { icon: "UserGroup", title: "Linked fields and recipients", body: "Fill a field or a recipient once across every document, linked by type, label, order or description." },
              { icon: "ListBullet", title: "Required actions", body: "One list of everything left, by document, section and issue." },
              { icon: "DocumentDuplicate", title: "Save, Save a copy, Reset", body: "Save once something has changed, keep a copy as a new base draft, or reset to the last save or the draft base." },
              { icon: "Users", title: "Shared with the team", body: "Drafts live in the team's library under a name that says what they're for." },
            ],
          },
          {
            label: "Principles",
            items: [
              { icon: "Squares2X2", title: "A control tower", body: "One overview shows every part of the send at a glance." },
              { icon: "PencilSquare", title: "Focused workspaces", body: "Each part is edited on its own page." },
              { icon: "Eye", title: "Always visible", body: "Every part shows if it's ready, and a disabled Send says why." },
              { icon: "ShieldCheck", title: "Non-destructive", body: "Sending never changes the saved draft, and nothing is lost without a warning." },
              { icon: "ArrowPath", title: "No silent cascades", body: "When one part breaks another, the user is told and shown the fix." },
              { icon: "AdjustmentsHorizontal", title: "Robust, not playful", body: "An enterprise feature that should feel solid." },
            ],
          },
          {
            label: "Rules",
            body: "Send is enabled only in sending mode, and only when every document is ready. A draft always has a file. Changing the template, file or participants can invalidate fields and recipients; the draft says so, offers a force update, and marks the section as needing preparation. Signers need a signature field; approvers don't.",
          },
          {
            label: "Edge cases",
            items: [
              { icon: "DocumentText", title: "A smaller file", body: "Fields on missing pages are lost, with a warning first." },
              { icon: "ArrowPath", title: "A changed or deleted template", body: "Sync the fields and recipients, or replace or remove the document." },
              { icon: "ArrowsSplit", title: "Switching modes", body: "Bring unsaved changes across or discard them; a swapped template stays behind." },
              { icon: "UserPlus", title: "Skipped or undecided recipients", body: "Never skip everyone; let the previous recipient decide who's next." },
            ],
          },
          {
            label: "Out of scope",
            body: "Locking individual sections, descriptions and labels on drafts, and choosing templates while creating a draft, until the MVP has been used.",
          },
          { label: "Success looks like", body: "Flexible but controlled. Powerful but safe. Modular but logically consistent." },
        ],
      },
      {
        type: "untangle",
        id: "drafts-tangle",
        eyebrow: "The tangle",
        heading: "Dozens of rules, and almost every one touches another.",
        body: "Swap a template and the fields stop matching. Skip a recipient and the signing order changes. Link a recipient and every document follows. Before designing anything, I mapped every rule, every dependency and everything that could stop a send, then gave each one a single home.",
        stats: [
          { value: "2", label: "modes: editing the draft, or sending it" },
          { value: "3", label: "kinds of send: single, multi-document, batch" },
          { value: "7", label: "sections to prepare in every document" },
          { value: "5", label: "things that can stop a send" },
        ],
        before: "Every rule touches another.",
        after: "So each one got a single home.",
        groups: [
          { name: "Names and batch", items: ["Draft name", "Rename per send", "Batch name", "Reorder documents", "Enforce Ordering"] },
          { name: "Underlying file", items: ["Swap the file", "Page count", "Rejected upload", "Placeholder file"] },
          { name: "Template", items: ["Swap template", "Template deleted", "Template changed", "Add participants", "Reorder participants", "Signature required"] },
          { name: "Field content", items: ["Linked fields", "Field labels", "Field types", "Required sender fields", "Fields mismatch"] },
          { name: "Recipient details", items: ["Linked recipients", "Participant mismatch", "Skip recipient", "Previous decides", "Time zones"] },
          { name: "Recipient options", items: ["Email message", "Reminders", "Attachments", "Expiry"] },
          { name: "Document options", items: ["Sequential signing", "Permissions", "Password", "CC"] },
          { name: "The whole send", items: ["Send", "Switch modes", "Remove document", "Reset draft", "Save over", "Save a copy"] },
        ],
        links: [
          ["Swap template", "Fields mismatch"],
          ["Swap template", "Participant mismatch"],
          ["Add participants", "Participant mismatch"],
          ["Add participants", "Required sender fields"],
          ["Template changed", "Fields mismatch"],
          ["Template deleted", "Swap template"],
          ["Swap the file", "Page count"],
          ["Page count", "Linked fields"],
          ["Rejected upload", "Swap the file"],
          ["Placeholder file", "Swap the file"],
          ["Field labels", "Linked fields"],
          ["Field types", "Linked fields"],
          ["Required sender fields", "Linked fields"],
          ["Participant mismatch", "Linked recipients"],
          ["Linked recipients", "Skip recipient"],
          ["Skip recipient", "Previous decides"],
          ["Previous decides", "Sequential signing"],
          ["Sequential signing", "Enforce Ordering"],
          ["Enforce Ordering", "Batch name"],
          ["Reminders", "Expiry"],
          ["Skip recipient", "Sequential signing"],
          ["Switch modes", "Swap template"],
          ["Switch modes", "Send"],
          ["Send", "Required sender fields"],
          ["Send", "Template deleted"],
          ["Send", "Rejected upload"],
          ["Save over", "Save a copy"],
          ["Switch modes", "Fields mismatch"],
          ["Add participants", "Signature required"],
          ["Reorder participants", "Linked recipients"],
          ["Reorder participants", "Participant mismatch"],
        ],
        deeper: {
          label: "See every rule and state",
          heading: "The full map: levels, modes, states and the rules behind them.",
          body: "Reconstructed from the final MVP file and the rules behind it.",
          blocks: [
          {
            type: "logic-map",
            id: "drafts-architecture",
            eyebrow: "How it fits together",
            heading: "Three levels, two modes, and always a clear way back.",
            body: "Before any screen, I placed every function somewhere. A draft holds documents, a document holds sections, and anything fiddly opens as a focused task. Who you are decides what a change does.",
            modes: [
              {
                label: "Editing mode",
                body: "The draft's owner, an admin or anyone allowed to make drafts. There's no Send here: Save overwrites the draft the whole team sees, and Save a copy keeps the original.",
              },
              {
                label: "Sending mode",
                body: "Anyone using a saved draft, even their own. Changes apply to this one send and never touch the base draft. Send stays disabled until every required action is done.",
              },
            ],
            levels: [
              {
                name: "Create the draft",
                note: "Pick templates, then decide how they travel together.",
                items: [
                  { label: "Select templates", opens: "One document, or several" },
                  { label: "Draft name", opens: "What the team sees in their library" },
                  { label: "Share with team", opens: "Every team member can use it" },
                  { label: "Reorder documents", opens: "The order they're sent in" },
                  { label: "Send as a batch", opens: "Batch name and Enforce Ordering" },
                ],
              },
              {
                name: "Send or batch overview",
                note: "The whole send at a glance, and what each document still needs.",
                items: [
                  { label: "Documents", opens: "Each marked Prepare or Ready" },
                  { label: "Required actions", opens: "Everything left, document by document" },
                  { label: "Prepare a document", opens: "Document overview" },
                  { label: "Send", opens: "Sending mode, once nothing blocks it" },
              { label: "Save or Save a copy", opens: "Editing mode, once something has changed" },
                ],
              },
              {
                name: "Document overview",
                note: "One document, prepared section by section, in a fixed order.",
                items: [
                  { label: "Document name", opens: "Rename this document" },
                  { label: "Underlying file", opens: "Swap the PDF, keep the fields" },
                  { label: "Template preparation", opens: "Edit fields and participants, or swap the template" },
                  { label: "Field content", opens: "Fill sender fields, manage linked fields" },
                  { label: "Recipient details", opens: "Add people, manage linked recipients" },
                  { label: "Recipient options", opens: "Message, reminders, attachments, expiry" },
                  { label: "Document options", opens: "Access control and signing order" },
                ],
              },
            ],
            out: [
              { label: "Save", body: "Back to the overview, with the document marked Ready. In editing mode this updates the draft for the whole team." },
              { label: "Reset to last save", body: "Undo what's changed since the last save, and nothing more." },
              { label: "Reset to draft base", body: "Go back to the saved draft. Everything prepared for this send is lost, so it asks first." },
              { label: "Exit the draft", body: "Leave without sending. Unsaved changes get a warning, never a silent loss." },
            ],
            note: "Reconstructed from the final MVP file to show how the logic fits together.",
          },
          {
            type: "state-matrix",
            id: "drafts-states",
            eyebrow: "Every state",
            heading: "Each part of a send, and everything that can happen to it.",
            body: "Reading across a row shows one part's whole life, from how the draft's owner sets it up to what a sender can change. Reading down the last two columns shows everything that needs fixing or stops a send, so no edge case is left to the build.",
            columns: [
              { name: "Starts as" },
              { name: "Editing mode" },
              { name: "Sending mode" },
              { name: "Needs attention", tone: "warn" },
              { name: "Blocks the send", tone: "block" },
            ],
            rows: [
              {
                name: "Names",
                cells: ["The template's name, for one document", "Name the draft for the team library, and the batch for the sent list", "Rename any document for this send", null, null],
              },
              {
                name: "Batch",
                cells: ["Documents in the order selected", "Reorder them, name the batch, turn on Enforce Ordering", "Reorder them for this send only", null, null],
              },
              {
                name: "Underlying file",
                cells: ["The template's PDF: a draft always has a file", "A placeholder, like a blank page, to swap out every send", "Swap in a file with any number of pages", "Fewer pages: fields on the missing pages are lost. Wrong format, password protected, encrypted or too large: rejected, upload another", "A rejected upload, until another file goes in"],
              },
              {
                name: "Template",
                cells: ["The template selected", "Move fields, add or move participants, or swap the template", "Swap the template for this send only; it stays behind if you switch to editing mode", "Template changed since the draft was saved, or a signer has no signature field", "Template deleted: replace it or remove the document"],
              },
              {
                name: "Sender fields",
                cells: ["Empty", "Pre-fill values, link fields by type or label", "Fill in what's left, or break a link", "Fields mismatch: force update, then prepare again", "A required sender field is empty"],
              },
              {
                name: "Participant fields",
                cells: ["Left for recipients", "Pre-fill what's known", "Pre-fill what's known", null, null],
              },
              {
                name: "Recipient details",
                cells: ["Roles from the template", "Fill in people, link them by order, label or description", "Add people, link or break links", "Participant mismatch: force update and re-enter details", "A recipient with no details, unless skipped or left for the one before to decide"],
              },
              {
                name: "Recipient settings",
                cells: ["Team defaults", "Experience, time zone, link previous recipient, skip", "Change them for this send", "Next recipient left to be decided by the one before", null],
              },
              {
                name: "Recipient options",
                cells: ["Team defaults", "Email message, reminder schedule, attachments, expiry", "Change them for this send", null, null],
              },
              {
                name: "Document options",
                cells: ["Team defaults", "Access control and sequential signing", "Change them for this send", null, null],
              },
              {
                name: "The whole send",
                cells: ["Each document marked Prepare", "Save over the draft or Save a copy, once something has changed; no Send", "Send, once nothing blocks it; changes stay with this send", "Switching modes, removing a document or resetting warns before entered details are lost", "Any document still needs preparing"],
              },
            ],
            note: "Reconstructed from the final MVP file and the rules behind it.",
          },
          {
            type: "callouts",
            id: "drafts-logic",
            eyebrow: "The hard parts",
            heading: "The rules that had to be worked out before anything was drawn.",
            look: "split",
            items: [
              {
                title: "Linked fields",
                body: "A batch might have a completion date on every document. Fields can be linked by type, or by a label set in the template, so a sender fills it in once. Each field type has its own states (a checkbox can be empty, ticked or crossed; a dropdown empty or set), and any one field can break from the link.",
                icon: "PuzzlePiece",
              },
              {
                title: "Linked recipients",
                body: "When the landlord or approver is the same on every document, their details are linked by the order they appear in the template, their label, or their description. Links are made from one place or straight from a recipient's card, and can be broken one at a time.",
                icon: "UserGroup",
              },
              {
                title: "When the template changes",
                body: "Adding a participant or sender field in the template leaves the draft out of step. A banner says the fields or recipients no longer match, the sender forces an update, and the document goes back to needing preparation. Details entered before are lost, so the warning comes first.",
                icon: "ArrowPath",
              },
              {
                title: "Skipping and handing on",
                body: "A recipient with no details blocks the send, with two ways out. Skip them, and it's as if they were never on the document; but never skip them all, so if every recipient after the first is skipped, the first can't be. Or let the previous recipient decide, and the person before them in the signing order adds their details while signing.",
                icon: "ArrowsSplit",
              },
              {
                title: "Switching modes",
                body: "Moving from sending to editing asks whether to bring unsaved changes across or discard them. A template swapped for one send can't follow, so it warns that the original template comes back and the sender fields may need syncing and filling in again.",
                icon: "ArrowsSplit",
              },
              {
                title: "Roles and order in the template",
                body: "A signer must have a signature field and an approver doesn't, so changing someone's role can add a requirement. Reordering participants after recipients are linked means deciding whether links follow the order, the label or the description.",
                icon: "UserPlus",
              },
              {
                title: "Losing work, only on purpose",
                body: "Removing a document, resetting the draft or switching modes all warn first when entered details would be lost. Saving a copy does the opposite: it keeps everything filled in as a new base draft, its own branch to build on.",
                icon: "DocumentDuplicate",
              },
              {
                title: "Two kinds of order",
                body: "Enforce Ordering is a batch setting, and only appears once a send is a batch: everyone finishes one document before the next opens. Sequential signing sets the order recipients sign within a document; with it off, everyone gets it at once. Both had to agree, and they carry through to the Inbox and Signer Lobby.",
                icon: "NumberedList",
              },
            ],
          },
          ],
        },
      },
      {
        type: "callouts",
        id: "drafts-ideation",
        eyebrow: "Ideation",
        heading: "Many ways to configure a send, and one flow that had to hold them all.",
        body: "I started wide. Early ideas tried to fit every kind of send into one place, from a single saved document to a hub that also handled batch and bulk sending.",
        items: [
          {
            title: "A single saved document",
            body: "The first idea treated a draft as one long page: every setting for one document, top to bottom. It was easy to follow, but it couldn't stretch to sends with several documents and recipients.",
            image: { src: "/work/drafts/ideation-saved-document.webp", w: 1516, h: 2840, alt: "Early concept of a saved document page with every setting on one long page", caption: "Ideation: one document, every setting on one page." },
          },
          {
            title: "A hub for everything",
            body: "Next came a tabbed hub that also took in batch and bulk sending. It showed how far the idea could go, and how much it would cost to build. That told me where to cut for the first release.",
            image: { src: "/work/drafts/ideation-hub.webp", w: 1516, h: 1102, alt: "Early concept of a tabbed drafts hub covering batch sending", caption: "Ideation: a tabbed hub that tried to hold every kind of send." },
          },
        ],
      },
      {
        type: "skeleton",
        id: "drafts-skeleton",
        eyebrow: "The skeleton",
        heading: "One frame for every screen, so drilling in never means getting lost.",
        body: "With every rule given a home, the next job was the frame around them. Three levels, each with the same parts in the same places, so a sender always knows how deep they are, what's left, and how to get back.",
        screens: [
          {
            name: "Send overview",
            crumbs: ["Send overview"],
            rows: [
              { label: "Rental Agreement", status: "prepare" },
              { label: "Lease Contract", status: "prepare" },
              { label: "Service Agreement", status: "ready" },
            ],
            panel: true,
            more: "Settings",
            secondary: ["Reset draft", "Exit"],
            primary: "Send",
            next: "Prepare",
            back: "Done",
            marks: { todo: 3, more: 4, rows: 6, panel: 7, actions: 9 },
          },
          {
            name: "Document overview",
            crumbs: ["Send overview", "Rental Agreement"],
            backButton: true,
            banner: "Fields no longer match the template. Force update to sync them.",
            rows: [
              { label: "Document name", status: "ready" },
              { label: "Underlying file", status: "ready" },
              { label: "Template preparation", status: "ready" },
              { label: "Field content", status: "prepare" },
              { label: "Recipient details", status: "prepare" },
              { label: "Recipient options", status: "ready" },
              { label: "Document options", status: "ready" },
            ],
            secondary: ["Reset document"],
            primary: "Done",
            next: "Prepare",
            back: "Done",
            marks: { crumbs: 1, backButton: 2, banner: 5, rows: 8 },
          },
          {
            name: "Recipient details",
            crumbs: ["Send overview", "Rental Agreement", "Recipient details"],
            rows: [{ label: "Recipient 01 · Buyer" }, { label: "Recipient 02 · Buyer" }, { label: "Recipient 03 · Solicitor" }],
            backButton: true,
            more: "Linked recipients",
            secondary: ["Reset", "Cancel"],
            primary: "Done",
            marks: { more: 4, actions: 9 },
          },
        ],
        notes: [
          { title: "Breadcrumbs", body: "Always show how deep you are and the way back out." },
          { title: "A back button", body: "Once you're drilled in, a round back button always sits just before the title." },
          { title: "One to-do list", body: "In the same top-right spot on every screen, listing everything left before sending." },
          { title: "More, beside the title", body: "Anything extra a page can do, like settings or managing links, opens from right of its title." },
          { title: "Banners in one place", body: "Anything you need to know sits under the title, above the work, or inside the card it's about, like a prompt to force update." },
          { title: "A status on every card", body: "Any card with something to do inside says Preparation Required. Otherwise it's Ready." },
          { title: "Peek before opening", body: "A details panel shows what a document already holds." },
          { title: "Seven sections, same order", body: "Every document is prepared the same way, one section at a time." },
          { title: "Actions in fixed places", body: "Reset on the left, Done or Send on the right, on every screen." },
        ],
      },
      {
        type: "callouts",
        id: "drafts-ui",
        eyebrow: "Making it simple",
        heading: "All of that, without the sender ever having to see it.",
        body: "An admin can lock a send down to one field or leave everything open, and the sender still has to find their way through either. So every screen shows just enough to know where to go next, and everything else is a click away.",
        items: [
          {
            title: "Know where to start",
            body: "Every document in the send is a card that says if it needs preparing. Send stays disabled until nothing blocks it, and a guided tour walks first-time senders through.",
            image: { src: "/work/drafts/send-overview-prepare.webp", w: 1516, h: 1162, alt: "Send overview with each document marked Preparation Required and Send disabled", caption: "Each card says what it needs. Send waits until nothing blocks it." },
          },
          {
            title: "Look before you dig in",
            body: "Selecting a document opens a side panel with everything already in it: the template, the file, its fields and who it goes to. Senders can check a document without opening it.",
            image: { src: "/work/drafts/side-panel.webp", w: 1516, h: 1280, alt: "Send overview with a document details panel open on the right", caption: "The details panel: a whole document at a glance." },
          },
          {
            title: "One list of everything left",
            body: "The required actions list sits in the same top-right spot on every page. It goes from documents, to sections, to the exact issue, and each line takes you straight there. When it's empty, the send is ready.",
            image: { src: "/work/drafts/required-actions.webp", w: 1598, h: 605, alt: "Required actions list drilling from documents to sections to issues, ending in All Documents Ready to Send", caption: "Required actions: from three documents, to seven sections, to the one issue, to ready." },
          },
          {
            title: "One section at a time",
            body: "Each document is split into the same seven cards, in the same order. Each card shows a short summary, with Show all for the rest, and its own Prepare button. Once a section is done it needs no more attention, so senders move on to the next one.",
            image: { src: "/work/drafts/section-cards.webp", w: 789, h: 1516, alt: "Document overview with seven section cards, two marked Preparation Required", caption: "Seven sections, each summarised, each prepared on its own." },
          },
          {
            title: "Always a way back",
            body: "Breadcrumbs show how deep you are and where you came from. Back, Reset, Cancel and Done sit in the same place on every page, and Save and Reset only come alive once there's something to save, so drilling in never feels like getting lost.",
            image: { src: "/work/drafts/document-overview.webp", w: 1516, h: 3020, alt: "Document overview with breadcrumbs at the top and Reset and Done at the bottom", caption: "The same frame on every page: breadcrumbs above, actions below." },
          },
          {
            title: "When something breaks, say how to fix it",
            body: "If a template is deleted or changed underneath a draft, a banner says what happened and offers the fix: replace it, remove it, or sync the fields and recipients to match. The affected sections go back to needing preparation.",
            image: { src: "/work/drafts/template-missing.webp", w: 1516, h: 1162, alt: "Send overview with a banner explaining a deleted template and how to resolve it", caption: "A deleted template: what happened, and the two ways to fix it." },
          },
          {
            title: "Type it once",
            body: "When the same person or the same date appears in several documents, linking fills it in everywhere. Any one link can be broken when a document needs something different.",
            image: { src: "/work/drafts/linked-recipients.webp", w: 1516, h: 1102, alt: "Recipient details linked across several documents", caption: "Linked recipient details across documents." },
          },
        ],
      },
      slot(
        "Signer Lobby",
        "Every state, worked out before it was drawn.",
        "The state matrix of configurations and rules (order, approvals, identity checks, multiple documents) and the screen each one leads to.",
        "signer-lobby-states",
      ),
      {
        type: "gallery",
        eyebrow: "The result",
        heading: "Clear progress, secure by default.",
        images: [
          {
            src: "/work/lobby-batch.png",
            w: 1516,
            h: 1100,
            alt: "Signer Lobby batch view",
            caption: "Multi-document, multi-recipient signing sessions with sequential ordering, approvals and clear progress.",
          },
          {
            src: "/work/lobby-verify.png",
            w: 1516,
            h: 1100,
            alt: "Identity verification step",
            caption: "2FA and access checks before signing, designed for government-grade security without the friction.",
          },
        ],
      },
    ],
  },
  {
    slug: "signer-lobby",
    era: "legalesign",
    title: "Signer Lobby",
    summary: "Controlling the signing flow for every recipient of a document.",
    role: "Design lead",
    tags: ["Signing", "Security", "Accessibility"],
    cover: { src: "/work/lobby-batch.png", w: 1516, h: 1100, alt: "The Signer Lobby showing a multi-document signing session" },
    intro:
      "The lobby is where recipients land to sign. It handles multi-document, multi-recipient sessions with sequential ordering, approvals and identity checks, built for government-grade security without the friction.",
    statement: "Controlling the signing flow for every recipient of a document.",
    context: legalesignContext("Recipients signing documents", "Design lead"),
    // Told alongside Drafts, on the complex logic page.
    href: "/work/drafts#signer-lobby-states",
    blocks: caseStudy({
      result: {
        type: "gallery",
        eyebrow: "The result",
        heading: "Clear progress, secure by default.",
        images: [
          {
            src: "/work/lobby-batch.png",
            w: 1516,
            h: 1100,
            alt: "Signer Lobby batch view",
            caption: "Multi-document, multi-recipient signing sessions with sequential ordering, approvals and clear progress.",
          },
          {
            src: "/work/lobby-verify.png",
            w: 1516,
            h: 1100,
            alt: "Identity verification step",
            caption: "2FA and access checks before signing, designed for government-grade security without the friction.",
          },
        ],
      },
    }),
  },
  {
    slug: "rebrand",
    era: "legalesign",
    title: "Legalesign Rebrand",
    summary: "A new brand, from message and tone to logo, illustration and motion.",
    year: "2021",
    role: "Brand designer, workshop lead",
    tags: ["Branding", "Workshops", "Guidelines"],
    cover: { src: "/brand/p8.jpg", w: 1600, h: 1131, alt: "The Legalesign primary logo" },
    featured: true,
    intro:
      "I worked with the founders and the whole company on a complete rebrand. It started with collaborative workshops on message, tone, market and users, and became a new identity, illustration style and guidelines the business still runs on.",
    blocks: [
      {
        type: "points",
        eyebrow: "The approach",
        heading: "Message first, then visuals.",
        items: [
          {
            title: "Workshops",
            body: "A series of collaborative brand workshops with the founders and wider team to define message, tone, market and user alignment, and marketing strategy.",
          },
          {
            title: "Identity",
            body: "A new logo, typography, colour, brand assets and iconography, captured in a clear brand guidelines booklet.",
          },
          {
            title: "Illustration & motion",
            body: "Worked with illustrators to define an illustration style and produce a set of illustrations. Animated the logo and iconography.",
          },
        ],
      },
      { type: "brand" },
      slot(
        "The website",
        "The brand, carried onto the web.",
        "The marketing site designed in Figma and built with external developers on Storyblok, with templates so marketing could run it themselves. A few key pages, and a line on what you'd do differently now.",
        "the-website",
      ),
      slot(
        "More identity work",
        "Logos and identities beyond Legalesign.",
        "A compact grid of other identity work, such as the Tynings logo, each with a one-line caption and a link to its page.",
      ),
    ],
  },
  {
    slug: "website",
    era: "legalesign",
    title: "Legalesign Website",
    summary: "A new customer-facing website that marketing can run themselves.",
    role: "Web designer",
    tags: ["Web", "Figma", "Storyblok"],
    cover: null,
    // Told as part of the rebrand.
    href: "/work/rebrand#the-website",
    intro:
      "A new customer-facing website, designed from scratch in Figma and built with external developers on Storyblok, so the internal marketing team could maintain and update it without a developer.",
    blocks: [
      {
        type: "text",
        heading: "Looking back.",
        body: [
          "This was a few years ago. Today I could design, build and launch the whole site myself with prompt-coding tools, which is exactly how this portfolio was made.",
        ],
      },
    ],
  },
  {
    slug: "spacebuds",
    era: "university",
    title: "SPACEBUDS",
    summary: "A service to re-shape the experience of living with a food allergy.",
    year: "2019",
    role: "Service & product designer",
    tags: ["Service design", "Co-design", "User research"],
    cover: shot("spacebuds/01.jpeg", "The SPACEBUDS app splash screen on a phone"),
    featured: true,
    intro:
      "SPACEBUDS is a service helping people with eating restrictions tackle the social and emotional challenges they face every day. It encourages adventure with food, expanding options in a controlled and safe way, so people with food allergies can have a more positive relationship with food and social life.",
    blocks: [
      {
        type: "text",
        eyebrow: "The problem",
        heading: "Avoidance is the only solution. It shouldn't be.",
        body: [
          "People with food allergies often create a 'safe food' barrier around themselves, based on what they think their allergy restricts them to. They end up avoiding everything they hadn't experienced before that barrier formed. On the rare occasions they go somewhere new, the worry and uncertainty can bring on a panic attack, easily confused with an allergic reaction, which makes the panic worse and creates a new trauma.",
          "From a young age, people with food allergies are taught avoidance: to be vigilant, cautious and to steer clear of anything that might trigger a reaction. Anxiety is instilled as a coping mechanism, the 'just right' amount of it. But it often grows, contributing to stress, OCD, paranoia and social isolation.",
        ],
      },
      {
        type: "gallery",
        eyebrow: "Research & co-design",
        heading: "Designed with the people who live it.",
        images: [
          shot("spacebuds/02.jpg", "User-journey wall of sticky notes", "Mapping how a group decides where to eat: price, time, location, and the conversation around it."),
          shot("spacebuds/03.jpg", "Co-design workshop around a table", "Co-design workshops with people who live with food allergies."),
          shot("spacebuds/04.jpg", "Participants writing on sticky notes", "Participants mapping their own experiences."),
          shot("spacebuds/05.jpg", "Affinity-mapping wall", "Affinity mapping the findings into themes."),
          shot("spacebuds/06.jpg", "Sketching logo shapes", "Early sketches for the rocket mark."),
          shot("spacebuds/07.jpg", "Studio desk with research board", "Research board and shape tests in the studio."),
        ],
      },
      {
        type: "gallery",
        eyebrow: "Synthesis",
        heading: "Understanding the moment of panic.",
        images: [
          shot("spacebuds/08.gif", "Illustration of a panicking girl at a restaurant table", "Something is not right: confusion, fear and panic at the table."),
          shot("spacebuds/09.gif", "Research synthesis map of the food-allergy experience", "The experience mapped from diagnosis through everyday challenges, trust, anxiety and avoidance."),
        ],
      },
      {
        type: "text",
        eyebrow: "The brand",
        heading: "A rocket you can trust.",
        body: [
          "The SPACEBUDS logo is a rocket, a universal symbol of exploration and of pushing the limits of discovery. Food restrictions are a boundary that can be pushed past and explored in a controlled, safe environment. When you see the rocket, you know the establishment cares about you and your food restrictions.",
        ],
      },
      {
        type: "image",
        image: shot("spacebuds/10.jpg", "SPACEBUDS brand board", "We're here to make your taste-buds safe-buds."),
      },
      {
        type: "embed",
        eyebrow: "In their words",
        heading: "No more missing out.",
        body: "Too often people with food allergies miss out on social gatherings, feeling it's safer to avoid the restaurant a group has picked, and not wanting to be a burden by asking to go elsewhere. SPACEBUDS is here to change that.",
        items: [
          {
            url: "https://www-ccv.adobe.io/v1/player/ccv/8kDkft7AhQw/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View",
            title: "SPACEBUDS, narrated by Callum",
            caption: "Narrated by Callum, who has multiple severe food allergies. I worked closely with food allergy sufferers throughout, and this video captures the result of that user-centred approach.",
          },
          { url: "https://player.vimeo.com/video/422412624", title: "SPACEBUDS in use" },
        ],
      },
    ],
  },
  {
    slug: "tacc",
    era: "university",
    title: "tacc",
    summary: "Personalised plans for living a more sustainable life.",
    year: "2021",
    role: "Service & product designer",
    tags: ["Speculative design", "Service design", "Sustainability"],
    cover: shot("tacc/01.gif", "The tacc app and the metal tacctile token"),
    featured: true,
    intro:
      "tacc analyses each user's circumstances and gives them a personalised plan of steps towards a sustainable life. It sets clear goals, shows visually how small sustainable acts add up, and connects people with others doing the same: a global community making change for future generations.",
    blocks: [
      {
        type: "text",
        eyebrow: "The brief",
        heading: "Who gets left behind?",
        body: [
          "Future Experiences looked at sustainable work practice and the changing relationship between the Global North and Global South. My group's theme was Environment.",
          "We imagined a future where cities are surrounded by a 'sustainable belt', an area dedicated to living as sustainably as possible, in symbiosis with nature. From that I saw an unintended consequence: the people who can't uproot their lives to live more sustainably are left behind. tacc is there for them.",
        ],
      },
      { type: "image", image: shot("tacc/02.jpeg", "12-panel storyboard following Sarah", "Sarah wants to be sustainable but can't see where to start. tacc takes her from first steps to becoming a champion of sustainability.") },
      { type: "image", image: shot("tacc/03.jpeg", "Presenting in front of a research wall", "\"Having the option to plan for the future and think outside of your immediate circumstance is a luxury many people don't have.\"") },
      {
        type: "gallery",
        eyebrow: "Research",
        heading: "Expert-led, then made tangible.",
        images: [
          shot("tacc/04.jpg", "Research wall of insight cards", "Insights from visiting experts. No amount of desk research compared to what they shared."),
          shot("tacc/05.jpg", "Team arranging printed cards on a grid", "Sorting insights as a group."),
          shot("tacc/06.jpg", "Dense research wall", "Articles, images and notes from the research."),
          shot("tacc/07.jpg", "Wall of logo and storyboard sketches", "Fingerprint logo explorations and storyboard frames."),
          shot("tacc/08.jpg", "Red dot stickers next to printed cards", "Dot-voting to prioritise ideas."),
          shot("tacc/09.jpg", "Pencil storyboard pinned along a wall", "The first full storyboard."),
        ],
      },
      {
        type: "text",
        eyebrow: "The tacctile",
        heading: "A fingerprint of the environment.",
        body: [
          "The tacctile and the ever-evolving tacc logo represent a fingerprint of the environment at a moment in time. In 2030 they mirror a grid-iron street pattern and an unbalanced spread of resources, reflecting our dependence on industry. The goal is an evenly distributed balance by 2050.",
        ],
      },
      {
        type: "gallery",
        heading: "From 2030 to 2050.",
        images: [
          shot("tacc/10.gif", "tacctile timeline from 2030 to 2050", "The logo evolves from a grid-iron city pattern to a balanced, radial one."),
          shot("tacc/11.gif", "Hand holding the worn metal tacctile", "The worn face of the tacctile shows years of individual contribution to a sustainable future."),
        ],
      },
      {
        type: "text",
        eyebrow: "Who it's for",
        heading: "Small changes, together.",
        body: [
          "tacc encourages small behavioural changes in everyday life. It's for people who want to be more sustainable but feel daunted by what it might take, and it shows them they're part of a greater whole whose combined efforts make a big difference.",
        ],
      },
      { type: "image", image: shot("tacc/12.png", "Personas for Sarah and Anton", "Personas: Sarah, 34, working multiple jobs with little time, and Anton, 27, a business owner who doubts small actions matter.") },
    ],
  },
  {
    slug: "kate-and-sam",
    era: "freelance",
    title: "Kate & Sam Lighting Designers",
    summary: "Branding and publication design for a lighting design studio.",
    year: "2019",
    role: "Brand & publication designer",
    tags: ["Branding", "Web design", "Print"],
    cover: shot("work/03-kate-sam-cover.jpg", "Kate & Sam logo over a glowing light"),
    featured: true,
    intro:
      "Branding and publication design for Kate & Sam, an award-winning lighting design studio: a monogram identity and colourways, website design, stationery and a printed portfolio book.",
    blocks: [
      {
        type: "gallery",
        eyebrow: "Identity",
        heading: "A monogram that holds the light.",
        images: [
          shot("kate-sam-lighting/01.gif", "K&S monogram in a circular text ring", "The K&S monogram."),
          shot("kate-sam-lighting/05.jpg", "Four circular logo colourways", "Colourways: yellow, navy, cobalt and lavender."),
        ],
      },
      {
        type: "gallery",
        eyebrow: "Website",
        heading: "The eye's instinct is to follow light.",
        images: [
          shot("kate-sam-lighting/02.jpg", "Website homepage design", "Homepage: services, approach and a call to action."),
          shot("kate-sam-lighting/03.jpg", "Website projects page", "Projects grid."),
          shot("kate-sam-lighting/04.jpg", "Website project detail page", "Project detail: Langham Chuan Body + Soul Spa."),
        ],
      },
      {
        type: "gallery",
        eyebrow: "Print",
        heading: "A portfolio book to keep.",
        images: [
          shot("kate-sam-lighting/06.jpg", "Stack of navy books with debossed logo", "Navy cloth covers with a debossed monogram."),
          shot("kate-sam-lighting/07.jpg", "Books showing yellow page edges", "Yellow page edges."),
          shot("kate-sam-lighting/08.jpg", "Book with tonal pattern cover", "A tonal monogram pattern cover."),
          shot("kate-sam-lighting/09.jpg", "Debossed book cover", "Debossed cover."),
          shot("kate-sam-lighting/10.jpg", "Fanned stack of books"),
          shot("kate-sam-lighting/11.jpg", "The book on a shelf"),
          shot("kate-sam-lighting/12.png", "Stationery set", "Stationery: folder, business cards, letterhead and envelope."),
          shot("kate-sam-lighting/23.jpg", "Repeating monogram pattern", "The repeating monogram pattern."),
        ],
      },
      {
        type: "gallery",
        eyebrow: "Inside the book",
        heading: "Spreads.",
        images: [
          shot("kate-sam-lighting/14.jpg", "Contents and founders spread", "Contents and founders."),
          shot("kate-sam-lighting/15.jpg", "Pull-quote spread"),
          shot("kate-sam-lighting/16.jpg", "Experience spread"),
          shot("kate-sam-lighting/17.jpg", "Projects index spread", "Projects: Wahaca, Visa Innovation Centre, Harrods Toy Department and Llanelly House."),
          shot("kate-sam-lighting/18.jpg", "Wahaca spread"),
          shot("kate-sam-lighting/19.jpg", "Visa Innovation Centre spread"),
          shot("kate-sam-lighting/20.jpg", "Harrods Toy Department spread"),
          shot("kate-sam-lighting/21.jpg", "Llanelly House spread"),
        ],
      },
      {
        type: "text",
        heading: "See it live.",
        body: ["The studio's site is at kateandsam.co.uk."],
      },
    ],
  },
  {
    slug: "tynings",
    era: "freelance",
    title: "TYNINGS",
    summary: "Logo and brand development for a fish & chip shop.",
    year: "2019",
    role: "Brand designer",
    tags: ["Logo design", "Signage", "Packaging"],
    cover: shot("work/04-tynings-cover.jpg", "TYNINGS fish logo over a misty beach"),
    intro:
      "Logo and brand development for Tynings Fish & Chips, a takeaway: a fish mark and wordmark, carried through signage and packaging.",
    blocks: [
      {
        type: "gallery",
        eyebrow: "The brand",
        heading: "From shopfront to takeaway box.",
        images: [
          shot("tynings/01.png", "Shopfront with the TYNINGS sign", "The shopfront."),
          shot("tynings/02.jpg", "3D fascia sign at sunset"),
          shot("tynings/03.png", "Fish logo on a teal band"),
          shot("tynings/05.png", "Textured teal badge with fish logo"),
          shot("tynings/04.jpg", "Open takeaway box", "Packaging."),
          shot("tynings/06.jpg", "Closed kraft takeaway box"),
          shot("tynings/07.png", "Man by a lake holding the takeaway box"),
        ],
      },
      {
        type: "gallery",
        eyebrow: "Development",
        heading: "Finding the fish.",
        images: [
          shot("tynings/08.png", "Logo development grid", "From geometric forms, through curled fish, to the final low-poly mark."),
          shot("tynings/09.png", "Six logo and wordmark lockups", "Lockup options for the logo and wordmark."),
        ],
      },
      {
        type: "embed",
        eyebrow: "Project presentations",
        heading: "The client presentations.",
        items: [
          { url: "https://indd.adobe.com/embed/aaad59e7-40a9-4c1f-8b86-040e6b362a27?startpage=1&allowFullscreen=true", title: "TYNINGS presentation 1" },
          { url: "https://indd.adobe.com/embed/bc6ba3b8-d1d8-4868-ac7e-34d96e1ed708?startpage=1&allowFullscreen=true", title: "TYNINGS presentation 2" },
          { url: "https://indd.adobe.com/embed/5a3fb3ab-ab45-4c64-9384-9115c3886ae6?startpage=1&allowFullscreen=true", title: "TYNINGS presentation 3" },
        ],
      },
    ],
  },
];

export const liveProjects = projects.filter((p) => !p.comingSoon);
// Projects with a /work/<slug> page of their own.
export const pageProjects = liveProjects.filter((p) => !p.href);
export const getProject = (slug: string) => pageProjects.find((p) => p.slug === slug);
export const projectHref = (p: Project) => p.href ?? `/work/${p.slug}`;
// Where the section nav jumps to for a block: its own id, or one made from
// its eyebrow. Blocks with neither aren't listed.
export const sectionAnchor = (b: Block) => {
  if ("id" in b && b.id) return b.id;
  const label = "eyebrow" in b ? b.eyebrow : undefined;
  return label ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : undefined;
};

// The sections a case study lists in its jump-to nav, in page order.
export const sectionLinks = (p: Project) =>
  p.blocks.flatMap((b) => {
    const label = "eyebrow" in b ? b.eyebrow : undefined;
    const id = sectionAnchor(b);
    return label && id ? [{ id, label }] : [];
  });

export const projectImage = (p: Project) => (p.hero?.src ? p.hero : p.cover?.src ? p.cover : null);
// What the full-screen title card shows when a project opens.
export const cardInfo = (p: Project): CardInfo => {
  const img = projectImage(p);
  const era = eras.find((e) => e.id === p.era);
  return {
    slug: p.slug,
    title: p.title,
    label: [era?.label, p.year].filter(Boolean).join(" · "),
    img: img?.src ? { src: img.src, alt: img.alt } : null,
  };
};
