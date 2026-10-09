import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkGrid } from "@/components/WorkGrid";

export const metadata: Metadata = {
  title: "Work — Euan Robertson",
  description: "Projects from Legalesign, freelance branding and Glasgow School of Art.",
};

export default function WorkPage() {
  return (
    <section className="pt-32 pb-24 md:pt-44 md:pb-32">
      <div className="container-x">
        <p className="eyebrow">Work</p>
        <h1 className="mt-4 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.04em]">
          Projects
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/75">
          Pick a project to see how it came together, from the first research
          to what shipped.
        </p>
        <Suspense>
          <WorkGrid />
        </Suspense>
      </div>
    </section>
  );
}
