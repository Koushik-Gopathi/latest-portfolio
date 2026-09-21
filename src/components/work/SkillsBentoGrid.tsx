"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { Variants } from "framer-motion";
import { ShieldCheck, CodeXml, Smartphone, Palette } from "lucide-react";
import { MaskText, DrawRule } from "@/components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const skillCategories = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Cybersecurity & Systems",
    subtitle: "Core Engineering & Security Lab",
    description: "Where the degree points. Threat analysis in SeedLabs, hardened Linux setups, and the web-vulnerability classes I went on to detect automatically in GuardianMesh.",
    skills: ["Kali Linux", "SeedLabs", "Prompt-injection detection", "Operating Systems", "DBMS"],
  },
  {
    number: "02",
    icon: CodeXml,
    title: "Web Development",
    subtitle: "Frontend Architecture",
    description: "The PERN stack end to end. I co-built LogBook, an attendance and scheduling platform my college runs on, and this site is Next.js and Framer Motion.",
    skills: ["React.js", "Next.js", "Express.js", "JavaScript", "HTML/CSS", "Framer Motion"],
  },
  {
    number: "03",
    icon: Smartphone,
    title: "App Development",
    subtitle: "Cross-Platform Solutions",
    description: "Flutter in production: an offline amblyopia screening app under faculty guidance, an attendance tracker shipping through GitHub Actions, and Karen's Android client.",
    skills: ["Flutter", "Dart", "Mobile UI Design"],
  },
  {
    number: "04",
    icon: Palette,
    title: "Design & DevOps Tools",
    subtitle: "Workflow & Craft",
    description: "Designing the interface before writing it, then owning the pipeline — Git, GitHub Actions and CI that deploys on push.",
    skills: ["Figma", "UI/UX Design", "Git & GitHub", "GitHub Actions"],
  },
];

const tagGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const tagItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/** Reduced motion: same end states, no travel and no stagger. */
const tagGroupInstant: Variants = { hidden: {}, show: {} };
const tagItemInstant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
};

function SkillRow({
  category,
  index,
  isActive,
  onHover,
  onPin,
  onLeave,
}: {
  category: (typeof skillCategories)[number];
  index: number;
  isActive: boolean;
  onHover: () => void;
  onPin: () => void;
  onLeave: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const Icon = category.icon;
  const panelId = `skill-panel-${category.number}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={reduced ? { duration: 0 } : { duration: 0.7, delay: index * 0.08, ease: EASE }}
      onPointerEnter={(e) => {
        // Hover opens the row on a mouse. Touch gets the tap handler instead,
        // or the panel would open and close under the same thumb.
        if (e.pointerType === "mouse") onHover();
      }}
      onPointerLeave={onLeave}
      className="relative isolate overflow-hidden"
    >
      {/* The white plate. It wipes in from the left across the header AND the
          panel, so an open row reads as one white band cut out of the red page
          rather than a card sitting on top of it. */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
        style={{ originX: 0 }}
        className="pointer-events-none absolute inset-0 -z-10 bg-white"
      />

      <button
        type="button"
        onClick={onPin}
        onFocus={onHover}
        onBlur={onLeave}
        aria-expanded={isActive}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center gap-3 px-3 py-6 text-left sm:gap-4 sm:px-4 md:gap-8 md:px-6 md:py-7"
      >
        <span
          className={`font-mono text-xs font-bold transition-colors duration-200 ${
            isActive ? "text-signal" : "text-white/60"
          }`}
        >
          {category.number}
        </span>

        <h3
          className={`min-w-0 text-[clamp(1.2rem,6.4vw,1.5rem)] font-black uppercase leading-none tracking-tighter hyphens-auto transition-colors duration-200 md:text-4xl lg:text-5xl ${
            isActive ? "text-signal" : "text-white"
          }`}
        >
          {category.title}
        </h3>

        <span
          className={`ml-auto hidden shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.22em] transition-colors duration-200 lg:block ${
            isActive ? "text-signal-ink" : "text-white/60"
          }`}
        >
          {category.subtitle}
        </span>

        {/* The marker: a plus that turns into a minus as the row opens. */}
        <span
          aria-hidden
          className={`relative ml-auto grid h-8 w-8 shrink-0 place-items-center sm:h-9 sm:w-9 rounded-full border transition-colors duration-200 lg:ml-8 ${
            isActive ? "border-signal text-signal" : "border-white/40 text-white"
          }`}
        >
          <span className="absolute h-[1.5px] w-3.5 bg-current" />
          <motion.span
            animate={{ rotate: isActive ? 90 : 0, opacity: isActive ? 0 : 1 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute h-3.5 w-[1.5px] bg-current"
          />
        </span>
      </button>

      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
        className="overflow-hidden"
      >
        <div className="relative grid grid-cols-1 gap-6 px-3 pb-10 sm:px-4 md:px-6 lg:grid-cols-[1fr_auto] lg:gap-8">
          {/* Oversized index, hollow, behind the panel content. */}
          <span
            aria-hidden
            className="fx-outline pointer-events-none absolute -bottom-8 right-2 select-none text-[7rem] font-black leading-none tracking-tighter text-signal/25 [--fx-stroke:2px] md:text-[9rem]"
          >
            {category.number}
          </span>

          <div className="relative max-w-xl">
            {/* The subtitle only sits in the header on a wide screen; below
                that it belongs to the panel. */}
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-smoke bg-mist px-3 py-1.5 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-signal-ink lg:hidden">
              <Icon size={13} strokeWidth={2.6} />
              {category.subtitle}
            </span>
            <p className="text-base font-medium leading-relaxed text-slate md:text-lg">
              {category.description}
            </p>
          </div>

          <motion.div
            variants={reduced ? tagGroupInstant : tagGroup}
            initial="hidden"
            animate={isActive ? "show" : "hidden"}
            className="relative flex flex-wrap items-start content-start gap-2 lg:max-w-md lg:justify-end"
          >
            {category.skills.map((skill) => (
              <motion.span
                key={skill}
                variants={reduced ? tagItemInstant : tagItem}
                className="cursor-default rounded-xl border border-smoke bg-mist px-3 py-1.5 font-mono text-xs font-bold text-black transition-[transform,background-color,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-signal hover:bg-signal hover:text-white"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SkillsBentoGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  // Which row is showing. `pinned` is what a click chose; a hover outranks it
  // while the pointer is on the list, so the list answers the mouse with no
  // click at all and falls back to the pinned row on the way out.
  const [pinned, setPinned] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? pinned;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const ghostX = useTransform(scrollYProgress, [0, 1], ["14%", "-26%"]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.14, 0]);

  return (
    <section
      ref={sectionRef}
      className="fx-grain relative z-30 min-h-screen w-full overflow-hidden bg-signal px-4 py-20 text-white sm:px-6 md:px-16 md:py-32"
    >
      <motion.div
        aria-hidden
        style={{ y: gridY }}
        className="fx-rule-grid pointer-events-none absolute inset-x-0 -inset-y-24 text-white/[0.14]"
      />
      <div aria-hidden className="fx-dots pointer-events-none absolute inset-0 text-white/20" />

      <motion.span
        aria-hidden
        style={{ x: ghostX, opacity: ghostOpacity }}
        className="fx-outline pointer-events-none absolute left-0 top-1/2 select-none whitespace-nowrap text-[22vw] font-black uppercase leading-none tracking-tighter text-white [--fx-stroke:3px]"
      >
        Skills Skills
      </motion.span>

      <div className="relative z-10">
        <div className="mx-auto mb-14 max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 pb-6 md:flex-row md:items-end">
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white md:text-6xl">
              <MaskText text="Skills & Expertise." />
            </h2>

            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-white/70"
            >
              <span className="fx-hover-only">Hover to open</span>
              <span className="fx-touch-only">Tap to open</span>
              <span
                aria-hidden
                className="inline-block h-3 w-1.5 bg-white"
                style={{ animation: "fx-blink 1.1s steps(1) infinite" }}
              />
            </motion.p>
          </div>
          <DrawRule className="bg-white/40" delay={0.2} />
        </div>

        {/* One list, four rows — no grid. The type is the layout, and only the
            row under the pointer is open. */}
        <div
          className="mx-auto max-w-6xl divide-y divide-white/25 border-b border-white/25"
          onPointerLeave={() => setHovered(null)}
        >
          {skillCategories.map((category, index) => (
            <SkillRow
              key={category.number}
              category={category}
              index={index}
              isActive={active === index}
              onHover={() => setHovered(index)}
              onPin={() => {
                setPinned((p) => (p === index ? null : index));
                setHovered(index);
              }}
              onLeave={() => setHovered((h) => (h === index ? null : h))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
