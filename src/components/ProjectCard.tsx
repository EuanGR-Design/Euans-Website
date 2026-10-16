import Image from "next/image";
import Link from "next/link";
import { eras, projectHref, type Project } from "@/projects";

export function ProjectCard({ p, priority = false }: { p: Project; priority?: boolean }) {
  const era = eras.find((e) => e.id === p.era);
  // Laid out like an Awwwards site card: the image, a label, the title and
  // its tags, with a "View project" pill over the image on hover.
  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-raised">
        <Cover p={p} priority={priority} />
        {p.comingSoon ? (
          <span className="eyebrow absolute top-3 left-3 rounded-full bg-bg px-3 py-1 !text-fg">Coming soon</span>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-fg/0 opacity-0 transition-all duration-300 group-hover:bg-fg/25 group-hover:opacity-100"
          >
            <span className="rounded-full bg-bg px-5 py-2.5 text-sm font-semibold text-fg">View project</span>
          </div>
        )}
      </div>
      <p className="eyebrow mt-4 !text-[11px]">
        {era?.label}
        {p.year && ` · ${p.year}`}
      </p>
      <h3 className="mt-1.5 text-xl font-bold tracking-[-0.02em]">{p.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{p.summary}</p>
      {p.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.tags.slice(0, 3).map((t) => (
            <li key={t} className="rounded-full bg-fg/[0.06] px-2.5 py-1 text-xs font-medium text-fg/80">
              {t}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  if (p.comingSoon) return <div className="opacity-70">{inner}</div>;
  return (
    <Link href={projectHref(p)} className="group block">
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
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-end bg-gradient-to-br from-accent/45 via-raised to-raised p-6 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
      <span className="text-4xl leading-none font-bold tracking-[-0.04em] text-fg/80 md:text-5xl">{p.title}</span>
    </div>
  );
}
