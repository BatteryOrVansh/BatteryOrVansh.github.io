# Decision log

Newest at the bottom. Each entry: what, why, and what it costs.

## Phase 0

- **Tag push blocked.** The build sandbox's git proxy refused `git push origin
old-site-v1` (HTTP 403); branch pushes work. The tag exists locally at
  `f3ce870` (old `main`). Vansh pushes it himself (see CONTENT_TODO.md).
- **Content is rendered at build time.** `content/site.json` is turned into
  static HTML by a Vite plugin, not at runtime. Why: the page is readable and
  indexable without JS, there's no layout shift from late-injected text, and
  Lighthouse SEO/LCP stay high. JS only adds motion and navigation.
- **TODO(Vansh) placeholders are visible.** Any string starting with
  `TODO(Vansh)` renders as a small ember "pending" mark rather than being
  hidden. Why: a missing project description should be obvious in a preview,
  not silently empty. `npm run todos` lists them.
- **Skill groups are a draft.** The old site had a flat skill list with no
  proficiency; the three charge levels are a first sort and are marked
  TODO(Vansh) to confirm.
- **Hackathon log kept as a small annotation on About.** It's real content
  from the old site (events, dates, places) and suits the mono-caption style.
  Flagged in CONTENT_TODO.md in case he'd rather drop it.
- **No AI attribution trailers in commits.** The old repo's handoff doc records
  this as Vansh's explicit, repeated instruction.
- **Lighthouse CI writes reports to the filesystem** and CI uploads them as an
  artifact, instead of uploading to public temporary storage.
- **ESLint + Prettier only.** No stylelint: one less tool to maintain for a
  small hand-written stylesheet.

## Phase 1

- **Fonts copied from @fontsource, not installed as a dependency.** The woff2
  files live in `public/fonts` (latin subset). Fraunces uses the "full" axis
  file (opsz, wght, SOFT, WONK; 121 KB). Italic is declared but only fetched
  when italic text is on screen. Metric-adjusted local fallbacks reduce swap shift.
- **Orbs are radial gradients, not `filter: blur()`.** Same look, far cheaper;
  they drift on `transform` only. Grain is a static SVG turbulence tile that
  jitters in 6 steps per 1.2 s. Both stop under reduced motion.
- **Charge bar fill is pure CSS.** `--level` (number of filled cells, can be
  fractional) drives each segment via `clamp(0, level - i, 1)`; JS only tweens
  one variable.
- **Design lab copy is not in site.json.** It is a developer page (`/lab.html`,
  noindex, unlinked), so its labels aren't site copy.
