"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { lockScroll } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/lib/hooks";

export type DemoVideo = {
  src: string;
  poster: string;
  title: string;
  /** "1:22" — shown on the play button so nobody clicks into a surprise. */
  duration: string;
};

/**
 * A project demo, played over the page.
 *
 * Rendered through a portal on purpose. The cards that open it live inside
 * the projects rail, which is transformed (translated and skewed), and a
 * `position: fixed` element inside a transformed ancestor is fixed to that
 * ancestor, not the viewport — the overlay would slide away with the rail.
 */
export default function VideoModal({
  video,
  onClose,
}: {
  video: DemoVideo | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!video) return;
    const opener = document.activeElement as HTMLElement | null;
    const unlock = lockScroll();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
      // Hand focus back to the button that opened it.
      opener?.focus?.();
    };
  }, [video, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {video && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl"
          >
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.24em]">{video.title}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close video"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <video
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="aspect-[1152/720] w-full rounded-2xl bg-black shadow-2xl"
            >
              Your browser does not play embedded video.{" "}
              <a href={video.src} className="underline">
                Download it instead
              </a>
              .
            </video>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
