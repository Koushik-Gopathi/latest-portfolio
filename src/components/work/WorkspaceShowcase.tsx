"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";

/** Keeps a value inside [min, max) by wrapping it — framer has no `wrap`. */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * One row of the name, repeating forever, whose speed and direction are set by
 * how you are scrolling.
 *
 * The plain `animate={{ x: [0, '-50%'] }}` version this replaces ran at one
 * fixed rate and ignored the page completely. Here the scroll velocity is fed
 * into the per-frame step, so flicking the wheel throws the type past you and
 * scrolling back drags it the other way — the marquee becomes part of the
 * scroll rather than decoration playing next to it.
 */
function VelocityRow({ text, baseVelocity }: { text: string; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1400], [0, 4], { clamp: false });

  // Four copies, so -25% is exactly one copy: the row can wrap there and the
  // seam is never visible.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const direction = useRef(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += direction.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden">
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="px-8 text-[7rem] sm:text-[10rem] md:text-[14rem] font-black uppercase leading-none tracking-tighter text-white"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function WorkspaceShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // The portrait rides the section slower than the page, and settles to 1:1
  // at the moment it is centred.
  const portraitY = useTransform(scrollYProgress, [0, 0.5, 1], [90, 0, -90]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.96]);
  const haloScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1.05, 0.8]);

  return (
    <section
      ref={containerRef}
      className="fx-grain relative z-20 h-[130vh] w-full bg-signal text-white"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Two rows of the name, running in opposite directions and reacting to
            the scroll. Skewed slightly so the band reads as a moving object. */}
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-center gap-8 overflow-hidden opacity-95 select-none">
          {reduced ? (
            <>
              <div className="overflow-hidden">
                <div className="flex whitespace-nowrap">
                  <span className="px-8 text-[7rem] sm:text-[10rem] md:text-[14rem] font-black uppercase leading-none tracking-tighter text-white">
                    KOUSHIK GOPATHI
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <VelocityRow text="KOUSHIK GOPATHI" baseVelocity={-2.4} />
              <VelocityRow text="KOUSHIK GOPATHI" baseVelocity={2.4} />
            </>
          )}
        </div>

        {/* A soft white halo, so the cut-out portrait separates from the type
            behind it without needing a box or a border. */}
        <motion.div
          aria-hidden
          style={{ scale: haloScale }}
          className="pointer-events-none absolute z-[5] h-[85vh] w-[85vh] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45),rgba(255,255,255,0)_62%)] blur-2xl"
        />

        <div className="relative z-10 mx-4 flex w-full max-w-5xl items-center justify-center">
          <motion.div
            style={reduced ? undefined : { y: portraitY, scale: portraitScale }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full items-center justify-center"
          >
            <Image
              src="/portrait_2.png"
              alt="Koushik Gopathi"
              width={1200}
              height={675}
              className="pointer-events-none h-auto w-[135%] max-w-none select-none object-contain drop-shadow-2xl sm:w-full sm:max-w-full"
              priority
            />
          </motion.div>
        </div>

        {/* Corner furniture — it tells you where you are on the page. */}
        <div className="pointer-events-none absolute inset-x-6 bottom-8 z-20 flex items-end justify-between font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/70 md:inset-x-12">
          <span>Based in India</span>
          <span>Open to work</span>
        </div>
      </div>
    </section>
  );
}
