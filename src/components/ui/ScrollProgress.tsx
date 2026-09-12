"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Reading position, as a hairline across the top of the document.
 *
 * The bar is near-black rather than red or white on purpose: it crosses both
 * the white pages and the red ones, and it is the only element on the site
 * that can never pick its contrast from its section. A dark red-black reads
 * against white and against #ff0000 without needing a track behind it.
 *
 * Springed so it glides with the weighted (Lenis) scroll instead of stepping
 * one frame behind it.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.0005 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width, transformOrigin: "left" }}
      className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-[#1f0000]"
    />
  );
}
