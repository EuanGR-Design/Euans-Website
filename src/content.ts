// All site copy lives here so it can be edited without touching layout code.

import { basePath } from "@/lib/basePath";

export const person = {
  name: "Euan Robertson",
  role: "Design Lead, with product ownership",
  email: "euan.g.robertson@gmail.com",
  cv: `${basePath}/cv/Euan-Robertson-CV.pdf`,
  // Drop a photo at public/images/euan.jpg and set this to "/images/euan.jpg".
  photo: null as string | null,
  intro:
    "I lead design at Legalesign, a secure e-signature platform used by governments, councils and large organisations, and over the last couple of years I've taken on product ownership too. I take complex, regulated workflows and make them feel simple, from the brand and the research all the way to the Jira tickets developers build from.",
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
    "I studied Product Design at Glasgow School of Art, where I learned to start with research and systems thinking, not screens. I went on to freelance on brand projects, then joined The Young Foundation as a graphic designer, working across reports, illustration, data visualisation and templates within an established brand.",
    "I joined Legalesign in 2021 to refresh a dated brand. That brief kept growing: the brand, then the website, then the whole product's UX and UI and the design system under it. I'm Design Lead, and over the past one to two years I've taken on more and more product owner duties alongside it: filling business needs, planning sprints, writing epics, and owning a larger share of how the product gets built.",
  ],
  approach: [
    {
      title: "Design-led, research first",
      body: "Workshops, interviews and user testing come before pixels. A clear design-thinking process is where I add the most value.",
    },
    {
      title: "Inclusive by default",
      body: "Accessibility isn't a final check. It shapes the work from the start, up to AAA on the mobile signing experience.",
    },
    {
      title: "Close to the build",
      body: "Detailed handover files, a component library matched 1:1 with code, and Jira epics developers can pick up and run with.",
    },
  ],
  skills: [
    {
      group: "Product",
      items: [
        "Product ownership",
        "Sprint planning",
        "Project planning",
        "Jira epics & tickets",
        "Product research",
        "Bug & feature triage",
      ],
    },
    {
      group: "Research",
      items: [
        "User research",
        "User interviews",
        "User journey mapping",
        "User testing & A/B tests",
        "Hotjar analytics",
        "Workshop facilitation",
      ],
    },
    {
      group: "Design",
      items: [
        "UI design",
        "Interactive prototyping",
        "Design systems (Figma)",
        "Developer handoff",
        "Accessibility",
        "Prompt coding (Figma Make)",
      ],
    },
    {
      group: "Brand",
      items: [
        "Brand strategy & identity",
        "Brand guidelines",
        "Illustration direction",
        "Icon & logo animation",
        "Data visualisation",
        "Marketing websites",
      ],
    },
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
      title: "Rebrand: message first, then visuals",
      body: "Ran a series of collaborative workshops with the founders and wider team to define the company's message, tone, market and users. From that I built the brand: logo, type, colour, iconography and guidelines. I worked with illustrators to define an illustration style, animated the logo and icon set, and have kept the brand evolving since.",
      tags: ["Workshops", "Identity", "Illustration", "Animation"],
    },
    {
      phase: "02",
      when: "Website",
      title: "Website: built so marketing could own it",
      body: "Designed a new customer-facing website from scratch in Figma and delivered it with external developers on Storyblok, so the marketing team could update it without a developer. Looking back, I could now design, build and launch it myself with prompt-coding tools.",
      tags: ["Figma", "Storyblok", "Web"],
    },
    {
      phase: "03",
      when: "Foundation",
      title: "Design system: paired 1:1 with code",
      body: "Created and maintain the company design system in Figma, matched one-to-one with the frontend component library. Once it was in place, new features were like building with blocks. I also built and expanded a custom icon library, twice, for interactions you won't find in any off-the-shelf set.",
      tags: ["Figma", "Components", "Tokens", "Icons"],
    },
    {
      phase: "04",
      when: "Two years",
      title: "Console: rebuilding the legacy product, feature by feature",
      body: "Recreated the entire legacy enterprise software in the new system, one epic at a time, while backend engineers rebuilt the platform to modern security standards. Every feature was researched, prototyped and tested with users before handover. I led the design team throughout.",
      tags: ["Epics", "User testing", "Team lead"],
    },
    {
      phase: "05",
      when: "Last 1–2 years",
      title: "Product ownership: design and delivery",
      body: "Without stepping away from design, I gradually took on product owner duties, filling business needs and taking control of a larger part of the development process. I plan bi-weekly sprints in Jira, write the epics and tickets developers work from, and manage bugs and feature requests. Prototypes are now fully interactive in Figma Make, with test environments for A/B testing with real users.",
      tags: ["Product ownership", "Jira", "Figma Make", "A/B testing"],
    },
  ],
  epics: [
    {
      name: "Quick Send",
      note: "A streamlined send flow built to cut trial bounce and churn. Trial users explored more of the product, got further, and more of them signed up.",
    },
    {
      name: "Drafts",
      note: "A send-flow configurer: admins pre-fill and lock settings, so everyday senders have less to fill in, in a controlled environment.",
    },
    {
      name: "Template Editor",
      note: "A rethought editor that makes placing and assigning fields before sending far easier.",
    },
    {
      name: "Signer Lobby",
      note: "Controls the signing flow for recipients across multi-document, multi-participant sends.",
    },
    {
      name: "Mobile Signing",
      note: "A new mobile-first signing experience, designed to AAA accessibility.",
    },
    {
      name: "Bulk Sending",
      note: "A separate app for sending many documents out for signing at once.",
    },
    {
      name: "Reporting",
      note: "A site for org admins and team users to review and export product usage data.",
    },
    {
      name: "Support Hub",
      note: "A customer support and ticketing hub serving both users and the internal support team.",
    },
    {
      name: "Customer Website",
      note: "Designed from scratch and built on Storyblok with external developers, so marketing can run it.",
    },
  ],
  // The double diamond. Euan leads the first as a designer and the second
  // as product owner.
  process: {
    heading: "Double diamond, end to end.",
    intro:
      "I design each product in full first: the complete end goal, shaped by research and as many rounds of user feedback as it takes. Then my role shifts to product owner, breaking it into phases that start with an MVP and seeing each one through development.",
    diamonds: [
      {
        label: "Diamond one · the right problem",
        note: "As design lead",
        steps: [
          {
            step: "Discover",
            body: "User research, interviews, workshops and Hotjar data to understand the real problem and who has it.",
          },
          {
            step: "Define",
            body: "Journeys mapped, then the whole product designed and prototyped, iterated through rounds of user testing.",
          },
        ],
      },
      {
        label: "Diamond two · the right solution",
        note: "As product owner",
        steps: [
          {
            step: "Develop",
            body: "I plan the sprints, write the Jira tickets and meet with developers to talk through the technical requirements.",
          },
          {
            step: "Deliver",
            body: "Redefining the MVP against what's possible, the time and the budget. Each release is tested internally, then with users.",
          },
        ],
      },
    ],
    pipeline:
      "While one project is in development, I'm already designing the next, so there's always a finished design queued up when developers are ready.",
  },
};

export const experience = [
  {
    role: "Design Lead",
    org: "Legalesign",
    when: "Jul 2021 – Present",
    body: "Lead design for an enterprise e-signature and agreements platform, from research to release. Over the last one to two years I've also taken on product owner duties, alongside design rather than instead of it.",
    points: [
      "Led a complete company rebrand through collaborative workshops, from message and tone to logo, illustration and animated iconography.",
      "Designed a new customer-facing website, delivered with external developers on Storyblok.",
      "Recreated the entire legacy product in a new system over two years, feature by feature.",
      "Took on product owner duties over the last 1–2 years: Jira epics and tickets, bi-weekly sprints, bugs and feature requests.",
      "Created and maintain the company design system in Figma, matched 1:1 with code.",
      "Led the design team for 3+ years.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "The Young Foundation",
    when: "Jul 2020 – Jul 2021",
    body: "Graphic design across every part of the brand, producing visual materials for many platforms and formats while working closely to brand guidelines.",
    points: [
      "Reports, templates and digital content.",
      "Typography, illustration and icon design.",
      "Charts, graphs and data visualisation.",
      "User journey mapping and storyboarding.",
      "Video editing and website updates.",
    ],
  },
  {
    role: "Freelance Graphic Designer",
    org: "Self-employed",
    when: "2019 – 2020",
    body: "Branding and visual identity for a range of clients: logos, brand systems, marketing materials and digital assets.",
    points: [] as string[],
  },
  {
    role: "BDes (Hons) Product Design",
    org: "Glasgow School of Art",
    when: "2015 – 2020",
    body: "Design thinking, research, prototyping, systems thinking and user-centred problem solving.",
    points: [] as string[],
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

// Interactive prototype for the redesigned document editor, published with
// Figma Sites. `width`/`height` are the size it was designed at.
export const prototype = {
  url: "https://love-model-19724475.figma.site/",
  eyebrow: "Interactive prototype",
  title: "Try the new document editor.",
  body: "The redesigned document editing page, built as a clickable prototype in Figma. This is the kind of prototype I put in front of users before a line of production code was written. Have a click around.",
  hint: "Best on a laptop or desktop. It's a working prototype, so not every path is wired up.",
  width: 1440,
  height: 900,
};
