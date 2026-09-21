"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ArrowUpRight, Lock, Play } from "lucide-react";
import VideoModal, { type DemoVideo } from "@/components/ui/VideoModal";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { MaskText, DrawRule } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

type Project = {
  title: string;
  category: string;
  description: string;
  tag: string;
  /** A screenshot of the thing actually running. */
  shot?: string;
  /** Which part of the screenshot the thin card frame should keep. */
  shotPosition?: string;
  /** A walkthrough, opened over the page. */
  video?: DemoVideo;
  /** Shown in place of a screenshot: three facts, not a placeholder image. */
  stats?: string[];
  /** Flagship cards get a wider frame and room for what makes them different. */
  highlights?: string[];
  code?: string;
  live?: string;
  /** Why a card has no links, said plainly rather than with a dead arrow. */
  note?: string;
};

const projects: Project[] = [
  {
    title: "Karen",
    category: "AI Agent · Windows + Android",
    description:
      "A hands-free voice agent that plans steps, calls the right tools, checks each result and keeps going until the job is done — PowerShell, files, documents, web search, and a paired Android phone.",
    tag: "Python / Flutter / LLM",
    shot: "/assets/projects/karen.webp",
    shotPosition: "50% 40%",
    stats: ["40+ tools", "~1s to first word", "EN · TE · HI"],
    highlights: [
      "Speaks while thinking: sentence-level TTS as the model streams",
      "Barge-in — talk over her and she stops, with an echo guard",
      "Model routing + prompt caching: about $0.0006 a request",
    ],
    code: "https://github.com/Koushik-Gopathi/ANVI-AI-personal-Assistant-",
  },
  {
    title: "AmbyoAI",
    category: "Health Tech · Faculty-guided",
    description:
      "Offline, touchless, voice-driven amblyopia screening that runs entirely on a health worker's smartphone. Implemented and calibrated the Hirschberg corneal-reflex test with ML Kit face mesh.",
    tag: "Flutter / ML Kit / TFLite",
    stats: ["4 screening tests", "Fully offline", "Clinical validation next"],
    code: "https://github.com/Koushik-Gopathi/Ambyo-AI",
  },
  {
    title: "GuardianMesh",
    category: "AI Security · Hackathon",
    description:
      "Threat detection for AI/MCP interactions: prompt injection, command and SQL injection, XSS, credential and SSH-key leaks, phishing and supply-chain URLs — scored 0–100 with confidence and an explanation.",
    tag: "TypeScript / React",
    shot: "/assets/projects/guardianmesh.webp",
    video: {
      src: "/assets/projects/guardianmesh-demo.mp4",
      poster: "/assets/projects/guardianmesh-demo-poster.webp",
      title: "GuardianMesh — walkthrough",
      duration: "1:22",
    },
    code: "https://github.com/Koushik-Gopathi/gaurdianmesh-threat-detection",
    live: "https://gaurdianmesh-threat-detection.onrender.com/dashboard",
  },
  {
    title: "LogBook",
    category: "Web Platform · ACM Chapter",
    description:
      "Full-stack PERN attendance and schedule platform, co-developed and deployed for college use: student-wise and course-wise tracking, schedules and monthly reports.",
    tag: "React / Node / PostgreSQL",
    stats: ["PERN stack", "In college use", "Monthly reporting"],
    note: "Built for my college — source stays private",
  },
  {
    title: "Student Attendance Tracker",
    category: "Mobile · Personal",
    description:
      "Cross-platform app for subject-wise attendance with per-student summaries. GitHub Actions builds and deploys the web version on every push.",
    tag: "Flutter / Firebase / CI",
    shot: "/assets/projects/attendance-tracker.webp",
    code: "https://github.com/Koushik-Gopathi/Attandence_tracker",
    live: "https://koushik-gopathi.github.io/Attandence_tracker/",
  },
  {
    title: "NASA APOD Explorer",
    category: "Web Development",
    description:
      "React front end for NASA's Astronomy Picture of the Day API: each day's image with its title, date and explanation, and a way to step back through the archive.",
    tag: "React / Vite / NASA API",
    shot: "/assets/projects/nasa-apod.webp",
    shotPosition: "50% 42%",
    code: "https://github.com/Koushik-Gopathi/WebSIG-S4-Recruitment/tree/main/Task-3-React-Frontend",
    live: "https://koushik-nasa-apod.netlify.app",
  },
  {
    title: "Task Manager",
    category: "Web App · Full-stack",
    description:
      "Full-stack task manager: sign-up and login with Firebase Auth, protected routes, and per-user tasks in Firestore that update in real time.",
    tag: "React / Firebase",
    // The live app opens on a login screen, so three facts say more than a
    // screenshot of an empty form would.
    stats: ["Firebase Auth", "Real-time Firestore", "Protected routes"],
    code: "https://github.com/Koushik-Gopathi/WebSIG-S4-Recruitment/tree/main/Task-5-Fullstack",
    live: "https://want-to-do.netlify.app/",
  },
];

/** Code / live buttons, or the reason there are none. */
function CardLinks({ project, isHovered }: { project: Project; isHovered: boolean }) {
  const base =
    "pointer-events-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider transition-colors duration-150";

  if (!project.code && !project.live) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-wider ${
          isHovered ? "text-white/90" : "text-slate"
        }`}
      >
        <Lock size={11} strokeWidth={2.6} />
        {project.note ?? "Link coming soon"}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {project.code && (
        <a
          href={project.code}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} source code on GitHub`}
          className={`${base} ${
            isHovered
              ? "border-white/40 bg-white/15 text-white hover:bg-white hover:text-signal"
              : "border-smoke bg-white text-black hover:border-signal hover:text-signal"
          }`}
        >
          <GithubIcon size={12} />
          Code
        </a>
      )}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} live demo`}
          className={`${base} ${
            isHovered
              ? "border-white bg-white text-signal"
              : "border-signal bg-signal text-white hover:bg-signal-deep"
          }`}
        >
          Live
          <ArrowUpRight size={12} />
        </a>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  isHovered,
  onEnter,
  onLeave,
  onPlay,
}: {
  project: Project;
  index: number;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onPlay: (video: DemoVideo) => void;
}) {
  const reduced = usePrefersReducedMotion();
  const wide = Boolean(project.highlights);

  return (
    <motion.div
      initial={{ opacity: 0, y: 46 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduced ? { duration: 0 } : { duration: 0.7, delay: index * 0.06, ease: EASE }}
      className="shrink-0"
    >
      <motion.div
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        animate={{
          backgroundColor: isHovered ? "#ee0000" : "#f6f0f0",
          borderColor: isHovered ? "#ee0000" : "#e6dede",
          y: isHovered ? -10 : 0,
          boxShadow: isHovered
            ? "0 34px 80px -30px rgba(238,0,0,0.6)"
            : "0 2px 8px -4px rgba(0,0,0,0.12)",
        }}
        transition={{
          duration: 0.1,
          ease: "easeOut",
          y: { duration: 0.3, ease: EASE },
          boxShadow: { duration: 0.3, ease: EASE },
        }}
        className={`project-card group relative flex w-[min(320px,82vw)] flex-col overflow-hidden rounded-3xl border p-5 sm:p-6 ${
          wide ? "md:w-[560px]" : "md:w-[450px]"
        }`}
      >
        {/* Media: a screenshot of the thing running, or three facts about it.
            Never a placeholder — a card with nothing in this slot would read
            as a missing image. */}
        <div className="project-media relative mb-4 h-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 md:h-36">
          {project.shot ? (
            <>
              <Image
                src={project.shot}
                alt={`${project.title} interface`}
                width={1280}
                height={800}
                sizes="(max-width: 768px) 82vw, 560px"
                style={{ objectPosition: project.shotPosition ?? "50% 0%" }}
                className="h-full w-full object-cover"
              />
              {/* A screenshot and its facts together: the facts sit on a
                  gradient at the foot of the image. */}
              {project.stats && (
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-x-3 gap-y-0.5 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2 pt-6 text-white">
                  {project.stats.map((s) => (
                    <span key={s} className="font-mono text-[0.6rem] uppercase tracking-[0.16em]">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {project.video && (
                <button
                  type="button"
                  onClick={() => onPlay(project.video!)}
                  aria-label={`Play ${project.video.title} (${project.video.duration})`}
                  className="group/play absolute inset-0 flex items-center justify-center bg-black/25 transition-colors duration-200 hover:bg-black/45"
                >
                  <span className="flex items-center gap-2 rounded-full bg-white py-2 pl-3 pr-4 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-black shadow-xl transition-transform duration-200 group-hover/play:scale-105">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-signal text-white">
                      <Play size={11} fill="currentColor" />
                    </span>
                    Watch demo · {project.video.duration}
                  </span>
                </button>
              )}
            </>
          ) : (
            <div className="fx-dots flex h-full w-full flex-col justify-center gap-1 bg-signal-deep px-4 text-white">
              {project.stats?.map((s) => (
                <span key={s} className="font-mono text-[0.68rem] uppercase tracking-[0.18em]">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="relative min-h-0 flex-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            <motion.span
              animate={{
                color: isHovered ? "#ffffff" : "#a30000",
                backgroundColor: isHovered ? "rgba(255,255,255,0.14)" : "#ffffff",
                borderColor: isHovered ? "rgba(255,255,255,0.34)" : "#e6dede",
              }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="rounded-full border px-3 py-1 font-mono text-[0.68rem] font-bold"
            >
              {project.tag}
            </motion.span>
            <motion.span
              animate={{ color: isHovered ? "#ffffff" : "#6b5f5f" }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="font-mono text-xs"
            >
              0{index + 1}
            </motion.span>
          </div>

          <motion.h3
            animate={{ color: isHovered ? "#ffffff" : "#111111" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="mb-2 text-xl font-black uppercase leading-[0.95] tracking-tight sm:text-2xl md:text-3xl"
          >
            {project.title}
          </motion.h3>

          <motion.p
            animate={{ color: isHovered ? "#ffffff" : "#6b5f5f" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="project-desc text-[0.82rem] font-medium leading-relaxed sm:text-sm md:text-base"
          >
            {project.description}
          </motion.p>

          {project.highlights && (
            <ul className="mt-3 hidden space-y-1 md:block">
              {project.highlights.map((h) => (
                <motion.li
                  key={h}
                  animate={{ color: isHovered ? "#ffffff" : "#6b5f5f" }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className="flex gap-2 text-[0.78rem] leading-snug"
                >
                  <span aria-hidden className={isHovered ? "text-white/70" : "text-signal"}>
                    —
                  </span>
                  <span>{h}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        <motion.div
          animate={{ borderColor: isHovered ? "rgba(255,255,255,0.3)" : "#e6dede" }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="relative mt-3 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t pt-4 font-mono text-xs font-bold"
        >
          <motion.span
            animate={{ color: isHovered ? "#ffffff" : "#6b5f5f" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="text-[0.66rem] uppercase tracking-wider"
          >
            {project.category}
          </motion.span>
          <CardLinks project={project} isHovered={isHovered} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsHorizontalScroll() {
  const targetRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({ target: targetRef });

  // How far the rail travels: exactly the track's overhang past its frame,
  // measured. A fixed percentage was tuned on a wide screen and parked the
  // last card off-screen on phones. Re-measured whenever either box resizes.
  const trackRef = useRef<HTMLDivElement>(null);
  const maxShift = useMotionValue(0);
  useEffect(() => {
    const track = trackRef.current;
    const frame = track?.parentElement;
    if (!track || !frame) return;
    const measure = () => maxShift.set(Math.max(0, track.offsetWidth - frame.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [maxShift]);
  // Both inputs listed explicitly, so the rail re-resolves when EITHER moves.
  const x = useTransform([scrollYProgress, maxShift], ([p, m]: number[]) => -p * m);

  // The track leans into the scroll. Velocity is springed first, so the lean
  // builds and releases instead of snapping on every wheel tick.
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 40, stiffness: 320 });
  const skew = useTransform(smoothVelocity, [-2.5, 0, 2.5], [2.5, 0, -2.5], { clamp: true });

  const railScale = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  const ghostX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  const [current, setCurrent] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setCurrent(Math.min(projects.length, Math.max(1, Math.ceil(p * projects.length) || 1)));
  });

  // Hover is tracked in state rather than with CSS :hover, so it stays right
  // while cards slide under a stationary cursor.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState<DemoVideo | null>(null);

  return (
    <section id="work" ref={targetRef} className="relative z-30 h-[300vh] bg-white text-black">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.span
          aria-hidden
          style={{ x: ghostX }}
          className="fx-outline pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[26vw] font-black uppercase leading-none tracking-tighter text-signal/15 [--fx-stroke:3px]"
        >
          Selected Work
        </motion.span>

        <div className="project-head relative mx-auto mb-6 flex w-full max-w-7xl items-end justify-between gap-4 px-6 md:mb-10 md:px-12">
          <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">
            <MaskText text="Designed to ship." />
          </h2>

          <div className="hidden shrink-0 items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-slate md:flex">
            <span className="tabular-nums text-signal">{String(current).padStart(2, "0")}</span>
            <span className="text-slate/40">/</span>
            <span className="tabular-nums">{String(projects.length).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="relative flex w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            style={reduced ? { x } : { x, skewX: skew }}
            className="flex w-max gap-4 px-6 md:gap-6 md:px-12"
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                isHovered={hoveredIndex === index}
                onEnter={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex((c) => (c === index ? null : c))}
                onPlay={setPlaying}
              />
            ))}
          </motion.div>
        </div>

        <div className="project-rail mx-auto mt-6 w-full max-w-7xl px-6 md:mt-10 md:px-12">
          <DrawRule className="bg-smoke" />
          <motion.div
            style={{ scaleX: railScale, transformOrigin: "left" }}
            className="h-[3px] w-full -translate-y-px bg-signal"
          />
        </div>
      </div>

      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}
