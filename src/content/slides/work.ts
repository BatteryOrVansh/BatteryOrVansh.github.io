import type { Link, Project, Site } from '../types';
import { isTodo } from '../types';
import { esc, fill, href, html, isExternal, t } from '../html';

const arrow =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function renderLink(site: Site, link: Link): string {
  if (isTodo(link.href)) {
    return `<li><span class="detail__link detail__link--pending mono">${esc(link.label)} · <span class="todo">${esc(site.ui.pendingLink ?? '')}</span></span></li>`;
  }
  const ext = isExternal(link.href);
  const attrs = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
  const hint = ext
    ? `<span class="visually-hidden"> (${esc(site.ui.externalHint ?? '')})</span>`
    : '';
  return `<li><a class="detail__link btn btn--charge" href="${href(link.href)}"${attrs}><span class="btn__magnet">${t(link.label)}${hint}${arrow}</span></a></li>`;
}

function renderDetail(site: Site, p: Project, i: number): string {
  const label = fill(site.ui.projectDialog ?? '{name}', { name: p.name });
  const n = String(i + 1).padStart(2, '0');
  return html`<section
    class="detail glass glass--strong"
    id="detail-${p.id}"
    role="region"
    aria-labelledby="detail-${p.id}-h"
    data-detail="${p.id}"
    aria-roledescription="${esc(label)}"
  >
    <button
      class="detail__close btn btn--icon"
      type="button"
      data-close
      aria-label="${esc(fill(site.ui.closeProject ?? 'Close', { name: p.name }))}"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
    </button>
    <p class="caption">${n} — ${t(p.year)}</p>
    <h3 class="detail__name display" id="detail-${p.id}-h" tabindex="-1">${t(p.name)}</h3>
    <p class="lede detail__tag">${t(p.tagline)}</p>
    <p class="body-copy detail__summary">${t(p.summary)}</p>
    <dl class="detail__meta">
      <div>
        <dt class="mono mono--dim">${esc(site.ui.roleLabel ?? '')}</dt>
        <dd>${t(p.role)}</dd>
      </div>
      <div>
        <dt class="mono mono--dim">${esc(site.ui.stackLabel ?? '')}</dt>
        <dd class="detail__stack">
          ${p.stack.map((s) => `<span class="chip mono">${t(s)}</span>`)}
        </dd>
      </div>
    </dl>
    <ul class="detail__links" aria-label="${esc(site.ui.linksLabel ?? '')}">
      ${p.links.map((l) => renderLink(site, l))}
    </ul>
  </section>`;
}

export function renderWork(site: Site): string {
  const w = site.slides.work;
  const panels = w.projects
    .map((p, i) => {
      const n = String(i + 1).padStart(2, '0');
      return html`<li class="panels__item" style="--n:${i}">
        <button
          class="panel glass"
          type="button"
          aria-expanded="false"
          aria-controls="detail-${p.id}"
          data-open="${p.id}"
          aria-label="${esc(fill(site.ui.openProject ?? '{name}', { name: p.name }))}"
        >
          <span class="panel__num mono mono--amber" aria-hidden="true">${n}</span>
          <span class="panel__name display" aria-hidden="true">${t(p.name)}</span>
          <span class="panel__tag" aria-hidden="true">${t(p.tagline)}</span>
          <span class="panel__foot mono mono--dim" aria-hidden="true"
            ><span>${t(p.year)}</span>${arrow}</span
          >
        </button>
      </li>`;
    })
    .join('');
  return html`<div class="work">
    <div class="work__main">
      <header class="work__head">
        <p class="caption">${w.num} — ${t(w.title)}</p>
        <h2 class="heading work__heading" data-focus>${t(w.heading)}</h2>
        <p class="mono mono--dim work__caption">${t(w.caption)}</p>
      </header>
      <ul class="panels">
        ${panels}
      </ul>
    </div>
    ${w.projects.map((p, i) => renderDetail(site, p, i))}
  </div>`;
}
