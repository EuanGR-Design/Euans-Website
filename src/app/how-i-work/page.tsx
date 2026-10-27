import type { Metadata } from "next";
import Link from "next/link";
import { foundations } from "@/content";
import { Blocks } from "@/components/Blocks";

export const metadata: Metadata = {
  title: "How I work — Euan Robertson",
  description: "Where my way of designing comes from, and how it works on a product team today.",
};

export default function HowIWorkPage() {
  return (
    <article>
      <header className="pt-32 md:pt-44">
        <div className="container-x">
          <p className="eyebrow">How I work</p>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.04em]">
            {foundations.heading}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg/80 md:text-xl">{foundations.intro}</p>
        </div>
      </header>

      <div className="mt-20 md:mt-28">
        <Blocks blocks={foundations.blocks} name="How I work" />
      </div>

      <section className="border-t border-line py-20 md:py-28">
        <div className="container-x">
          <p className="eyebrow">Where I learned it</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {foundations.projects.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group block h-full rounded-3xl border border-line bg-raised p-6 transition-colors hover:border-fg/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold">{p.title}</h2>
                    <span aria-hidden className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg">
                      →
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
