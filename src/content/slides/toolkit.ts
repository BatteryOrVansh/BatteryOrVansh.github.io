import type { Site } from '../types';
import { esc, fill, html, t } from '../html';

export function renderToolkit(site: Site): string {
  const k = site.slides.toolkit;
  const groups = k.groups
    .map((g, i) => {
      const cells = [1, 2, 3].map((n) => `<i${n <= g.level ? ' class="on"' : ''}></i>`).join('');
      return html`<li class="level level--${g.level}" style="--n:${i}">
        <span
          class="level__cells"
          role="img"
          aria-label="${esc(fill(site.ui.levelLabel ?? '', { n: g.level }))}"
          >${cells}</span
        >
        <h3 class="level__name subheading">${t(g.name)}</h3>
        <p class="level__note mono mono--dim">${t(g.note)}</p>
        <ul class="level__items">
          ${g.items.map((it) => `<li>${t(it)}</li>`)}
        </ul>
      </li>`;
    })
    .join('');
  return html`<div class="toolkit">
    <header class="toolkit__head">
      <p class="caption">${k.num} — ${t(k.title)}</p>
      <h2 class="heading toolkit__heading" data-focus>${t(k.heading)}</h2>
      <p class="mono mono--dim">${t(k.caption)}</p>
    </header>
    <ol class="levels">
      ${groups}
    </ol>
    ${k.todo ? `<p class="toolkit__todo body-copy">${t(k.todo)}</p>` : ''}
  </div>`;
}
