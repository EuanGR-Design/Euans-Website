import Image from "next/image";
import Link from "next/link";
import { eras, type Project } from "@/projects";

export function ProjectCard({ p, priority = false }: { p: Project; priority?: boolean }) {
  const era = eras.find((e) => e.id === p.era);
  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-raised md:rounded-3xl">
        <Cover p={p} priority={priority} />
        {p.comingSoon && (
          <span className="eyebrow absolute top-4 left-4 rounded-full border border-line bg-bg/80 px-3 py-1 backdrop-blur">
            Coming soon
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{p.summary}</p>
        </div>
        {!p.comingSoon && (
          <span
            aria-hidden
            className="mt-1 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg"
          >
            →
          </span>
        )}
      </div>
      <p className="mt-3 font-mono text-xs text-muted">
        {era?.label}
        {p.year && ` · ${p.year}`}
      </p>
    </>
  );

  if (p.comingSoon) return <div className="opacity-70">{inner}</div>;
  return (
    <Link href={`/work/${p.slug}`} className="group block">
      {inner}
    </Link>
  );
}

/** The project's cover image, or a branded placeholder with its title. */
export function Cover({ p, priority = false }: { p: Project; priority?: boolean }) {
  if (p.cover?.src) {
    return (
      <Image
        src={p.cover.src}
        alt={p.cover.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 600px, (min-width: 640px) 50vw, 100vw"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-end bg-gradient-to-br from-accent/45 via-raised to-raised p-6 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
      <span className="font-serif text-4xl leading-none text-fg/80 italic md:text-5xl">{p.title}</span>
    </div>
  );
}
