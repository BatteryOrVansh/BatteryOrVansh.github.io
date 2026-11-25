import type { Site } from '../types';
import { isTodo } from '../types';
import { esc, href, html, isExternal, t } from '../html';

const arrow =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8"/></svg>';

export function renderContact(site: Site): string {
  const c = site.slides.contact;
  const rows = c.links
    .map((l) => {
      const inner = `<span class="mono mono--dim">${t(l.label)}</span><span class="clink__v">${t(l.value ?? l.label)}</span>`;
      if (isTodo(l.href)) {
        return `<li><span class="clink clink--pending">${inner}<span class="todo">${esc(site.ui.pendingLink ?? '')}</span></span></li>`;
      }
      const ext = isExternal(l.href);
      const attrs = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
      const hint = ext
        ? `<span class="visually-hidden"> (${esc(site.ui.externalHint ?? '')})</span>`
        : '';
      return `<li><a class="clink" href="${href(l.href)}"${attrs}>${inner}${hint}${arrow}</a></li>`;
    })
    .join('');
  return html`<div class="contact">
    <header class="contact__head">
      <p class="caption">${c.num} — ${t(c.title)}</p>
      <h2 class="display contact__heading" data-focus>${t(c.heading)}</h2>
      <p class="lede">${t(c.body)}</p>
    </header>
    <ul class="clinks">
      ${rows}
    </ul>
    <p class="contact__foot mono mono--dim">${t(c.footer)}</p>
  </div>`;
}
