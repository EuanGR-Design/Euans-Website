// The Legalesign section: an overview page at /work/legalesign, then one
// page per stage of the design process, each told through one Console
// project.
//
// To show a stage through a different project, change its `project` slug
// and rewrite its `problem`, `why` and `blocks`. The overview cards, the
// "Everything I shipped" badges and the "See the final outcome" links all
// follow the slug.

import type { Block } from "./projects";
import { quickSendInProduction, quickSendIterations, quickSendShot, quickSendTesting } from "./quickSend";

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

export const stages: Stage[] = [
  {
    id: "research",
    label: "Research",
    headline: "How I research",
    approach:
      "I start by finding out who has the problem and what it actually is, from the people living with it and from the data, before anything gets designed.",
    question: "How I find the real problem",
    project: "getting-unstuck",
    problem: "Customers couldn't find answers on their own, so simple questions turned into support tickets.",
    why: "Getting Unstuck had the deepest research of anything I worked on, so I use it to show how I work at this stage.",
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
    problem: "Trial users were bouncing before their first send, because sending meant building a template first.",
    why: "Quick Send went through the most rounds of designs and user feedback, so I use it to show how I iterate.",
    blocks: [
      {
        type: "text",
        eyebrow: "The research behind it",
        heading: "From research to the brief.",
        body: [
          "Trial users had a high bounce rate, and few of them ever reached a first send. In-app feedback and Hotjar recordings showed why. The feedback was grouped into shared pain points, and the recordings showed dead ends, U-turns and rage clicks, nearly all in the send flow. People wanted to upload a document and send it, but we made them upload, build a template and then send, in three different places. And they weren't occasional users: many were lawyers and other professionals sending one-off documents, high-value customers whose needs didn't fit our workflow.",
          "At the same time, customers were asking for Compose, an editor they could embed in their own products. Working as product owner as well as designer, I saw that one piece of work could answer both. Together, those insights showed the opportunity for Quick Send, built around Compose, and that became the brief: its scope and requirements came straight from what users had told and shown us.",
        ],
      },
      {
        type: "iterations",
        eyebrow: "25 versions",
        heading: "From Figma screens to prototypes to the final design.",
        body: "Versions 1 to 14 were screens I shared for feedback, and from version 15 users tried clickable prototypes. Nothing was built until the design settled, and only the final design went live. Drag the bar, use the arrows or swipe to step through them. What changed and why sits beside the screen.",
        items: quickSendIterations,
      },
      {
        type: "rounds",
        eyebrow: "Rounds of feedback",
        heading: "What testers told us, and what changed.",
        items: [
          {
            title: "Versions 1 to 2 · Decluttering",
            heard:
              "The editor showed everything at once: every field type, two sidebars and all the document options. Testers said it was too much information, and that they didn't need most of those fields to send a simple document. Hiding some of it helped, but the next round still found the screen too busy.",
            changed:
              "I moved the extra field types behind a More Field Types dropdown, and made the right sidebar show only the details of the field you'd selected. Then I tried Minimised and Advanced toggles, so people could choose a stripped-back screen or the full set of features.",
            image: quickSendShot(2, "Quick Send version 2, with Minimised and Advanced toggles"),
          },
          {
            title: "Versions 3 to 8 · Signature only",
            heard:
              "Internal testing suggested that a quick send only needs a signature. It was an assumption, so we tested it, and pushed it further each time. Letting signers sign anywhere, with no fields placed, was wrong: senders need signatures in specific places, and losing that control made signing worse. A one-field shortcut with an optional full preparation step was wrong too. Most people place more than one field, so the shortcut added a step for them, and splitting the flow broke their idea of how preparing a document works.",
            changed:
              "I made the document the centre of the page, on an open canvas with floating panels, with what you need first on the left. Over six versions I cut back to a single signature field, tried skipping fields altogether, brought one field back with a Go Straight to Send shortcut, then committed to place and send. Looking back it was a rabbit hole, and testing is what pulled the design back out of it.",
            image: quickSendShot(4, "Quick Send version 4, with large page thumbnails and no fields to place"),
          },
          {
            title: "Versions 9 to 14 · Recipients first",
            heard:
              "Until now we'd assumed a quick send goes to one person. Testers told us they wanted to send to several, and since nothing was saved as a template, there was no reason for placeholder recipients. Each version after that was well received but still felt busy. People didn't realise they had to pick a recipient before placing a field, missed the Sign upon sending toggle, couldn't find how to edit recipients once they'd added them, and couldn't tell why Send was still disabled.",
            changed:
              "You now add recipients first and choose who you're placing fields for, so Send became the very last click. The recipient picker moved into a \"Placing signature for\" bar, the old header went, and a toggle separated placing new fields from editing placed ones. I removed sender signatures: few people signed their own documents, nobody missed them, and that need became its own inbox feature. Panels stopped floating to give the document more room, and a Requires Fields label explained why Send was disabled.",
            image: quickSendShot(13, "Quick Send version 13, with recipients first and an Edit button in the sidebar"),
          },
          {
            title: "Versions 15 to 19 · Joined with Compose",
            heard:
              "Letting where you clicked decide the mode was too fiddly, and people lost the Send button when it moved into the header. At the same time, Compose, our embeddable editor, had to fit inside a customer's product with very little screen width. The Requires Fields label said something was missing, but not what, or for whom. Trying sender fields again in the new layout cluttered it and mixed up two different jobs.",
            changed:
              "The mode toggle came back, with a bigger Send button. Quick Send joined up with Compose, and every control from the right sidebar moved into one left sidebar that changes with what you select. Requires Fields became a dropdown of who still needs fields, and picking someone readies their signature field. Our main customer contact and their team loved it, and asked for more alerts, so recipients who still need fields got a red dot and the field to place got a caution icon.",
            image: quickSendShot(19, "Quick Send version 19, with alerts in the sidebar for missing fields"),
          },
          {
            title: "Versions 20 to 25 · Refining",
            heard:
              "Requires Fields sat so close to Send that you could send by mistake. With several recipients, it wasn't clear that each one needed fields. Requires Fields scrolled away with the document, most people send more than a signature so More Field Types was an extra click, and the yellow alerts didn't read as a must-do. People also asked for undo and redo, and near the end said Send was too easy to click by accident. Once a document is sent, it's sent.",
            changed:
              "Requires Fields moved into the sidebar, leaving Send alone on the right as the final action. The sidebar became a list of recipient cards that expand to show their fields. Alerts turned red, the default fields became signature, text and date (with more in team settings), and editing recipients and document settings moved into modals. In the version that went live, Send counts down for 5 seconds so a mistaken click can be cancelled, undo and redo buttons help new users who don't know the shortcuts, and a Document Settings modal lets people change settings for a single send instead of always using the team defaults.",
            image: quickSendShot(25, "Quick Send, the final design"),
          },
        ],
      },
      quickSendTesting,
      quickSendInProduction,
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
        id: "sent",
        label: "Sent",
        before: "/work/compare/sent-before.webp",
        after: "/work/compare/sent-after.webp",
        caption:
          "From rows of status buttons beside an event log to a card for each document, with every recipient's progress from emailed to signed, plus search and filters.",
      },
      {
        id: "library",
        label: "Library",
        before: "/work/compare/library-before.webp",
        after: "/work/compare/library-after.webp",
        caption: "A bare list of uploaded files became a template library, with status, tags and quick actions to edit or send.",
      },
      {
        id: "editor",
        label: "Editor",
        before: "/work/compare/editor-before.webp",
        after: "/work/compare/editor-after.webp",
        caption:
          "Two long lists of signer and sender fields and a row of checkboxes became one panel of fields, placed for one participant at a time.",
      },
      {
        id: "send",
        label: "Sending",
        before: "/work/compare/send-before.webp",
        after: "/work/compare/send-after.webp",
        caption:
          "A form of icons and buttons became a Send Overview, where documents, participants, fields and recipients are checked in one place before sending.",
      },
      {
        id: "dashboard",
        label: "Dashboard",
        before: null,
        after: "/work/compare/dashboard-after.webp",
        missing: { title: "No dashboard", body: "The sent listings doubled as the home page." },
        caption:
          "New in Console. Quick actions, an overview of everything sent, recent activity and next steps, all on the first screen you see.",
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
    { title: "Ticket tracking", body: "Raising, following and escalating support tickets, for users and their admins.", project: "getting-unstuck" },
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
