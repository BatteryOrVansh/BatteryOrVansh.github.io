// Shared motion environment checks.
export const reduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** a real mouse/trackpad with hover, not a touch screen */
export const finePointer = (): boolean =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;
