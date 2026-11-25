// Custom cursor: a dot that tracks the pointer and a ring that trails it.
// Desktop only (fine pointer + hover) and never under reduced motion.
import { gsap } from 'gsap';
import { finePointer, reduced } from './env';

const HOT = 'a, button, [role="button"], input, label, [data-open], .panel';

export function initCursor(): void {
  if (reduced() || !finePointer()) return;
  const root = document.documentElement;
  const wrap = document.createElement('div');
  wrap.className = 'cursor';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = '<i class="cursor__ring"></i><i class="cursor__dot"></i>';
  document.body.append(wrap);
  const ring = wrap.querySelector<HTMLElement>('.cursor__ring')!;
  const dot = wrap.querySelector<HTMLElement>('.cursor__dot')!;

  const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
  const dx = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'none' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'none' });

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      if (!root.classList.contains('has-cursor')) root.classList.add('has-cursor');
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      wrap.classList.toggle('is-hot', !!(e.target as Element | null)?.closest(HOT));
    },
    { passive: true },
  );
  window.addEventListener('pointerdown', () => wrap.classList.add('is-down'));
  window.addEventListener('pointerup', () => wrap.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => root.classList.remove('has-cursor'));
}
