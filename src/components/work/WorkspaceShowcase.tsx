"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WorkspaceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative h-[130vh] w-full bg-[#FF0000] text-white z-20"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Infinite, time-based scrolling marquee — two rows, opposite directions */}
<div className="absolute inset-0 flex flex-col justify-center gap-8 pointer-events-none select-none overflow-hidden z-0">

  {/* Row 1 — scrolls left */}
  <div className="overflow-hidden">
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{
        duration: 25,
        ease: "linear",
        repeat: Infinity,
      }}
      className="flex whitespace-nowrap"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="text-[14rem] font-black uppercase tracking-tighter px-8"
          style={{
            color: "white",
            opacity: 1,
          }}
        >
          KOUSHIK GOPATHI
        </span>
      ))}
    </motion.div>
  </div>

  {/* Row 2 — scrolls right (opposite direction) */}
  <div className="overflow-hidden">
    <motion.div
      animate={{ x: ["-50%", "0%"] }}
      transition={{
        duration: 25,
        ease: "linear",
        repeat: Infinity,
      }}
      className="flex whitespace-nowrap"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="text-[14rem] font-black uppercase tracking-tighter px-8"
          style={{
            color: "white",
            opacity: 1,
          }}
        >
          KOUSHIK GOPATHI
        </span>
      ))}
    </motion.div>
  </div>

</div>

        {/* Pure Portrait Image with No Box/Border */}
        <div className="relative z-10 max-w-5xl w-full mx-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex items-center justify-center"
          >
            <Image
              src="/portrait_2.png"
              alt="Koushik Gopathi Workspace Portrait"
              width={1200}
              height={675}
              className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-2xl"
              priority
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}