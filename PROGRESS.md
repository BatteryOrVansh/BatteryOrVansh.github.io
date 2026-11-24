# PROGRESS

Resume from this file alone. Spec: `PRD.md`. Rules: `CLAUDE.md`. Decisions: `docs/NOTES.md`.

## Current phase

Phase 1: Design system (starting).

## Phase checklist

- [x] 0 Scaffold
- [ ] 1 Design system
- [ ] 2 Deck engine
- [ ] 3 Slide layouts and content
- [ ] 4 Motion pass + music player
- [ ] 5 Responsive and accessibility pass
- [ ] 6 Performance, SEO, OG image, favicon, sitemap, 404
- [ ] 7 README and DEPLOY.md

## Done

- Old site tagged locally as `old-site-v1`; branch `redesign` created.
- CLAUDE.md, PRD.md, PROGRESS.md, AGENTS.md, GEMINI.md, docs/NOTES.md.
- docs/OLD_CONTENT.md (content notes + secrets scan: none found).
- Old Next.js site removed on this branch.
- Vite 6 + TypeScript strict, ESLint 9 + Prettier, copy linter for banned words.
- content/site.json with typed schema (`src/content/types.ts`), TODO lister.
- CONTENT_TODO.md.
- CI (`ci.yml`: lint, format, build, JS budget, Lighthouse), Pages deploy
  (`deploy.yml`, main only), vercel.json, netlify.toml.

## Next 5 actions

1. Copy Fraunces / Hanken Grotesk / Martian Mono woff2 into public/fonts, @font-face.
2. tokens.css (palette, spacing, type scale, easing) and base.css.
3. Glass component, drifting orbs, film grain.
4. Hidden design lab page (lab.html) showing every component.
5. Charge-bar and button styles in the lab.

## Open decisions

- None blocking.

## How to run and test

```bash
npm install
npm run dev            # http://localhost:5173
npm run build && npm run check:budget
npm run lint
```

## Known issues

- Tag `old-site-v1` exists only locally in the build sandbox. Push it with
  `git tag old-site-v1 f3ce870 && git push origin old-site-v1`.
- The page is an empty shell until Phase 2/3.
