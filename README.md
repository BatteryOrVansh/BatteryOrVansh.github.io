# BatteryOrVansh

My portfolio, at [batteryorvansh.github.io](https://batteryorvansh.github.io).

It is a deck of six full-screen cells, like the cells in a battery. A charge bar
at the top fills as you move through them: low power on the first cell, full
charge on the last. Swipe, scroll, use the arrow keys, click a cell on the charge
bar, or open a direct link such as `/#work`.

Static site, no backend, no database, no accounts.

## Run it

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. The page reloads when you save `content/site.json`.

Other commands:

```bash
npm run build          # type-check and build the site into dist/
npm run preview        # serve dist/ at http://localhost:4173
npm run lint           # eslint and the banned-word check on the copy
npm run format         # prettier
npm run check:budget   # fails if JavaScript is over 120 KB gzipped
npm run lighthouse     # Lighthouse checks against dist/ (needs Chrome or Chromium)
npm run todos          # lists every TODO(Vansh) placeholder left in the content
```

## Change the words

Every word on the site lives in one file: `content/site.json`. Edit it, save,
and the site rebuilds. Anything that still needs me starts with `TODO(Vansh)`
and shows up as a small orange mark on the page. `CONTENT_TODO.md` lists them.
Step-by-step instructions are in [DEPLOY.md](DEPLOY.md).

## Change the music

Drop an MP3 into `public/music` and add a line to `public/music/library.json`.
See [MUSIC.md](MUSIC.md).

## What is where

```
content/site.json      all the copy, links, projects and skills
src/content/           turns site.json into HTML at build time
src/deck/              navigation, charge bar, intro, project details
src/motion/            reveals, magnetic buttons, tilt, cursor, FLIP
src/player/            music player (Web Audio)
src/styles/            hand-written CSS with variables
public/                fonts, music, icons, social image
scripts/               track generator, icon and image generators, checks
docs/NOTES.md          why things are the way they are
PRD.md                 the spec
```

The hidden design lab (every component on one page) is at `/lab.html` on a dev
server. It is not linked from the site and is kept out of search engines.

## Built with

Vite, TypeScript, GSAP, and hand-written CSS. No framework. Fonts are
self-hosted: Fraunces, Hanken Grotesk and Martian Mono (all SIL Open Font
License; the licences are in `public/fonts`).

## Deploying

See [DEPLOY.md](DEPLOY.md).
