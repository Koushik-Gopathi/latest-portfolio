"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { MotionStyle, TargetAndTransition, Transition, VariantLabels } from "framer-motion";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees at the corners. 0 disables the tilt. */
  strength?: number;
  /** How far the card lifts toward the viewer on hover, in px. */
  lift?: number;
  style?: MotionStyle;
  initial?: TargetAndTransition | VariantLabels | boolean;
  whileInView?: TargetAndTransition | VariantLabels;
  animate?: TargetAndTransition | VariantLabels;
  whileHover?: TargetAndTransition | VariantLabels;
  transition?: Transition;
  viewport?: { once?: boolean; amount?: number | "some" | "all" };
  onPointerEnterCapture?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

/**
 * A card that leans toward the pointer and carries a light source with it.
 *
 * Two things happen on one pointermove, which is why they live together: the
 * rotation (springed, so the card settles instead of snapping) and the
 * `--mx/--my` custom properties the `.fx-spotlight` gradient in globals.css
 * reads. Doing the highlight in CSS keeps it off the JS thread — only two
 * numbers cross the boundary per frame.
 *
 * `perspective` is set on the element itself rather than a parent so a card
 * can be dropped anywhere in a grid without the grid having to know.
 */
export default function TiltCard({
  children,
  className = "",
  strength = 7,
  lift = 0,
  style,
  ...motionProps
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // -1..1 across the card, before springing.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.4 };
  const rotateY = useSpring(useTransform(px, [-1, 1], [-strength, strength]), spring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [strength, -strength]), spring);
  const z = useSpring(0, spring);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    px.set(nx * 2 - 1);
    py.set(ny * 2 - 1);
    // Read by the CSS spotlight. Percentages so the gradient needs no JS.
    el.style.setProperty("--mx", `${(nx * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(ny * 100).toFixed(1)}%`);
  };

  const handleEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!reduced && e.pointerType === "mouse") z.set(lift);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
    z.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      style={
        reduced
          ? style
          : {
              ...style,
              rotateX,
              rotateY,
              z,
              transformPerspective: 1100,
              transformStyle: "preserve-3d",
            }
      }
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
