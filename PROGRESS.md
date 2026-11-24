# PROGRESS

Resume from this file alone. Spec: `PRD.md`. Rules: `CLAUDE.md`. Decisions: `docs/NOTES.md`.

## Current phase

Phase 0: Scaffold (in progress).

## Phase checklist

- [ ] 0 Scaffold
- [ ] 1 Design system
- [ ] 2 Deck engine
- [ ] 3 Slide layouts and content
- [ ] 4 Motion pass + music player
- [ ] 5 Responsive and accessibility pass
- [ ] 6 Performance, SEO, OG image, favicon, sitemap, 404
- [ ] 7 README and DEPLOY.md

## Done

- Tagged the old site locally as `old-site-v1` (push blocked by sandbox proxy; Vansh pushes it).
- Created branch `redesign`.
- CLAUDE.md, PRD.md.

## Next 5 actions

1. AGENTS.md and GEMINI.md pointers.
2. docs/OLD_CONTENT.md from the old site.
3. Remove old Next.js site files on this branch.
4. Vite + TypeScript scaffold, lint and format.
5. CI workflow, content/site.json skeleton, CONTENT_TODO.md.

## Open decisions

- None blocking.

## How to run and test

Not runnable yet (scaffold pending).

## Known issues

- Tag `old-site-v1` exists only locally in the build sandbox. Push it with
  `git tag old-site-v1 f3ce870 && git push origin old-site-v1`.
