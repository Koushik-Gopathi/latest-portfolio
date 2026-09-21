"use client";

import { useEffect, useRef, useState } from "react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*_";

/**
 * A word that scrambles into random characters on hover and resolves back.
 *
 * Shared by the About bio and the LET'S CONNECT heading. The interval is
 * cleared on unmount as well as on mouse-out: a scramble left running would
 * keep calling setState on a component that no longer exists.
 */
export default function GlitchText({ text, className = "" }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const scramble = () => {
    stop();
    let frame = 0;
    const totalFrames = Math.max(10, text.length * 2.5);

    intervalRef.current = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        stop();
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

  const reset = () => {
    stop();
    setDisplayText(text);
  };

  useEffect(() => stop, []);

  return (
    <span onMouseEnter={scramble} onMouseLeave={reset} className={`inline-block cursor-pointer ${className}`}>
      {displayText}
    </span>
  );
}
