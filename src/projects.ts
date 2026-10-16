import type { CardInfo } from "./components/ProjectTransition";
// Every project on the site, and what each case study page shows.
// Pages are built from `blocks`, top to bottom. Images live in public/.

import { oldDims } from "./oldImageSizes";
import { quickSendInProduction, quickSendIterations, quickSendTesting } from "./quickSend";

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

// `draft: true` shows the copy as a muted prompt until the real words are in.
export type Block =
  | { type: "text"; eyebrow?: string; heading: string; body: string[]; draft?: boolean }
  | { type: "points"; eyebrow?: string; heading: string; items: { title: string; body: string }[] }
  | { type: "image"; image: Img }
  // A silent screen recording from public/, with a still from it as the poster.
  // `id` lets other parts of the page link to it, as #id.
  | { type: "video"; id?: string; eyebrow?: string; heading: string; body?: string; src: string; poster: string; label: string }
  // Looping clips of the live product in a grid, under one longer recording
  // with controls. See BentoTile.
  | {
      type: "bento";
      id?: string;
      eyebrow?: string;
      heading: string;
      body?: string;
      feature?: { src: string; poster: string; label: string; w: number; h: number; title: string; caption: string };
      tiles: BentoTile[];
    }
  | { type: "gallery"; eyebrow?: string; heading: string; images: Img[] }
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
      url: string;
      heading: string;
      body: string;
      width: number;
      height: number;
    }
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
      items: { name: string; role: string; goals: string; frustrations: string }[];
      draft?: boolean;
    }
  | {
      type: "journey-map";
      eyebrow?: string;
      heading: string;
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
      eyebrow?: string;
      heading: string;
      body?: string;
      items: { title: string; body: string; fix?: string; image?: Img }[];
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
  | { type: "flow"; eyebrow?: string; heading: string; body?: string; image: Img }
  // The ending: big statements of what changed, then any numbers.
  | {
      type: "outcome";
      eyebrow?: string;
      heading: string;
      items: { title: string; body: string }[];
      stats?: { value: string; label: string }[];
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
  // achieved. Projects without a statement show `intro` instead.
  statement?: string;
  roleStatement?: string;
  context?: { label: string; value: string }[];
  impact?: { value: string; label: string }[];
  // Which project to suggest next, and why. Defaults to the next in the list.
  next?: { slug: string; label: string };
  blocks: Block[];
};

const step = (stage: JourneyStep["stage"], title: string, hint: string): JourneyStep => ({
  stage,
  title,
  decision: hint,
  image: null,
  written: false,
});

const journeySteps = (shipped: string) => [
  step("Research", "What we heard", "What the research showed, and what it pointed you towards."),
  step("Ideation", "Early directions", "The directions you explored, and why you dropped the ones you did."),
  step("Iteration", "What testing changed", "What testers struggled with, and the change you made because of it."),
  step("Handoff", "Ready for build", "How the handoff was structured, and anything developers needed to know."),
  step("Shipped", "In production", shipped),
];

// An image from the old portfolio export (images/<ref>), served from
// public/work/old/<ref>.
const shot = (ref: string, alt: string, caption?: string): Img => {
  const [w, h] = oldDims[ref];
  return { src: `/work/old/${ref}`, w, h, alt, caption, ref };
};

const evidenceHint = "Add the evidence: a support-ticket theme, a Hotjar finding or a user quote.";

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
    title: "Console",
    summary: "Five years of features, and how I worked on each stage of them.",
    year: "2021 – Present",
    role: "Design lead, product owner",
    tags: ["Product design", "Research", "Product ownership"],
    cover: dashboard,
    featured: true,
    href: "/work/legalesign",
    intro: "",
    blocks: [],
  },
  {
    slug: "support-hub",
    era: "legalesign",
    title: "Support Hub",
    summary: "One place for customers and the support team to find answers and track tickets.",
    role: "Design lead",
    tags: ["Research", "Service design", "UX"],
    cover: null,
    intro:
      "A customer support and ticketing hub serving both Legalesign users and the internal support team.",
    blocks: [
      { type: "journey", problem: "Customers couldn't find answers on their own, so simple questions turned into support tickets.", evidence: evidenceHint, steps: journeySteps("What shipped, and what changed for customers and the support team.") },
    ],
  },
  {
    slug: "template-editor",
    era: "legalesign",
    title: "Template Editor",
    summary: "Placing and assigning fields, made faster and harder to get wrong.",
    role: "Design lead, product owner",
    tags: ["UX", "Prototyping", "User testing"],
    cover: editorHero,
    hero: editorHero,
    featured: true,
    intro:
      "A redesigned document editing page: the step where senders place fields on a document and assign them to recipients before it goes out for signing.",
    blocks: [
      { type: "journey", problem: "Adding fields to a document before sending was slow and easy to get wrong, so people sent documents that couldn't be completed.", evidence: evidenceHint, steps: journeySteps("What shipped, and what changed for users.") },
      {
        type: "prototype",
        url: "https://love-model-19724475.figma.site/",
        heading: "Try the new editor.",
        body: "The redesigned editing page as a clickable prototype, the kind I put in front of users before a line of production code was written.",
        width: 1440,
        height: 900,
      },
    ],
  },
  {
    slug: "drafts",
    era: "legalesign",
    title: "Drafts",
    summary: "Controlled, pre-filled sending that admins set up for their teams.",
    role: "Design lead, product owner",
    tags: ["Workflow", "Admin tools", "UX"],
    cover: { src: "/work/drafts-v2-cover.png", w: 800, h: 566, alt: "Drafts V2 Figma file cover" },
    intro:
      "A send-flow configurer. Admins set up drafts with sections pre-filled and settings locked, so when everyday users send from them there's less to fill in, in a controlled environment.",
    blocks: [
      { type: "journey", problem: "Admins needed control over what their teams sent, while everyday senders needed less to fill in.", evidence: evidenceHint, steps: journeySteps("What shipped, and what changed for users.") },
    ],
  },
  {
    slug: "quick-send",
    era: "legalesign",
    title: "Quick Send",
    summary: "A streamlined first send that cut trial bounce and churn.",
    role: "Sole designer, product owner",
    tags: ["Onboarding", "Conversion", "UX"],
    cover: quickSendHero,
    hero: quickSendHero,
    intro:
      "A send flow built around trial users, with an editor customers can embed in their own products at its centre.",
    statement:
      "New users just wanted to send a document. We made them build a template first, so most trials ended before anything was sent.",
    roleStatement:
      "As the sole designer and product owner, I found the problem, wrote the brief, tested 25 versions with users and launched one flow from upload to sent.",
    context: [
      { label: "Company", value: "Legalesign, in-house" },
      { label: "Product", value: "B2B SaaS e-signature web app" },
      { label: "For", value: "Trial and new users" },
      { label: "My role", value: "Sole designer, product owner" },
    ],
    impact: [
      { value: "4 → 1", label: "Four steps in four places became one flow" },
      { value: "25", label: "Versions tested with users, four as clickable prototypes" },
      { value: "3", label: "Products built on the one editor component" },
    ],
    next: { slug: "template-editor", label: "See how Compose powers the Template Editor too." },
    blocks: [
      {
        type: "video",
        id: "in-production",
        eyebrow: "In production",
        heading: "Upload, add recipients, place fields, send.",
        body: "The live flow, start to finish, with no template in sight.",
        src: "/work/quick-send/send-flow.mp4",
        poster: "/work/quick-send/send-flow-poster.jpg",
        label: "Screen recording of sending a document with Quick Send, from upload to sent",
      },
      {
        type: "overview",
        eyebrow: "Overview",
        heading: "One place to send a document, built around the people trying us out.",
        body: "Quick Send lets anyone upload a document, add who's signing, place their fields and send it, all in one flow. It's built on Compose, an editor customers embed in their own products, so one piece of work served trial users, embedded customers and the main editor.",
        did: [
          "Found the problem in feedback and session recordings",
          "Shaped the brief as product owner",
          "Designed 25 versions and tested them with users",
          "Handed off annotated flows to development",
          "Launched it as a beta and kept iterating",
        ],
      },
      {
        type: "callouts",
        eyebrow: "The problem",
        heading: "Trials were ending before the first send.",
        items: [
          {
            title: "A high bounce rate",
            body: "Few trial users ever reached a first send, the moment a trial succeeds.",
          },
          {
            title: "Template first, send second",
            body: "To send a document, you first had to turn it into a template.",
          },
          {
            title: "Four steps in four places",
            body: "Upload, find it in the library, make a template, then pick that template to send.",
          },
          {
            title: "A Send button that led nowhere",
            body: "New users clicked Send and landed on an empty template picker.",
          },
        ],
      },
      {
        type: "points",
        eyebrow: "My approach",
        heading: "How I led the research.",
        items: [
          { title: "Feedback into themes", body: "In-app feedback landed in a Jira channel. I grouped it into shared pain points." },
          { title: "Goals before features", body: "Most feedback wasn't about bits of UI. It showed goals going unmet, so I defined those first." },
          { title: "Watching real sessions", body: "I clipped Hotjar recordings where people hit dead ends, made U-turns or rage-clicked." },
          { title: "Following the pattern", body: "Nearly every clip was in the send flow, and nearly every one was a trial or new user." },
        ],
      },
      {
        type: "insights",
        eyebrow: "What we heard",
        heading: "What they said, and what they needed.",
        labels: ["They said", "They needed"],
        quotes: true,
        items: [
          { found: "I just want to send this document.", so: "One flow from upload to Send, with a clear start and end." },
          { found: "I clicked Send and there was nothing there.", so: "Send to be the start of the flow, not a dead end." },
          { found: "Why do I have to make a template?", so: "To send without one, then send again with the same document or people." },
          { found: "I don't want the whole team seeing this.", so: "One-off sends kept out of the shared library." },
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
      {
        type: "callouts",
        eyebrow: "What it exposed",
        heading: "Three things to fix.",
        items: [
          {
            title: "A cluttered UI",
            body: "Two sidebars showed every recipient, field and control at once.",
            fix: "Simplify every screen",
          },
          {
            title: "Navigation that lost people",
            body: "Sending was spread across the app, with no clear start or end.",
            fix: "One flow, with one clear next step",
          },
          {
            title: "Features forced on everyone",
            body: "Everything the power users needed sat in front of people who just wanted to send.",
            fix: "Reveal features when and where they're needed",
          },
        ],
      },
      {
        type: "callouts",
        eyebrow: "The opportunity",
        heading: "Designer and product owner, so I could see across the company.",
        body: "Working in both roles, I could see three needs that one piece of work could answer. Quick Send would be built on Compose, so the same build paid off three times.",
        items: [
          { title: "Trial users", body: "A first send with no barriers, in their first session." },
          { title: "Embedded customers", body: "Compose, an editor they could put inside their own products." },
          { title: "The main editor", body: "A beta where the redesign could be tested live, without risking anyone's daily sending." },
        ],
      },
      {
        type: "points",
        eyebrow: "Goals",
        heading: "What Quick Send had to do.",
        items: [
          { title: "No barriers", body: "Send within the first session." },
          { title: "One clean flow", body: "Send, upload, recipients, fields, sent." },
          { title: "A clear next step", body: "Nothing left to guess at any point." },
          { title: "Power when needed", body: "The full editor, revealed only on demand." },
          { title: "Works embedded", body: "Fits inside a customer's product, at a narrow width." },
          { title: "Safe to test", body: "A beta for the new editor, away from daily work." },
        ],
      },
      quickSendTesting,
      {
        type: "iterations",
        eyebrow: "25 versions",
        heading: "From Figma screens to prototypes to the final design.",
        body: "Versions 1 to 14 were screens I shared for feedback. From version 15, users tried clickable prototypes. Nothing was built until the design settled. It plays through on its own; drag the bar or click a numbered pin to take over.",
        items: quickSendIterations,
      },
      {
        type: "points",
        eyebrow: "Key decisions",
        heading: "The decisions that shaped it.",
        items: [
          { title: "Recipients before fields", body: "Add people first, and it's obvious who each field is for." },
          { title: "One sidebar", body: "More room for the document, and narrow enough to embed." },
          { title: "Three fields by default", body: "Signature, text and date. Admins can change the set." },
          { title: "A panel that follows you", body: "Select a field and the sidebar becomes its editor." },
          { title: "Modals for occasional tasks", body: "Recipients and settings stay out of the way until needed." },
          { title: "A Send you can't hit by accident", body: "Bold, explains what's missing, and counts down before sending." },
        ],
      },
      {
        type: "flow",
        eyebrow: "User flow",
        heading: "From Send to sent.",
        image: { src: null, w: 6000, h: 1500, alt: "The annotated Quick Send user flow, screen by screen" },
      },
      {
        type: "screens",
        eyebrow: "How it works",
        heading: "Screen by screen.",
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
      {
        ...quickSendInProduction,
        id: "up-close",
        eyebrow: "Up close",
        heading: "The details, live.",
        body: undefined,
        feature: undefined,
        tiles: quickSendInProduction.tiles.filter((t) => t.kind !== "note"),
      },
      {
        type: "outcome",
        eyebrow: "The outcome",
        heading: "What changed.",
        items: [
          { title: "First sends stopped being a problem.", body: "Trial users went from struggling to reach a first send to sending without trouble. Quick Send was the main driver." },
          { title: "One component, three products.", body: "The same editor powers Quick Send, embedded Compose for several customers, and the redesigned main editor." },
          { title: "Tested live, without the risk.", body: "The beta gave the new editor real feedback without touching anyone's everyday sending." },
        ],
        todo: "Add the numbers: trial first-send rate and bounce, before and after.",
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
    blocks: [
      {
        type: "gallery",
        eyebrow: "Final designs",
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
