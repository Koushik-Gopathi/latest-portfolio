"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const journey = [
  {
    phase: "Phase 01",
    year: "1st Year",
    title: "The Transition",
    points: [
      "Shifted from high school theory to core engineering fundamentals.",
      "Had my first real 'it just clicked' moment — Data Structures made logic feel like a language I could actually speak.",
    ],
    quote:
      "Started my B.Tech journey and discovered a passion for solving logical puzzles, which naturally pulled me into the world of software engineering.",
  },
  {
    phase: "Phase 02",
    year: "2nd Year",
    title: "Building the Foundation",
    points: [
      "Moved beyond the college syllabus — picked up React, Python, and cloud basics on my own through YouTube and Coursera.",
      "Shipped my first personal projects: small builds like a weather app and a basic automation script.",
      "Joined college tech clubs, entered my first 24-hour hackathon, and made early open-source contributions.",
    ],
    quote:
      "Explored web ecosystems outside the classroom. Built my first full-stack application and discovered the rush of building things that actually run in a browser.",
  },
  {
    phase: "Phase 03",
    year: "3rd Year / Present",
    title: "Specialization & Impact",
    points: [
      "Currently focused on full-stack web development, with a growing interest in scalable systems and DevOps.",
      "Took on leadership in a technical club and led a 4-person team through a major college project.",
      "Picked up freelance and open-source work alongside coursework.",
    ],
    quote:
      "Currently diving deep into scalable architectures and database optimization. Leading a team of 4 to build our 3rd-year major project using Next.js and MongoDB.",
  },
];

export default function MyJourney() {
  const trackRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    <section className="relative w-full bg-white text-black py-32 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-24 text-center">
          My Journey
        </h2>

        <div ref={trackRef} className="relative">

          {pathD && (
            <svg
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none hidden md:block"
              style={{ top: svgTop, overflow: "visible" }}
              width="200"
              height={svgHeight}
              viewBox={`0 0 100 ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <path d={pathD} stroke="#E5E7EB" strokeWidth={2} fill="none" />

              <motion.path
                d={pathD}
                stroke="#000000"
                strokeWidth={2}
                fill="none"
                style={{ pathLength }}
              />
            </svg>
          )}

          <div className="flex flex-col gap-24 md:gap-32">
            {journey.map((item, index) => {
              const isLeft = index % 2 === 0;
              const tilt = isLeft ? -3 : 3;

              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  <div
                    ref={(el) => {
                      nodeRefs.current[index] = el;
                    }}
                    className="absolute left-1/2 -translate-x-1/2 w-4 h-4 z-10 hidden md:block"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="w-4 h-4 rounded-full bg-black"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95, rotate: 0 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, rotate: tilt }}
                    whileHover={{ rotate: 0, scale: 1.02 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`w-full md:w-[46%] bg-[#FF0000] text-white rounded-3xl p-8 md:p-10 shadow-xl ${
                      isLeft ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest bg-white/10 border border-white/30 px-3 py-1 rounded-full">
                        {item.phase}
                      </span>
                      <span className="text-xs font-mono text-white/70">{item.year}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">
                      {item.title}
                    </h3>

                    <ul className="space-y-2 mb-6">
                      {item.points.map((point, i) => (
                        <li key={i} className="flex gap-2 text-sm md:text-base text-white/90 leading-relaxed">
                          <span className="text-white/60">—</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm md:text-base italic font-medium leading-relaxed border-t border-white/20 pt-4">
                      "{item.quote}"
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}