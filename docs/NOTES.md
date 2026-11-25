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

## Changes requested by Vansh

- **Project 2 is AdPulse Academy**, not AdOps Toolkit: a separate free learning
  platform for business, data and ad analysts with labs, quizzes and certificates.
- **No `old-site-v1` tag.** Vansh creates an `old-site` branch on GitHub himself.
  DEPLOY.md's restore steps must use that branch, not a tag.
- **Command hygiene:** dev servers and previews run in the background, and every
  command gets a timeout.

## Decisions (Vansh, after phase 2)

- `old-site` branch exists on GitHub (from `f3ce870`). DEPLOY.md restore steps point at it.
- No AI attribution in commits, PRs, README or docs (rule 7 in CLAUDE.md).
- TODO(Vansh) fields stay until Vansh finishes the other projects.

## Phase 3: Boot cell

- **Intro shows on a first visit only, and not on a deep link.** An inline
  script in `index.html` adds `has-intro` before first paint (state key
  `bov:v1`, shared with `src/state.ts`), so returning visitors never see a flash
  of overlay and Lighthouse isn't measuring a covered page. Returning visitors
  with a saved sound choice resume on their first interaction (player, phase 4).
- **"Skip intro" skips the animation, not the choice.** It lights the battery
  and reveals the two buttons at once (also Esc). Skipping entirely is "Enter
  silent". Why: the gate must stay a real user gesture for audio.
- **Deck and top bar are `inert` while the intro is open**, focus starts on
  Skip, then moves to "Enter with sound" when the buttons appear.
- **Boot cell decoration** ("that's me" scribble, fig. caption) comes from
  site.json (`scribble`, `annotation`), so copy stays in one place.

## Phase 3: remaining cells

- **Cells overflow on short screens by design.** Each `.cell` scrolls vertically
  on its own; the wheel handler lets a tall cell scroll first and only changes
  cell at its edge. Desktop layouts aim to fit 900px tall; phones scroll.
- **Project detail is an overlay inside the Work cell** (absolute, not fixed:
  the track has a transform, which would break `position: fixed`). Open details
  inert the panels, lock deck input, close on Esc/close button/any cell change.
  Without JS the details simply follow the panels as normal sections.
- **Toolkit uses a 3-cell battery glyph per group**, not bars: it is the
  charge-bar motif at small size and carries an aria-label ("2 of 3 cells charged").
- **Dropped the "joining" fact from About's facts list**; the Joining card says it
  (one statement, not two).
- **TODO(Vansh) links render as inert "link pending" marks**, never as `href="#"` links.
