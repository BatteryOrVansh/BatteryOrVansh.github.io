# PRD — BatteryOrVansh portfolio, v2

## 1. Goal

A personal portfolio for Vansh Dixit that looks and feels designed by a person
with a point of view: never a template, never an obviously generated site.
Portfolio only. No dashboard, admin panel or backend.

## 2. Concept

The site is a deck of full-screen horizontal **cells**, like the cells in a
battery. A charge bar fixed at the top fills cell by cell as the visitor moves
through the deck. The theme plays on the handle **BatteryOrVansh**: charging,
low power, full charge.

## 3. Slides

| # | Id | Content |
|---|----|---------|
| 00 | `boot` | Short charging intro, skippable, that doubles as the sound gate (**Enter with sound** / **Enter silent**). Then the name and a one-line description. |
| 01 | `about` | Who I am, what I am learning (data analysis, machine learning), what I am joining. |
| 02 | `work` | Four project panels (FocusBoard, AdOps Toolkit, AdPulse, this site). Each expands into a detail view with a FLIP animation. |
| 03 | `toolkit` | Skills grouped honestly by how well I know them. |
| 04 | `now` | Now and Next: what I am building and studying, and the January 2027 internship. |
| 05 | `contact` | Email, GitHub, LinkedIn, resume link. |

## 4. Content rules

- All text lives in `content/site.json` (single source of truth).
- The old site (tag `old-site-v1`) is read for content only, never for code or design.
- Unknowns are written as `TODO(Vansh): ...` and listed in `CONTENT_TODO.md`.
- Never invent experience, employers, numbers or skills.
- InMobi Group, Analyst intern (business analysis and ad operations), January
  2027, is shown as **Joining**. Exact wording is `TODO(Vansh)`.
- Short, specific, first-person copy with some personality.
- Banned words: passionate, leverage, seamless, elevate, cutting-edge, crafting,
  journey, tapestry. No lorem ipsum.

## 5. Design system

### Palette (CSS variables; no green anywhere; success states use amber)

| Token | Hex | Role |
|---|---|---|
| ink | `#110C0E` | background |
| oxblood | `#3B1219` | depth, orbs |
| dusk | `#2B3A67` | cool counterweight, orbs |
| bone | `#F2EAD8` | text, glass tint |
| amber | `#FFB238` | charge, focus, success |
| ember | `#FF5A3C` | low power, warnings |

### Glass

Bone tint at ~7% opacity, `backdrop-filter: blur(24px) saturate(140%)`, 1px bone
border at ~18% opacity, a soft inner highlight. Behind it: slowly drifting
blurred orbs (oxblood, ember, dusk) and a faint film-grain overlay so the blur
has something to refract.

### Type

- Display: **Fraunces** (variable, SOFT and WONK axes in use).
- Body: **Hanken Grotesk**.
- Labels and captions: **Martian Mono**.
- All self-hosted. Not allowed: Inter, Roboto, Poppins, Montserrat, Space
  Grotesk, system defaults.

### Layout

Asymmetric and editorial: irregular grid, overlapping elements, oversized
numerals, small mono annotations and numbered captions, a few hand-drawn SVG
scribbles.

Not allowed: centered hero with gradient text, a row of three equal cards with
icons, emoji icons, purple/blue/pink gradients, generic skill bars.

### Motion (GSAP)

Skippable intro, split-text reveals, magnetic buttons, pointer-tilt glass cards
with a moving specular highlight, custom cursor (desktop only), charge-bar fill,
FLIP panel expansion. All of it respects `prefers-reduced-motion` with a calm
fallback.

### Interaction

Navigation by swipe, wheel, arrow keys, clicking a charge-bar cell, and
deep-link hashes (`#work`). Phones first: `100dvh` layouts, large tap targets.

## 6. Music player

**UI.** Top right: an animated toggle (equalizer bars that move while a song
plays). Clicking it expands, with a FLIP animation, into a small glass card:
song title and artist, mute, volume slider, previous / next, a small library
list, and the license credit. Clicking outside or the close button collapses
it. Keyboard and screen-reader accessible; reduced-motion fallback.

**Behaviour.**
- The Boot slide's **Enter with sound** is the user gesture that starts audio;
  **Enter silent** keeps it off.
- Later visits remember the choice, last song, volume and mute state
  (localStorage) and start the music on the first user interaction.
- Every song starts at its `startAt` (default 10 s; 0 if the track is shorter
  than 10 s), fades in over ~2 s, loops, and fades out over ~1 s when the song
  changes, music is switched off, or the page is hidden or unloading. Fade-out
  on refresh is best effort; the next load always fades in.

**Audio.** Web Audio API with a GainNode for volume and fades (iOS Safari
ignores `audio.volume`). Small files streamed from `public/music` (96–128 kbps
MP3/AAC, < 4 MB each). Library: `public/music/library.json` with `title`,
`artist`, `file`, `startAt`, `license`, `sourceUrl`.

**Songs.** Ship only generated demo tracks (`scripts/make_demo_tracks.py`,
3 original ambient tracks). `MUSIC.md` explains how to add real tracks and that
audio committed to a public repo can be downloaded by anyone. No YouTube or
Spotify embeds.

## 7. Stack and budgets

- Vite + TypeScript, hand-written CSS with variables, GSAP, no framework.
- JS < 120 KB gzipped (fonts excluded).
- Lighthouse ≥ 90 on performance, accessibility, best practices and SEO.
- No layout shift (CLS ≈ 0).

## 8. Phases

0. Scaffold: old-content notes, remove old site on this branch, Vite + TS,
   folders, lint/format, CI (build + Lighthouse), docs, `site.json` skeleton,
   `CONTENT_TODO.md`.
1. Design system: tokens, fonts, glass, orbs, grain, type scale, hidden design lab.
2. Deck engine: cells, navigation, charge bar, hash routing, keyboard and swipe,
   focus management, screen-reader labels.
3. Slide layouts and content from `site.json`.
4. Motion pass, then the music player and `MUSIC.md`.
5. Responsive and accessibility pass, reduced motion, keyboard-only test.
6. Performance, SEO, Open Graph image, favicon, sitemap, 404.
7. README and DEPLOY.md.

## 9. Deployment

- `npm run build` produces static `dist/`.
- GitHub Actions builds and deploys to GitHub Pages from `main` (user site:
  https://batteryorvansh.github.io).
- `vercel.json` and `netlify.toml` allow previewing `redesign` on Vercel,
  Netlify or Cloudflare Pages before merging.
- `DEPLOY.md`: numbered beginner steps for preview, merge with a merge commit,
  Pages source = GitHub Actions, checking the live site, restoring
  `old-site-v1`, custom domain, and editing `content/site.json`.

## 10. Done when

All phases ticked, Lighthouse budgets met, `CONTENT_TODO.md` lists exactly what
Vansh still needs to fill in, and `DEPLOY.md` is complete.
