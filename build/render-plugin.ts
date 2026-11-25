// Vite plugin: injects the deck rendered from content/site.json into index.html.
// Placeholders in index.html: <!--site:head-->, <!--site:body-->.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import type { Site } from '../src/content/types';
import { renderPage } from '../src/content/page';

const CONTENT = resolve(__dirname, '../content/site.json');

export const loadSite = (): Site => JSON.parse(readFileSync(CONTENT, 'utf8')) as Site;

export function renderPlugin(): Plugin {
  return {
    name: 'bov-render-site',
    configureServer(server) {
      server.watcher.add(CONTENT);
      server.watcher.on('change', (file) => {
        if (resolve(file) === CONTENT) server.ws.send({ type: 'full-reload' });
      });
    },
    // robots.txt, sitemap.xml and the web manifest are generated from site.json
    generateBundle() {
      const site = loadSite();
      const url = site.meta.url;
      const emit = (fileName: string, source: string) =>
        this.emitFile({ type: 'asset', fileName, source });
      emit(
        'robots.txt',
        `User-agent: *\nAllow: /\nDisallow: /lab.html\n\nSitemap: ${new URL('sitemap.xml', url).href}\n`,
      );
      emit(
        'sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </url>\n</urlset>\n`,
      );
      emit(
        'site.webmanifest',
        JSON.stringify(
          {
            name: site.person.name,
            short_name: site.person.handle,
            description: site.meta.description,
            start_url: '/',
            display: 'standalone',
            background_color: site.meta.themeColor,
            theme_color: site.meta.themeColor,
            icons: [
              { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
              { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
            ],
          },
          null,
          2,
        ) + '\n',
      );
    },
    transformIndexHtml: {
      order: 'pre',
      handler(source, ctx) {
        const page = ctx.filename.endsWith('404.html')
          ? '404'
          : ctx.filename.endsWith('index.html')
            ? 'index'
            : null;
        if (!page) return source;
        const site = loadSite();
        const out = renderPage(site, page);
        return source.replace('<!--site:head-->', out.head).replace('<!--site:body-->', out.body);
      },
    },
  };
}
