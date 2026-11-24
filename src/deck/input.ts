// Deck input: arrow keys, wheel, swipe, charge-bar cells, buttons, hash changes.
import type { Deck } from './deck';

const TYPING = 'input, textarea, select, [contenteditable="true"], [role="slider"]';

export function bindInput(deck: Deck): void {
  // buttons
  document.querySelectorAll<HTMLElement>('[data-deck]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.deck === 'prev') deck.prev('click');
      else deck.next('click');
    });
  });

  // charge bar cells and brand link act as hash links; handle in-page so history stays tidy
  document.querySelectorAll<HTMLAnchorElement>('.charge__cell, .chrome__brand').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')?.replace('#', '') ?? '';
      const i = deck.ids.indexOf(id);
      if (i < 0) return;
      e.preventDefault();
      deck.goTo(i, 'click');
    });
  });

  window.addEventListener('hashchange', () => deck.goTo(deck.indexFromHash(), 'hash'));
  window.addEventListener('popstate', () => deck.goTo(deck.indexFromHash(), 'hash'));

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = e.target as HTMLElement;
    if (el.closest(TYPING)) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        deck.next('key');
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        deck.prev('key');
        break;
      case 'Home':
        e.preventDefault();
        deck.goTo(0, 'key');
        break;
      case 'End':
        e.preventDefault();
        deck.goTo(deck.count - 1, 'key');
        break;
    }
  });

  // wheel / trackpad
  let acc = 0;
  let resetTimer = 0;
  deck.root.addEventListener(
    'wheel',
    (e) => {
      if (deck.locked || e.ctrlKey) return;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = horizontal ? e.deltaX : e.deltaY;
      if (!horizontal) {
        // vertical wheel: let a tall cell scroll first, navigate only at its edge
        const cell = (e.target as HTMLElement).closest<HTMLElement>('.cell');
        if (cell && cell.scrollHeight > cell.clientHeight + 2) {
          const atTop = cell.scrollTop <= 0 && delta < 0;
          const atBottom = cell.scrollTop + cell.clientHeight >= cell.scrollHeight - 2 && delta > 0;
          if (!atTop && !atBottom) return;
        }
      }
      e.preventDefault();
      if (deck.busy) return;
      acc += delta;
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => (acc = 0), 140);
      if (Math.abs(acc) > 40) {
        if (acc > 0) deck.next('wheel');
        else deck.prev('wheel');
        acc = 0;
      }
    },
    { passive: false },
  );

  // swipe
  let sx = 0;
  let sy = 0;
  let tracking = false;
  deck.root.addEventListener(
    'touchstart',
    (e) => {
      if (deck.locked || e.touches.length !== 1) return;
      const t = e.touches[0]!;
      sx = t.clientX;
      sy = t.clientY;
      tracking = true;
    },
    { passive: true },
  );
  deck.root.addEventListener(
    'touchend',
    (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0]!;
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) deck.next('swipe');
        else deck.prev('swipe');
      }
    },
    { passive: true },
  );
}
