import type { Site } from '../types';
import { html, t } from '../html';

export function renderNow(site: Site): string {
  const n = site.slides.now;
  return html`<div class="now">
    <header class="now__head">
      <p class="caption">${n.num} — ${t(n.title)}</p>
      <h2 class="heading now__heading" data-focus>${t(n.heading)}</h2>
    </header>
    <section class="now__now" aria-labelledby="now-label">
      <h3 class="subheading" id="now-label">${t(n.now.label)}</h3>
      <ul class="now__list">
        ${n.now.items.map(
          (it) =>
            `<li><span class="mono mono--amber">${t(it.kind)}</span><span class="now__text">${t(it.text)}</span></li>`,
        )}
      </ul>
    </section>
    <section class="now__next glass glass--strong" aria-labelledby="next-label">
      <p class="mono mono--amber" id="next-label">${t(n.next.label)}</p>
      <p class="now__date display" aria-hidden="true">${t(n.next.date)}</p>
      <h3 class="now__title subheading">${t(n.next.title)}</h3>
      <p class="body-copy">${t(n.next.text)}</p>
      ${n.next.todo ? `<p class="body-copy">${t(n.next.todo)}</p>` : ''}
    </section>
    <p class="now__updated mono mono--dim">${t(n.updated)}</p>
  </div>`;
}
