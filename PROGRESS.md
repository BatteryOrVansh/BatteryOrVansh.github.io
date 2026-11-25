# PROGRESS

Resume from this file alone. Spec: `PRD.md`. Rules: `CLAUDE.md`. Decisions: `docs/NOTES.md`.

## Current phase

Phase 7: README and DEPLOY.md (starting).

## Phase checklist

- [x] 0 Scaffold
- [x] 1 Design system
- [x] 2 Deck engine
- [x] 3 Slide layouts and content
- [x] 4 Motion pass + music player
- [x] 5 Responsive and accessibility pass
- [x] 6 Performance, SEO, OG image, favicon, sitemap, 404
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

- Phase 6: head (canonical, OG, Twitter, JSON-LD Person), robots/sitemap/manifest generated
  from site.json at build, favicon set + OG image (scripts/make-icons.cjs, make-og.cjs), 404 page.
  Lighthouse (3 runs, mobile sim): perf 95-96, a11y 100, best-practices 100, SEO 100, CLS 0,
  LCP 2.6 s, JS 47 KB gzip. Hidden-heading approach kept: LCP element is the numeral, not a heading.
- Phase 5: 360px and phone-landscape pass (no horizontal overflow), keyboard walkthrough
  (all focus rings visible, skip link fixed), reduced-motion audit incl. player card,
  no-JS fallback checked, fonts subset. Lighthouse (mobile sim): perf 96-97, a11y 100,
  best-practices 96, SEO 90 (before phase 6 meta), CLS 0, LCP 2.4 s.
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

1. README.md (what it is, run, edit content, structure; no AI notes).
2. DEPLOY.md with numbered beginner steps (preview, merge with a merge commit, Pages source = GitHub Actions, check live, restore from the `old-site` branch, custom domain, edit site.json).
3. Final pass: lint, format:check, build, budget, e2e scripts.
4. Regenerate CONTENT_TODO.md from `npm run todos`.
5. Hand over: list what remains in CONTENT_TODO.md.

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
node scripts/e2e/keyboard.cjs # keyboard-only walkthrough
node scripts/e2e/reduced.cjs  # reduced-motion audit
```

Run dev servers/previews in the background and put a timeout on every command.

Design lab: `npm run dev` then open http://localhost:5173/lab.html

## Known issues

- (none)
- The page is an empty shell until Phase 2/3.
