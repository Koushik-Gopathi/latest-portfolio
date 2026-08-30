"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail, Phone, Copy, Check, ArrowUpRight } from "lucide-react";

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

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  return (
    <span onMouseEnter={scramble} onMouseLeave={stop} className={`cursor-pointer inline-block ${className}`}>
      {displayText}
    </span>
  );
}

// Inline brand icons — lucide-react dropped brand logos, so these are hand-rolled SVGs
function GithubIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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
        className="group flex items-center justify-between w-full bg-white/10 hover:bg-white text-white hover:text-[#FF0000] border border-white/20 hover:border-white rounded-2xl px-6 py-5 md:px-8 md:py-6 transition-colors duration-300 cursor-pointer"
      >
        <div className="flex items-center gap-4 md:gap-5">
          <span className="shrink-0">{icon}</span>
          <div className="text-left">
            <p className="text-xs font-mono uppercase tracking-widest opacity-60 mb-1">{label}</p>
            <p className="text-base md:text-xl font-bold tracking-tight">{value}</p>
          </div>
        </div>

        {!href ? (
          <span className="shrink-0">
            {copied ? <Check size={20} /> : <Copy size={20} className="opacity-50 group-hover:opacity-100" />}
          </span>
        ) : (
          <ArrowUpRight
            size={20}
            className="shrink-0 opacity-50 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
          className="absolute rounded-full bg-white/10"
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

export default function ContactMe() {
  return (
    <section className="relative w-full bg-[#FF0000] text-white py-32 px-6 md:px-12 overflow-hidden">
      <FloatingDots />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-white/70 mb-4"
        >
          Got a project in mind?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6"
        >
          <GlitchText text="LET'S" />
          <br />
          <GlitchText text="CONNECT" />
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/80 text-sm md:text-base font-medium max-w-md mx-auto mb-14"
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
          className="text-white/50 text-xs font-mono mt-16"
        >
          © {new Date().getFullYear()} Koushik Gopathi
        </motion.p>
      </div>
    </section>
  );
}