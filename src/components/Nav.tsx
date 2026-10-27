"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { person } from "@/content";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/how-i-work", label: "How I work" },
  { href: "/#about", label: "About" },
  { href: "/#cv", label: "CV" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const active = (href: string) => href === "/#work" && pathname.startsWith("/work");

  // Close the mobile menu when moving to another page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? "border-line bg-bg/90 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <nav aria-label="Main" className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="text-[15px] font-bold tracking-[-0.02em]">
          {person.name}
        </Link>

        <ul className="hidden items-center gap-7 text-sm font-medium md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active(l.href) ? "page" : undefined}
                className={`transition-colors hover:text-muted ${active(l.href) ? "underline decoration-2 underline-offset-[6px]" : ""}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={person.cv}
            download
            className="hidden rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85 sm:inline-flex"
          >
            Download CV
          </a>
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span
              className={`absolute h-px w-4 bg-fg transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`}
            />
            <span
              className={`absolute h-px w-4 bg-fg transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="container-x border-t border-line pt-4 pb-8 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-4xl font-bold tracking-[-0.035em]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={person.cv}
              download
              className="mt-6 inline-flex rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg"
            >
              Download CV
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
