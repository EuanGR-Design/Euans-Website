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
  | { type: "brand" }
  // A video player (Vimeo, Adobe) or another embeddable page, shown 16:9.
  | { type: "embed"; eyebrow?: string; heading: string; body?: string; items: { url: string; title: string; caption?: string }[] };

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

// An image from the old portfolio export (images/<ref>), waiting to be added
// at public/work/old/<ref>. Swap `src` in once the file is there.
const shot = (ref: string, alt: string, caption?: string, w = 1600, h = 1000): Img => ({
  src: null,
  w,
  h,
  alt,
  caption,
  ref,
});

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
      { type: "image", image: shot("tacc/12.png", "Personas for Sarah and Anton", "Personas: Sarah, 34, working multiple jobs with little time, and Anton, 27, a business owner who doubts small actions matter.", 1200, 2400) },
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
          shot("kate-sam-lighting/02.jpg", "Website homepage design", "Homepage: services, approach and a call to action.", 1600, 3200),
          shot("kate-sam-lighting/03.jpg", "Website projects page", "Projects grid.", 1600, 2400),
          shot("kate-sam-lighting/04.jpg", "Website project detail page", "Project detail: Langham Chuan Body + Soul Spa.", 1600, 2400),
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
          shot("tynings/08.png", "Logo development grid", "From geometric forms, through curled fish, to the final low-poly mark.", 1600, 2000),
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
export const getProject = (slug: string) => liveProjects.find((p) => p.slug === slug);
