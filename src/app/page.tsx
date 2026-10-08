import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { CaseStudy } from "@/components/CaseStudy";
import { Brand } from "@/components/Brand";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { MotionProvider } from "@/components/motion";

export default function Home() {
  return (
    <MotionProvider>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to case study
      </a>
      <Nav />
      <main>
        <Hero />
        <CaseStudy />
        <Brand />
        <About />
        <Experience />
      </main>
      <Contact />
    </MotionProvider>
  );
}
