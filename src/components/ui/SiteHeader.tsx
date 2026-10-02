"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Download } from "lucide-react";
import { site } from "@/config/site";
import { usePrefersReducedMotion } from "@/lib/hooks";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The bar that follows you down the page.
 *
 * The page is roughly eleven thousand pixels tall and had no navigation at
 * all: reaching the contact details meant scrolling past everything. This
 * keeps the name, the CV and the way to get in touch one click away.
 *
 * It stays out of the way until the red landing plate has started to break
 * (scroll 420), because the first screen is a poster and a toolbar across it
 * would spoil it.
 */
export default function SiteHeader() {
  const { scrollY } = useScroll();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setShown(v > 420);
  });

  const link =
    "font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate transition-colors duration-200 hover:text-signal";

  return (
    <motion.header
      initial={false}
      animate={{ y: shown ? 0 : -72, opacity: shown ? 1 : 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
      className="fixed inset-x-0 top-0 z-[70] border-b border-smoke bg-white/90 backdrop-blur-md"
      // Hidden from the keyboard and screen readers while it is off screen.
      aria-hidden={!shown}
    >
      <nav
        aria-label="Site"
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2.5 md:px-10 md:py-3"
      >
        <a
          href="#top"
          className="shrink-0 text-sm font-black uppercase leading-none tracking-tight text-black transition-colors duration-200 hover:text-signal md:text-base"
          tabIndex={shown ? undefined : -1}
        >
          {site.meta.shortName}
        </a>

        <div className="flex items-center gap-4 md:gap-6">
          <a href="#work" className={`hidden sm:inline ${link}`} tabIndex={shown ? undefined : -1}>
            Work
          </a>
          <a href="#education" className={`hidden md:inline ${link}`} tabIndex={shown ? undefined : -1}>
            Education
          </a>
          <a href="#contact" className={link} tabIndex={shown ? undefined : -1}>
            Contact
          </a>
          <a
            href={site.resume.href}
            download
            tabIndex={shown ? undefined : -1}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-signal px-3.5 py-2 font-mono text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-black md:px-4"
          >
            <Download size={12} strokeWidth={2.8} />
            Résumé
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
