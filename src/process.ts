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
// oldest, 25 the final design). Versions left out show prompts in the pop-up.
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
    change: "Smaller thumbnails put the focus on placing the one signature field, and Go Straight to Send lights up once it's on the page.",
    feedback: "Refining the same one-field shortcut as version 5.",
  },
  7: {
    stage: signatureOnly,
    change: "Committed to one signature field: place it, then send. No branch off to full preparation.",
    feedback: "Most users place more than one field, so the shortcut added a step for them, and splitting the flow broke people's idea of preparing a document.",
  },
  8: {
    stage: signatureOnly,
    change: "Removed the page count and \"created by\". Pages already show below, and the creator is always you.",
    feedback: "Keep cutting anything that doesn't help someone send.",
  },
  9: {
    stage: recipientsFirst,
    change: "Add recipients first, then choose who you're placing a signature for. Next is gone, so Send is truly the last click.",
    feedback: "Users wanted to send to several people, not just one. With nothing saved as a template, there was no need for placeholder recipients.",
  },
  10: {
    stage: recipientsFirst,
    change: "The recipient picker moved into a floating \"Placing signature for\" bar, and your saved signature sits in the sidebar, ready to drag on.",
    feedback: "Users didn't realise they had to click a recipient before placing fields, and missed the \"Sign upon sending\" toggle.",
  },
  11: {
    stage: recipientsFirst,
    change: "Added a toggle between placing signatures and editing fields you've already placed.",
    feedback: "Well received, but still too busy and cluttered.",
  },
  12: {
    stage: recipientsFirst,
    change: "Removed the Upload and Prepare header. Send Document sits at the top right, with the mode toggle above the recipients.",
    feedback: "The header took up space with information nobody needed.",
  },
  13: {
    stage: recipientsFirst,
    change: "Removed sender signatures to cut the UI, and added an Edit button for recipients at the top of the sidebar.",
    feedback: "Users couldn't tell how to edit recipients once added. Few signed their own documents, and that need became a separate inbox feature.",
  },
  14: {
    stage: recipientsFirst,
    change: "Panels stopped floating, the mode toggle went (where you click sets the mode), a Requires Fields label joined the header and Send moved up there too.",
    feedback: "Floating panels wasted space around the document, and users couldn't tell why Send was still disabled.",
  },
  15: {
    stage: compose,
    change: "The mode toggle came back with a bigger Send Document button. Quick Send joined up with Compose, the embeddable editor.",
    feedback: "Choosing the mode by where you click was too fiddly, and users couldn't find Send.",
  },
  16: {
    stage: compose,
    change: "Signature, date and text joined the mode selector, so you pick which field you're placing. The \"Placing signature for\" bar above the document went.",
    feedback: "Signature alone wasn't enough: people needed signature, text and date fields. The bar above the document was a blind spot, and most people picked recipients in the sidebar anyway.",
  },
  17: {
    stage: compose,
    change: "Every control from the right sidebar moved into the left one, Compose's pattern. Sender fields were tried again.",
    feedback: "A customer embedding Compose had very little screen width, so everything had to fit one sidebar.",
  },
  18: {
    stage: compose,
    change: "Requires Fields became a dropdown of who still needs fields, picking someone readies their signature field. Zoom and page controls were added.",
    feedback: "Sender fields cluttered it again, and the label didn't say which fields were needed or for whom.",
  },
  19: {
    stage: compose,
    change: "Added alerts in the sidebar: a red dot on recipients who still need fields, and a caution icon on the field to place.",
    feedback: "Our main customer contact loved the dropdown, but wanted more alerts on screen.",
  },
  20: {
    stage: refining,
    change: "Simplified the sidebar and moved Requires Fields to the left, leaving Send alone on the right as the final action.",
    feedback: "Requires Fields sat so close to Send that you could send by mistake.",
  },
  21: {
    stage: refining,
    change: "The icon rail went, leaving the sidebar as a list of your recipients. An edit button appears when you hover a card.",
    feedback: "Keep simplifying the sidebar.",
  },
  22: {
    stage: refining,
    change: "Every recipient shows in the sidebar at all times with their signature field. Other field types sit under More Field Types.",
    feedback: "With several recipients, it wasn't clear that each one needed fields placing.",
  },
  23: {
    stage: refining,
    change: "Requires Fields moved into the sidebar, and selecting a recipient expands their card to show all their fields.",
    feedback: "Requires Fields scrolled away with the document, and most people send more than a signature, so More Field Types was an extra click.",
  },
  24: {
    stage: refining,
    change: "Alerts turned red, the default fields became signature, date and text (more in team settings), and Manage Recipients opens in a modal.",
    feedback: "Yellow alerts didn't read as a must-do, and editing recipients from their cards meant doing two things at once.",
  },
  25: {
    stage: "Final design",
    change: "Send counts down for 5 seconds so you can cancel it, undo and redo buttons sit under the sidebar, and a Document Settings modal lets you change settings for this one send. This is the version live today.",
    feedback: "Send was too easy to click, and once a document is sent it's sent. New users didn't know the undo shortcuts. And some quick sends did need their own document settings, not the team defaults.",
  },
};

// Comment pins on each screen, at x and y percent of the frame, marking
// where that version changed. Click one on the page to read its note.
const quickSendPins: Record<number, { x: number; y: number; note: string }[]> = {
  1: [
    { x: 6, y: 58, note: "Extra field types now sit behind More Field Types." },
    { x: 90, y: 13, note: "This sidebar now switches to the selected field's details." },
  ],
  2: [
    { x: 12, y: 13, note: "Minimised and Advanced toggles: choose a stripped-back screen or every feature." },
  ],
  3: [
    { x: 8, y: 33, note: "Just one signature field." },
    { x: 8, y: 55, note: "Page previews shown by default, to keep the focus on the document." },
    { x: 88, y: 18, note: "Advanced moved to the right, so what you need first is on the left." },
  ],
  4: [
    { x: 12, y: 30, note: "Large page thumbnails take over the left panel." },
    { x: 62, y: 94, note: "Skip placing fields: recipients could sign anywhere. Testing proved this wrong." },
  ],
  5: [
    { x: 50, y: 82, note: "One signature field, then straight to Send." },
    { x: 95, y: 6, note: "Or press Next for full preparation with more fields." },
  ],
  6: [
    { x: 10, y: 30, note: "Go Straight to Send lights up once the field is placed." },
    { x: 45, y: 51, note: "The placed signature field." },
    { x: 93, y: 70, note: "Thumbnails shrunk and moved aside." },
  ],
  7: [
    { x: 8, y: 19, note: "Place the one signature field." },
    { x: 94, y: 7, note: "Then send. No branch off to full preparation." },
  ],
  8: [
    { x: 90, y: 15, note: "Page count and \"created by\" removed." },
  ],
  9: [
    { x: 7, y: 32, note: "Add recipients first, then choose who you're placing a signature for." },
    { x: 92, y: 36, note: "A \"Sign upon sending\" toggle for the sender. Users missed it." },
    { x: 94, y: 7, note: "Next is gone, so Send is the last click." },
  ],
  10: [
    { x: 60, y: 14, note: "The recipient picker moved into a floating \"Placing signature for\" bar." },
    { x: 93, y: 42, note: "Your saved signature, ready to drag onto the page." },
  ],
  11: [
    { x: 40, y: 14, note: "A toggle between placing signatures and editing placed fields." },
  ],
  12: [
    { x: 10, y: 7, note: "The mode toggle now sits above the recipients." },
    { x: 93, y: 7, note: "Upload and Prepare header gone. Send Document sits inline here." },
  ],
  13: [
    { x: 16, y: 13, note: "An Edit button for recipients." },
    { x: 90, y: 29, note: "Sender signatures removed. Just your details remain." },
  ],
  14: [
    { x: 10, y: 15, note: "Panels no longer float, and the mode toggle is gone." },
    { x: 57, y: 4, note: "A Requires Fields label in the header." },
    { x: 96, y: 4, note: "Send moved up into the header." },
  ],
  15: [
    { x: 21, y: 7, note: "The mode toggle is back." },
    { x: 88, y: 7, note: "A bigger Send Document button, so nobody loses it." },
  ],
  16: [
    { x: 22, y: 5, note: "Signature, date and text joined the mode selector." },
    { x: 52, y: 10, note: "The \"Placing signature for\" bar above the document is gone. People picked recipients in the sidebar instead." },
  ],
  17: [
    { x: 15, y: 8, note: "Sender fields, tried again." },
    { x: 15, y: 45, note: "Every control now lives in the left sidebar, so it fits a narrow embed." },
  ],
  18: [
    { x: 91, y: 4, note: "Requires Fields is now a dropdown of who still needs fields." },
    { x: 80, y: 95, note: "Zoom, fit and page controls." },
  ],
  19: [
    { x: 21, y: 16, note: "A red dot on recipients who still need fields." },
    { x: 18, y: 33, note: "A caution icon on the field to place." },
  ],
  20: [
    { x: 37, y: 10, note: "Requires Fields moved left, away from Send." },
    { x: 90, y: 8, note: "Send stands alone as the final action." },
  ],
  21: [
    { x: 11, y: 10, note: "The icon rail is gone. The sidebar is just your recipients." },
  ],
  22: [
    { x: 19, y: 14, note: "Every recipient shown at all times, with More Field Types for the rest." },
  ],
  23: [
    { x: 19, y: 8, note: "Requires Fields now lives in the sidebar." },
    { x: 12, y: 30, note: "Selecting a recipient expands their card to show all their fields." },
  ],
  24: [
    { x: 17, y: 26, note: "Alerts turned red, so they read as a must-do." },
    { x: 12, y: 37, note: "Three default fields. More can be switched on in team settings." },
    { x: 20, y: 95, note: "Recipients are edited in a modal, one task at a time." },
  ],
  25: [
    { x: 19, y: 7, note: "Ready to Send shows once every required field is placed." },
    { x: 17, y: 90, note: "Document settings for this send, instead of always using the team defaults." },
    { x: 27, y: 96, note: "Undo and redo buttons, for new users who don't know the keyboard shortcuts." },
    { x: 82, y: 6, note: "Send counts down for 5 seconds, so a mistaken click can be cancelled." },
  ],
};

// Clickable prototypes of Quick Send, keyed by the version they show. A
// version can have more than one, such as the screen alone and the full flow.
const quickSendPrototypes: Record<number, { title?: string; body: string; links: { label: string; url: string }[] }> = {
  15: {
    body: "Click through Quick Send as it was when it first joined up with Compose.",
    links: [{ label: "Open the prototype", url: "https://lace-bonus-64273429.figma.site" }],
  },
  16: {
    body: "Click through this version of Quick Send.",
    links: [{ label: "Open the prototype", url: "https://umber-rerun-82210169.figma.site" }],
  },
  19: {
    body: "Click through this screen, or the full flow from choosing Quick Send to pressing Send.",
    links: [
      { label: "This screen", url: "https://gloss-pod-32624458.figma.site" },
      { label: "The full flow", url: "https://sleet-cloth-69056845.figma.site" },
    ],
  },
  24: {
    body: "Click through the final prototype yourself.",
    links: [{ label: "Open the prototype", url: "https://peach-comma-28912996.figma.site" }],
  },
  25: {
    title: "See it in use",
    body: "Watch the live version of Quick Send, from upload to send.",
    links: [{ label: "Watch the video", url: "#in-production" }],
  },
};

// Versions whose screen hasn't been added yet. They show a placeholder.
const quickSendMissingScreens = new Set<number>();

// A Quick Send screen, for the rounds of feedback.
const quickSendShot = (v: number, alt: string) => ({
  src: `/work/quick-send/iterations/${String(v).padStart(2, "0")}.webp`,
  w: 2000,
  h: 1425,
  alt,
});

// Every Quick Send screen, oldest first, in public/work/quick-send/iterations/.
const quickSendIterations: Extract<Block, { type: "iterations" }>["items"] = Array.from({ length: 25 }, (_, i) => ({
  image: {
    src: quickSendMissingScreens.has(i + 1) ? null : `/work/quick-send/iterations/${String(i + 1).padStart(2, "0")}.webp`,
    w: 2000,
    h: 1425,
    alt: i === 24 ? "Quick Send, the final design" : `Quick Send, version ${i + 1} of 25`,
  },
  ...quickSendDetails[i + 1],
  pins: quickSendPins[i + 1],
  prototype: quickSendPrototypes[i + 1],
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
    problem: "Trial users were bouncing before their first send, because sending meant building a template first.",
    why: "Quick Send went through the most rounds of prototypes and user feedback, so I use it to show how I iterate.",
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
        heading: "From first prototype to the final design.",
        body: "Every version was a prototype, tested with users before any development time was spent, and only the final design went live. Drag the bar to step through them, hover it to see what changed and why, or click a numbered pin on the screen.",
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
      {
        type: "text",
        eyebrow: "Testing",
        heading: "How I ran testing.",
        body: [
          "Every version on this page was a Figma prototype, not a release. We were a small team and developer time was precious, so I didn't want to commit it until we were confident in the design, and I was careful about when it was ready for handoff. Prototypes let us put something real in front of users using only my time, not the developers'.",
          "I tested them with users in interviews over video calls, many of them the same people whose feedback started the project, set up by their account managers. I worked from a script of questions I needed answered, then let people explore the prototype freely and say whatever came to mind. Alongside that, I ran internal workshops and feedback rounds where several people went through the user flows and left comments, and I compiled and worked through every one before the next version.",
          "The final design launched as an MVP with a beta label. Since then it has kept evolving in smaller steps, guided by screen recordings and heatmaps in Hotjar and usage data in PostHog. The beta also became a safe place to test the Compose editor component, so what we learned fed into the main editor without putting anyone's everyday sending at risk.",
        ],
      },
      {
        type: "video",
        id: "in-production",
        eyebrow: "In production",
        heading: "What it became.",
        body: "Quick Send on the live product: upload a document, add who's signing, place their fields and send it, without making a template first.",
        src: "/work/quick-send/send-flow.mp4",
        poster: "/work/quick-send/send-flow-poster.jpg",
        label: "Screen recording of sending a document with Quick Send, from upload to sent",
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
