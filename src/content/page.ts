// Assembles full-page head/body fragments from site.json.
import type { Site } from './types';
import { isTodo } from './types';
import { esc, isExternal } from './html';
import { renderAbout } from './slides/about';
import { renderBoot, renderIntro } from './slides/boot';
import { renderWork } from './slides/work';
import { renderToolkit } from './slides/toolkit';
import { renderNow } from './slides/now';
import { renderContact } from './slides/contact';
import { renderAtmosphere, renderChrome, renderDeck } from './render';

export interface PageParts {
  head: string;
  body: string;
}

const abs = (site: Site, path: string): string => new URL(path, site.meta.url).href;

/** external profile links (GitHub, LinkedIn...) for structured data */
const profiles = (site: Site): string[] =>
  site.slides.contact.links.map((l) => l.href).filter((h) => !isTodo(h) && isExternal(h));

export function renderHead(
  site: Site,
  title = site.meta.title,
  opts: { noindex?: boolean } = {},
): string {
  const m = site.meta;
  const image = abs(site, m.ogImage);
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="theme-color" content="${esc(m.themeColor)}" />`,
    `<meta name="color-scheme" content="dark" />`,
    opts.noindex
      ? `<meta name="robots" content="noindex" />`
      : `<link rel="canonical" href="${esc(m.url)}" />`,
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`,
    `<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.person.handle)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(m.url)}" />`,
    `<meta property="og:locale" content="${esc(m.locale)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(m.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(m.ogImageAlt)}" />`,
  ];
  if (!opts.noindex) {
    const person = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: site.person.name,
      alternateName: site.person.handle,
      url: m.url,
      description: m.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.person.location.split(',')[0]?.trim(),
        addressRegion: site.person.location.split(',')[1]?.trim(),
        addressCountry: 'IN',
      },
      sameAs: profiles(site),
    };
    // "<" is escaped so the JSON can never close its own script tag
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`,
    );
  }
  return tags.join('\n    ');
}

export function renderPage(site: Site, page: 'index' | '404'): PageParts {
  if (page === '404') {
    const n = site.notFound;
    return {
      head: renderHead(site, `${n.title} — ${site.person.name}`, { noindex: true }),
      body: [
        `<a class="skip-link" href="#main">${esc(site.ui.skipToContent ?? '')}</a>`,
        renderAtmosphere(),
        `<main class="lost" id="main">
          <p class="lost__code numeral" aria-hidden="true">${esc(n.code)}</p>
          <div class="lost__copy">
            <p class="caption">${esc(n.code)} — ${esc(n.title)}</p>
            <h1 class="heading" tabindex="-1">${esc(n.heading)}</h1>
            <p class="lede">${esc(n.body)}</p>
            <a class="btn btn--charge" href="/"><span class="btn__magnet">${esc(n.back)}</span></a>
          </div>
        </main>`,
      ].join('\n'),
    };
  }
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
        toolkit: renderToolkit(site),
        now: renderNow(site),
        contact: renderContact(site),
      }),
      renderIntro(site),
    ].join('\n'),
  };
}
