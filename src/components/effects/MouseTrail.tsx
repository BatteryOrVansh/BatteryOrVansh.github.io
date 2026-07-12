"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const TRAIL_DOTS = [
  { stiffness: 900, damping: 32, size: 10, opacity: 0.55 },
  { stiffness: 560, damping: 32, size: 8, opacity: 0.4 },
  { stiffness: 360, damping: 30, size: 6, opacity: 0.3 },
  { stiffness: 240, damping: 28, size: 5, opacity: 0.22 },
  { stiffness: 150, damping: 26, size: 4, opacity: 0.15 },
] as const;

/**
 * Decorative cursor trail of red blob dots, each spring-lagging the raw
 * pointer position by a different amount to read as a comet tail. Hidden via
 * Tailwind's pointer-coarse:/motion-reduce: variants rather than a JS gate —
 * it has no functional purpose beyond flourish, so touch/reduced-motion
 * visitors simply never see it (the listener still attaches but is harmless).
 */
export function MouseTrail() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dot0X = useSpring(mouseX, { stiffness: TRAIL_DOTS[0].stiffness, damping: TRAIL_DOTS[0].damping });
  const dot0Y = useSpring(mouseY, { stiffness: TRAIL_DOTS[0].stiffness, damping: TRAIL_DOTS[0].damping });
  const dot1X = useSpring(mouseX, { stiffness: TRAIL_DOTS[1].stiffness, damping: TRAIL_DOTS[1].damping });
  const dot1Y = useSpring(mouseY, { stiffness: TRAIL_DOTS[1].stiffness, damping: TRAIL_DOTS[1].damping });
  const dot2X = useSpring(mouseX, { stiffness: TRAIL_DOTS[2].stiffness, damping: TRAIL_DOTS[2].damping });
  const dot2Y = useSpring(mouseY, { stiffness: TRAIL_DOTS[2].stiffness, damping: TRAIL_DOTS[2].damping });
  const dot3X = useSpring(mouseX, { stiffness: TRAIL_DOTS[3].stiffness, damping: TRAIL_DOTS[3].damping });
  const dot3Y = useSpring(mouseY, { stiffness: TRAIL_DOTS[3].stiffness, damping: TRAIL_DOTS[3].damping });
  const dot4X = useSpring(mouseX, { stiffness: TRAIL_DOTS[4].stiffness, damping: TRAIL_DOTS[4].damping });
  const dot4Y = useSpring(mouseY, { stiffness: TRAIL_DOTS[4].stiffness, damping: TRAIL_DOTS[4].damping });

  const dots = [
    { x: dot0X, y: dot0Y, ...TRAIL_DOTS[0] },
    { x: dot1X, y: dot1Y, ...TRAIL_DOTS[1] },
    { x: dot2X, y: dot2Y, ...TRAIL_DOTS[2] },
    { x: dot3X, y: dot3Y, ...TRAIL_DOTS[3] },
    { x: dot4X, y: dot4Y, ...TRAIL_DOTS[4] },
  ];

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden motion-reduce:hidden pointer-coarse:hidden sm:block"
    >
      {dots.map((dot, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-red mix-blend-multiply"
          style={{
            x: dot.x,
            y: dot.y,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
      ))}
    </div>
  );
}
