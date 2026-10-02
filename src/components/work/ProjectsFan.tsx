"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { usePrefersReducedMotion, useMediaQuery } from "@/lib/hooks";
import { ArrowUpRight, Lock, Play, Plus, X } from "lucide-react";
import VideoModal, { type DemoVideo } from "@/components/ui/VideoModal";
import { lockScroll } from "@/lib/lenis";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { MaskText, DrawRule } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Where each project sits in the hand.
 *
 * The array stays in strength order — that is the reading order, and the
 * order of the stacked layout on a phone — while the fan deals outward from
 * the centre: the first project takes the middle slot and the rest alternate
 * right, left, right… so the weakest end up at the edges, half hidden.
 */
function slotOffset(index: number) {
  if (index === 0) return 0;
  const step = Math.ceil(index / 2);
  return index % 2 === 1 ? step : -step;
}

/** The fan's geometry, in one place. */
const FAN = {
  /** Portrait, like the reference: the picture leads, the words follow. */
  cardWidth: 272,
  /** Horizontal gap between neighbours; clamped against the real container. */
  stepMin: 84,
  stepMax: 150,
  /** Degrees of lean per card away from the middle. */
  tilt: 7.5,
  /**
   * Rotation happens about a point below the deck, not each card's middle,
   * which is what splays the tops apart into one arc — a hand of cards held
   * at the bottom rather than seven separately spun rectangles.
   */
  origin: "50% 132%",
  /** A little extra sink on the outer cards, on top of what the pivot gives. */
  dip: 7,
  /** Nominal card height, for working out how wide the fan wants to be. */
  cardHeight: 480,
  /** The stage's height at full size. */
  stageHeight: 620,
};

type Project = {
  title: string;
  category: string;
  description: string;
  tag: string;
  /** A screenshot of the thing actually running. */
  shot?: string;
  /** Which part of the screenshot the card frame should keep. */
  shotPosition?: string;
  /** A walkthrough, opened over the page. */
  video?: DemoVideo;
  /** Shown in place of a screenshot: three facts, not a placeholder image. */
  stats?: string[];
  /** Only shown in the stacked layout; a fanned card has no room for them. */
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
    note: "Faculty project in development — source private",
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
    stats: ["Firebase Auth", "Real-time Firestore", "Protected routes"],
    code: "https://github.com/Koushik-Gopathi/WebSIG-S4-Recruitment/tree/main/Task-5-Fullstack",
    live: "https://want-to-do.netlify.app/",
  },
];

/** Code / live buttons, or the reason there are none. */
function CardLinks({ project, isActive }: { project: Project; isActive: boolean }) {
  const base =
    "pointer-events-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider transition-colors duration-150";

  if (!project.code && !project.live) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-wider ${
          isActive ? "text-white/90" : "text-slate"
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
            isActive
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
            isActive
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

/**
 * A project opened out: the same card, full size, with the whole description
 * instead of the two lines a fanned card has room for.
 *
 * Portalled to <body> like the video overlay, because the deck it is opened
 * from is transformed, and a fixed element inside a transformed ancestor is
 * fixed to that ancestor rather than the screen.
 */
function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!project) return;
    const opener = document.activeElement as HTMLElement | null;
    const unlock = lockScroll();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
      opener?.focus?.();
    };
  }, [project, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm md:items-center md:p-10"
        >
          <motion.div
            initial={{ y: 26, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 26, scale: 0.97 }}
            transition={reduced ? { duration: 0 } : { duration: 0.32, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-smoke bg-white text-black shadow-2xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-black/50 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
            >
              <X size={18} />
            </button>

            {/* The walkthrough plays in place here, rather than opening a
                second overlay on top of this one. */}
            {project.video ? (
              <video
                src={project.video.src}
                poster={project.video.poster}
                controls
                playsInline
                preload="none"
                className="aspect-[1152/720] w-full bg-black"
              />
            ) : project.shot ? (
              <Image
                src={project.shot}
                alt={`${project.title} interface`}
                width={1280}
                height={800}
                sizes="(max-width: 768px) 92vw, 672px"
                className="aspect-[16/10] w-full object-cover object-top"
              />
            ) : (
              <div className="fx-dots flex aspect-[16/7] w-full flex-col justify-center gap-1.5 bg-signal-deep px-8 text-white">
                {project.stats?.map((s) => (
                  <span key={s} className="font-mono text-xs uppercase tracking-[0.2em]">
                    {s}
                  </span>
                ))}
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-smoke bg-mist px-3 py-1 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-signal-ink">
                  {project.tag}
                </span>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-slate">
                  {project.category}
                </span>
              </div>

              <h3 className="mb-3 text-3xl font-black uppercase leading-[0.95] tracking-tighter md:text-4xl">
                {project.title}
              </h3>

              <p className="text-sm font-medium leading-relaxed text-slate md:text-base">
                {project.description}
              </p>

              {project.highlights && (
                <ul className="mt-5 space-y-2 border-t border-smoke pt-5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5 text-sm leading-snug text-slate">
                      <span aria-hidden className="text-signal">
                        —
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Stats sit under the copy here; on the card they ride the
                  screenshot, where there is no room for words. */}
              {project.stats && (project.shot || project.video) && (
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-smoke pt-5">
                  {project.stats.map((st) => (
                    <span
                      key={st}
                      className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-signal-ink"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <CardLinks project={project} isActive={false} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function ProjectCard({
  project,
  index,
  isActive,
  onEnter,
  onLeave,
  onPlay,
  onOpen,
  fan,
  step,
  spread,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onPlay: (video: DemoVideo) => void;
  onOpen: () => void;
  /** Fanned on a wide screen; a plain stack below that. */
  fan: boolean;
  step: MotionValue<number>;
  /** 0 = stacked behind the middle, 1 = fully fanned out. */
  spread: MotionValue<number>;
}) {
  const reduced = usePrefersReducedMotion();

  // Distance from the middle of the hand: 0 for the centre card.
  const offset = slotOffset(index);
  const away = Math.abs(offset);
  const tilt = offset * FAN.tilt;
  const dip = Math.pow(away, 1.7) * FAN.dip;
  const rest = 1 - away * 0.035;

  const spring = { stiffness: 140, damping: 22, mass: 0.5 };
  // Each card slides out from behind the middle, leaning as it goes.
  const x = useTransform([spread, step], ([p, s]: number[]) => offset * s * p);
  const rotate = useSpring(useTransform(spread, (p) => tilt * p), spring);
  const y = useSpring(useTransform(spread, (p) => dip * p + (1 - p) * 90), spring);
  const scale = useSpring(useTransform(spread, (p) => 0.78 + (rest - 0.78) * p), spring);
  const opacity = useTransform(spread, (p) => Math.min(1, p * 2.4));

  const fanStyle = fan
    ? reduced
      ? {
          x: offset * FAN.stepMax,
          rotate: tilt,
          y: dip,
          scale: rest,
          zIndex: isActive ? 100 : 50 - Math.round(away),
          transformOrigin: FAN.origin,
        }
      : {
          x,
          rotate,
          y,
          scale,
          opacity,
          zIndex: isActive ? 100 : 50 - Math.round(away),
          transformOrigin: FAN.origin,
        }
    : undefined;

  return (
    <motion.div
      style={fanStyle}
      className={
        fan
          ? "absolute left-1/2 top-0 -ml-[136px] w-[272px] will-change-transform"
          : "w-full"
      }
    >
      <motion.div
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onClick={onOpen}
        animate={{
          backgroundColor: isActive ? "#ee0000" : "#f6f0f0",
          borderColor: isActive ? "#ee0000" : "#e6dede",
          // Pulled forward, not straightened: the lean is the whole look.
          scale: fan && isActive ? 1.09 : 1,
          y: isActive ? (fan ? -30 : -10) : 0,
          boxShadow: isActive
            ? "0 36px 80px -28px rgba(238,0,0,0.55)"
            : "0 12px 30px -18px rgba(0,0,0,0.35)",
        }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: 0.1,
                ease: "easeOut",
                scale: { duration: 0.4, ease: EASE },
                y: { duration: 0.4, ease: EASE },
                boxShadow: { duration: 0.35, ease: EASE },
              }
        }
        className={`project-card ${
          fan ? "project-card--fan" : "project-card--stack"
        } group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border p-5 sm:p-6`}
      >
        {/* Keyboard route to the same thing the click does. The card itself is
            not a button: it already contains links, and a button cannot hold
            links. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          aria-label={`Open ${project.title}`}
          className={`absolute right-4 top-4 z-20 grid h-7 w-7 place-items-center rounded-full border transition-colors duration-200 ${
            isActive
              ? "border-white/60 bg-white/15 text-white hover:bg-white hover:text-signal"
              : "border-smoke bg-white/90 text-signal hover:bg-signal hover:text-white"
          }`}
        >
          <Plus size={14} strokeWidth={2.8} />
        </button>

        {/* Media: a screenshot of the thing running, or three facts about it.
            Never a placeholder — a card with nothing in this slot would read
            as a missing image. */}
        <div className="project-media relative mb-3 shrink-0 overflow-hidden rounded-2xl">
          {project.shot ? (
            <>
              <Image
                src={project.shot}
                alt={`${project.title} interface`}
                width={1280}
                height={800}
                sizes="(max-width: 1024px) 90vw, 300px"
                style={{ objectPosition: project.shotPosition ?? "50% 0%" }}
                className="h-full w-full object-cover"
              />
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(project.video!);
                  }}
                  aria-label={`Play ${project.video.title} (${project.video.duration})`}
                  className="group/play absolute inset-0 flex items-center justify-center bg-black/25 transition-colors duration-200 hover:bg-black/45"
                >
                  <span className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-2.5 pr-3 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-black shadow-xl transition-transform duration-200 group-hover/play:scale-105">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-signal text-white">
                      <Play size={10} fill="currentColor" />
                    </span>
                    Demo · {project.video.duration}
                  </span>
                </button>
              )}
            </>
          ) : (
            <div className="fx-dots flex h-full w-full flex-col justify-center gap-1 bg-signal-deep px-4 text-white">
              {project.stats?.map((s) => (
                <span key={s} className="font-mono text-[0.66rem] uppercase tracking-[0.16em]">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="relative min-h-0 flex-1">
          <div className="mb-3 flex items-center gap-3">
            <motion.span
              animate={{
                color: isActive ? "#ffffff" : "#a30000",
                backgroundColor: isActive ? "rgba(255,255,255,0.14)" : "#ffffff",
                borderColor: isActive ? "rgba(255,255,255,0.34)" : "#e6dede",
              }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="rounded-full border px-2.5 py-1 font-mono text-[0.62rem] font-bold"
            >
              {project.tag}
            </motion.span>
          </div>

          <motion.h3
            animate={{ color: isActive ? "#ffffff" : "#111111" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="mb-2 text-xl font-black uppercase leading-[0.95] tracking-tight sm:text-2xl"
          >
            {project.title}
          </motion.h3>

          <motion.p
            animate={{ color: isActive ? "#ffffff" : "#6b5f5f" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="project-desc text-[0.8rem] font-medium leading-relaxed sm:text-sm"
          >
            {project.description}
          </motion.p>

          {/* The flagship's highlights only fit the stacked layout. */}
          {project.highlights && !fan && (
            <ul className="mt-3 hidden space-y-1 md:block">
              {project.highlights.map((h) => (
                <motion.li
                  key={h}
                  animate={{ color: isActive ? "#ffffff" : "#6b5f5f" }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className="flex gap-2 text-[0.78rem] leading-snug"
                >
                  <span aria-hidden className={isActive ? "text-white/70" : "text-signal"}>
                    —
                  </span>
                  <span>{h}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        <motion.div
          animate={{ borderColor: isActive ? "rgba(255,255,255,0.3)" : "#e6dede" }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 mt-3 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t pt-3 font-mono text-xs font-bold"
        >
          <motion.span
            animate={{ color: isActive ? "#ffffff" : "#6b5f5f" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="text-[0.6rem] uppercase tracking-wider"
          >
            {project.category}
          </motion.span>
          <CardLinks project={project} isActive={isActive} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsFan() {
  const sectionRef = useRef<HTMLElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  // A seven-card hand needs room; narrower screens get a plain stack.
  const fan = useMediaQuery("(min-width: 1024px)");

  /**
   * The cards deal themselves out: `spread` runs 0 → 1 as the section rises
   * into view, and every card reads it to slide out from behind the middle.
   */
  const { scrollYProgress: spreadRaw } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const spread = useSpring(spreadRaw, { stiffness: 90, damping: 26, restDelta: 0.001 });

  // The hand keeps one shape at every width and is scaled to the room there
  // is. Because the pivot sits below the deck, an outer card's lean also
  // throws it sideways — that is the swing term, and it has to be paid for or
  // the end cards hang off the edges.
  const step = useMotionValue(FAN.stepMax);
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const el = fanRef.current;
    if (!el) return;
    const measure = () => {
      const maxAway = (projects.length - 1) / 2;
      const swing = 0.82 * FAN.cardHeight * Math.sin((maxAway * FAN.tilt * Math.PI) / 180);
      const wanted = maxAway * FAN.stepMax + swing + FAN.cardWidth / 2;
      const available = el.clientWidth / 2 - 10;
      setFit(Math.min(1, Math.max(0.58, available / wanted)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState<DemoVideo | null>(null);
  const [opened, setOpened] = useState<Project | null>(null);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative z-30 w-full overflow-hidden bg-white px-6 py-20 text-black md:px-12 md:py-28"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-3 md:mb-14 md:flex-row md:items-end">
          <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">
            <MaskText text="Designed to ship." />
          </h2>
        </div>

        <DrawRule className="mb-10 bg-smoke md:mb-14" />

        {/* The hand of cards. Absolute inside a fixed-height stage on a wide
            screen; a plain column below that, where a fan cannot be read. */}
        {/* No pointerleave on this stage: the outer cards lean past its edges,
            so a pointer resting on one of them counts as having left the
            stage and would cancel the hover the instant it began. Each card
            clears itself. */}
        <div
          ref={fanRef}
          style={fan ? { height: Math.round(FAN.stageHeight * fit) } : undefined}
          className={fan ? "relative mx-auto w-full" : "mx-auto flex w-full max-w-xl flex-col gap-5"}
        >
          <div
            style={fan ? { transform: `scale(${fit})`, transformOrigin: "50% 0%" } : undefined}
            className={fan ? "relative h-[620px] w-full" : "contents"}
          >
            {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isActive={active === index}
              onEnter={() => setActive(index)}
              onLeave={() => setActive((c) => (c === index ? null : c))}
              onPlay={setPlaying}
              onOpen={() => setOpened(project)}
              fan={fan}
              step={step}
              spread={spread}
            />
            ))}
          </div>
        </div>
      </div>

      <ProjectDetail project={opened} onClose={() => setOpened(null)} />
      <VideoModal video={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}
