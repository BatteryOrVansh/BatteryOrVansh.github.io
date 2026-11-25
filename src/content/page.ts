// Assembles full-page head/body fragments from site.json.
import type { Site } from './types';
import { esc } from './html';
import { renderAbout } from './slides/about';
import { renderWork } from './slides/work';
import { renderBoot, renderIntro } from './slides/boot';
import { renderAtmosphere, renderChrome, renderDeck } from './render';

export interface PageParts {
  head: string;
  body: string;
}

export function renderHead(site: Site, title = site.meta.title): string {
  const m = site.meta;
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="theme-color" content="${esc(m.themeColor)}" />`,
  ].join('\n    ');
}

export function renderPage(site: Site, page: 'index' | '404'): PageParts {
  if (page === '404') return { head: renderHead(site, site.notFound.title), body: '' };
  return {
    head: renderHead(site),
    body: [
      `<a class="skip-link" href="#main">${esc(site.ui.skipToContent ?? '')}</a>`,
      renderAtmosphere(),
      renderChrome(site),
      renderDeck(site, {
        boot: renderBoot(site),
        about: renderAbout(site),
        work: renderWork(site),
      }),
      renderIntro(site),
    ].join('\n'),
  };
}
