// Magnetic buttons: within a halo around the button, it drifts toward the pointer.
import { gsap } from 'gsap';
import { finePointer, reduced } from './env';

const HALO = 64;
const PULL = 0.32;

export function initMagnetic(): void {
  if (reduced() || !finePointer()) return;
  const buttons = [...document.querySelectorAll<HTMLElement>('.btn')].map((el) => ({
    el,
    x: gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' }),
  }));

  let raf = 0;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch' || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        for (const b of buttons) {
          const r = b.el.getBoundingClientRect();
          if (r.width === 0 || b.el.closest('[inert]')) {
            b.x(0);
            b.y(0);
            continue;
          }
          const near =
            e.clientX > r.left - HALO &&
            e.clientX < r.right + HALO &&
            e.clientY > r.top - HALO &&
            e.clientY < r.bottom + HALO;
          // r already includes the current offset; measure from the un-offset centre
          const cx = r.left + r.width / 2 - (Number(gsap.getProperty(b.el, 'x')) || 0);
          const cy = r.top + r.height / 2 - (Number(gsap.getProperty(b.el, 'y')) || 0);
          b.x(near ? (e.clientX - cx) * PULL : 0);
          b.y(near ? (e.clientY - cy) * PULL : 0);
        }
      });
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () =>
    buttons.forEach((b) => {
      b.x(0);
      b.y(0);
    }),
  );
}
