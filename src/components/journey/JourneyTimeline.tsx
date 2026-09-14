"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import TiltCard from "@/components/ui/TiltCard";
import { useMediaQuery } from "@/lib/hooks";
import { MaskText } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const journey = [
  {
    phase: "Phase 01",
    year: "1st Year",
    title: "Into Cybersecurity",
    points: [
      "Joined B.Tech Cybersecurity — shifted from high school theory to core engineering fundamentals.",
      "Started building a foundation in how systems work, and more importantly, how they break.",
    ],
    quote:
      "Started my B.Tech journey in Cybersecurity, discovering a passion for understanding systems from the inside out.",
  },
  {
    phase: "Phase 02",
    year: "2nd Year",
    title: "Building the Foundation",
    points: [
      "Learned web development and app development, moving beyond the college syllabus on my own.",
      "Completed the full-stack and PERN stack (PostgreSQL, Express, React, Node.js).",
      "Built a functional application for college — my first real-world deployed project.",
      "Joined ACM Amritapuri, stepping into a community of like-minded builders.",
    ],
    quote:
      "Went from learning syntax to shipping a full-stack application my college actually uses — and found my people along the way in ACM.",
  },
  {
    phase: "Phase 03",
    year: "3rd Year / Present (S5)",
    title: "Specialization & Impact",
    points: [
      "Currently in Semester 5, working under a faculty member on an app development project.",
      "Active in ACM's technical activities, while exploring Flutter for cross-platform development.",
      "Mentoring juniors — passing on what I picked up the hard way.",
      "Next up: React Native for cross-platform mobile, and diving into cloud technologies.",
    ],
    quote:
      "Currently building an app under faculty guidance, staying involved with ACM, and mentoring juniors — while gearing up to learn React Native and cloud.",
  },
];

/** The dot, plus the ring it throws off at the moment it lands. */
function TimelineNode() {
  const reduced = useReducedMotion();

  return (
    <div className="relative h-4 w-4">
      {!reduced && (
        <motion.span
          aria-hidden
          initial={{ scale: 1, opacity: 0.6 }}
          whileInView={{ scale: 3.2, opacity: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, delay: 0.25, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border-2 border-signal"
        />
      )}
      <motion.div
        initial={reduced ? undefined : { scale: 0 }}
        whileInView={reduced ? undefined : { scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative h-4 w-4 rounded-full bg-signal ring-4 ring-white"
      />
    </div>
  );
}

export default function MyJourney() {
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  // A full-width card tilted 3deg pokes its corners out of a phone screen.
  const isWide = useMediaQuery("(min-width: 1024px)");

  const [pathD, setPathD] = useState("");
  const [svgTop, setSvgTop] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  // Track scroll progress against the timeline track itself (not the whole
  // section with its header/padding), so completion lines up with the last node.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.75", "end 0.6"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const trackRect = trackRef.current.getBoundingClientRect();
      const points = nodeRefs.current
        .filter(Boolean)
        .map((node) => {
          const r = node!.getBoundingClientRect();
          return {
            y: r.top - trackRect.top + r.height / 2,
          };
        });

      if (points.length === 0) return;

      const startY = points[0].y;
      const endY = points[points.length - 1].y;

      setSvgTop(startY);
      setSvgHeight(endY - startY);

      const centerX = 50;
      const bulge = 42;

      // Path now starts AT the first node (relative y = 0 in this shifted
      // coordinate space) instead of at the top of the container — no stray
      // line above Phase 01 anymore.
      let d = `M ${centerX} 0`;
      let prevY = 0;

      points.slice(1).forEach((pt, i) => {
        const relY = pt.y - startY;
        const dir = i % 2 === 0 ? 1 : -1;
        const midY1 = prevY + (relY - prevY) / 4;
        const midY2 = prevY + (3 * (relY - prevY)) / 4;
        d += ` C ${centerX + dir * bulge} ${midY1}, ${centerX + dir * bulge} ${midY2}, ${centerX} ${relY}`;
        prevY = relY;
      });

      setPathD(d);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white px-6 py-20 text-black md:px-12 md:py-32">
      {/* Faint red field behind the spine, so the white page is not empty
          either side of the cards. */}
      <div
        aria-hidden
        className="fx-dots pointer-events-none absolute inset-0 text-signal/15"
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-14 text-center md:mb-24">
          <p className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-signal">
            2024 — Present
          </p>
          <h2 className="flex justify-center text-4xl font-black uppercase tracking-tighter md:text-6xl">
            <MaskText text="My Journey" />
          </h2>
        </div>

        <div ref={trackRef} className="relative">
          {pathD && (
            <svg
              className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 lg:block"
              style={{ top: svgTop, overflow: "visible" }}
              width="200"
              height={svgHeight}
              viewBox={`0 0 100 ${svgHeight}`}
              preserveAspectRatio="none"
            >
              {/* The unwritten route, then the red ink that follows you down
                  it. The drawn line glows a little so it still reads where it
                  crosses a card's shadow. */}
              <path d={pathD} stroke="#e6dede" strokeWidth={2} fill="none" />

              <motion.path
                d={pathD}
                stroke="#ff0000"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                style={{ pathLength, filter: "drop-shadow(0 0 6px rgba(255,0,0,0.45))" }}
              />
            </svg>
          )}

          <div className="flex flex-col gap-12 md:gap-16 lg:gap-32">
            {journey.map((item, index) => {
              const isLeft = index % 2 === 0;
              const tilt = (isLeft ? -1 : 1) * (isWide ? 3 : 1);

              return (
                <div
                  key={index}
                  className={`relative flex flex-col items-center lg:flex-row ${
                    isLeft ? "lg:justify-start" : "lg:justify-end"
                  }`}
                >
                  <div
                    ref={(el) => {
                      nodeRefs.current[index] = el;
                    }}
                    className="absolute left-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 lg:block"
                  >
                    <TimelineNode />
                  </div>

                  <TiltCard
                    strength={4}
                    lift={12}
                    initial={{ opacity: 0, y: 60, scale: 0.95, rotate: 0 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
                    whileHover={{ rotate: 0, scale: 1.02 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className={`fx-spotlight fx-spotlight-light fx-grain group relative w-full overflow-hidden rounded-3xl bg-signal p-8 text-white shadow-xl md:p-10 lg:w-[46%] ${
                      isLeft ? "lg:mr-auto" : "lg:ml-auto"
                    }`}
                  >
                    {/* Corner ruling, not a number: the card already says
                        "Phase 02" in the pill, and an oversized figure here
                        landed on top of the year label. */}
                    <span
                      aria-hidden
                      className="fx-stripes pointer-events-none absolute -right-8 -top-8 h-28 w-28 rotate-12 text-white/40 opacity-50 transition-transform duration-700 ease-out group-hover:rotate-45 group-hover:scale-110"
                    />

                    <div className="relative z-10 mb-4 flex items-center justify-between">
                      <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-300 group-hover:bg-white group-hover:text-signal">
                        {item.phase}
                      </span>
                      <span className="font-mono text-xs text-white/70">{item.year}</span>
                    </div>

                    <h3 className="relative z-10 mb-4 text-2xl font-black uppercase tracking-tight md:text-3xl">
                      {item.title}
                    </h3>

                    <ul className="relative z-10 mb-6 space-y-2">
                      {item.points.map((point, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{ duration: 0.5, delay: 0.25 + i * 0.09, ease: EASE }}
                          className="flex gap-2 text-sm leading-relaxed text-white/90 md:text-base"
                        >
                          <span aria-hidden className="text-white/60">
                            —
                          </span>
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <p className="relative z-10 border-t border-white/20 pt-4 text-sm font-medium italic leading-relaxed md:text-base">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
