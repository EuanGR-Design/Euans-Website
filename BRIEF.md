# Euan Robertson — Portfolio Site Brief

Distilled from the kickoff conversation on 2026-10-08. This is the source of truth for whoever builds the site (human or Claude).

## Goal
A personal portfolio for **Euan Robertson, Lead Designer / Product Owner**. The site is about **Euan first**, and its centrepiece is one strong, five-year case study: **Legalesign**, an enterprise e-signature product. It should help him land product design, product owner or design lead roles at tech startups and agencies. It should also show broader design skills (branding, icon libraries, design systems) for design-focused roles.

## Stack and deploy
- Next.js (App Router, TypeScript) + Framer Motion (+ Tailwind is fine)
- Repo: https://github.com/EuanGR-Design/Euans-Website
- Deploy: Vercel (Euan has an account, so link the repo there)

## Look and feel
- Modern, slick, Apple-esque, well animated. It should feel non-traditional ("break the rules") while keeping **function over form**: clear, high-level, simple.
- References: Awwwards (how it presents and breaks up projects), Godly (godly.website). Use interesting interactive elements, but never at the cost of clarity.
- Accessibility matters: Euan's own product work had to meet strict accessibility standards (AAA for the mobile signing app), so the site should model that. Use semantic HTML, keyboard navigation, `prefers-reduced-motion` and good contrast.

## Site structure
1. **Hero**: Euan, Lead Designer & Product Owner. Use a photo of Euan (none yet, so use a placeholder at `public/images/euan.jpg`; he will supply one or have studio shots taken).
2. **About**: who he is and what he's been doing (see CV summary below).
3. **CV**: downloadable PDF at `public/cv/Euan-Robertson-CV.pdf`, plus an interactive or on-page version of the key points.
4. **Case study: Legalesign (2021 to present)**: told as a **timeline of the product's evolution**, starting with **before vs after**.
5. **Other skills** (optional sections): brand identity, icon library, design system.
6. Contact.

## The Legalesign case study, as a story

### The problem (where it started)
- Legalesign is a B2B enterprise e-signature product (like DocuSign, but more secure). Its users include governments, councils and large organisations, so it is regulated and must be highly accessible.
- Large clients wanted to roll it out more widely across their organisations, but the **UX/UI was so poor that people could not understand how to use it**.
- The brand was badly dated.
- The old product is **still live** (the "v1" app), and the new product, **Console**, replaced it. Console matches the old product one-to-one in features, adds many new ones, and has much better UX/UI. Show before and after comparisons (screenshots and slider).
- Euan has user feedback distillations in Figma/FigJam that can be mocked up as research artefacts.

### Timeline
- **2021: Joined; rebrand.** Brought the brand into the 2020s. Ran consultancy-style workshops to find the message and core pillars, then built the brand from the ground up: logo, visual identity, messaging, illustration direction, and brand guidelines (see `brief/legalesign-brand-guidelines.pdf`). He couldn't change the name. He built the marketing website with an external developer (two versions) and created templates so marketing could run the brand themselves, designed for easy handoff.
- **Design system.** Built a scalable design system in Figma, paired one-to-one with a frontend component library. Once it was in place, building features was "like building with blocks". He also built and expanded the **icon library twice**: the enterprise use cases are so niche that many interactions needed custom icons.
- **Migrating the product to Console**, feature by feature, as epics of roughly 2 to 6 months each. Every feature was UX- and UI-tested. While Euan led frontend and design, backend developers rebuilt the backend to modern security standards. He led the full design team for 3+ years and partly led the developers. Over time his role grew into product ownership: planning, feature definition, sprint management and delivery.
- **Releases and epics** (from the CV): Signer Lobby (multi-participant signing), redesigned Dashboard, Mobile Signing App (mobile-first, AAA accessibility), Quick Send Flow (onboarding, trial conversion, churn), Reporting Platform, Bulk Sending (CSV), Template Editing System, Support Hub, Workflow Configuration.
- **Most recent:** the **Drafts automated sending flow**, which Euan considers some of his best UX, and an updated **editing page**.
- Core product areas: e-signature sending, the listing page (what you've sent), and the editing page (placing and editing fields).
- Headline number: **100+ features and workflows** designed and delivered.

### Framing to get across
Show the MVP and Euan's remit at that stage, then the releases that followed as sprints. Explain how he managed the team, the design system, and ongoing updates.

## Assets
- CV: `public/cv/Euan-Robertson-CV.pdf` (note: it includes his phone number)
- Brand guidelines: `brief/legalesign-brand-guidelines.pdf` (reference only; don't publish it in full)
- Figma folder: https://figma.com/files/folder/667605701 (individual file links are needed to pull screens)
- Photo of Euan: still needed
- Live product URLs, old v1 and new Console: still needed

## CV summary
- **Lead Designer / Product Owner, Legalesign**, July 2021 to present
- Graphic Designer, The Young Foundation, 2020–2021
- Freelance Graphic Designer, 2019–2020
- BDes (Hons) Product Design, Glasgow School of Art, 2015–2020
- Strengths: product strategy, UX/UI, user research, workshop facilitation, interactive prototyping, design systems, stakeholder collaboration, cross-functional delivery, visual design & branding, accessibility & inclusive design.
