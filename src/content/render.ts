// Renders content/site.json into static HTML at build time.
// Pure string functions: imported by build/render-plugin.ts (Node) only.
import type { Site, SlideId } from './types';
import { esc, fill, html, t } from './html';

const slideHeading = (site: Site, id: SlideId): string => {
  const slide = site.slides[id];
  return 'heading' in slide ? slide.heading : site.person.name;
};

export function renderChrome(site: Site): string {
  const count = site.order.length;
  const cells = site.order
    .map((id, i) => {
      const s = site.slides[id];
      return html`<li class="charge__item">
        <a
          class="charge__cell"
          href="#${id}"
          data-index="${i}"
          style="--i:${i}"
          aria-label="${esc(`${s.num} ${s.title}`)}"
          ${i === 0 ? ' aria-current="step"' : ''}
          ><span class="charge__fill"></span
        ></a>
        <span class="charge__label mono" aria-hidden="true">${s.num} ${t(s.title)}</span>
      </li>`;
    })
    .join('');
  return html`<header class="chrome">
    <a
      class="chrome__brand mono"
      href="#${site.order[0]}"
      aria-label="${esc(site.person.name)}, back to the start"
      ><span>Battery</span><b>Or</b><span>Vansh</span></a
    >
    <nav
      class="charge"
      style="--level:1;--count:${count}"
      data-level="low"
      aria-label="${esc(site.ui.chargeNavLabel ?? '')}"
    >
      <ol class="charge__cells">
        ${cells}
      </ol>
    </nav>
    <p class="charge__readout mono" data-level="low">
      <span class="visually-hidden">${esc(site.ui.chargeLabel ?? '')}: </span
      ><span data-readout>${Math.round(100 / count)}%</span>
    </p>
    <div class="chrome__player" id="player-slot"></div>
  </header>`;
}

function renderCell(site: Site, id: SlideId, index: number, inner: string): string {
  const s = site.slides[id];
  const label = fill(site.ui.cellLabel ?? '{title}', {
    n: index + 1,
    total: site.order.length,
    title: s.title,
  });
  return html`<section
    class="cell cell--${id}"
    id="${id}"
    data-index="${index}"
    tabindex="-1"
    aria-roledescription="cell"
    aria-label="${esc(label)}"
  >
    <div class="cell__bg" aria-hidden="true">
      <span class="numeral cell__numeral">${s.num}</span>
    </div>
    <div class="cell__inner">${inner}</div>
  </section>`;
}

export function renderDeck(site: Site, bodies: Partial<Record<SlideId, string>> = {}): string {
  const cells = site.order
    .map((id, i) => {
      const s = site.slides[id];
      const fallback = html`<p class="caption">${s.num} — ${t(s.title)}</p>
        <h2 class="heading" data-focus>${t(slideHeading(site, id))}</h2>`;
      return renderCell(site, id, i, bodies[id] ?? fallback);
    })
    .join('');
  return html`<main
      class="deck"
      id="main"
      aria-roledescription="deck"
      aria-label="${esc(site.ui.deckLabel ?? '')}"
    >
      <div class="deck__track" style="--count:${site.order.length}">${cells}</div>
    </main>
    <div class="deck__nav" aria-label="Deck controls">
      <span class="deck__count mono" aria-hidden="true"
        ><b data-count>01</b> / ${String(site.order.length).padStart(2, '0')}</span
      >
      <button
        class="btn btn--icon deck__btn"
        type="button"
        data-deck="prev"
        aria-label="${esc(site.ui.prev ?? '')}"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg>
      </button>
      <button
        class="btn btn--icon deck__btn"
        type="button"
        data-deck="next"
        aria-label="${esc(site.ui.next ?? '')}"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
      </button>
    </div>
    <span class="deck__hint mono mono--dim">${t(site.ui.hint ?? '')}</span>
    <p class="visually-hidden" id="announcer" aria-live="polite" aria-atomic="true"></p>`;
}

export function renderAtmosphere(): string {
  return `<div class="atmos" aria-hidden="true"><span class="orb orb--oxblood"></span><span class="orb orb--dusk"></span><span class="orb orb--ember"></span><span class="orb orb--amber"></span></div><div class="grain" aria-hidden="true"></div>`;
}
