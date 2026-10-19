import type { Metadata, Viewport } from "next";
import { Caveat, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Contact } from "@/components/Contact";
import { MotionProvider } from "@/components/motion";
import { Cursor } from "@/components/Cursor";
import { ProjectTransitionProvider } from "@/components/ProjectTransition";

const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

// Handwriting, only for notes scribbled on the page.
const hand = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Euan Robertson — Design Lead",
  description:
    "Portfolio of Euan Robertson: five years leading design at Legalesign, an enterprise e-signature platform, and more recently product ownership too.",
};

export const viewport: Viewport = {
  themeColor: "#efebe4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" data-theme="orange">
      <body
        className={`${sans.variable} ${hand.variable} antialiased`}
      >
        <MotionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <ProjectTransitionProvider>
            <Nav />
            <main id="main">{children}</main>
            <Contact />
          </ProjectTransitionProvider>
          <Cursor />
        </MotionProvider>
      </body>
    </html>
  );
}
