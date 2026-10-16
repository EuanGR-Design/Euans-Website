import { person } from "@/content";
import { Reveal } from "./motion";

export function Contact() {
  return (
    <footer id="contact" className="bg-tertiary pt-24 text-on-tertiary md:pt-40 [--line:color-mix(in_srgb,var(--on-tertiary)_18%,transparent)] [--muted:color-mix(in_srgb,var(--on-tertiary)_72%,transparent)]">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h2 className="mt-6 text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
            Let&apos;s build
            <br />
            <span className="font-serif font-normal italic">something clear.</span>
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
        <div className="mt-24 flex flex-col justify-between gap-4 border-t border-line py-8 text-sm text-muted md:flex-row">
          <span>© {new Date().getFullYear()} {person.name}</span>
          <a href="#main" className="hover:text-on-tertiary">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
