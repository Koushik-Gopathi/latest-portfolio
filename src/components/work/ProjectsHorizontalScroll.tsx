"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
    description: "A Full-Stack web application for managing and tracking Attendance and Schedules of students and Faculty.",
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
  description: "Heuristic threat detection engine for AI/MCP interactions — scores intent, context, and action verbs across 16+ threat categories with real-time risk analysis.",
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
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-70%"]);

  // Tracks which card index is currently hovered — driven by explicit
  // mouse enter/leave events, not CSS :hover, so it stays accurate
  // even while cards are sliding under a stationary cursor via scroll.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-white text-black z-30">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

        {/* Section Header */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
              Designed to ship.
            </h2>
          </div>
        </div>

        {/* Horizontal Scrolling Track */}
        <div className="flex w-full overflow-hidden">
          <motion.div style={{ x }} className="flex gap-6 px-6 md:px-12">
            {projects.map((project, index) => {
              const isHovered = hoveredIndex === index;

              return (
                <motion.div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() =>
                    setHoveredIndex((current) => (current === index ? null : current))
                  }
                  animate={{
                    backgroundColor: isHovered ? "#FF0000" : "#F9FAFB", // gray-50 fallback
                    borderColor: isHovered ? "#FF0000" : "#E5E7EB", // gray-200 fallback
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative h-[420px] w-[320px] md:w-[450px] border rounded-3xl p-8 flex flex-col justify-between shadow-sm shrink-0"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <motion.span
                        animate={{
                          color: isHovered ? "#FFFFFF" : "#DC2626",
                          backgroundColor: isHovered ? "rgba(255,255,255,0.1)" : "#FEF2F2",
                          borderColor: isHovered ? "rgba(255,255,255,0.3)" : "#FEE2E2",
                        }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="text-xs font-mono font-bold border px-3 py-1 rounded-full"
                      >
                        {project.tag}
                      </motion.span>
                      <motion.span
                        animate={{ color: isHovered ? "rgba(255,255,255,0.7)" : "#9CA3AF" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="text-xs font-mono"
                      >
                        0{index + 1}
                      </motion.span>
                    </div>

                    <motion.h3
                      animate={{ color: isHovered ? "#FFFFFF" : "#111827" }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3"
                    >
                      {project.title}
                    </motion.h3>

                    <motion.p
                      animate={{ color: isHovered ? "#000000" : "#4B5563" }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="text-sm md:text-base font-medium leading-relaxed"
                    >
                      {project.description}
                    </motion.p>
                  </div>

                  <motion.div
                    animate={{ borderColor: isHovered ? "rgba(0,0,0,0.2)" : "#E5E7EB" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="pt-6 border-t flex justify-between items-center text-xs font-mono font-bold"
                  >
                    <motion.span
                      animate={{ color: isHovered ? "#000000" : "#6B7280" }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {project.category}
                    </motion.span>
                    <motion.span
                      animate={{ color: isHovered ? "#000000" : "#6B7280" }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      EXPLORE →
                    </motion.span>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}