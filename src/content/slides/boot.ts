import type { Site } from '../types';
import { scribbles } from '../scribbles';
import { html, t } from '../html';

/** Full-screen intro + sound gate. Shown only on a first visit (see index.html + intro.ts). */
export function renderIntro(site: Site): string {
  const b = site.slides.boot;
  const lines = b.intro.lines.map((line, i) => `<li style="--i:${i}">${t(line)}</li>`).join('');
  const cells = Array.from(
    { length: site.order.length },
    (_, i) => `<i style="--i:${i}"></i>`,
  ).join('');
  return html`<div
    class="intro"
    id="intro"
    role="dialog"
    aria-modal="true"
    aria-labelledby="intro-q"
  >
    <div class="intro__panel glass">
      <p class="caption">${b.num} — ${t(b.title)}</p>
      <ol class="intro__log mono" aria-hidden="true">
        ${lines}
      </ol>
      <div class="intro__battery" aria-hidden="true"><div class="intro__cells">${cells}</div></div>
      <p class="intro__charged subheading" data-charged>${t(b.intro.chargedLabel)}</p>
      <p class="intro__q body-copy" id="intro-q">${t(b.intro.question)}</p>
      <div class="intro__actions">
        <button class="btn btn--charge" type="button" data-enter="on">
          <span class="btn__magnet">${t(b.intro.enterSound)}</span>
        </button>
        <button class="btn" type="button" data-enter="off">
          <span class="btn__magnet">${t(b.intro.enterSilent)}</span>
        </button>
      </div>
      <button class="intro__skip btn btn--ghost" type="button" data-skip>${t(b.intro.skip)}</button>
    </div>
  </div>`;
}

export function renderBoot(site: Site): string {
  const b = site.slides.boot;
  const p = site.person;
  return html`<div class="boot">
    <p class="boot__kicker caption">${b.num} — ${t(b.kicker)}</p>
    <h1 class="boot__name display" data-focus>
      <span class="boot__first">${t(p.firstName)}</span>
      <span class="boot__last"><em>${t(p.lastName)}</em></span>
    </h1>
    <div class="boot__line glass">
      <p class="lede">${t(b.oneLiner)}</p>
    </div>
    <p class="boot__note mono mono--dim">
      ${scribbles.arrow('boot__arrow')}<span class="boot__fig">${t(b.annotation)}</span>
    </p>
    <p class="boot__scribble">
      ${scribbles.bolt('boot__bolt')}<span class="boot__tag">${t(b.scribble)}</span>
    </p>
  </div>`;
}
