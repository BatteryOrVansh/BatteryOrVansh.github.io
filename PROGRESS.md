# PROGRESS

Resume from this file alone. Spec: `PRD.md`. Rules: `CLAUDE.md`. Decisions: `docs/NOTES.md`.

## Current phase

Phase 4: Motion pass, then music player (starting).

## Phase checklist

- [x] 0 Scaffold
- [x] 1 Design system
- [x] 2 Deck engine
- [x] 3 Slide layouts and content
- [ ] 4 Motion pass + music player
- [ ] 5 Responsive and accessibility pass
- [ ] 6 Performance, SEO, OG image, favicon, sitemap, 404
- [ ] 7 README and DEPLOY.md

## Done

- Branch `redesign` created; old-site backup is Vansh's job (branch `old-site`).
- Work project 2 is AdPulse Academy (replaced AdOps Toolkit).
- Build-time renderer (site.json -> cells/charge bar) and deck track CSS.
- CLAUDE.md, PRD.md, PROGRESS.md, AGENTS.md, GEMINI.md, docs/NOTES.md.
- docs/OLD_CONTENT.md (content notes + secrets scan: none found).
- Old Next.js site removed on this branch.
- Vite 6 + TypeScript strict, ESLint 9 + Prettier, copy linter for banned words.
- content/site.json with typed schema (`src/content/types.ts`), TODO lister.
- CONTENT_TODO.md.
- CI (`ci.yml`: lint, format, build, JS budget, Lighthouse), Pages deploy
  (`deploy.yml`, main only), vercel.json, netlify.toml.
- Phase 1: self-hosted fonts, tokens, type roles, glass, orbs + grain, buttons,
  scribbles, charge-bar styles, hidden design lab at `/lab.html`.

- Phase 3: all six cells render from site.json (`src/content/slides/*.ts`,
  `src/styles/<cell>.css`). Work details: `src/deck/work.ts` (plain show/hide for now).
  Boot cell + first-visit intro/sound gate (`src/deck/intro.ts`,
  `src/content/slides/boot.ts`, `src/state.ts`). Emits `intro:done` {sound, gesture}.
- Phase 2: deck engine (`src/deck/`): inert cells, GSAP track, charge-level tween,
  hash routing + back button, keys/wheel/swipe/click, focus handoff, live region.
  Verified with Playwright (`npm run e2e`), normal and reduced motion.

## Next 5 actions

1. src/motion: split-text reveals on headings, per-cell entrance (GSAP), reduced-motion safe.
2. Magnetic buttons, pointer-tilt glass cards (sets --mx/--my/--spec), custom cursor (desktop only).
3. FLIP project panel -> detail (replace plain open/close in `src/deck/work.ts`).
4. Music engine (Web Audio, GainNode fades, startAt 10s, loop) + `scripts/make_demo_tracks.py`.
5. Player UI (equalizer toggle, FLIP card, library, license) + MUSIC.md.

## Open decisions

- None blocking.

## How to run and test

```bash
npm install
npm run dev            # http://localhost:5173
npm run build && npm run check:budget
npm run lint
npm run e2e            # Playwright: nav, hash, wheel, swipe, reduced motion
```

Run dev servers/previews in the background and put a timeout on every command.

Design lab: `npm run dev` then open http://localhost:5173/lab.html

## Known issues

- (none)
- The page is an empty shell until Phase 2/3.
