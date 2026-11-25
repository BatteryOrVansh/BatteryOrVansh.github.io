// Entrance animation for the active cell: heading splits into words that rise,
// everything else fades up in a stagger. Reduced motion: nothing moves.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { reduced } from './env';

gsap.registerPlugin(SplitText);

const ITEMS = [
  '.caption',
  '.lede',
  '.about__copy',
  '.about__joining',
  '.fact',
  '.about__log',
  '.panel',
  '.level',
  '.now__list li',
  '.now__next',
  '.now__updated',
  '.boot__line',
  '.boot__note',
  '.boot__scribble',
  '.clink',
  '.contact__foot',
  '.work__caption',
  '.toolkit__head > p:last-child',
  '.toolkit__todo',
].join(',');

const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();

export function revealCell(cell: HTMLElement, delay = 0): void {
  if (reduced()) return;
  const all = [...cell.querySelectorAll<HTMLElement>(ITEMS)];
  // animate the outermost element only, so nested pieces don't double-animate
  const items = all.filter((el) => !all.some((o) => o !== el && o.contains(el)));
  gsap.killTweensOf(items);
  gsap.fromTo(
    items,
    { y: 26, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.07,
      delay: delay + 0.18,
      clearProps: 'transform,opacity',
    },
  );

  const heading = cell.querySelector<HTMLElement>('[data-focus]');
  if (!heading) return;
  void fontsReady.then(() => {
    const split = SplitText.create(heading, { type: 'words' });
    gsap.from(split.words, {
      yPercent: 70,
      opacity: 0,
      rotation: 2.5,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.06,
      delay,
      onComplete: () => split.revert(),
    });
  });
}

/** wire reveals to the deck; the first cell waits for the intro if one is open */
export function initReveal(): void {
  const root = document.documentElement;
  const play = (cell: HTMLElement | null, delay = 0) => cell && revealCell(cell, delay);
  const active = () => document.querySelector<HTMLElement>('.cell.is-active');

  const first = () => {
    root.classList.add('is-ready');
    play(active());
  };

  if (root.classList.contains('has-intro')) {
    // keep the cell hidden until the visitor has chosen; then reveal it
    document.addEventListener('intro:done', () => window.setTimeout(first, 350), { once: true });
  } else {
    first();
  }

  document.addEventListener('deck:change', (e) => {
    const { source, id } = (e as CustomEvent<{ source: string; id: string }>).detail;
    if (source === 'init') return;
    // start once the track is mostly across, so the reveal lands as the cell settles
    play(document.getElementById(id), 0.28);
  });
}
