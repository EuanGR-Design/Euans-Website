import Image from "next/image";
import { about, person, stats } from "@/content";
import { Reveal } from "./motion";

export function About() {
  return (
    <section id="about" className="border-t border-line py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">About</p>
          <div className="relative mt-6 aspect-[4/5] max-w-xs overflow-hidden rounded-[2rem] border border-line bg-raised">
            {person.photo ? (
              <Image
                src={person.photo}
                alt={`Portrait of ${person.name}`}
                fill
                sizes="320px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-accent/40 via-raised to-raised">
                <span className="font-serif text-8xl italic">ER</span>
                <span className="eyebrow">Photo coming soon</span>
              </div>
            )}
          </div>
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
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {about.approach.map((a, i) => (
              <Reveal
                key={a.title}
                delay={0.08 * i}
                className="rounded-3xl border border-line bg-raised p-6"
              >
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <p className="mt-5 font-semibold">{a.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x mt-16 md:mt-24">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.08 * i} className="bg-bg p-5 md:p-8">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight md:text-5xl">{s.value}</dd>
              <dd className="mt-2 text-sm text-muted">{s.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">What I do</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Skills, end to end.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {about.skills.map((g, i) => (
            <Reveal key={g.group} delay={0.06 * i} className="bg-bg p-6 md:p-8">
              <h3 className="text-xl font-semibold tracking-tight">{g.group}</h3>
              <ul className="mt-5 space-y-2.5" aria-label={`${g.group} skills`}>
                {g.items.map((s) => (
                  <li key={s} className="flex gap-3 text-sm text-fg/80">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
