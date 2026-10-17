import Link from "next/link";
import { person } from "@/content";
import { cardInfo, liveProjects, projectHref } from "@/projects";
import { ProjectLink } from "./ProjectTransition";
import { Reveal } from "./motion";

const site = [
  { href: "/work", label: "All work" },
  { href: "/#approach", label: "Approach" },
  { href: "/#about", label: "About" },
  { href: "/#cv", label: "Experience" },
];

/** A dark footer block with columns of links, as on Awwwards. */
export function Contact() {
  const featured = liveProjects.filter((p) => p.featured);
  return (
    <footer
      id="contact"
      className="bg-tertiary pt-24 text-on-tertiary md:pt-32 [--line:color-mix(in_srgb,var(--on-tertiary)_18%,transparent)] [--muted:color-mix(in_srgb,var(--on-tertiary)_72%,transparent)]"
    >
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="mt-6 text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] font-semibold">
            Let&apos;s build
            <br />
            <span className="text-on-tertiary/55">something clear.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <a
            href={`mailto:${person.email}`}
            className="mt-10 inline-block border-b border-on-tertiary/30 pb-1 text-xl break-all transition-colors hover:border-accent hover:text-accent md:text-3xl"
          >
            {person.email}
          </a>
        </Reveal>

        <div className="mt-20 grid gap-10 border-t border-line pt-10 text-sm sm:grid-cols-3 md:mt-28">
          <Column title="Selected work">
            {featured.map((p) => (
              <li key={p.slug}>
                <ProjectLink card={cardInfo(p)} href={projectHref(p)} className="transition-colors hover:text-accent">
                  {p.title}
                </ProjectLink>
              </li>
            ))}
          </Column>
          <Column title="Site">
            {site.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </Column>
          <Column title="Get in touch">
            <li>
              <a href={`mailto:${person.email}`} className="transition-colors hover:text-accent">
                Email
              </a>
            </li>
            <li>
              <a href={person.cv} download className="transition-colors hover:text-accent">
                Download CV
              </a>
            </li>
          </Column>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-line py-8 text-sm text-muted md:flex-row">
          <span>© {new Date().getFullYear()} {person.name}</span>
          <a href="#main" className="hover:text-on-tertiary">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-2.5 font-medium">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-accent">
        {children}
      </Link>
    </li>
  );
}
