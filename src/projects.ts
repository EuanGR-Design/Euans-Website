// Every project on the site, and what each case study page shows.
// Pages are built from `blocks`, top to bottom. Images live in public/.

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

type Img = { src: string; w: number; h: number; alt: string; caption?: string };

type JourneyStep = {
  stage: "Research" | "Ideation" | "Iteration" | "Handoff" | "Shipped";
  title: string;
  decision: string;
  image: string | null;
  // False while `decision` is still a prompt rather than real copy.
  written: boolean;
};

export type Block =
  | { type: "text"; eyebrow?: string; heading: string; body: string[] }
  | { type: "points"; eyebrow?: string; heading: string; items: { title: string; body: string }[] }
  | { type: "image"; image: Img }
  | { type: "gallery"; eyebrow?: string; heading: string; images: Img[] }
  | {
      type: "comparison";
      eyebrow?: string;
      heading: string;
      // Leave a side null until its screenshot exists (1440×900 works best).
      items: { id: string; label: string; before: string | null; after: string | null; caption: string }[];
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
  | { type: "brand" };

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
  featured?: boolean;
  // Coming-soon projects show as a card but have no page yet.
  comingSoon?: boolean;
  intro: string;
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

const evidenceHint = "Add the evidence: a support-ticket theme, a Hotjar finding or a user quote.";

const dashboard: Img = {
  src: "/work/dashboard.png",
  w: 1452,
  h: 1073,
  alt: "The Console dashboard: quick actions, document overview, ready-to-send templates and team activity",
};

export const projects: Project[] = [
  {
    slug: "console",
    era: "legalesign",
    title: "Console",
    summary: "Rebuilding a legacy enterprise e-signature product, feature by feature.",
    year: "2021 – Present",
    role: "Design lead, product owner",
    tags: ["Product design", "Design system", "Research"],
    cover: dashboard,
    featured: true,
    intro:
      "Legalesign is a secure, regulated e-signature platform used by governments, councils and large organisations. Over two years I recreated the whole legacy product in a new system, Console, built on a design system I created and matched 1:1 with code.",
    blocks: [
      {
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
      },
      {
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
      },
      {
        type: "timeline",
        eyebrow: "How it came together",
        heading: "From one brief to a whole product.",
        items: [
          {
            when: "Foundation",
            title: "Design system: paired 1:1 with code",
            body: "Created and maintain the company design system in Figma, matched one-to-one with the frontend component library. Once it was in place, new features were like building with blocks. I also built and expanded a custom icon library, twice, for interactions you won't find in any off-the-shelf set.",
            tags: ["Figma", "Components", "Tokens", "Icons"],
          },
          {
            when: "Two years",
            title: "Rebuilding the legacy product, feature by feature",
            body: "Recreated the entire legacy enterprise software in the new system, one epic at a time, while backend engineers rebuilt the platform to modern security standards. Every feature was researched, prototyped and tested with users before handover. I led the design team throughout.",
            tags: ["Epics", "User testing", "Team lead"],
          },
          {
            when: "Last 1–2 years",
            title: "Product ownership: design and delivery",
            body: "Without stepping away from design, I gradually took on product owner duties, filling business needs and taking control of a larger part of the development process. I plan bi-weekly sprints in Jira, write the epics and tickets developers work from, and manage bugs and feature requests.",
            tags: ["Product ownership", "Jira", "Figma Make"],
          },
        ],
      },
      {
        type: "points",
        eyebrow: "Also shipped",
        heading: "More products and workflows inside Console.",
        items: [
          { title: "Mobile Signing", body: "A new mobile-first signing experience, designed to AAA accessibility." },
          { title: "Bulk Sending", body: "A separate app for sending many documents out for signing at once." },
          { title: "Reporting", body: "A site for org admins and team users to review and export product usage data." },
          { title: "Support Hub", body: "A customer support and ticketing hub serving both users and the internal support team." },
        ],
      },
    ],
  },
  {
    slug: "template-editor",
    era: "legalesign",
    title: "Template Editor",
    summary: "Placing and assigning fields, made faster and harder to get wrong.",
    role: "Design lead, product owner",
    tags: ["UX", "Prototyping", "User testing"],
    cover: null,
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
    featured: true,
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
    role: "Design lead",
    tags: ["Onboarding", "Conversion", "UX"],
    cover: null,
    intro:
      "A new send flow built around trial users. It put the user experience first, so people exploring the product during their trial got further, were less confused, and more of them signed up.",
    blocks: [
      { type: "journey", problem: "Trial users were bouncing before they'd sent anything, and the send flow was the reason.", evidence: evidenceHint, steps: journeySteps("Trial users explored more of the product and more of them signed up.") },
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
    slug: "university-projects",
    era: "university",
    title: "University projects",
    summary: "Product design work from Glasgow School of Art.",
    year: "2015 – 2020",
    role: "Student",
    tags: ["Product design", "Research"],
    cover: null,
    comingSoon: true,
    intro: "",
    blocks: [],
  },
  {
    slug: "freelance-branding",
    era: "freelance",
    title: "Brand identities",
    summary: "Logos, brand systems and marketing materials for a range of clients.",
    year: "2019 – 2020",
    role: "Freelance designer",
    tags: ["Branding", "Identity"],
    cover: null,
    comingSoon: true,
    intro: "",
    blocks: [],
  },
];

export const liveProjects = projects.filter((p) => !p.comingSoon);
export const getProject = (slug: string) => liveProjects.find((p) => p.slug === slug);
