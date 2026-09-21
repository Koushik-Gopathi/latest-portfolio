"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail, Phone, Copy, Check, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import GlitchText from "@/components/ui/GlitchText";

// Button that subtly follows the cursor within its own bounds ("magnetic" feel)
function MagneticButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.25);
    y.set(relY * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CopyableRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <MagneticButton className="w-full">
      <motion.a
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        onClick={!href ? handleCopy : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="fx-spotlight fx-sheen group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-2xl border border-smoke bg-white px-6 py-5 text-black shadow-[0_10px_30px_-22px_rgba(0,0,0,0.45)] transition-colors duration-300 hover:border-signal hover:bg-signal hover:text-white md:px-8 md:py-6"
      >
        <div className="relative z-10 flex min-w-0 items-center gap-4 md:gap-5">
          <span className="shrink-0 text-signal transition-colors duration-300 group-hover:text-white">{icon}</span>
          <div className="min-w-0 text-left">
            <p className="text-xs font-mono uppercase tracking-widest mb-1 text-slate transition-colors duration-300 group-hover:text-white">{label}</p>
            <p className="text-base md:text-xl font-bold tracking-tight [overflow-wrap:anywhere]">{value}</p>
          </div>
        </div>

        {!href ? (
          <span className="relative z-10 shrink-0">
            {copied ? <Check size={20} /> : <Copy size={20} className="opacity-50 group-hover:opacity-100" />}
          </span>
        ) : (
          <ArrowUpRight
            size={20}
            className="relative z-10 shrink-0 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        )}
      </motion.a>
    </MagneticButton>
  );
}

// Slowly drifting background dots for ambient motion
function FloatingDots() {
  const dots = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-signal/15"
          style={{
            width: 4 + (i % 3) * 4,
            height: 4 + (i % 3) * 4,
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + (i % 5),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

/**
 * The last thing on the page: one line of type running out of the bottom of
 * the document. It is set in outline rather than solid so it closes the page
 * without competing with the contact rows above it.
 */
function FooterMarquee() {
  return (
    <div className="relative z-10 mt-24 overflow-hidden border-t border-smoke py-8">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        className="flex w-max whitespace-nowrap"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="select-none px-6 text-[4rem] font-black uppercase leading-none tracking-tighter text-signal md:text-[6rem]"
          >
            Let&rsquo;s work together ·
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ContactMe() {
  return (
    <section className="relative w-full overflow-hidden bg-white px-6 pb-0 pt-20 text-black md:px-12 md:pt-32">
      <FloatingDots />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-signal mb-4"
        >
          Got a project in mind?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mb-6 text-5xl font-black uppercase leading-none tracking-tighter text-signal md:text-8xl"
        >
          <span className="relative">
            <GlitchText text="LET'S" />
            <br />
            <GlitchText text="CONNECT" />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate text-sm md:text-base font-medium max-w-md mx-auto mb-14"
        >
          Whether it's a project, an opportunity, or just to talk tech — my inbox is always open.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col gap-4"
        >
          <CopyableRow icon={<Mail size={22} />} label="Email" value="g.koushikvarma724@gmail.com" />
          <CopyableRow icon={<Phone size={22} />} label="Phone" value="+91 8919596047" />
          <CopyableRow
            icon={<LinkedinIcon size={22} />}
            label="LinkedIn"
            value="linkedin.com/in/koushikgopathi"
            href="https://www.linkedin.com/in/gopathi-koushik-48844631a/"
          />
          <CopyableRow
            icon={<GithubIcon size={22} />}
            label="GitHub"
            value="github.com/koushikgopathi"
            href="https://github.com/Koushik-Gopathi"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 font-mono text-xs text-slate"
        >
          © {new Date().getFullYear()} Koushik Gopathi
        </motion.p>
      </div>

      <FooterMarquee />
    </section>
  );
}