"use client";

import { useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate as animateValue,
  useReducedMotion,
  MotionValue,
} from "framer-motion";

const COLS = 5;
const ROWS = 4;
const SHARDS = COLS * ROWS;

/**
 * Where a shard goes, and WHEN it leaves.
 *
 * The `from` offset is the part that matters: a single scroll range for all
 * twenty pieces made the plate break as one rigid sheet. Staggering the start
 * by ring — centre first, corners last — gives the break a direction and an
 * order, which is the difference between glass shattering and a wall sliding
 * apart. Both the shard and the letter riding it read this, so they can never
 * drift out of sync.
 */
function getShardTarget(index: number) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const xTarget = (col - 2) * 600 + (index % 2 === 0 ? 250 : -250);
  const yTarget = (row - 1.5) * 600 + (index % 3 === 0 ? 250 : -250);
  const rotateTarget = (index % 2 === 0 ? 1 : -1) * (index * 25 + 90);

  // Chebyshev distance from the middle of the grid: 0 for the centre pieces,
  // 2 for the corners.
  const ring = Math.max(Math.abs(col - 2), Math.abs(row - 1.5) - 0.5);
  const from = ring * 55;
  const to = from + 620;

  return { xTarget, yTarget, rotateTarget, from, to };
}

function Shard({ index, scrollY }: { index: number; scrollY: MotionValue<number> }) {
  const { xTarget, yTarget, rotateTarget, from, to } = getShardTarget(index);

  const x = useTransform(scrollY, [from, to], [0, xTarget], { clamp: true });
  const y = useTransform(scrollY, [from, to], [0, yTarget], { clamp: true });
  const rotate = useTransform(scrollY, [from, to], [0, rotateTarget], { clamp: true });
  // Each piece grows a little as it tumbles toward the viewer, then goes.
  const scale = useTransform(scrollY, [from, to], [1.004, 1.18], { clamp: true });
  const opacity = useTransform(scrollY, [from + 330, to], [1, 0], { clamp: true });

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity }}
      className="h-full w-full origin-center bg-signal"
    />
  );
}

// A letter that pops in on mount, then shatters using the SAME transform
// as the grid shard sitting behind it — so letter + glass piece move together.
function LetterShard({
  char,
  index,
  shardIndex,
  scrollY,
}: {
  char: string;
  index: number;
  shardIndex: number;
  scrollY: MotionValue<number>;
}) {
  const mountY = useMotionValue(24);
  const mountBlur = useMotionValue(6);

  useEffect(() => {
    const c1 = animateValue(mountY, 0, { duration: 0.5, delay: 0.4 + index * 0.03, ease: [0.16, 1, 0.3, 1] });
    const c2 = animateValue(mountBlur, 0, { duration: 0.5, delay: 0.4 + index * 0.03, ease: [0.16, 1, 0.3, 1] });
    return () => {
      c1.stop();
      c2.stop();
    };
  }, [index, mountY, mountBlur]);

  // Use the exact same shatter target and timing as the shard grid cell this
  // letter sits over.
  const { xTarget, yTarget, rotateTarget, from, to } = getShardTarget(shardIndex);

  const shatterX = useTransform(scrollY, [from, to], [0, xTarget], { clamp: true });
  const shatterY = useTransform(scrollY, [from, to], [0, yTarget], { clamp: true });
  const shatterRotate = useTransform(scrollY, [from, to], [0, rotateTarget], { clamp: true });
  const shatterOpacity = useTransform(scrollY, [from + 330, to], [1, 0], { clamp: true });

  const totalY = useTransform([mountY, shatterY], (latest) => (latest as number[])[0] + (latest as number[])[1]);
  const filter = useTransform(mountBlur, (b) => `blur(${b}px)`);

  return (
    <motion.span
      style={{ x: shatterX, y: totalY, rotate: shatterRotate, opacity: shatterOpacity, filter }}
      className="inline-block will-change-transform"
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

function NameReveal({ name, scrollY }: { name: string; scrollY: MotionValue<number> }) {
  const letters = name.split("");

  // The name sits horizontally centred across roughly the middle row of the
  // grid — map each letter's horizontal position to one of the 5 grid columns
  // so it shatters in sync with the shard actually behind it.
  const middleRow = 1;

  return (
    <h1 className="flex text-[clamp(1.25rem,7.4vw,3rem)] font-black uppercase tracking-widest text-white drop-shadow-md">
      {letters.map((char, i) => {
        const col = Math.floor((i / letters.length) * COLS);
        const shardIndex = middleRow * COLS + col;

        return <LetterShard key={i} char={char} index={i} shardIndex={shardIndex} scrollY={scrollY} />;
      })}
    </h1>
  );
}

/** The eyebrow and the scroll cue: both belong to the plate, both leave first. */
function Furniture({ scrollY }: { scrollY: MotionValue<number> }) {
  const opacity = useTransform(scrollY, [0, 140], [1, 0], { clamp: true });
  const y = useTransform(scrollY, [0, 240], [0, -40], { clamp: true });

  return (
    <>
      <motion.div
        style={{ opacity, y }}
        className="absolute inset-x-0 top-[calc(50%-5.5rem)] z-20 flex justify-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.7em" }}
          animate={{ opacity: 1, letterSpacing: "0.34em" }}
          transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[0.6rem] uppercase text-white/80 md:text-xs"
        >
          Developer / Designer
        </motion.p>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/70">Scroll</span>
        {/* A 56px rail with a bead falling down it, on a loop. Cheaper and
            calmer than a bouncing chevron, and it reads as a direction. */}
        <span className="relative h-14 w-px overflow-hidden bg-white/30">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 top-0 h-1/2 bg-white"
          />
        </span>
      </motion.div>
    </>
  );
}

export default function RedLanding() {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();

  // Once the plate is gone it must stop intercepting anything and stop
  // compositing twenty transformed layers over the rest of the document.
  const plateVisibility = useTransform(scrollY, (v) => (v > 1400 ? "hidden" : "visible"));

  // Reduced motion gets the same plate as a plain title card: it scrolls away
  // with the document instead of breaking apart. The heading still ships —
  // the name is not allowed to be something only the animation can show you.
  if (reduced) {
    return (
      <section className="fx-grain relative flex h-screen w-full items-center justify-center bg-signal">
        <div aria-hidden className="fx-dots pointer-events-none absolute inset-0 text-white/20" />
        <div className="relative z-10 text-center">
          <p className="mb-5 font-mono text-[0.6rem] uppercase tracking-[0.34em] text-white/80 md:text-xs">
            Developer / Designer
          </p>
          <h1 className="flex justify-center text-[clamp(1.25rem,7.4vw,3rem)] font-black uppercase tracking-widest text-white">
            KOUSHIK GOPATHI
          </h1>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      style={{ visibility: plateVisibility }}
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 z-10 grid h-full w-full grid-cols-5 grid-rows-4">
        {Array.from({ length: SHARDS }).map((_, i) => (
          <Shard key={i} index={i} scrollY={scrollY} />
        ))}
      </div>

      {/* Texture and a vignette, so the plate is a surface rather than a
          swatch. Both sit above the shards but below the type. */}
      <div
        aria-hidden
        className="fx-grain fx-dots pointer-events-none absolute inset-0 z-[15] text-white/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[15]"
        style={{
          background:
            "radial-gradient(115% 85% at 50% 45%, transparent 45%, rgba(90,0,0,0.45) 100%)",
        }}
      />

      <div className="absolute z-20 pointer-events-none">
        <NameReveal name="KOUSHIK GOPATHI" scrollY={scrollY} />
      </div>

      <Furniture scrollY={scrollY} />
    </motion.section>
  );
}
