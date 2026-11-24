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
