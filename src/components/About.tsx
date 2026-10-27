import Image from "next/image";
import Link from "next/link";
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
                <span className="text-8xl font-bold tracking-[-0.05em]">ER</span>
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
                <span className="font-mono text-xs text-accent-ink">0{i + 1}</span>
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
    <section id="skills" className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">What I do</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
              Looking for a skill? Go straight to the proof.
            </h2>
          </div>
          <p className="max-w-sm text-muted">Each link opens the part of a project where I did it.</p>
        </Reveal>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {about.skills.map((s, i) => (
            <li key={s.skill} className="bg-bg">
            <Reveal delay={0.04 * (i % 3)} className="h-full p-6 md:p-7">
              <h3 className="text-lg font-semibold tracking-tight">{s.skill}</h3>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Where to see ${s.skill.toLowerCase()}`}>
                {s.proof.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-sm transition-colors hover:border-fg/30"
                    >
                      {p.label}
                      <span aria-hidden className="text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-fg">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
