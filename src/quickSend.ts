// Quick Send's story, shared by its project page (src/projects.ts) and the
// Iteration stage page (src/process.ts).

import type { Block } from "./projects";

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
    change: "A hierarchy change: the signature field moved up to the top left, so the main action leads from the left, and smaller thumbnails moved aside.",
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
    { x: 10, y: 20, note: "The signature field moved up to the top left, so the main action leads from the left." },
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
export const quickSendShot = (v: number, alt: string) => ({
  src: `/work/quick-send/iterations/${String(v).padStart(2, "0")}.webp`,
  w: 2000,
  h: 1425,
  alt,
});

// Every Quick Send screen, oldest first, in public/work/quick-send/iterations/.
export const quickSendIterations: Extract<Block, { type: "iterations" }>["items"] = Array.from({ length: 25 }, (_, i) => ({
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

// How the prototypes were tested, and what happened after launch.
export const quickSendTesting: Block = {
  type: "points",
  eyebrow: "Testing",
  heading: "How I tested it.",
  items: [
    { title: "Designs, not releases", body: "Every version was a Figma design, so testing cost my time, not the developers'. Four became clickable prototypes." },
    { title: "Interviews with real users", body: "Video calls with the people whose feedback started it, set up by their account managers." },
    { title: "Internal workshops", body: "Colleagues walked the flows and left comments. I worked through every one before the next version." },
    { title: "A beta, then the data", body: "Launched as an MVP with a beta label, then refined with Hotjar and PostHog." },
  ],
};

// The live product: the full recording, then short looping clips.
export const quickSendInProduction: Extract<Block, { type: "bento" }> = {
  type: "bento",
  id: "in-production",
  eyebrow: "In production",
  heading: "What it became.",
  body: "These are recordings of Quick Send live today. Set them beside the designs above and you can see how closely the build follows the final design.",
  feature: {
    src: "/work/quick-send/send-flow.mp4",
    poster: "/work/quick-send/send-flow-poster.jpg",
    label: "Screen recording of sending a document with Quick Send, from the dashboard to sent",
    w: 1920,
    h: 1080,
    title: "The whole flow",
    caption: "From the dashboard to sent: upload a document, add who's signing, place their fields and send it, without making a template first.",
  },
  tiles: [
    {
      kind: "video",
      span: "wide",
      title: "Adding recipients",
      caption: "Recipients come first, up to twelve of them, and each gets a colour that follows them through the rest of the flow.",
      src: "/work/quick-send/clips/recipients.mp4",
      poster: "/work/quick-send/clips/recipients-poster.jpg",
      label: "Adding three recipients in the Recipient Details window",
      aspect: "16 / 9",
    },
    {
      kind: "video",
      span: "tall",
      title: "Recipient cards",
      caption: "Select a recipient to open their card, then drag their fields onto the document. Required lists who still needs a signature.",
      compare: 24,
      src: "/work/quick-send/clips/cards.mp4",
      poster: "/work/quick-send/clips/cards-poster.jpg",
      label: "Opening each recipient's card in the sidebar, and the list of recipients who still need signature fields",
      aspect: "670 / 1300",
      position: "top",
      bg: "#eef0f3",
    },
    {
      kind: "video",
      span: "one",
      title: "A message for each recipient",
      caption: "Each recipient can get their own email, with merge tags for their name and the document.",
      src: "/work/quick-send/clips/email-message.mp4",
      poster: "/work/quick-send/clips/email-message-poster.jpg",
      label: "Writing an email message for a recipient",
      aspect: "4 / 3",
      fit: "contain",
      bg: "#757ba0",
    },
    {
      kind: "video",
      span: "one",
      title: "Signer or approver",
      caption: "Switching a recipient's role, with a line on what each role does.",
      src: "/work/quick-send/clips/role.mp4",
      poster: "/work/quick-send/clips/role-poster.jpg",
      label: "Changing a recipient from signer to approver",
      aspect: "4 / 3",
      position: "left top",
    },
    {
      kind: "video",
      span: "wide",
      title: "Placing fields",
      caption: "Signature, text and date fields for each recipient in their colour, then Send.",
      compare: 25,
      src: "/work/quick-send/clips/fields.mp4",
      poster: "/work/quick-send/clips/fields-poster.jpg",
      label: "Placing fields for three recipients and sending, with the countdown on the Send button",
      aspect: "16 / 9",
    },
    {
      kind: "video",
      span: "one",
      fill: true,
      title: "Why Send is disabled",
      caption: "Hover the disabled Send button and it says what's missing, instead of leaving people guessing.",
      src: "/work/quick-send/clips/send-button.mp4",
      poster: "/work/quick-send/clips/send-button-poster.jpg",
      label: "Hovering the disabled Send Document button shows that signature fields are required",
      aspect: "470 / 438",
      fit: "contain",
      bg: "#f4f5f8",
    },
    {
      kind: "video",
      span: "one",
      fill: true,
      title: "The countdown on Send",
      caption: "Send counts down for five seconds before anything goes out, so a mistaken click can be cancelled.",
      src: "/work/quick-send/clips/countdown.mp4",
      poster: "/work/quick-send/clips/countdown-poster.jpg",
      label: "Pressing Send Document starts a five-second countdown with a Cancel button",
      aspect: "466 / 342",
      fit: "contain",
      bg: "#f4f5f8",
    },
    {
      kind: "video",
      span: "one",
      fill: true,
      title: "Sent",
      caption: "The send icon stretches out of its circle and snaps back as a tick.",
      src: "/work/quick-send/clips/success.mp4",
      poster: "/work/quick-send/clips/success-poster.jpg",
      label: "The Quick Send icon stretching out of a blue circle and turning into a tick",
      aspect: "1 / 1",
      fit: "contain",
      bg: "#ffffff",
    },
    {
      kind: "video",
      span: "one",
      title: "Send another",
      caption: "After sending, start again with the same document, the same recipients, or something new.",
      src: "/work/quick-send/clips/send-another.mp4",
      poster: "/work/quick-send/clips/send-another-poster.jpg",
      label: "Choosing what to send next after a document is sent",
      aspect: "1 / 1",
    },
    {
      kind: "note",
      span: "full",
      title: "Built as designed.",
      caption: "Every version was tested in Figma first, so by handoff there was little left to guess. The live product follows the final design closely, down to the recipient colours and the countdown on Send.",
      compare: 25,
    },
  ],
};
