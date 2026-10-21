import { About, Skills } from "@/components/About";
import { Milestones } from "@/components/Milestones";
import { Experience } from "@/components/Experience";
import { HomeCarousel } from "@/components/HomeCarousel";
import { WorkTimeline } from "@/components/WorkTimeline";
import { homeCarousel } from "@/content";
import { liveProjects, projects } from "@/projects";

// The carousel's projects, in the order set in content.ts.
const carousel = homeCarousel.map((slug) => projects.find((p) => p.slug === slug)!).filter(Boolean);
// Every project on the timeline except Console, which gathers the others.
const timeline = liveProjects.filter((p) => p.slug !== "console");

export default function Home() {
  return (
    <>
      <HomeCarousel list={carousel} />
      <WorkTimeline list={timeline} />
      <Milestones />
      <About />
      <Skills />
      <Experience />
    </>
  );
}
