# PROGRESS

Resume from this file alone. Spec: `PRD.md`. Rules: `CLAUDE.md`. Decisions: `docs/NOTES.md`.

## Current phase

Phase 5: Responsive and accessibility pass (starting).

## Phase checklist

- [x] 0 Scaffold
- [x] 1 Design system
- [x] 2 Deck engine
- [x] 3 Slide layouts and content
- [x] 4 Motion pass + music player
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

- Phase 4: motion (`src/motion/`: SplitText reveals, magnetic buttons, tilt + specular,
  cursor, FLIP helper used by Work details and the player card) and the music player
  (`src/player/`: Web Audio engine, UI; `scripts/make_demo_tracks.py`, 3 demo MP3s, MUSIC.md).
  JS is ~47 KB gzipped (budget 120).
- Phase 3: all six cells render from site.json (`src/content/slides/*.ts`,
  `src/styles/<cell>.css`). Work details: `src/deck/work.ts` (plain show/hide for now).
  Boot cell + first-visit intro/sound gate (`src/deck/intro.ts`,
  `src/content/slides/boot.ts`, `src/state.ts`). Emits `intro:done` {sound, gesture}.
- Phase 2: deck engine (`src/deck/`): inert cells, GSAP track, charge-level tween,
  hash routing + back button, keys/wheel/swipe/click, focus handoff, live region.
  Verified with Playwright (`npm run e2e`), normal and reduced motion.

## Next 5 actions

1. 360px and small-landscape pass: every cell, the player card, the detail overlay.
2. Keyboard-only walkthrough (intro, deck, detail, player), contrast check, focus order.
3. Screen-reader labels audit (roles, live regions, link hints); axe or Lighthouse a11y.
4. Reduced-motion audit of every module (reveal, orbs, grain, FLIP, cursor).
5. Fix whatever Lighthouse flags; then phase 6 (SEO, OG image, favicon, sitemap, 404).

## Open decisions

- None blocking.

## How to run and test

```bash
npm install
npm run dev            # http://localhost:5173
npm run build && npm run check:budget
npm run lint
npm run e2e            # Playwright: nav, hash, wheel, swipe, reduced motion
node scripts/e2e/player.cjs   # player flow (preview must be running on :4173)
```

Run dev servers/previews in the background and put a timeout on every command.

Design lab: `npm run dev` then open http://localhost:5173/lab.html

## Known issues

- (none)
- The page is an empty shell until Phase 2/3.
