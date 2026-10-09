import { Hero } from "@/components/Hero";
import { About, Skills } from "@/components/About";
import { Process } from "@/components/Process";
import { FeaturedWork, Milestones } from "@/components/Milestones";
import { Experience } from "@/components/Experience";

export default function Home() {
  return (
    <>
      <Hero />
      <Process />
      <Milestones />
      <FeaturedWork />
      <About />
      <Skills />
      <Experience />
    </>
  );
}
