"use client";

import { motion } from "framer-motion";
import { Download, GraduationCap, BadgeCheck, Users } from "lucide-react";
import { MaskText, Reveal, DrawRule } from "@/components/ui/Reveal";
import { site } from "@/config/site";

const EASE = [0.16, 1, 0.3, 1] as const;

const education = [
  {
    degree: "B.Tech, CSE (Cyber Security)",
    place: "Amrita Vishwa Vidyapeetham, Amritapuri",
    score: "CGPA 7.61 / 10",
    years: "2024 — 2028",
    current: true,
  },
  {
    degree: "Intermediate (MPC)",
    place: "Sri Chaitanya Junior College, Telangana",
    score: "95.5%",
    years: "2022 — 2024",
  },
  {
    degree: "Secondary School (SSC, State Board)",
    place: "Sri Chaitanya School, Telangana",
    score: "CGPA 9.7 / 10",
    years: "2021 — 2022",
  },
];

const certifications = [
  { name: "Introduction to Cybersecurity", issuer: "Cisco" },
  { name: "Database SQL (DBMS)", issuer: "Oracle" },
  { name: "Professional Soft Skills Pathway", issuer: "LinkedIn Learning" },
  { name: "Critical Thinking & Decision-Making", issuer: "LinkedIn Learning" },
];

const community = [
  { name: "Mentor, ACM Student Chapter", detail: "Ran the junior induction; guide juniors in web & app dev" },
  { name: "Kargil Vijay Diwas Marathon", detail: "Co-led organisation for 400+ participants" },
  { name: "Vishmaya Summer Camp", detail: "Taught web development basics to school students" },
];

function Column({
  icon: Icon,
  label,
  children,
  delay = 0,
}: {
  icon: typeof GraduationCap;
  label: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} y={24} className="relative">
      <div className="mb-5 flex items-center gap-2 border-b border-white/35 pb-3">
        <Icon size={15} strokeWidth={2.6} className="text-white" />
        <h3 className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white">
          {label}
        </h3>
      </div>
      {children}
    </Reveal>
  );
}

export default function Education() {
  return (
    <section
      id="education"
      className="fx-grain relative w-full overflow-hidden bg-signal px-6 py-20 text-white md:px-12 md:py-28"
    >
      <div aria-hidden className="fx-dots pointer-events-none absolute inset-0 text-white/20" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-white">
              The paperwork
            </p>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tighter md:text-6xl">
              <MaskText text="Education &amp; credentials." />
            </h2>
          </div>

          {/* The one thing a recruiter always wants, where they cannot miss it. */}
          <motion.a
            href={site.resume.href}
            download
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            whileHover={{ y: -2 }}
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal shadow-[0_18px_44px_-22px_rgba(0,0,0,0.55)] transition-colors duration-200 hover:bg-black hover:text-white"
          >
            <Download size={15} strokeWidth={2.6} />
            Download résumé
            <span className="font-normal normal-case tracking-normal opacity-75">
              {site.resume.meta}
            </span>
          </motion.a>
        </div>

        <DrawRule className="mb-12 bg-white/40" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-10">
          <Column icon={GraduationCap} label="Education">
            <ol className="space-y-6">
              {education.map((e) => (
                <li key={e.degree} className="relative border-l-2 border-white/35 pl-5">
                  {/* The current course gets the solid marker; the rest are history. */}
                  <span
                    aria-hidden
                    className={`absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ${
                      e.current ? "bg-white ring-4 ring-white/30" : "bg-white/50"
                    }`}
                  />
                  <p className="text-base font-black uppercase leading-tight tracking-tight md:text-lg">
                    {e.degree}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">{e.place}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-wider">
                    <span className="rounded bg-white px-1.5 py-0.5 font-bold text-signal-ink">{e.score}</span>
                    <span className="text-white">{e.years}</span>
                  </p>
                </li>
              ))}
            </ol>
          </Column>

          <Column icon={BadgeCheck} label="Certifications" delay={0.1}>
            <ul className="space-y-4">
              {certifications.map((c) => (
                <li key={c.name}>
                  <p className="text-sm font-bold leading-snug text-white">{c.name}</p>
                  <p className="mt-0.5 font-mono text-[0.66rem] uppercase tracking-wider text-white">
                    {c.issuer}
                  </p>
                </li>
              ))}
            </ul>
          </Column>

          <Column icon={Users} label="Leadership" delay={0.2}>
            <ul className="space-y-4">
              {community.map((c) => (
                <li key={c.name}>
                  <p className="text-sm font-bold leading-snug text-white">{c.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white">{c.detail}</p>
                </li>
              ))}
            </ul>
          </Column>
        </div>
      </div>
    </section>
  );
}
