"use client";

import { motion, type Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Scroll-triggered fade+slide reveal, once per element (IntersectionObserver
 * under the hood via whileInView — no continuous scroll-listener cost).
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ type: "spring", stiffness: 60, damping: 16, mass: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}
