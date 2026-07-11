"use client";

import { useEffect, useRef } from "react";

type BlobBackgroundProps = {
  className?: string;
  variant?: "hero" | "section";
};

/**
 * Organic morph-shape background accent. Parallax is applied to the wrapper
 * transform only — never to text — so it stays subtle on scroll.
 */
export function BlobBackground({ className = "", variant = "section" }: BlobBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = window.scrollY * 0.08;
        if (el) el.style.transform = `translate3d(0, ${offset}px, 0)`;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const size = variant === "hero" ? "h-[70vh] w-[70vh]" : "h-[45vh] w-[45vh]";

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <svg
        className={`animate-blob-drift absolute -right-1/4 top-0 ${size} opacity-70`}
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blob-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--red)" />
            <stop offset="100%" stopColor="var(--red-dim)" />
          </linearGradient>
        </defs>
        <path
          fill="url(#blob-red)"
          d="M421.5,314.5Q407,429,297.5,438.5Q188,448,133,343.5Q78,239,168.5,157.5Q259,76,357,123.5Q455,171,451,242.5Q447,314,421.5,314.5Z"
        />
      </svg>
      <svg
        className="animate-blob-drift absolute -left-1/3 bottom-0 h-[50vh] w-[50vh] opacity-30 [animation-delay:-6s]"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="var(--bg-elevated)"
          stroke="var(--red-dim)"
          strokeWidth="1.5"
          d="M447,300Q447,394,362.5,443.5Q278,493,183,451Q88,409,90.5,304.5Q93,200,190,153.5Q287,107,367,163Q447,219,447,300Z"
        />
      </svg>
    </div>
  );
}
