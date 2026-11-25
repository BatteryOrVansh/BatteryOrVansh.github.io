// Pointer-tilt glass cards with a moving specular highlight (--mx/--my/--spec in glass.css).
import { gsap } from 'gsap';
import { finePointer, reduced } from './env';

const CARDS = '.panel, .about__copy, .about__joining, .now__next, .boot__line';
const MAX_Y = 7; // degrees
const MAX_X = 5;

export function initTilt(): void {
  if (reduced() || !finePointer()) return;
  document.querySelectorAll<HTMLElement>(CARDS).forEach((el) => {
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 900 });

    el.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      el.style.setProperty('--spec', '1');
      ry((px - 0.5) * 2 * MAX_Y);
      rx((0.5 - py) * 2 * MAX_X);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--spec', '0');
      rx(0);
      ry(0);
    });
  });
}
