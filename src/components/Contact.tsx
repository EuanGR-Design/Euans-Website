import Link from "next/link";
import { person } from "@/content";
import { cardInfo, liveProjects, projectHref } from "@/projects";
import { ProjectLink } from "./ProjectTransition";
import { Reveal } from "./motion";

const site = [
  { href: "/work", label: "All work" },
  { href: "/#about", label: "About" },
  { href: "/#cv", label: "Experience" },
];

/** A dark footer block inviting a chat about a role, then columns of links. */
export function Contact() {
  const featured = liveProjects.filter((p) => p.featured);
  return (
    <footer
      id="contact"
      className="bg-tertiary pt-24 text-on-tertiary md:pt-32 [--line:color-mix(in_srgb,var(--on-tertiary)_18%,transparent)] [--muted:color-mix(in_srgb,var(--on-tertiary)_72%,transparent)]"
    >
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Open to new roles</p>
          <h2 className="mt-6 text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] font-semibold">
            Want to hear more?
            <br />
            <span className="text-on-tertiary/55">Let&apos;s talk.</span>
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-on-tertiary/75 md:text-xl">
            I&apos;m looking for my next design role. If you&apos;d like the story behind any of these projects, or how I&apos;d
            approach yours, I&apos;d love to chat.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href={`mailto:${person.email}`}
              className="inline-block border-b border-on-tertiary/30 pb-1 text-xl break-all transition-colors hover:border-accent hover:text-accent md:text-3xl"
            >
              {person.email}
            </a>
            <a
              href={person.cv}
              download
              className="inline-flex h-12 items-center rounded-full bg-on-tertiary px-6 font-medium text-tertiary transition-colors hover:bg-accent hover:text-on-accent"
            >
              Download CV
            </a>
          </div>
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
