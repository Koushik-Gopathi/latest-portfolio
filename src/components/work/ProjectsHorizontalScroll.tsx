"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MaskText, DrawRule } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const projects = [
  {
    title: "Voice Assistant AI",
    category: "AI & Systems",
    description: "Real-time personal voice assistant using LiveKit Cloud and MCP servers.",
    tag: "LiveKit / MCP",
  },
  {
    title: "LogBook Web App",
    category: "Web Development",
    description:
      "A Full-Stack web application for managing and tracking Attendance and Schedules of students and Faculty.",
    tag: "React / Next.js",
  },
  {
    title: "Student Attendance App",
    category: "App Development",
    description: "Cross-platform mobile application built with Flutter for tracking attendance.",
    tag: "Flutter / Dart",
  },
  {
    title: "Task Manager",
    category: "Web App",
    description: "Productivity-focused application for managing daily tasks and workflows.",
    tag: "React / Next.js",
  },
  {
    title: "GuardianMesh",
    category: "AI Security",
    description:
      "Heuristic threat detection engine for AI/MCP interactions — scores intent, context, and action verbs across 16+ threat categories with real-time risk analysis.",
    tag: "TypeScript / React",
  },
  {
    title: "NASA APOD Interface",
    category: "Web Development",
    description: "A sleek web application exploring daily astronomy data and imagery.",
    tag: "API Integration",
  },
];

export default function ProjectsHorizontalScroll() {
  const targetRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: targetRef });

  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-70%"]);

  // The track leans into the scroll. Velocity is springed first, so the lean
  // builds and releases instead of snapping on every wheel tick — this is the
  // single cheapest thing that makes a horizontal rail feel physical.
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 40, stiffness: 320 });
  const skew = useTransform(smoothVelocity, [-2.5, 0, 2.5], [2.5, 0, -2.5], { clamp: true });

  const railScale = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  const ghostX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  // Which card the rail is currently sitting on, for the counter.
  const [current, setCurrent] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(projects.length, Math.max(1, Math.ceil(p * projects.length) || 1));
    setCurrent(next);
  });

  // Tracks which card index is currently hovered — driven by explicit
  // mouse enter/leave events, not CSS :hover, so it stays accurate
  // even while cards are sliding under a stationary cursor via scroll.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={targetRef} className="relative z-30 h-[300vh] bg-white text-black">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* Hollow word sliding the other way behind the rail. */}
        <motion.span
          aria-hidden
          style={{ x: ghostX }}
          className="fx-outline pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[26vw] font-black uppercase leading-none tracking-tighter text-signal/15 [--fx-stroke:3px]"
        >
          Selected Work
        </motion.span>

        {/* Section Header */}
        <div className="relative mx-auto mb-10 flex w-full max-w-7xl items-end justify-between px-6 md:px-12">
          <div>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">
              <MaskText text="Designed to ship." />
            </h2>
          </div>

          <div className="hidden shrink-0 items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-slate md:flex">
            <span className="tabular-nums text-signal">{String(current).padStart(2, "0")}</span>
            <span className="text-slate/40">/</span>
            <span className="tabular-nums">{String(projects.length).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Horizontal Scrolling Track */}
        <div className="relative flex w-full overflow-hidden">
          <motion.div
            style={reduced ? { x } : { x, skewX: skew }}
            className="flex gap-6 px-6 md:px-12"
          >
            {projects.map((project, index) => {
              const isHovered = hoveredIndex === index;

              return (
                // Entry and hover live on separate elements on purpose: a
                // `whileInView` with `once` stays active for good, and it
                // would then outrank the `animate` the hover lift needs.
                <motion.div
                  key={index}
                  initial={reduced ? undefined : { opacity: 0, y: 46 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: index * 0.06, ease: EASE }}
                  className="shrink-0"
                >
                  <motion.div
                    onPointerEnter={() => setHoveredIndex(index)}
                    onPointerLeave={() =>
                      setHoveredIndex((c) => (c === index ? null : c))
                    }
                    animate={{
                      backgroundColor: isHovered ? "#ff0000" : "#f6f0f0",
                      borderColor: isHovered ? "#ff0000" : "#e6dede",
                      y: isHovered ? -10 : 0,
                      boxShadow: isHovered
                        ? "0 34px 80px -30px rgba(255,0,0,0.6)"
                        : "0 2px 8px -4px rgba(0,0,0,0.12)",
                    }}
                    transition={{
                      // Colour is the hover feedback, so it lands almost at
                      // once; the lift and the shadow are allowed to travel.
                      duration: 0.1,
                      ease: "easeOut",
                      y: { duration: 0.3, ease: EASE },
                      boxShadow: { duration: 0.3, ease: EASE },
                    }}
                    className="group relative flex h-[420px] w-[320px] flex-col justify-between overflow-hidden rounded-3xl border p-8 md:w-[450px]"
                  >
                    {/* Index watermark. It slides in from the corner on hover
                        instead of sitting there permanently. */}
                    <motion.span
                      aria-hidden
                      animate={{
                        opacity: isHovered ? 0.16 : 0.07,
                        x: isHovered ? 0 : 18,
                        color: isHovered ? "#ffffff" : "#ff0000",
                      }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="pointer-events-none absolute -top-10 right-0 select-none text-[10rem] font-black leading-none tracking-tighter"
                    >
                      0{index + 1}
                    </motion.span>

                    <div className="relative">
                      <div className="mb-6 flex items-center justify-between">
                        <motion.span
                          animate={{
                            color: isHovered ? "#ffffff" : "#a30000",
                            backgroundColor: isHovered ? "rgba(255,255,255,0.14)" : "#ffffff",
                            borderColor: isHovered ? "rgba(255,255,255,0.34)" : "#e6dede",
                          }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                          className="rounded-full border px-3 py-1 font-mono text-xs font-bold"
                        >
                          {project.tag}
                        </motion.span>
                        <motion.span
                          animate={{ color: isHovered ? "rgba(255,255,255,0.75)" : "#6b5f5f" }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                          className="font-mono text-xs"
                        >
                          0{index + 1}
                        </motion.span>
                      </div>

                      <motion.h3
                        animate={{ color: isHovered ? "#ffffff" : "#111111" }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className="mb-3 text-2xl font-black uppercase tracking-tight md:text-3xl"
                      >
                        {project.title}
                      </motion.h3>

                      <motion.p
                        animate={{ color: isHovered ? "rgba(255,255,255,0.92)" : "#6b5f5f" }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className="text-sm font-medium leading-relaxed md:text-base"
                      >
                        {project.description}
                      </motion.p>
                    </div>

                    <motion.div
                      animate={{ borderColor: isHovered ? "rgba(255,255,255,0.3)" : "#e6dede" }}
                      transition={{ duration: 0.1, ease: "easeOut" }}
                      className="relative flex items-center justify-between border-t pt-6 font-mono text-xs font-bold"
                    >
                      <motion.span
                        animate={{ color: isHovered ? "#ffffff" : "#6b5f5f" }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                      >
                        {project.category}
                      </motion.span>
                      <motion.span
                        animate={{ color: isHovered ? "#ffffff" : "#6b5f5f" }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className="inline-flex items-center gap-2"
                      >
                        Explore
                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* The rail's own progress, so the horizontal move has a readout. */}
        <div className="mx-auto mt-10 w-full max-w-7xl px-6 md:px-12">
          <DrawRule className="bg-smoke" />
          <motion.div
            style={{ scaleX: railScale, transformOrigin: "left" }}
            className="h-[3px] w-full -translate-y-px bg-signal"
          />
        </div>
      </div>
    </section>
  );
}
