import { person } from "@/content";
import { Reveal } from "./motion";

export function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line pt-24 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/30 blur-[140px]"
      />
      <div className="container-x relative">
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
            className="mt-10 inline-block border-b border-fg/30 pb-1 text-xl break-all transition-colors hover:border-accent hover:text-accent md:text-3xl"
          >
            {person.email}
          </a>
        </Reveal>
        <div className="mt-24 flex flex-col justify-between gap-4 border-t border-line py-8 text-sm text-muted md:flex-row">
          <span>© {new Date().getFullYear()} {person.name}</span>
          <a href="#main" className="hover:text-fg">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
