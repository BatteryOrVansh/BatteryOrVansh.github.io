// Work cell: open a project panel into its detail view, close it again.
// (Phase 4 swaps the plain show/hide for a FLIP animation in src/motion/flip.ts.)
import type { Deck } from './deck';

export function initWork(deck: Deck): void {
  const cell = document.getElementById('work');
  if (!cell) return;
  const main = cell.querySelector<HTMLElement>('.work__main')!;
  const details = [...cell.querySelectorAll<HTMLElement>('[data-detail]')];
  let openId: string | null = null;
  let opener: HTMLElement | null = null;

  const open = (id: string, from: HTMLElement) => {
    const detail = details.find((d) => d.dataset.detail === id);
    if (!detail) return;
    openId = id;
    opener = from;
    cell.scrollTop = 0;
    cell.classList.add('has-detail');
    detail.classList.add('is-open');
    from.setAttribute('aria-expanded', 'true');
    main.setAttribute('inert', '');
    deck.locked = true;
    detail.querySelector<HTMLElement>('[data-close]')?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('work:open', { detail: { id } }));
  };

  const close = (restoreFocus = true) => {
    if (!openId) return;
    const detail = details.find((d) => d.dataset.detail === openId);
    detail?.classList.remove('is-open');
    cell.classList.remove('has-detail');
    main.removeAttribute('inert');
    opener?.setAttribute('aria-expanded', 'false');
    deck.locked = false;
    if (restoreFocus) opener?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('work:close', { detail: { id: openId } }));
    openId = null;
  };

  cell
    .querySelectorAll<HTMLElement>('[data-open]')
    .forEach((btn) => btn.addEventListener('click', () => open(btn.dataset.open!, btn)));
  details.forEach((d) => d.querySelector('[data-close]')?.addEventListener('click', () => close()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openId) {
      e.preventDefault();
      close();
    }
  });
  // leaving the cell by hash/back closes the detail without stealing focus
  document.addEventListener('deck:change', () => close(false));
}
