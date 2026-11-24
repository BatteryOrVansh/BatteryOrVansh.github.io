// Hand-drawn SVG scribbles. Paths are drawn by hand (slightly wobbly on purpose).
// Each returns an inline <svg> string; decorative, so aria-hidden.

const svg = (viewBox: string, body: string, cls = '') =>
  `<svg class="scribble ${cls}" viewBox="${viewBox}" aria-hidden="true" focusable="false">${body}</svg>`;

export const scribbles = {
  /** loose underline with a return flick */
  underline: (cls = '') =>
    svg(
      '0 0 320 28',
      '<path pathLength="1" d="M4 17c38-5 79-9 121-9 47 0 96 3 140 4 16 0 33-1 47-3-31 6-73 10-118 11"/>',
      cls,
    ),
  /** curved arrow pointing left-down */
  arrow: (cls = '') =>
    svg(
      '0 0 120 90',
      '<path pathLength="1" d="M112 8C92 10 70 18 55 33 42 46 33 62 27 80"/><path pathLength="1" d="M14 64c4 6 9 12 13 17 4-6 10-12 17-16"/>',
      cls,
    ),
  /** wobbly ring around a word */
  ring: (cls = '') =>
    svg(
      '0 0 220 90',
      '<path pathLength="1" d="M128 9C80 3 22 14 8 40c-12 24 30 42 92 43 58 1 112-13 112-38C212 22 168 8 118 10 92 11 70 16 56 22"/>',
      cls,
    ),
  /** little lightning bolt, for "charging" */
  bolt: (cls = '') =>
    svg(
      '0 0 40 60',
      '<path pathLength="1" d="M24 3 8 33l14 1-6 23 18-32-14-1 7-21"/>',
      cls,
    ),
  /** zig-zag squiggle used as a divider */
  squiggle: (cls = '') =>
    svg(
      '0 0 200 20',
      '<path pathLength="1" d="M3 12c8-8 14-8 20 0s13 8 20 0 13-8 20 0 13 8 20 0 13-8 20 0 13 8 20 0 13-8 20 0 13 8 20 0 13-8 20 0"/>',
      cls,
    ),
};

export type ScribbleName = keyof typeof scribbles;
