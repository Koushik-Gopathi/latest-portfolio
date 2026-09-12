"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ShieldCheck, Code2, Palette, ArrowUpRight } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*_";
const EASE = [0.16, 1, 0.3, 1] as const;

function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let frame = 0;
    const totalFrames = Math.max(10, text.length * 2.5);

    intervalRef.current = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        return;
      }
      setDisplayText(
        text
          .split("")
          .map((ch) => (ch === " " ? " " : LETTERS[Math.floor(Math.random() * LETTERS.length)]))
          .join("")
      );
    }, 40);
  };

  const stopScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  // Always clear on unmount, or a scramble left running keeps setState firing
  // into a dead component.
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return (
    <span
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className={`inline-block cursor-pointer transition-colors duration-200 hover:text-signal ${className}`}
    >
      {displayText}
    </span>
  );
}

const skills = [
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description: "Securing systems, understanding attack surfaces, thinking like a defender.",
  },
  {
    icon: Code2,
    title: "Web & App Dev",
    description: "Building scalable full-stack applications with modern frameworks.",
  },
  {
    icon: Palette,
    title: "Design",
    description: "Crafting clean, intentional interfaces that feel as good as they look.",
  },
];

function SkillCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <TiltCard
      strength={5}
      lift={14}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
      className="fx-spotlight group relative flex cursor-default items-start gap-4 overflow-hidden rounded-2xl border border-smoke bg-white px-5 py-4 text-left shadow-[0_12px_40px_-26px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:border-signal hover:bg-signal"
    >
      {/* A red plate that wipes in from the left under the content, so the
          hover is a fill rather than a colour swap. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      <div className="relative z-10 mt-0.5 shrink-0 text-signal transition-colors duration-300 group-hover:text-white">
        <Icon size={22} strokeWidth={2.2} />
      </div>
      <div className="relative z-10">
        <h4 className="mb-1 text-sm font-black uppercase tracking-tight text-black transition-colors duration-300 group-hover:text-white md:text-base">
          {title}
        </h4>
        <p className="text-xs leading-relaxed text-slate transition-colors duration-300 group-hover:text-white/90 md:text-sm">
          {description}
        </p>
      </div>

      <ArrowUpRight
        size={16}
        aria-hidden
        className="relative z-10 mt-1 shrink-0 -translate-x-1 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      />
    </TiltCard>
  );
}

export default function WhoAmI() {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();

  const titleOpacity = useTransform(scrollY, [600, 750], [0, 1]);
  const titleY = useTransform(scrollY, [600, 750], [40, 0]);
  // The heading keeps moving after it has arrived — it drifts up and loosens
  // its tracking as the block below it takes over.
  const titleDrift = useTransform(scrollY, [750, 1500], [0, -70]);
  const titleScale = useTransform(scrollY, [600, 1500], [1.08, 0.94]);
  const ghostX = useTransform(scrollY, [600, 1600], [-40, 60]);

  const titleTotalY = useTransform([titleY, titleDrift], (v) => (v as number[])[0] + (v as number[])[1]);

  const contentOpacity = useTransform(scrollY, [850, 1300], [0, 1]);
  const contentY = useTransform(scrollY, [850, 1300], [30, 0]);

  const shortBio =
    "I'm a B.Tech Cybersecurity student with a strong pull toward building things, not just securing them. My focus right now spans web development, app development, and web design — crafting full-stack applications that scale, building cross-platform mobile experiences, and designing interfaces that feel as intentional as the code behind them. I'm driven by curiosity for how technology works under the hood, and I'm always looking for the next problem worth solving.";

  const [typedBio, setTypedBio] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startedRef = useRef(false);

  /**
   * The bio types itself out, once, the first time the block is more than half
   * revealed.
   *
   * Three things here are deliberate:
   *
   * - The trigger is the block's own reveal progress, not an intersection
   *   observer. The container is `sticky top-0` inside a 280vh section, so the
   *   paragraph is technically on screen from the very first frame — an
   *   observer would type the whole thing out behind the red landing plate and
   *   the visitor would arrive to finished text.
   * - The current value is checked on mount as well as subscribed to, so a
   *   reload halfway down the page still types.
   * - The "has it started" flag is a ref and the cleanup does NOT clear the
   *   interval. A state flag would make this effect depend on a value it sets,
   *   so the re-subscribe would tear down the interval it created a tick
   *   earlier and the paragraph would stay blank for good.
   */
  useEffect(() => {
    if (reduced) {
      setTypedBio(shortBio);
      setTypingDone(true);
      return;
    }

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      let i = 0;
      typingTimerRef.current = setInterval(() => {
        if (i < shortBio.length) {
          setTypedBio(shortBio.substring(0, i + 1));
          i++;
        } else {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setTypingDone(true);
        }
      }, 13);
    };

    if (contentOpacity.get() > 0.5) start();
    return contentOpacity.on("change", (latest) => {
      if (latest > 0.5) start();
    });
  }, [contentOpacity, shortBio, reduced]);

  useEffect(
    () => () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    },
    []
  );

  const bioWords = shortBio.split(" ");

  return (
    <div className="relative z-0 h-[280vh] w-full bg-white text-black">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-10 overflow-hidden px-4 md:px-10">
        {/* Ambient red wash behind everything, drifting against the heading. */}
        <motion.div
          aria-hidden
          style={{ x: ghostX }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(255,0,0,0.14),transparent_65%)]" />
        </motion.div>
        <div aria-hidden className="fx-dots pointer-events-none absolute inset-0 text-signal/15" />

        {/* Section index, set vertically down the left edge. */}
        <span
          aria-hidden
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-slate/50 [writing-mode:vertical-rl] md:block"
        >
          01 — About
        </span>

        <div className="relative">
          {/* The hollow twin sits behind the solid word and moves the other
              way, which is what gives a single centred heading depth. */}
          <motion.h2
            aria-hidden
            style={{ opacity: titleOpacity, y: titleDrift, x: ghostX, scale: titleScale }}
            className="fx-outline absolute inset-0 hidden select-none whitespace-nowrap text-center text-6xl font-black uppercase leading-none tracking-tighter text-signal/40 [--fx-stroke:2px] md:block md:text-[8rem]"
          >
            WHO AM I?
          </motion.h2>

          <motion.h2
            style={{ opacity: titleOpacity, y: titleTotalY }}
            className="relative select-none whitespace-nowrap text-center text-6xl font-black uppercase leading-none tracking-tighter text-signal md:text-[8rem]"
          >
            WHO AM I?
          </motion.h2>
        </div>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:gap-16"
        >
          {/* Left: the bio, typed out. The finished text swaps to per-word
              spans so each word can scramble on hover; the caret stays put
              either way, because a typewriter that loses its cursor the
              instant it finishes stops reading as one. */}
          <div className="text-left">
            <p className="min-h-[190px] text-base font-medium leading-relaxed text-black md:min-h-[210px] md:text-lg">
              <span className="sr-only">{shortBio}</span>

              <span aria-hidden>
                {!typingDone
                  ? typedBio
                  : bioWords.map((word, i) => (
                      <span key={i}>
                        <GlitchText text={word} />{" "}
                      </span>
                    ))}
                <span
                  className="ml-0.5 inline-block h-[1.05em] w-[0.5ch] translate-y-[0.16em] bg-signal"
                  style={{ animation: "fx-blink 1.05s steps(1) infinite" }}
                />
              </span>
            </p>
          </div>

          {/* Right: interactive skill cards */}
          <div className="flex flex-col gap-3">
            {skills.map((skill, i) => (
              <SkillCard
                key={skill.title}
                icon={skill.icon}
                title={skill.title}
                description={skill.description}
                index={i}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
