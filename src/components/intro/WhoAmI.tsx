"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ShieldCheck, Code2, Palette } from "lucide-react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*_";

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

  return (
    <span onMouseEnter={scramble} onMouseLeave={stopScramble} className={`cursor-pointer inline-block ${className}`}>
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
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      whileHover={{ scale: 1.03, backgroundColor: "#FF0000" }}
      className="group flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-left cursor-default transition-colors"
    >
      <div className="shrink-0 mt-0.5 text-[#FF0000] group-hover:text-white transition-colors">
        <Icon size={22} strokeWidth={2.2} />
      </div>
      <div>
        <h4 className="text-sm md:text-base font-black uppercase tracking-tight text-gray-900 group-hover:text-white transition-colors mb-1">
          {title}
        </h4>
        <p className="text-xs md:text-sm text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function WhoAmI() {
  const { scrollY } = useScroll();

  const titleOpacity = useTransform(scrollY, [600, 750], [0, 1]);
  const titleY = useTransform(scrollY, [600, 750], [40, 0]);

  const contentOpacity = useTransform(scrollY, [850, 1300], [0, 1]);
  const contentY = useTransform(scrollY, [850, 1300], [30, 0]);

  const shortBio =
    "I'm a B.Tech Cybersecurity student with a strong pull toward building things, not just securing them. My focus right now spans web development, app development, and web design — crafting full-stack applications that scale, building cross-platform mobile experiences, and designing interfaces that feel as intentional as the code behind them. I'm driven by curiosity for how technology works under the hood, and I'm always looking for the next problem worth solving.";

  const [typedBio, setTypedBio] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = contentOpacity.on("change", (latest) => {
      if (latest > 0.5 && !isRevealed) {
        setIsRevealed(true);
        let i = 0;
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        typingTimerRef.current = setInterval(() => {
          if (i < shortBio.length) {
            setTypedBio(shortBio.substring(0, i + 1));
            i++;
          } else {
            if (typingTimerRef.current) clearInterval(typingTimerRef.current);
            setTypingDone(true);
          }
        }, 14);
      }
    });
    return () => unsubscribe();
  }, [contentOpacity, isRevealed, shortBio]);

  useMotionValueEvent(scrollY, "change", (latest) => {
  if (latest < 550 && isRevealed) {
    // resets typing back to blank
  }
});

  const bioWords = shortBio.split(" ");

  return (
    <div className="relative h-[280vh] w-full bg-white text-black z-0">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-10 gap-10">

        <motion.h2
          style={{ opacity: titleOpacity, y: titleY }}
          className="text-6xl md:text-[8rem] font-black text-[#FF0000] tracking-tighter leading-none uppercase whitespace-nowrap select-none text-center"
        >
          WHO AM I?
        </motion.h2>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center px-4"
        >
          {/* Left: short typed bio */}
          <div className="text-left">
            <p className="text-gray-900 text-base md:text-lg font-medium leading-relaxed min-h-[140px]">
              {!typingDone ? (
                <>
                  {typedBio}
                  <span className="inline-block w-2 h-4 bg-red-600 ml-1 animate-pulse" />
                </>
              ) : (
                bioWords.map((word, i) => (
                  <span key={i}>
                    <GlitchText text={word} />{" "}
                  </span>
                ))
              )}
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