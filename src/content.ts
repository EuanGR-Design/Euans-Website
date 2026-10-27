// All site copy lives here so it can be edited without touching layout code.

import { basePath } from "@/lib/basePath";
import { slot } from "@/caseStudy";
import type { Block } from "@/projects";

export const person = {
  name: "Euan Robertson",
  role: "Design Lead, with product ownership",
  email: "euan.g.robertson@gmail.com",
  cv: `${basePath}/cv/Euan-Robertson-CV.pdf`,
  // Drop a photo at public/images/euan.jpg and set this to "/images/euan.jpg".
  photo: null as string | null,
  // The line above the projects at the top of the home page.
  statement: "I lead product design from research to release, and own the product decisions in between.",
  // A quieter line under the statement, on where the way of working comes from.
  roots: "Trained at Glasgow School of Art. I still start with the problem, not the pixels.",
  intro:
    "Five years leading design at Legalesign, an enterprise e-signature platform, and more recently owning the product too. I research, prototype and test until the work holds up, then see it through to launch.",
};

// The projects the home page opens on, in order.
export const homeCarousel = ["quick-send", "getting-unstuck", "template-editor", "console", "mobile-signing", "drafts", "rebrand"];

export const stats = [
  { value: "5+", label: "years in product design" },
  { value: "100+", label: "features & workflows shipped" },
  { value: "3+", label: "years leading a design team" },
  { value: "1", label: "brand built from the ground up" },
];

// Career milestones on the home page. `era` links to that era on /work and
// `project` to a single case study.
export const milestones: {
  when: string;
  title: string;
  org: string;
  body: string;
  link?: { href: string; label: string };
}[] = [
  {
    when: "2015 – 2020",
    title: "Learning to design",
    org: "Glasgow School of Art",
    body: "A BDes (Hons) in Product Design taught me to start with research and systems thinking, not screens.",
    link: { href: "/work?era=university", label: "University projects" },
  },
  {
    when: "2019 – 2020",
    title: "Building brands",
    org: "Freelance",
    body: "Logos, brand systems, marketing materials and digital assets for a range of clients.",
    link: { href: "/work?era=freelance", label: "Freelance work" },
  },
  {
    when: "2020 – 2021",
    title: "Design in a brand system",
    org: "The Young Foundation",
    body: "Reports, illustration, data visualisation, journey mapping and templates, with a strong focus on accessibility.",
  },
  {
    when: "2021",
    title: "A rebrand, from the workshops up",
    org: "Legalesign",
    body: "Joined to refresh a dated brand. Ran the workshops, built the identity and wrote the guidelines.",
    link: { href: "/work/rebrand", label: "The rebrand" },
  },
  {
    when: "2021 – Present",
    title: "Rebuilding the product",
    org: "Legalesign",
    body: "Created the design system and rebuilt the whole product in it, leading the design team for 3+ years.",
    link: { href: "/work/legalesign", label: "Console" },
  },
  {
    when: "Last 1–2 years",
    title: "Owning the product",
    org: "Legalesign",
    body: "Took on product owner duties alongside design: sprints, epics and tickets, and the roadmap.",
    link: { href: "/work?era=legalesign", label: "Legalesign projects" },
  },
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
  // The skills index: each skill links straight to the part of the site
  // that proves it, even halfway down a case study.
  skills: [
    {
      skill: "Prototyping",
      proof: [
        { label: "Quick Send", href: "/work/quick-send#prototypes" },
        { label: "Template Editor", href: "/work/template-editor#built-to-test-itself" },
        { label: "Mobile Signing", href: "/work/mobile-signing#try-it" },
      ],
    },
    {
      skill: "User testing & A/B tests",
      proof: [
        { label: "Template Editor", href: "/work/template-editor#a-b-inside-the-prototype" },
        { label: "Quick Send", href: "/work/quick-send#25-versions" },
      ],
    },
    { skill: "Iteration", proof: [{ label: "Quick Send", href: "/work/quick-send#25-versions" }] },
    { skill: "User research", proof: [{ label: "Getting Unstuck", href: "/work/getting-unstuck#problem" }] },
    { skill: "Personas", proof: [{ label: "Getting Unstuck", href: "/work/getting-unstuck#discover" }] },
    { skill: "Journey mapping", proof: [{ label: "Getting Unstuck", href: "/work/getting-unstuck#problem" }] },
    {
      skill: "User stories & story mapping",
      proof: [
        { label: "Story maps", href: "/work/getting-unstuck#develop" },
        { label: "User stories", href: "/work/getting-unstuck#product-owner" },
      ],
    },
    { skill: "Prioritisation", proof: [{ label: "Getting Unstuck", href: "/work/getting-unstuck#define" }] },
    {
      skill: "Complex flows & logic",
      proof: [
        { label: "Drafts", href: "/work/drafts#drafts" },
        { label: "Signer Lobby", href: "/work/drafts#signer-lobby-states" },
      ],
    },
    { skill: "Mobile UI", proof: [{ label: "Mobile Signing", href: "/work/mobile-signing" }] },
    {
      skill: "UI & design systems",
      proof: [
        { label: "Design system", href: "/work/legalesign#design-system" },
        { label: "Quick Send", href: "/work/quick-send#key-decisions" },
      ],
    },
    {
      skill: "Product ownership",
      proof: [
        { label: "Getting Unstuck", href: "/work/getting-unstuck#product-owner" },
        { label: "Rebuilding Legalesign", href: "/work/legalesign#my-remit" },
      ],
    },
    { skill: "Accessibility", proof: [{ label: "Mobile Signing", href: "/work/mobile-signing#accessibility" }] },
    { skill: "Dev handoff", proof: [{ label: "Quick Send", href: "/work/quick-send#design-to-dev-handoff" }] },
    {
      skill: "Branding, logo, print & web",
      proof: [
        { label: "Legalesign rebrand", href: "/work/rebrand" },
        { label: "Website", href: "/work/rebrand#the-website" },
      ],
    },
  ],
};

// The double diamond. Euan leads the first as a designer and the second
// as product owner.
export const designProcess = {
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

// Work that slides past under the home page statement. Each tile links to
// its project.
export const showreel = [
  { src: "/work/dashboard.png", w: 1452, h: 1073, alt: "Console dashboard", href: "/work/legalesign" },
  { src: "/brand/p8.jpg", w: 1600, h: 1131, alt: "Legalesign primary logo", href: "/work/rebrand" },
  { src: "/work/lobby-batch.png", w: 1516, h: 1100, alt: "Signer Lobby", href: "/work/signer-lobby" },
  { src: "/brand/p25.jpg", w: 1600, h: 1131, alt: "Legalesign illustration style", href: "/work/rebrand" },
  { src: "/work/drafts-v2-cover.png", w: 800, h: 566, alt: "Drafts", href: "/work/drafts" },
  { src: "/brand/p17.jpg", w: 1600, h: 1131, alt: "Legalesign brand on a banner", href: "/work/rebrand" },
  { src: "/work/lobby-verify.png", w: 1516, h: 1100, alt: "Identity verification", href: "/work/signer-lobby" },
  { src: "/brand/p29.jpg", w: 1600, h: 1131, alt: "Legalesign pictogram set", href: "/work/rebrand" },
];

// The How I work page: where the way of working comes from, told as a story
// rather than a diagram, then how it runs on a product team today.
export const foundations = {
  heading: "Research first, then taste that's earned.",
  intro:
    "I learned to design at Glasgow School of Art, starting from the problem and the people who have it. Years of shipping product have built a design eye I can trust, but the fundamentals I learned there are still what I lean on.",
  blocks: [
    slot(
      "Where it started",
      "Glasgow School of Art.",
      "The story in three short paragraphs: what Product Design at GSA taught you (research, co-design, systems thinking), how that became a mindset rather than a method, and how practice turned it into taste. Not a list of stages.",
    ),
    slot(
      "The knotted line",
      "Design isn't a straight line.",
      "Your tutor's sketch, drawn as the site's signature: a line that rises and dips, ties itself in a knot, then straightens out at delivery. A line on why that's truer than a neat diagram. Each case study can open with its own version.",
    ),
    slot(
      "How it works today",
      "The loop on a product team.",
      "Research over Teams calls, insights into Jira, design in Figma, reviews in FigJam, prototypes in Figma Make, sprints with the developers, then Hotjar and PostHog feeding back into Jira. Drawn as a loop, each step a short tag.",
    ),
  ] satisfies Block[],
  // The early projects, shown for the process behind them rather than as
  // polished showcase pieces.
  projects: [
    {
      title: "SPACEBUDS",
      body: "Research, co-design and personas behind a service for people living with food allergies.",
      href: "/work/spacebuds",
    },
    { title: "tacc", body: "Research and planning behind personalised plans for living a more sustainable life.", href: "/work/tacc" },
  ],
};
