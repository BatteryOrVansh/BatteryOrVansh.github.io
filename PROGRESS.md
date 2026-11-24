# PROGRESS

Resume from this file alone. Spec: `PRD.md`. Rules: `CLAUDE.md`. Decisions: `docs/NOTES.md`.

## Current phase

Phase 2: Deck engine (starting).

## Phase checklist

- [x] 0 Scaffold
- [x] 1 Design system
- [ ] 2 Deck engine
- [ ] 3 Slide layouts and content
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

## Next 5 actions

1. Build-time render plugin: site.json -> cell markup in index.html.
2. Deck engine: horizontal track, goTo(index), cell `inert` handling.
3. Charge bar wired to the deck (--level tween, click to jump).
4. Hash routing (#work), keyboard, wheel, swipe.
5. Focus management + live-region announcements.

## Open decisions

- None blocking.

## How to run and test

```bash
npm install
npm run dev            # http://localhost:5173
npm run build && npm run check:budget
npm run lint
```

Design lab: `npm run dev` then open http://localhost:5173/lab.html

## Known issues

- Vansh will create an `old-site` branch on GitHub himself; do not retry the tag push.
- The page is an empty shell until Phase 2/3.
