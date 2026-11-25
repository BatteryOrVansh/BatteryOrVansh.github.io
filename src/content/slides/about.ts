import type { Site } from '../types';
import { scribbles } from '../scribbles';
import { html, t } from '../html';

export function renderAbout(site: Site): string {
  const a = site.slides.about;
  return html`<div class="about">
    <header class="about__head">
      <p class="caption">${a.num} — ${t(a.title)}</p>
      <h2 class="heading about__heading" data-focus>${t(a.heading)}</h2>
    </header>
    <div class="about__copy glass">
      ${a.body.map((p) => `<p class="body-copy">${t(p)}</p>`)}
      ${a.todo ? `<p class="body-copy">${t(a.todo)}</p>` : ''}
    </div>
    <dl class="about__facts">
      ${a.facts.map(
        (f) =>
          `<div class="fact"><dt class="mono mono--dim">${t(f.label)}</dt><dd>${t(f.value)}</dd></div>`,
      )}
    </dl>
    <aside class="about__joining glass glass--strong" aria-label="${t(a.joining.label)}">
      <p class="joining__label mono mono--amber">
        <span class="joining__ring"
          >${t(a.joining.label)}${scribbles.ring('joining__scribble')}</span
        >
      </p>
      <p class="joining__text">${t(a.joining.text)}</p>
      ${a.joining.todo ? `<p class="body-copy">${t(a.joining.todo)}</p>` : ''}
    </aside>
    <section class="about__log" aria-labelledby="log-title">
      <h3 class="mono mono--dim" id="log-title">${t(a.logTitle)}</h3>
      <ol class="log">
        ${a.log.map(
          (l) =>
            `<li><span class="mono mono--amber">${t(l.when)}</span><span>${t(l.what)}</span><span class="mono mono--dim">${t(l.note)}</span></li>`,
        )}
      </ol>
    </section>
  </div>`;
}
