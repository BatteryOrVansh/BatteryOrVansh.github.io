# CLAUDE.md — working notes for any agent on this repo

Read this file and `PROGRESS.md` before touching anything. `PRD.md` is the spec.
Decisions and their reasons live in `docs/NOTES.md`.

## What this is

Vansh Dixit's personal portfolio (GitHub: BatteryOrVansh). A static site, served
at https://batteryorvansh.github.io. Portfolio only: **no dashboard, no admin
panel, no backend, no database, no auth.** If a task drifts toward any of those,
stop and ask.

The concept: the site is a deck of full-screen horizontal **cells** (like battery
cells). A charge bar fixed at the top fills cell by cell as you move. The theme
plays on the handle BatteryOrVansh: charging, low power, full charge.

## Stack

- Vite + TypeScript, no framework. Plain DOM modules.
- Hand-written CSS with custom properties. No Tailwind, no UI kit, no CSS-in-JS.
- GSAP (core + Flip + SplitText) for motion.
- Fonts self-hosted from `public/fonts` (copied from @fontsource, see `docs/NOTES.md`).
- Content: `content/site.json` is the single source of truth for every word on
  the site. It is rendered into static HTML at build time by a Vite plugin
  (`build/render-plugin.ts`), so the page works and is indexable without JS.
- Music: Web Audio API (GainNode for volume and fades), files in `public/music`.

## Structure

```
content/site.json          all copy, links, projects, skills (single source of truth)
index.html                 shell; slides are injected at build from site.json
lab.html                   hidden design lab (noindex), every component on one page
404.html                   not-found page
build/render-plugin.ts     Vite plugin: site.json -> static slide HTML
src/content/               types + renderers (pure string functions, no DOM)
src/styles/                tokens, fonts, base, glass, deck, slides, player, lab
src/deck/                  deck engine: navigation, charge bar, hash routing, input
src/motion/                GSAP pieces: intro, reveals, magnetic, tilt, cursor, flip
src/player/                music engine (Web Audio) + player UI
src/main.ts                entry for index.html
src/lab.ts                 entry for lab.html
public/music/              library.json + audio files (see MUSIC.md)
public/fonts/              self-hosted woff2
scripts/                   make_demo_tracks.py, budget check, og image
docs/                      NOTES.md (decisions), OLD_CONTENT.md (old site notes)
```

## Commands

```bash
npm install            # once
npm run dev            # local dev server at http://localhost:5173
npm run build          # type-check + static build to dist/
npm run preview        # serve dist/ at http://localhost:4173
npm run lint           # eslint + stylelint-free css checks (eslint only)
npm run format         # prettier --write
npm run check:budget   # fails if JS > 120 KB gzipped
npm run lighthouse     # Lighthouse CI against dist/ (needs Chrome/Chromium)
python3 scripts/make_demo_tracks.py   # regenerate the demo music
```

## Design rules (non-negotiable)

- Palette, as CSS variables only: ink `#110C0E`, oxblood `#3B1219`, dusk `#2B3A67`,
  bone `#F2EAD8`, amber `#FFB238` (charge, and **all success states**), ember
  `#FF5A3C` (low power). **No green anywhere.** No purple, blue or pink gradients.
- Glass: bone tint ~7% opacity, `backdrop-filter: blur(24px) saturate(140%)`,
  1px bone border ~18% opacity, soft inner highlight. Behind the glass: slowly
  drifting blurred orbs (oxblood, ember, dusk) and a faint film-grain overlay.
- Type: Fraunces (variable; use SOFT and WONK axes) for display, Hanken Grotesk
  for body, Martian Mono for labels and captions. Never Inter, Roboto, Poppins,
  Montserrat, Space Grotesk or system defaults as a design font.
- Layout: asymmetric, editorial, irregular grid, overlaps, oversized numerals,
  small mono annotations, numbered captions, a few hand-drawn SVG scribbles.
- Banned: centered hero with gradient text, three-equal-cards-with-icons rows,
  emoji icons, generic skill bars, lorem ipsum.
- Motion: GSAP. Everything respects `prefers-reduced-motion` with a calm fallback
  (no drift, no tilt, no custom cursor, crossfades instead of slides).
- Phones first: `100dvh` cells, tap targets ≥ 44px.

## Content rules

- Every word comes from `content/site.json`. Never hard-code copy in TS/HTML.
- Never invent experience, employers, numbers or skills. Vansh must be able to
  defend every claim in an interview. Unknowns are written as `TODO(Vansh): ...`
  in site.json and listed in `CONTENT_TODO.md`.
- InMobi Group (Analyst intern, business analysis and ad operations, January
  2027) is shown as **Joining**, never as past experience.
- Short, specific, first-person copy with some personality.
- Banned words: passionate, leverage, seamless, elevate, cutting-edge, crafting,
  journey, tapestry. (`npm run lint:copy` checks site.json.)

## Git rules

1. Identity: `git config user.name 'Vansh Dixit'` and
   `git config user.email '146572068+BatteryOrVansh@users.noreply.github.com'`.
2. Small commits, one logical change each, every commit leaves the site working.
3. Conventional Commits (`feat:`, `fix:`, `style:`, `perf:`, `docs:`,
   `refactor:`, `chore:`), imperative subject under 72 chars. No empty or filler commits.
4. Work on `redesign`. `git push origin redesign` every 3–5 commits. Never push
   to `main`; Vansh merges with a merge commit. Never force-push or rewrite history.
5. No secrets, no files over 5 MB, optimise images before committing.
6. Update `PROGRESS.md` at every push (Current phase, Done, Next 5 actions,
   Open decisions, How to run and test, Known issues).
7. No AI attribution trailers in commits or files (Vansh's standing instruction
   from the old repo).

## Current phase

See the top of `PROGRESS.md`.
