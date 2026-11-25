// Intro + sound gate. Shown on a first visit only (and not on a deep link).
// "Enter with sound" is the user gesture that lets audio start; the choice is
// saved and announced via the 'intro:done' event for the music player.
import { gsap } from 'gsap';
import { load, save } from '../state';
import { reducedMotion, type Deck } from './deck';

export type Choice = 'on' | 'off';

export interface IntroDone {
  sound: Choice;
  /** true when this click was the gesture (so audio may start now) */
  gesture: boolean;
}

const done = (detail: IntroDone) =>
  document.dispatchEvent(new CustomEvent<IntroDone>('intro:done', { detail }));

export function initIntro(deck: Deck): void {
  const el = document.getElementById('intro');
  if (!el) return;

  const saved = load();
  const show = document.documentElement.classList.contains('has-intro');
  if (!show) {
    el.remove();
    // returning visitor: the player resumes on the first interaction
    if (saved.sound) done({ sound: saved.sound, gesture: false });
    return;
  }

  const shell = [deck.root, document.querySelector('.chrome')].filter(Boolean) as HTMLElement[];
  shell.forEach((n) => n.setAttribute('inert', ''));
  deck.locked = true;

  const cells = [...el.querySelectorAll<HTMLElement>('.intro__cells i')];
  const first = el.querySelector<HTMLButtonElement>('[data-enter="on"]')!;
  let ready = false;

  const reveal = () => {
    if (ready) return;
    ready = true;
    tl?.kill();
    cells.forEach((c, i) => {
      c.classList.add('is-on');
      c.classList.toggle('is-full', true);
      c.style.setProperty('--i', String(i));
    });
    el.classList.add('is-ready');
    // buttons un-hide after the staggered transition; focus once they can take it
    window.setTimeout(() => first.focus({ preventScroll: true }), 360);
  };

  el.querySelector<HTMLElement>('[data-skip]')?.focus({ preventScroll: true });

  // charging: cells light up one at a time (first one low-power ember)
  let tl: gsap.core.Timeline | null = null;
  if (reducedMotion()) {
    reveal();
  } else {
    tl = gsap.timeline({ delay: 0.3, onComplete: reveal });
    cells.forEach((c, i) => {
      tl!.add(() => {
        c.classList.add('is-on');
        if (i > 0) cells[0]!.classList.add('is-full');
      }, i * 0.42);
    });
    tl.to({}, { duration: 0.35 });
  }

  el.querySelector('[data-skip]')?.addEventListener('click', reveal);
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape' && !ready) reveal();
    if (!document.getElementById('intro')) document.removeEventListener('keydown', onKey);
  });

  el.querySelectorAll<HTMLButtonElement>('[data-enter]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const sound = btn.dataset.enter as Choice;
      save({ seen: true, sound });
      el.classList.add('is-leaving');
      const finish = () => {
        el.remove();
        document.documentElement.classList.remove('has-intro');
        shell.forEach((n) => n.removeAttribute('inert'));
        deck.locked = false;
        deck.focusCurrent();
      };
      if (reducedMotion()) finish();
      else gsap.to(el, { opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: finish });
      done({ sound, gesture: true });
    }),
  );
}
