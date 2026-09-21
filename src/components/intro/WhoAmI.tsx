"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { site } from "@/config/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The facts a recruiter scans for, in the first block of the page.
 *
 * This replaces three cards that repeated the Skills section further down
 * (Cybersecurity / Web & App Dev / Design) — the same three headings twice on
 * one page told the visitor nothing the second time.
 */
const facts = [
  ["Course", "B.Tech CSE — Cyber Security"],
  ["College", "Amrita Vishwa Vidyapeetham, Amritapuri"],
  ["Year", "3rd year · graduating 2028"],
  ["CGPA", "7.61 / 10"],
  ["Open to", "Internships & freelance"],
];

export default function WhoAmI() {
  const { scrollY } = useScroll();
  const reduced = usePrefersReducedMotion();

  const titleOpacity = useTransform(scrollY, [600, 750], [0, 1]);
  const titleY = useTransform(scrollY, [600, 750], [40, 0]);
  // The heading keeps moving after it has arrived — it drifts up as the block
  // below takes over. On a short screen there is no headroom to drift into:
  // the full 70px lift pushed it off the top of a 640px phone.
  const roomy = useMediaQuery("(min-height: 760px)");
  const titleDrift = useTransform(scrollY, [750, 1500], [0, roomy ? -70 : -16]);
  const ghostX = useTransform(scrollY, [600, 1600], [-40, 60]);
  // How much of the solid word is showing over its outline.
  const fillClip = useTransform(scrollY, [700, 1150], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);

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
   * revealed — in about a second and a half rather than six seconds. Nobody
   * should have to wait out an animation to read the one paragraph that says
   * who you are.
   *
   * It advances several characters per tick instead of one character per 5ms:
   * same speed on screen, a fifth of the renders.
   *
   * Two other things here are deliberate:
   *
   * - The trigger is the block's own reveal progress, not an intersection
   *   observer. The container is `sticky top-0` inside a very tall section, so
   *   the paragraph is technically on screen from the first frame — an observer
   *   would type it out behind the red landing plate and the visitor would
   *   arrive to finished text.
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

    const STEP = 4;
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      let i = 0;
      typingTimerRef.current = setInterval(() => {
        i += STEP;
        if (i < shortBio.length) {
          setTypedBio(shortBio.slice(0, i));
        } else {
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setTypedBio(shortBio);
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

  return (
    <div className="relative z-0 h-[max(280vh,2600px)] w-full bg-white text-black">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden px-4 py-6 md:gap-10 md:px-10">
        {/* Ambient red wash behind everything, drifting against the heading. */}
        <motion.div
          aria-hidden
          style={{ x: ghostX }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(238,0,0,0.14),transparent_65%)]" />
        </motion.div>
        <div aria-hidden className="fx-dots pointer-events-none absolute inset-0 text-signal/15" />

        {/* Section index, set vertically down the left edge. */}
        <span
          aria-hidden
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-slate/50 [writing-mode:vertical-rl] md:block"
        >
          01 — About
        </span>

        {/* The outline is the real heading; the solid copy sits exactly on
            top of it and is uncovered left to right as you scroll. */}
        <motion.div style={{ opacity: titleOpacity, y: titleTotalY }} className="relative">
          <h2 className="about-title fx-outline select-none whitespace-nowrap text-center font-black uppercase leading-none tracking-tighter text-signal [--fx-stroke:2px]">
            WHO AM I?
          </h2>
          <motion.span
            aria-hidden
            style={{ clipPath: reduced ? "inset(0 0% 0 0)" : fillClip }}
            className="about-title absolute inset-0 select-none whitespace-nowrap text-center font-black uppercase leading-none tracking-tighter text-signal"
          >
            WHO AM I?
          </motion.span>
        </motion.div>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-6 px-2 sm:px-4 md:grid-cols-2 md:gap-16"
        >
          {/* Left: the bio, typed out. The caret stays after the last
              character, because a typewriter that loses its cursor the instant
              it finishes stops reading as one. The hover-scramble that used to
              sit on these words is gone: turning the one paragraph that
              explains you into gibberish is a toy fighting the reader. */}
          <div className="text-left">
            <p className="about-bio relative font-medium text-black">
              <span className="sr-only">{shortBio}</span>

              {/* An invisible copy of the finished paragraph holds its exact
                  final height from the first frame, at any width, so the
                  centred block does not creep upward as the text grows. */}
              <span aria-hidden className="invisible">
                {shortBio}
                <span className="ml-0.5 inline-block w-[0.5ch]" />
              </span>

              <span aria-hidden className="absolute inset-0">
                {typingDone ? shortBio : typedBio}
                <span
                  className="ml-0.5 inline-block h-[1.05em] w-[0.5ch] translate-y-[0.16em] bg-signal"
                  style={{ animation: "fx-blink 1.05s steps(1) infinite" }}
                />
              </span>
            </p>
          </div>

          {/* Right: the facts, and the CV. */}
          <div className="about-cards">
            <motion.dl
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE }}
              className="overflow-hidden rounded-2xl border border-smoke bg-white shadow-[0_16px_50px_-30px_rgba(0,0,0,0.5)]"
            >
              {facts.map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex items-baseline justify-between gap-4 px-4 py-2.5 md:px-5 md:py-3 ${
                    i === 0 ? "" : "border-t border-smoke"
                  }`}
                >
                  <dt className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-slate">
                    {label}
                  </dt>
                  <dd className="text-right text-[0.78rem] font-bold leading-snug text-black md:text-sm">
                    {value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.a
              href={site.resume.href}
              download
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.12, ease: EASE }}
              whileHover={{ y: -2 }}
              className="mt-3 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-signal px-5 py-3.5 font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-black"
            >
              <Download size={14} strokeWidth={2.6} />
              Résumé
              <span className="font-normal normal-case tracking-normal text-white/80">
                {site.resume.meta}
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
