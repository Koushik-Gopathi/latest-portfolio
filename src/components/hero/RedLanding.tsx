"use client";

import { useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, animate as animateValue, MotionValue } from "framer-motion";

// Shared formula for a shard's shatter target, based on its grid index (0-19 in a 5x4 grid)
function getShardTarget(index: number) {
  const col = index % 5;
  const row = Math.floor(index / 5);
  const xTarget = (col - 2) * 600 + (index % 2 === 0 ? 250 : -250);
  const yTarget = (row - 1.5) * 600 + (index % 3 === 0 ? 250 : -250);
  const rotateTarget = (index % 2 === 0 ? 1 : -1) * (index * 25 + 90);
  return { xTarget, yTarget, rotateTarget };
}

function Shard({ index, scrollY }: { index: number; scrollY: MotionValue<number> }) {
  const { xTarget, yTarget, rotateTarget } = getShardTarget(index);

  const x = useTransform(scrollY, [0, 700], [0, xTarget]);
  const y = useTransform(scrollY, [0, 700], [0, yTarget]);
  const rotate = useTransform(scrollY, [0, 700], [0, rotateTarget]);
  const opacity = useTransform(scrollY, [400, 700], [1, 0]);

  return (
    <motion.div
      style={{ x, y, rotate, opacity }}
      className="w-full h-full bg-[#FF0000] origin-center"
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

  // Use the exact same shatter target as the shard grid cell this letter sits over
  const { xTarget, yTarget, rotateTarget } = getShardTarget(shardIndex);

  const shatterX = useTransform(scrollY, [0, 700], [0, xTarget]);
  const shatterY = useTransform(scrollY, [0, 700], [0, yTarget]);
  const shatterRotate = useTransform(scrollY, [0, 700], [0, rotateTarget]);
  const shatterOpacity = useTransform(scrollY, [400, 700], [1, 0]);

  const totalY = useTransform([mountY, shatterY], (latest) => (latest as number[])[0] + (latest as number[])[1]);
  const filter = useTransform(mountBlur, (b) => `blur(${b}px)`);

  return (
    <motion.span
      style={{ x: shatterX, y: totalY, rotate: shatterRotate, opacity: shatterOpacity, filter }}
      className="inline-block will-change-transform"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

function NameReveal({ name, scrollY }: { name: string; scrollY: MotionValue<number> }) {
  const letters = name.split("");

  // The name sits horizontally centered across roughly the middle row of the
  // grid — map each letter's horizontal position to one of the 5 grid columns
  // so it shatters in sync with the shard actually behind it.
  const middleRow = 1; // 0-indexed row (5 cols x 4 rows grid) — tweak if your name sits on a different row visually
  const numCols = 5;

  return (
    <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase text-white drop-shadow-md flex">
      {letters.map((char, i) => {
        // Distribute letters evenly across the 5 columns based on horizontal order
        const col = Math.floor((i / letters.length) * numCols);
        const shardIndex = middleRow * numCols + col;

        return (
          <LetterShard
            key={i}
            char={char}
            index={i}
            shardIndex={shardIndex}
            scrollY={scrollY}
          />
        );
      })}
    </h1>
  );
}

export default function RedLanding() {
  const { scrollY } = useScroll();

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 w-full h-full z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <Shard key={i} index={i} scrollY={scrollY} />
        ))}
      </div>

      <div className="z-20 absolute pointer-events-none">
        <NameReveal name="KOUSHIK GOPATHI" scrollY={scrollY} />
      </div>
    </section>
  );
}