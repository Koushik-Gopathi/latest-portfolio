"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The two reveals the whole page is built from.
 *
 * `MaskText` is the one that does the work: each word gets its own clipping
 * box and slides up out of it, so the type appears to be printed rather than
 * faded in. Opacity-only reveals read as a loading state; a masked slide reads
 * as a deliberate entrance, and on heavy uppercase display type the difference
 * is the whole effect.
 *
 * Both collapse to their finished state under `prefers-reduced-motion` — the
 * content is never gated behind an animation that will not run.
 */

export function MaskText({
  text,
  className = "",
  delay = 0,
  stagger = 0.045,
  duration = 0.85,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.split(" ");

  if (reduced) return <span className={className}>{text}</span>;

  const container: Variants = {
    hidden: {},
    show: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };

  const word: Variants = {
    hidden: { y: "110%", rotate: 4 },
    show: { y: "0%", rotate: 0, transition: { duration, ease: EASE } },
  };

  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      aria-label={text}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((w, i) => (
        // The clipping box. `pb` gives descenders somewhere to live, otherwise
        // the mask shaves the tail off a lowercase g.
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] mr-[0.24em]">
          <motion.span variants={word} className="inline-block will-change-transform">
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  blur = false,
  amount = 0.35,
  duration = 0.7,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  /** Adds a short defocus on the way in. Use sparingly — it is expensive. */
  blur?: boolean;
  amount?: number;
  duration?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale, filter: blur ? "blur(8px)" : undefined }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: blur ? "blur(0px)" : undefined }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A thin rule that draws itself across as the section arrives. */
export function DrawRule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={reduced ? { duration: 0 } : { duration: 1.1, delay, ease: EASE }}
      style={{ transformOrigin: "left" }}
      className={`h-px w-full ${className}`}
    />
  );
}
