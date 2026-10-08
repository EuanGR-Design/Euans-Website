import { about } from "@/content";
import { Reveal } from "./motion";

export function About() {
  return (
    <section id="about" className="py-24 md:py-40">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">About</p>
        </Reveal>
        <div className="lg:col-span-8">
          <Reveal>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
              {about.heading}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 text-lg leading-relaxed text-fg/75 md:grid-cols-2">
            {about.body.map((p, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <ul className="mt-12 flex flex-wrap gap-2" aria-label="Strengths">
              {about.strengths.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line px-4 py-2 text-sm text-fg/80 transition-colors hover:border-accent hover:text-fg"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
