// All site copy lives here so it can be edited without touching layout code.

export const person = {
  name: "Euan Robertson",
  role: "Lead Designer & Product Owner",
  email: "euan.g.robertson@gmail.com",
  cv: "/cv/Euan-Robertson-CV.pdf",
  // Drop a photo at public/images/euan.jpg and set this to "/images/euan.jpg".
  photo: null as string | null,
  intro:
    "I take complex, regulated enterprise software and make it feel simple. For the past five years I've led design and product at Legalesign, rebuilding an e-signature platform used by governments, councils and large organisations from the brand up.",
};

export const stats = [
  { value: "5+", label: "years leading one product" },
  { value: "100+", label: "features & workflows shipped" },
  { value: "3+", label: "years leading the design team" },
  { value: "1:1", label: "Figma ↔ code component library" },
];

export const about = {
  heading: "Designer by training. Product owner by necessity.",
  body: [
    "I studied Product Design at Glasgow School of Art, where I learned to start with research and systems thinking, not screens. After working as a graphic designer at The Young Foundation and running freelance branding projects, I joined Legalesign in 2021 to refresh a dated brand.",
    "That brief kept growing. I rebuilt the brand, then the product's UX and UI, then the design system that underpins it. Along the way I picked up product ownership: planning, feature definition, sprint management and delivery, working closely with developers, stakeholders and users.",
  ],
  strengths: [
    "Product strategy",
    "UX/UI design",
    "User research",
    "Workshop facilitation",
    "Interactive prototyping",
    "Design systems",
    "Stakeholder collaboration",
    "Cross-functional delivery",
    "Branding",
    "Accessibility & inclusive design",
  ],
};

export const caseStudy = {
  client: "Legalesign",
  years: "2021 – Present",
  title: "Rebuilding enterprise e-signature, from the brand up.",
  summary:
    "Legalesign is a secure, regulated e-signature platform used by governments, councils and large organisations. Over five years I led its transformation from a dated, hard-to-use tool into Console, a modern product built on a scalable design system.",
  problem: [
    {
      title: "Clients couldn't scale it",
      body: "Large customers wanted to roll Legalesign out across their organisations, but new users couldn't work out how to use it.",
    },
    {
      title: "A brand stuck in the past",
      body: "The visual identity and messaging hadn't kept pace with the product or the market it was competing in.",
    },
    {
      title: "Regulated, niche, high stakes",
      body: "Government and enterprise users meant strict security and accessibility requirements, and workflows you won't find anywhere else.",
    },
  ],
  timeline: [
    {
      phase: "01",
      when: "2021",
      title: "Rebrand",
      body: "Ran consultancy-style workshops to define the company's message and core pillars, then built the brand from the ground up: logo, identity, messaging, illustration direction and guidelines. Built the marketing site with an external developer and created templates so marketing could run the brand on their own.",
      tags: ["Workshops", "Identity", "Guidelines", "Website"],
    },
    {
      phase: "02",
      when: "First product",
      title: "Agent: offline signing",
      body: "My first UI and UX work for the product: an offline signing app for teams working in warehouses with no connection. A focused brief that set the pattern for everything after.",
      tags: ["Mobile", "Offline-first", "MVP"],
    },
    {
      phase: "03",
      when: "Foundation",
      title: "A design system, paired 1:1 with code",
      body: "Built a scalable design system in Figma, matched one-to-one with the frontend component library. Once it was in place, new features were like building with blocks. I also built and expanded a custom icon library, twice, for interactions you won't see in any off-the-shelf set.",
      tags: ["Figma", "Components", "Tokens", "Icons"],
    },
    {
      phase: "04",
      when: "Epics",
      title: "Console: rebuilding the product, feature by feature",
      body: "We moved the whole product to the new Console one epic at a time, each two to six months, while backend engineers rebuilt the platform to modern security standards. Every feature was researched, prototyped and tested with users before handover. I led the design team for 3+ years and grew into product ownership.",
      tags: ["Product ownership", "Sprints", "User testing", "Team lead"],
    },
    {
      phase: "05",
      when: "Latest",
      title: "Drafts & automated sending",
      body: "A rethought drafts and automated sending flow, plus a redesigned document editing page. Some of the best UX work I've done: complex, multi-step tasks made calm and obvious.",
      tags: ["Automation", "Editor", "UX"],
    },
  ],
  epics: [
    { name: "Signer Lobby", note: "Multi-participant signing workflows" },
    { name: "Dashboard", note: "The central hub of the product" },
    { name: "Mobile Signing App", note: "Mobile-first, AAA accessibility" },
    { name: "Quick Send", note: "Onboarding, trial conversion, churn" },
    { name: "Reporting Platform", note: "Usage insights & exports" },
    { name: "Bulk Sending", note: "Mass send via CSV upload" },
    { name: "Template Editing", note: "Reusable workflows across teams" },
    { name: "Support Hub", note: "Tickets & organisation oversight" },
    { name: "Workflow Configuration", note: "Admin control over sending" },
    { name: "Drafts & Auto-send", note: "Automated sending flow" },
  ],
  process: [
    { step: "Discover", body: "Interviews, support tickets and feedback distilled in FigJam." },
    { step: "Define", body: "Epics scoped with stakeholders; clear acceptance criteria." },
    { step: "Design", body: "Prototypes built from the design system, not from scratch." },
    { step: "Test", body: "Usability tests with real customers before a line of code." },
    { step: "Ship", body: "1:1 handover to developers; sprint-by-sprint delivery." },
  ],
};

export const experience = [
  {
    role: "Lead Designer / Product Owner",
    org: "Legalesign",
    when: "Jul 2021 – Present",
    body: "Lead design across enterprise agreements and e-signature software, from research to developer handover. Expanded into product ownership: planning, feature definition, sprint management and delivery. Led a complete company rebrand.",
  },
  {
    role: "Graphic Designer",
    org: "The Young Foundation",
    when: "Jul 2020 – Jul 2021",
    body: "Reports, digital content, templates, illustration, data visualisation and web updates within an established brand system, with a strong focus on accessibility.",
  },
  {
    role: "Freelance Graphic Designer",
    org: "Self-employed",
    when: "2019 – 2020",
    body: "Branding and visual identity for a range of clients: logos, brand systems, marketing materials and digital assets.",
  },
  {
    role: "BDes (Hons) Product Design",
    org: "Glasgow School of Art",
    when: "2015 – 2020",
    body: "Design thinking, research, prototyping, systems thinking and user-centred problem solving.",
  },
];

// Screens exported from the Figma source files (public/work).
export const screens = [
  {
    src: "/work/dashboard.png",
    w: 1452,
    h: 1073,
    title: "Dashboard",
    caption:
      "The redesigned hub: quick actions, a live document overview, ready-to-send templates and team activity.",
  },
  {
    src: "/work/lobby-batch.png",
    w: 1516,
    h: 1100,
    title: "Signer Lobby",
    caption:
      "Multi-document, multi-recipient signing sessions with sequential ordering, approvals and clear progress.",
  },
  {
    src: "/work/lobby-verify.png",
    w: 1516,
    h: 1100,
    title: "Identity verification",
    caption:
      "2FA and access checks before signing, designed for government-grade security without the friction.",
  },
  {
    src: "/work/dashboard-mobile.png",
    w: 442,
    h: 914,
    title: "Dashboard, mobile",
    caption: "Every core flow designed down to a mobile breakpoint.",
  },
];

// Highlights from the Legalesign brand guidelines (public/brand), which Euan
// created in 2021. Pages are 1600×1131.
export const brand = {
  heading: "A brand built to carry everything that came after.",
  body: "I designed the Legalesign identity and wrote its guidelines: the TriDoc mark, wordmark, colour system, type, the LS Ribbon and an isometric illustration style. Marketing, sales and the product team still build from it today, and its colour scale became the foundation of the Console design tokens.",
  // Legalesign Brand Blue, steps 10–100 from the guidelines.
  blues: [
    "#EFF4FF", "#C7DDFF", "#9DC3FC", "#79ADFC", "#5185FF",
    "#4456F6", "#2134DC", "#0E20C1", "#000F99", "#0C1457",
  ],
  pages: [
    { src: "/brand/p8.jpg", title: "Primary logo", span: "wide" },
    { src: "/brand/p7.jpg", title: "TriDoc colour options", span: "half" },
    { src: "/brand/p17.jpg", title: "The brand in the world", span: "half" },
    { src: "/brand/p19.jpg", title: "Colour scale, LS Blue", span: "half" },
    { src: "/brand/p20.jpg", title: "Typography, IBM Plex", span: "half" },
    { src: "/brand/p21.jpg", title: "Fifth element: the LS Ribbon", span: "wide" },
    { src: "/brand/p24.jpg", title: "Illustration: shading", span: "half" },
    { src: "/brand/p25.jpg", title: "Illustration: light & form", span: "half" },
    { src: "/brand/p29.jpg", title: "Pictogram set", span: "wide" },
  ],
} as const;
