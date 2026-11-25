// FLIP expand/collapse between a small "source" element (panel, toggle button)
// and a larger "panel" element (project detail, player card).
// The panel is placed over the source with Flip.fit (scale), then released to
// its natural box. Reduced motion: a short crossfade, no movement.
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { reduced } from './env';

gsap.registerPlugin(Flip);

export interface FlipOpts {
  /** direct children that fade in after the box has grown */
  content?: Element[] | NodeListOf<Element> | string;
  duration?: number;
}

const kids = (panel: HTMLElement, c: FlipOpts['content']) =>
  typeof c === 'string' ? [...panel.querySelectorAll(c)] : c ? [...c] : [...panel.children];

/** call after the panel is displayed (display/visibility already on) */
export function expandFrom(source: HTMLElement, panel: HTMLElement, opts: FlipOpts = {}) {
  gsap.killTweensOf(panel);
  const content = kids(panel, opts.content);
  gsap.killTweensOf(content);

  if (reduced()) {
    return gsap.fromTo(
      panel,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'none', clearProps: 'opacity' },
    );
  }

  const d = opts.duration ?? 0.75;
  gsap.set(content, { opacity: 0, y: 14 });
  Flip.fit(panel, source, { scale: true, absolute: false });
  const tl = gsap.timeline();
  tl.to(panel, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    duration: d,
    ease: 'power3.inOut',
    clearProps: 'transform',
  });
  tl.to(
    content,
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.045,
      clearProps: 'opacity,transform',
    },
    d * 0.45,
  );
  return tl;
}

/** shrink the panel back onto its source, then call done (hide it there) */
export function collapseTo(
  source: HTMLElement,
  panel: HTMLElement,
  done: () => void,
  opts: FlipOpts = {},
) {
  gsap.killTweensOf(panel);
  const content = kids(panel, opts.content);
  gsap.killTweensOf(content);

  if (reduced()) {
    return gsap.to(panel, {
      opacity: 0,
      duration: 0.15,
      ease: 'none',
      onComplete: () => {
        done();
        gsap.set(panel, { clearProps: 'opacity' });
      },
    });
  }

  const d = opts.duration ?? 0.55;
  const tl = gsap.timeline({
    onComplete: () => {
      done();
      gsap.set(panel, { clearProps: 'transform,opacity' });
      gsap.set(content, { clearProps: 'opacity,transform' });
    },
  });
  tl.to(content, { opacity: 0, duration: 0.18, ease: 'power1.in' });
  tl.add(() => {
    Flip.fit(panel, source, { scale: true, absolute: false, duration: d, ease: 'power3.inOut' });
  }, 0.05);
  tl.to(panel, { opacity: 0, duration: 0.2, ease: 'none' }, d - 0.12);
  tl.to({}, { duration: d }, 0.05); // keep the timeline alive until the fit finishes
  return tl;
}
