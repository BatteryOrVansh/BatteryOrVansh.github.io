// Deck engine: owns the current cell, the track position and the charge level.
// Input (keyboard, wheel, swipe) lives in input.ts and only calls goTo().
import { gsap } from 'gsap';

export interface DeckChange {
  index: number;
  prev: number;
  id: string;
  source: Source;
}

export type Source = 'init' | 'key' | 'wheel' | 'swipe' | 'click' | 'hash' | 'api';

export const reducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export class Deck {
  readonly root: HTMLElement;
  readonly track: HTMLElement;
  readonly cells: HTMLElement[];
  readonly ids: string[];
  index = 0;
  busy = false;
  /** other layers (project detail, music card) set this to pause deck input */
  locked = false;

  private charge: HTMLElement | null;
  private readout: HTMLElement | null;
  private counter: HTMLElement | null;
  private announcer: HTMLElement | null;
  private prevBtn: HTMLButtonElement | null;
  private nextBtn: HTMLButtonElement | null;
  private tween: gsap.core.Tween | null = null;
  private levelState = { v: 1 };

  constructor(root: HTMLElement) {
    this.root = root;
    this.track = root.querySelector<HTMLElement>('.deck__track')!;
    this.cells = [...root.querySelectorAll<HTMLElement>('.cell')];
    this.ids = this.cells.map((c) => c.id);
    this.charge = document.querySelector('.charge');
    this.readout = document.querySelector('[data-readout]');
    this.counter = document.querySelector('[data-count]');
    this.announcer = document.getElementById('announcer');
    this.prevBtn = document.querySelector('[data-deck="prev"]');
    this.nextBtn = document.querySelector('[data-deck="next"]');

    const start = this.indexFromHash();
    this.index = start;
    this.levelState.v = start + 1;
    this.apply(start, true);
    this.syncCharge();
    this.emit(start, start, 'init');
  }

  get count(): number {
    return this.cells.length;
  }

  indexFromHash(hash = location.hash): number {
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    const i = this.ids.indexOf(id);
    return i >= 0 ? i : 0;
  }

  next(source: Source = 'api'): void {
    this.goTo(this.index + 1, source);
  }

  prev(source: Source = 'api'): void {
    this.goTo(this.index - 1, source);
  }

  goTo(target: number, source: Source = 'api'): void {
    const i = Math.max(0, Math.min(this.count - 1, target));
    if (i === this.index) return;
    if (this.locked && source !== 'hash' && source !== 'api') return;
    const prev = this.index;
    this.index = i;
    this.apply(i, source === 'hash' && reducedMotion());
    this.animateTo(i, prev);
    this.writeHash(i, source);
    this.emit(i, prev, source);
    this.announce(i);
    if (source !== 'init') this.focusCell(i);
  }

  /** inert everything but the active cell so focus and AT can't wander off-screen */
  private apply(i: number, instant: boolean): void {
    this.cells.forEach((cell, n) => {
      const active = n === i;
      cell.toggleAttribute('inert', !active);
      cell.setAttribute('aria-hidden', active ? 'false' : 'true');
      cell.classList.toggle('is-active', active);
    });
    if (this.prevBtn) this.prevBtn.disabled = i === 0;
    if (this.nextBtn) this.nextBtn.disabled = i === this.count - 1;
    if (this.counter) this.counter.textContent = String(i + 1).padStart(2, '0');
    this.root.dataset.active = this.ids[i];
    document.documentElement.dataset.cell = this.ids[i];
    if (instant) {
      gsap.set(this.track, { xPercent: (-100 / this.count) * i });
    }
  }

  private animateTo(i: number, prev: number): void {
    this.tween?.kill();
    const reduced = reducedMotion();
    const distance = Math.abs(i - prev);
    this.busy = true;
    const xPercent = (-100 / this.count) * i;
    if (reduced) {
      // calm fallback: a quick crossfade instead of a slide
      gsap.set(this.track, { xPercent });
      gsap.fromTo(
        this.cells[i]!,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.25,
          ease: 'none',
          onComplete: () => {
            this.busy = false;
          },
        },
      );
      this.setLevel(i + 1, 0);
      return;
    }
    const duration = 0.7 + Math.min(distance - 1, 3) * 0.12;
    this.tween = gsap.to(this.track, {
      xPercent,
      duration,
      ease: 'power3.inOut',
      onComplete: () => {
        this.busy = false;
      },
    });
    this.setLevel(i + 1, duration);
  }

  /** tween the continuous charge level (number of filled cells) */
  private setLevel(target: number, duration: number): void {
    gsap.killTweensOf(this.levelState);
    gsap.to(this.levelState, {
      v: target,
      duration,
      ease: 'power3.inOut',
      onUpdate: () => this.syncCharge(),
    });
    if (duration === 0) {
      this.levelState.v = target;
      this.syncCharge();
    }
  }

  private syncCharge(): void {
    const v = this.levelState.v;
    const state = this.index === 0 ? 'low' : this.index === this.count - 1 ? 'full' : '';
    if (this.charge) {
      this.charge.style.setProperty('--level', v.toFixed(3));
      if (state) this.charge.dataset.level = state;
      else this.charge.removeAttribute('data-level');
    }
    if (this.readout) {
      const pct = Math.round((v / this.count) * 100);
      this.readout.textContent = `${pct}%`;
      const parent = this.readout.parentElement;
      if (parent && state) parent.dataset.level = state;
      else parent?.removeAttribute('data-level');
    }
    document.querySelectorAll<HTMLElement>('.charge__cell').forEach((a, n) => {
      if (n === this.index) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
  }

  private writeHash(i: number, source: Source): void {
    if (source === 'hash' || source === 'init') return;
    const hash = `#${this.ids[i]}`;
    if (location.hash !== hash) history.pushState(null, '', hash);
  }

  private announce(i: number): void {
    if (!this.announcer) return;
    this.announcer.textContent = this.cells[i]?.getAttribute('aria-label') ?? '';
  }

  /** move keyboard focus to the new cell's heading so SR and keyboard users land there */
  private focusCell(i: number): void {
    const cell = this.cells[i]!;
    const target = cell.querySelector<HTMLElement>('[data-focus]') ?? cell;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  private emit(index: number, prev: number, source: Source): void {
    document.dispatchEvent(
      new CustomEvent<DeckChange>('deck:change', {
        detail: { index, prev, id: this.ids[index]!, source },
      }),
    );
  }
}
