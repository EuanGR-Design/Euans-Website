// The Legalesign section: an overview page at /work/legalesign, then one
// page per stage of the design process, each told through one Console
// project.
//
// To show a stage through a different project, change its `project` slug
// and rewrite its `problem`, `why` and `blocks`. The overview cards, the
// "Everything I shipped" badges and the "See the final outcome" links all
// follow the slug.

import type { Block } from "./projects";

export type StageId = "research" | "ideation" | "iteration" | "outcome";

export type Stage = {
  id: StageId;
  label: string;
  // Page headline, about Euan rather than the project.
  headline: string;
  // One sentence on how Euan approaches this stage.
  approach: string;
  // The question this stage answers, shown on the overview cards.
  question: string;
  // Slug of the project in src/projects.ts that shows this stage.
  project: string;
  // The project's problem in one line, so the page stands alone.
  problem: string;
  // Why this project is the one used for this stage.
  why: string;
  // Results lead the page, ahead of the headline.
  result?: { value: string; label: string; draft?: boolean };
  blocks: Block[];
};

// What each Quick Send version changed, keyed by version number (1 is the
// oldest, 26 the final design). Versions left out show prompts in the pop-up.
const declutter = "Decluttering";
const signatureOnly = "Signature only";
const recipientsFirst = "Recipients first";
const compose = "Joined with Compose";
const refining = "Refining";

const quickSendDetails: Record<number, { stage?: string; change?: string; feedback?: string }> = {
  1: {
    stage: declutter,
    change: "Extra field types went behind a More Field Types dropdown, and the right sidebar switched to the selected field's details.",
    feedback: "Too much information at once. Users don't need every field type up front, so hide them until they're needed.",
  },
  2: {
    stage: declutter,
    change: "Added Minimised and Advanced toggles, so people could choose a stripped-back screen or the full feature set.",
    feedback: "Still too much on screen. The first round of trimming wasn't enough.",
  },
  3: {
    stage: signatureOnly,
    change: "Cut to a single signature field, with what you need first on the left. Panels float over an open canvas so the document takes centre stage.",
    feedback: "Internal testing suggested Quick Send only needs a signature field. It was an assumption, so we tested it.",
  },
  4: {
    stage: signatureOnly,
    change: "The document took over, with large page thumbnails. Placing fields was skipped entirely, so recipients could sign anywhere.",
    feedback: "Push the minimal idea further and make the flow about nothing but the document.",
  },
  5: {
    stage: signatureOnly,
    change: "One signature field came back. Place it and go straight to Send, or press Next for full preparation with more fields.",
    feedback: "Skipping fields was wrong. Senders need signers to sign in specific places, and losing that control hurt the signing experience.",
  },
  6: {
    stage: signatureOnly,
    change: "Shrank the thumbnails to focus on placing the one signature field.",
    feedback: "Refining the same one-field shortcut as version 5.",
  },
  7: {
    stage: signatureOnly,
    change: "Another pass at the one-field shortcut.",
    feedback: "Refining the same one-field shortcut as version 5.",
  },
  8: {
    stage: signatureOnly,
    change: "Another pass at the one-field shortcut.",
    feedback: "Refining the same one-field shortcut as version 5.",
  },
  9: {
    stage: signatureOnly,
    change: "Committed to one signature field: place it, then send. No branch off to full preparation.",
    feedback: "Most users place more than one field, so the shortcut added a step for them, and splitting the flow broke people's idea of preparing a document.",
  },
  10: {
    stage: signatureOnly,
    change: "Removed the page count and \"created by\". Pages already show below, and the creator is always you.",
    feedback: "Keep cutting anything that doesn't help someone send.",
  },
  11: {
    stage: recipientsFirst,
    change: "Add recipients first, then choose who you're placing a signature for. Next is gone, so Send is truly the last click.",
    feedback: "Users wanted to send to several people, not just one. With nothing saved as a template, there was no need for placeholder recipients.",
  },
  12: {
    stage: recipientsFirst,
    change: "The recipient picker moved into a floating \"Placing signature for\" bar, and your saved signature sits in the sidebar, ready to drag on.",
    feedback: "Users didn't realise they had to click a recipient before placing fields, and missed the \"Sign upon sending\" toggle.",
  },
  13: {
    stage: recipientsFirst,
    change: "Added a toggle between placing signatures and editing fields you've already placed.",
    feedback: "Well received, but still too busy and cluttered.",
  },
  14: {
    stage: recipientsFirst,
    change: "Removed the Upload and Prepare header. Send Document sits at the top right, with the mode toggle above the recipients.",
    feedback: "The header took up space with information nobody needed.",
  },
  15: {
    stage: recipientsFirst,
    change: "Removed sender signatures to cut the UI, and added an Edit button for recipients at the top of the sidebar.",
    feedback: "Users couldn't tell how to edit recipients once added. Few signed their own documents, and that need became a separate inbox feature.",
  },
  16: {
    stage: recipientsFirst,
    change: "Panels stopped floating, the mode toggle went (where you click sets the mode), a Requires Fields label joined the header and Send moved up there too.",
    feedback: "Floating panels wasted space around the document, and users couldn't tell why Send was still disabled.",
  },
  17: {
    stage: compose,
    change: "The mode toggle came back with a bigger Send Document button. Quick Send joined up with Compose, the embeddable editor.",
    feedback: "Choosing the mode by where you click was too fiddly, and users couldn't find Send.",
  },
  18: {
    stage: compose,
    change: "Every control from the right sidebar moved into the left one, Compose's pattern. Sender fields were tried again.",
    feedback: "A customer embedding Compose had very little screen width, so everything had to fit one sidebar.",
  },
  19: {
    stage: compose,
    change: "Requires Fields became a dropdown of who still needs fields, picking someone readies their signature field. Zoom and page controls were added.",
    feedback: "Sender fields cluttered it again, and the label didn't say which fields were needed or for whom.",
  },
  20: {
    stage: compose,
    change: "Added alerts in the sidebar: a red dot on recipients who still need fields, and a caution icon on the field to place.",
    feedback: "Our main customer contact loved the dropdown, but wanted more alerts on screen.",
  },
  21: {
    stage: refining,
    change: "Simplified the sidebar and moved Requires Fields to the left, leaving Send alone on the right as the final action.",
    feedback: "Requires Fields sat so close to Send that you could send by mistake.",
  },
  22: {
    stage: refining,
    change: "The sidebar became a simple list of your recipients, with an edit button that appears when you hover a card.",
    feedback: "Keep simplifying the sidebar.",
  },
  23: {
    stage: refining,
    change: "Every recipient shows in the sidebar at all times with their signature field. Other field types sit under More Field Types.",
    feedback: "With several recipients, it wasn't clear that each one needed fields placing.",
  },
  24: {
    stage: refining,
    change: "Moved the Requires Fields dropdown into the sidebar with everything else.",
    feedback: "It scrolled away with the document, and users wanted to see it at all times.",
  },
  25: {
    stage: refining,
    change: "Dropped the More Field Types click. Selecting a recipient expands their card to show all their fields.",
    feedback: "Most people send more than a signature, so the extra click wasn't needed.",
  },
  26: {
    stage: "Final design",
    change: "Red alerts, three default fields (more in team settings), recipients and document settings in modals, plus undo and redo.",
    feedback: "Yellow alerts didn't read as a must-do, and users asked for undo and redo.",
  },
};

// Every Quick Send screen, oldest first, in public/work/quick-send/iterations/.
const quickSendIterations: Extract<Block, { type: "iterations" }>["items"] = Array.from({ length: 26 }, (_, i) => ({
  image: {
    src: `/work/quick-send/iterations/${String(i + 1).padStart(2, "0")}.webp`,
    w: 2000,
    h: 1430,
    alt: i === 25 ? "Quick Send, the final design" : `Quick Send, version ${i + 1} of 26`,
  },
  ...quickSendDetails[i + 1],
}));

export const stages: Stage[] = [
  {
    id: "research",
    label: "Research",
    headline: "How I research",
    approach:
      "I start by finding out who has the problem and what it actually is, from the people living with it and from the data, before anything gets designed.",
    question: "How I find the real problem",
    project: "support-hub",
    problem: "Customers couldn't find answers on their own, so simple questions turned into support tickets.",
    why: "Support Hub had the deepest research of anything I worked on, so I use it to show how I work at this stage.",
    blocks: [
      {
        type: "text",
        eyebrow: "Method",
        heading: "How I ran the research.",
        body: [
          "Which methods you used (interviews, support ticket analysis, a workshop with the support team, Hotjar) and why each one.",
          "Who you spoke to, and how many.",
        ],
        draft: true,
      },
      {
        type: "quotes",
        eyebrow: "In their words",
        heading: "What people told us.",
        items: [
          { quote: "Add a quote from a customer admin.", who: "Org admin" },
          { quote: "Add a quote from an everyday sender.", who: "Everyday sender" },
          { quote: "Add a quote from the support team.", who: "Support team" },
        ],
        draft: true,
      },
      {
        type: "personas",
        eyebrow: "Personas",
        heading: "Who we were designing for.",
        items: [
          { name: "Org admin", role: "Runs Legalesign for their organisation", goals: "What they're trying to get done.", frustrations: "What gets in their way today." },
          { name: "Everyday sender", role: "Sends documents for signing", goals: "What they're trying to get done.", frustrations: "What gets in their way today." },
          { name: "Support agent", role: "Answers customer questions", goals: "What they're trying to get done.", frustrations: "What gets in their way today." },
        ],
        draft: true,
      },
      {
        type: "journey-map",
        eyebrow: "Journey map",
        heading: "Getting help, step by step.",
        stages: ["Hits a problem", "Looks for help", "Raises a ticket", "Gets an answer"],
        lanes: [
          { label: "Doing", cells: ["What they do here.", "What they do here.", "What they do here.", "What they do here."] },
          { label: "Thinking", cells: ["What they're thinking.", "What they're thinking.", "What they're thinking.", "What they're thinking."] },
          { label: "Pain point", cells: ["What goes wrong.", "What goes wrong.", "What goes wrong.", "What goes wrong."] },
        ],
        draft: true,
      },
      {
        type: "insights",
        eyebrow: "From insight to brief",
        heading: "What the research changed.",
        items: [
          { found: "A finding from the research.", so: "What the design had to do because of it." },
          { found: "A finding from the research.", so: "What the design had to do because of it." },
          { found: "A finding from the research.", so: "What the design had to do because of it." },
        ],
        draft: true,
      },
    ],
  },
  {
    id: "ideation",
    label: "Ideation",
    headline: "How I explore ideas",
    approach:
      "I open up as many directions as I can before narrowing down, and I keep the ones I drop so the team can see why the chosen one won.",
    question: "How I explore options",
    project: "drafts",
    problem: "Admins needed control over what their teams sent, while everyday senders needed less to fill in.",
    why: "Drafts had the widest set of directions to choose between, and it's some of my best UX, so I use it to show how I explore.",
    blocks: [
      {
        type: "text",
        eyebrow: "The question",
        heading: "How might admins lock down a send without slowing their team down?",
        body: ["How you framed the problem before sketching, and who was involved."],
        draft: true,
      },
      {
        type: "options",
        eyebrow: "Directions",
        heading: "What I explored.",
        items: [
          { title: "Direction A", body: "What it was, and why it was dropped.", image: null },
          { title: "Direction B", body: "What it was, and why it was dropped.", image: null },
          { title: "Direction C", body: "What it was, and why it won.", image: null, chosen: true },
        ],
        draft: true,
      },
      {
        type: "text",
        eyebrow: "Deciding",
        heading: "How I chose.",
        body: ["The criteria you used, who was in the room, and what tipped it."],
        draft: true,
      },
    ],
  },
  {
    id: "iteration",
    label: "Iteration",
    headline: "How I test and refine",
    approach:
      "I put prototypes in front of real users early and often, and let what they struggle with decide what changes next.",
    question: "How testing changed the design",
    project: "quick-send",
    problem: "Trial users were bouncing before they'd sent anything, and the send flow was the reason.",
    why: "Quick Send went through the most rounds of prototypes and user feedback, so I use it to show how I iterate.",
    blocks: [
      {
        type: "iterations",
        eyebrow: "26 versions",
        heading: "From first prototype to the final design.",
        body: "Drag the bar to step through every version of Quick Send, oldest first, and see what each round of feedback changed.",
        items: quickSendIterations,
      },
      {
        type: "rounds",
        eyebrow: "Rounds of feedback",
        heading: "What testers told us, and what changed.",
        items: [
          { heard: "What testers struggled with in this round.", changed: "The change you made because of it.", image: null },
          { heard: "What testers struggled with in this round.", changed: "The change you made because of it.", image: null },
          { heard: "What testers struggled with in this round.", changed: "The change you made because of it.", image: null },
        ],
        draft: true,
      },
      {
        type: "text",
        eyebrow: "Testing",
        heading: "How I ran testing.",
        body: ["Who tested, how many people per round, and the tools you used."],
        draft: true,
      },
    ],
  },
  {
    id: "outcome",
    label: "Outcome",
    headline: "How I prove it worked",
    approach:
      "I agree what success looks like before we ship, then measure it, so every release has evidence behind it.",
    question: "How I proved it worked",
    project: "template-editor",
    problem: "Adding fields to a document before sending was slow and easy to get wrong, so people sent documents that couldn't be completed.",
    why: "The Template Editor has the clearest before and after data, so I use it to show how I measure outcomes.",
    result: { value: "XX%", label: "Add the headline result, for example fewer documents sent that couldn't be completed.", draft: true },
    blocks: [
      {
        type: "stats",
        eyebrow: "Results",
        heading: "What changed after release.",
        items: [
          { value: "XX%", label: "Documents sent with field errors" },
          { value: "XX%", label: "Time to prepare a document" },
          { value: "XX%", label: "Support tickets about fields" },
        ],
        draft: true,
      },
      {
        type: "text",
        eyebrow: "Measuring",
        heading: "How we measured it.",
        body: ["The tools, the time window, and what counted as a success."],
        draft: true,
      },
      {
        type: "prototype",
        url: "https://love-model-19724475.figma.site/",
        heading: "Try the new editor.",
        body: "The redesigned editing page as a clickable prototype: placing fields and assigning them to recipients before a document goes out.",
        width: 1440,
        height: 900,
      },
      {
        type: "text",
        eyebrow: "Looking back",
        heading: "What I learned.",
        body: ["Two or three lines on what you'd keep and what you'd do differently."],
        draft: true,
      },
    ],
  },
];

export const getStage = (id: string) => stages.find((s) => s.id === id);

// The overview page.
export const legalesign = {
  eyebrow: "Legalesign · 2021 – Present",
  title: "Console",
  intro:
    "Legalesign is a secure, regulated e-signature platform used by governments, councils and large organisations. I rebuilt the whole legacy product as Console, feature by feature, and over five years shipped more than 100 features and workflows. Rather than tell every project the same way, each stage of how I work is shown through the project that shows it best.",
  facts: [
    { label: "Role", value: "Design lead, product owner" },
    { label: "Shipped", value: "100+ features and workflows" },
    { label: "Team", value: "Led the design team for 3+ years" },
  ],
  problem: {
    type: "points",
    eyebrow: "The problem",
    heading: "Customers wanted to roll it out wider, but their people couldn't use it.",
    items: [
      {
        title: "Clients couldn't scale it",
        body: "Large customers wanted to roll Legalesign out across their organisations, but new users couldn't work out how to use it.",
      },
      {
        title: "Regulated, niche, high stakes",
        body: "Government and enterprise users meant strict security and accessibility requirements, and workflows you won't find anywhere else.",
      },
    ],
  } satisfies Block,
  comparison: {
    type: "comparison",
    eyebrow: "Before → after",
    heading: "Same product. Unrecognisable experience.",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        before: null,
        after: "/work/dashboard.png",
        caption:
          "From a table of links to a hub: quick actions, a live document overview, ready-to-send templates and team activity.",
      },
      {
        id: "editor",
        label: "Editor",
        before: null,
        after: null,
        caption: "Placing and assigning fields before sending, rebuilt to be faster and far harder to get wrong.",
      },
      {
        id: "drafts",
        label: "Sending & Drafts",
        before: null,
        after: null,
        caption: "Admins set up drafts with locked, pre-filled settings, so everyday senders have less to fill in.",
      },
    ],
  } satisfies Block,
  // Every Console feature. `project` links the card to its page.
  shipped: [
    { title: "Dashboard", body: "A hub of quick actions, a live document overview and team activity." },
    { title: "Sending flow", body: "The core flow for sending documents out for signing." },
    { title: "Documents list", body: "Everything you've sent, and where each document is up to." },
    { title: "Signer Lobby", body: "Multi-document, multi-recipient signing with approvals and identity checks.", project: "signer-lobby" },
    { title: "Mobile Signing", body: "A mobile-first signing experience, designed to AAA accessibility." },
    { title: "Bulk Sending", body: "Sending many documents out for signing at once, from a CSV." },
    { title: "Reporting", body: "Usage data for org admins and team users to review and export." },
    { title: "Workflow configuration", body: "Admin controls for how documents move through an organisation." },
    { title: "Support Hub", body: "Customer support and ticketing for users and the support team.", project: "support-hub" },
    { title: "Drafts", body: "Pre-filled, locked-down sending that admins set up for their teams.", project: "drafts" },
    { title: "Template Editor", body: "Placing and assigning fields, faster and harder to get wrong.", project: "template-editor" },
    { title: "Quick Send", body: "A streamlined first send that cut trial bounce and churn.", project: "quick-send" },
  ] as { title: string; body: string; project?: string }[],
  remit: {
    type: "timeline",
    eyebrow: "My remit",
    heading: "From designer to product owner.",
    items: [
      {
        when: "2021",
        title: "Joining, and the first Console release",
        body: "Joined Legalesign and started rebuilding the legacy product as Console, beginning with an MVP that matched the old product's core features.",
        tags: ["MVP", "UX", "UI"],
      },
      {
        when: "Two years",
        title: "Rebuilding the product, feature by feature",
        body: "Recreated the entire legacy product one epic at a time, while backend engineers rebuilt the platform to modern security standards. Every feature was researched, prototyped and tested with users before handover. I led the design team throughout.",
        tags: ["Epics", "User testing", "Team lead"],
      },
      {
        when: "Last 1–2 years",
        title: "Product ownership: design and delivery",
        body: "Without stepping away from design, I took on product owner duties, filling business needs and taking control of a larger part of the development process. I plan bi-weekly sprints in Jira, write the epics and tickets developers work from, and manage bugs and feature requests.",
        tags: ["Product ownership", "Jira", "Figma Make"],
      },
    ],
  } satisfies Block,
};
