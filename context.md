# Context handoff — Vansh Dixit portfolio

Read this before touching the codebase. It's written for whoever (human or AI
agent) picks this project up next, cold.

## What this is

Personal portfolio for Vansh Dixit (Co-Founder & Tech Lead at WaterPlane,
B.Tech CSE student, full-stack + GenAI background). Single Next.js app with
three public pages (Hero/Projects/Bio) and a Supabase-backed admin panel so
content can be edited without a redeploy.

- **Repo:** github.com/BatteryOrVansh/BatteryOrVansh.github.io, `main` branch only.
- **Live deploy:** https://battery-or-vansh-github-io.vercel.app (Vercel, auto-deploys on push to `main`).
- **Custom domain:** vanshdixit.me — registered on Namecheap, DNS migration to Vercel is **in progress, not finished** (see "Open items" below).
- **Design brief origin:** built from a "client call" style spec — the person driving development (Harshit, `tech.harshit.tiwari@gmail.com`) is not the site's subject (Vansh, `officialvanshdixit@gmail.com`); both are in the admin allowlist.

## Tech stack

- Next.js 16 (App Router), TypeScript, React 19.
- Tailwind CSS v4 — no `tailwind.config.js`; theme tokens live in `src/app/globals.css` under `@theme inline`, driven by CSS custom properties in `:root`.
- Supabase (Postgres + Storage) — the only datastore. No other database.
- Firebase Authentication (Google provider only) — gates `/admin`. Firebase has no role in the public site at all beyond that.
- framer-motion, react-icons, lucide-react — used for the Hero page's animations/icons (added later in the build, not part of the original scaffold).
- Hosted on Vercel (Hobby plan).

## Directory map (only the non-obvious parts)

```
src/app/page.tsx                    Hero — now a long single-scroll page (see below), NOT just a hero anymore
src/app/projects/page.tsx           Projects — cards from Supabase `projects`
src/app/bio/page.tsx                Bio — deliberately clashing 90s aesthetic, separate from the rest of the site
src/app/admin/page.tsx              Admin dashboard shell (auth gate + tabs)
src/app/api/admin/**/route.ts       Every admin write goes through one of these. Each independently calls requireAdmin().
src/app/api/cron/keep-alive/route.ts  Vercel cron target, see vercel.json

src/lib/supabase/client.ts          Public anon client — used for all public reads (server components can await this directly)
src/lib/supabase/server.ts          getSupabaseAdmin() — LAZY singleton, service-role client. Never import eagerly, see "Gotchas".
src/lib/supabase/queries.ts         Shared read helpers reused across pages (currently just getSocialLinks)
src/lib/firebase/client.ts          getFirebaseAuth()/getGoogleProvider() — also lazy, same reason as above
src/lib/firebase/admin.ts           verifyFirebaseIdToken() — firebase-admin, verifies ID tokens server-side
src/lib/admin/verify-request.ts     requireAdmin(request) — the ONLY auth check that matters (client-side gating is UX only)
src/lib/admin/allowlist.ts          Hardcoded two-email allowlist. Not an env var, not a DB table — edit this file to change it.
src/lib/admin/api-helpers.ts        adminAuthErrorResponse() — always returns generic "Access denied.", never leaks allowlist membership
src/lib/admin/client.ts             adminFetch/adminFetchJson — browser-side helpers that attach the Firebase ID token

src/components/hero/*               Hero-page-only decorative pieces (GridBackground, AnimatedGradientBackground, ScrollCue)
src/components/effects/MouseTrail.tsx  Hero-page-only cursor trail
src/components/motion/Reveal.tsx    Generic scroll-into-view fade+slide wrapper, framer-motion whileInView
src/components/ui/background-shapes.tsx           Ported from a 21st.dev component — see perf note below before touching
src/components/ui/interactive-tech-stack-builder.tsx  Ported "LEGO block" component, repointed to Vansh's real stack
src/components/skills/StreakCards.tsx  GitHub/LeetCode stat-card <img> embeds (external services, not an API integration)
src/components/audio/AudioPlayerProvider.tsx  Lives in root layout so <audio> survives client-side nav. Compact play/prev/next pill, top-right.
src/components/admin/*Panel.tsx     One panel per content type, all follow the same CRUD pattern (see any one as a template for a new one)
```

## Data model (Supabase project "Portfolio", ref `oaxkhimilwkglrgebtgx`, region ap-northeast-2)

All content the public pages render comes from these 5 tables. RLS: public
`select` on every table (`using (true)`), no public insert/update/delete —
all writes go through the service-role key server-side via the `/api/admin/*`
routes, which independently re-verify the Firebase ID token + allowlist
before touching anything.

| Table | Purpose | Written from |
|---|---|---|
| `projects` | Projects page cards. `status` field doubles as hackathon/award text, reused on the Hero "Hackathons & achievements" section. | `ProjectsPanel` |
| `bio_content` | Key/value blocks: `photo_url`, `summary`, `education`, `experience`, `contact`, `links`, `certifications`, `technical_skills`. Read by both Bio page and Hero page (certifications + technical_skills). | `BioPanel` |
| `site_settings` | Key/value. Currently just `hero_interests` (short line under the name). `active_track_url` key still exists with a null value — dead, superseded by `music_tracks`, safe to ignore/drop. | `HeroInterestsPanel` |
| `social_links` | `platform`/`label`/`url`/`sort_order`/`is_active`. Drives the Hero socials row and the site footer. `SocialIcon.tsx` maps `platform` string → icon; unknown platforms fall back to a generic link icon. | `SocialLinksPanel` |
| `music_tracks` | `title`/`file_url`/`is_active`/`sort_order`. Drives the shuffled background-music queue. **Currently 0 rows** — the player intentionally renders nothing until at least one active track exists. | `MusicPanel` |

Storage buckets: `photos` and `music`, both public. Upload path is always
`POST /api/admin/upload` (form fields `bucket`, `file`), which returns
`{ path, publicUrl }`.

## Admin panel (`/admin`)

- Firebase Google sign-in → client shows a "checking access" state → calls
  `GET /api/admin/whoami` → server verifies the ID token and checks
  `src/lib/admin/allowlist.ts`. Only that server check is real security;
  everything client-side is just UX.
- Allowlisted emails: `officialvanshdixit@gmail.com`, `tech.harshit.tiwari@gmail.com`.
  To add/remove an admin, edit `ADMIN_EMAIL_ALLOWLIST` in `allowlist.ts` and redeploy.
- Tabs: Projects, Bio, Hero interests, Social links, Music. Each is a
  self-contained panel component following the same pattern: fetch on mount
  via the public `supabase` client or `adminFetchJson`, optimistic-free
  "Saved." toast that only fires after a confirmed non-error response.
- Every admin write route calls `revalidatePath()` for whichever public
  route(s) it affects, on top of those routes already being fully dynamic
  (`export const revalidate = 0`). Both were added deliberately after a real
  bug where admin saves didn't show up on the public pages — don't remove
  either half of that fix.

## Design system

- Light theme: white bg, near-black text, **red is the only accent color**
  (`--red: #e8283f`). No other hue anywhere except the intentionally
  different Bio page.
- Google-product-marketing visual language: organic blob shapes with
  scroll/idle morph, generous negative space, `--ease-google: cubic-bezier(0.4, 0, 0.2, 1)`.
- Bio page (`.bio-90s` scope in globals.css) is a **deliberate aesthetic
  clash** — Windows-95 bevels, Times New Roman, tiled background, LCD
  counter. Don't "fix" it to match the rest of the site; that's the point.
- Right nav (`RightNav.tsx`) is an icon rail that expands ~168px on hover.
  Hides itself on `/admin*` via `usePathname()`.
- Hero page background layers, back to front: `GridBackground` (fixed,
  `-z-40`) → `AnimatedGradientBackground` (fixed, `-z-30`) → per-section
  `BlobBackground`/`BackgroundShapes` (absolute within their own section) →
  content. `MouseTrail` is a `pointer-events-none` overlay on top of everything.

## Gotchas / things that already bit someone once

1. **Never eagerly instantiate the Supabase service-role client or the
   Firebase client SDK at module scope.** Both `getSupabaseAdmin()` and
   `getFirebaseAuth()` are lazy singletons on purpose — Next.js evaluates
   this code during `next build`'s prerendering even when real secrets
   aren't set, and eager instantiation crashes the entire build. If you add
   a new file that needs either, import the existing lazy getter, don't
   create a new client instance.
2. **`BackgroundShapes` is expensive if you crank up its density.** It was
   originally rendering ~1200 individual components each running its own
   `setTimeout` loop, which was the actual cause of a real reported "laggy
   scrolling" bug. Current default `cellSize` (48) plus an
   `IntersectionObserver`-gated pause when off-screen keeps it to ~160
   components. Don't lower `cellSize` back down without re-checking perf.
3. **All continuous CSS animations have `will-change: transform` (or `d` for
   the morphing blob paths) and are transform/opacity-only** — no
   `background-position` or other paint-triggering properties animate
   continuously anywhere. Keep new background effects to this same
   transform-only discipline.
4. **A background agent once self-merged its own PR despite an explicit
   instruction not to**, and that PR's unverified code broke the production
   build (the eager-instantiation issue in #1). If you spawn subagents for
   parallel work, tell them explicitly to open a PR and stop, and actually
   review + build/lint-verify before merging yourself — don't trust a
   subagent's own "done" report.
5. **`hero_interests` and other admin-edited text currently contains
   informal/placeholder-sounding content** (was being used to test the
   admin panel). Worth a content review pass with Vansh before treating the
   live site as final, but don't silently rewrite his content without being asked.

## Environment variables

See `.env.example` for the full list with comments on where to get each
value. Summary of the four groups:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_FIREBASE_*` (client config) — Firebase project is `portfolio-6776d`
- `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` (Admin SDK, from a service-account JSON)
- `CRON_SECRET` — optional, locks `/api/cron/keep-alive` to Vercel's own invocations

Real values already exist in `.env.local` (gitignored, not in this repo) —
if you're picking this up in a fresh environment, get them from whoever has
access to the Supabase/Firebase dashboards, or from Vercel's project
environment variables (same values are set there for the live deploy).

## Deployment

- Vercel project auto-deploys `main`. No manual deploy step.
- `vercel.json` defines a daily cron (`0 6 * * *`, the max frequency Vercel's
  free Hobby plan allows) hitting `/api/cron/keep-alive`, which does a
  trivial Supabase read — Supabase free-tier projects auto-pause after ~7
  days of no DB activity, this prevents that without needing to upgrade
  either Vercel or Supabase.

## Open items (not yet done)

1. **Domain DNS migration is mid-flight.** vanshdixit.me was pointed at a
   stale third-party proxy (`*.beta.supersonic.ai`) left over from before
   this project, which was itself dead-ending into a GitHub Pages "site not
   found". Correct records were identified (A `@` → `216.198.79.1`, CNAME
   `www` → whatever Vercel's dashboard currently shows) and the user was
   walked through applying them in Namecheap's Advanced DNS — **verify this
   actually landed** before assuming the custom domain works. Namecheap's
   nameservers were NOT switched to Vercel's (deliberately — using the
   simpler "keep Namecheap DNS, add Vercel's specific records" path instead
   of full nameserver delegation).
2. **No music tracks uploaded yet** — `music_tracks` has 0 rows, so the
   player correctly renders nothing on the live site. Upload at least one
   via `/admin` → Music.
3. **Content pass needed** — `hero_interests` and possibly other bio fields
   have informal/test-sounding text rather than final copy (see Gotcha #5).
4. Every other item from the original build brief (Vercel connection,
   Firebase project creation, Supabase service-role key) is already done —
   this is a live, working, deployed site, not an unfinished scaffold.

## Working conventions (if you're an AI agent continuing this)

- **Never add AI/Claude/Anthropic attribution to any commit, PR, or file** —
  no `Co-Authored-By`, no "Generated with" trailers. This has been an
  explicit, repeated instruction throughout the project's history.
- Commit incrementally, one logical change per commit, on a feature branch —
  never push directly to `main`.
- Run `npm run lint` and `npm run build` (and ideally a dev-server smoke test
  against real Supabase data) before opening a PR, and again before merging.
- Open PRs with `gh pr create`, review the actual diff yourself, then merge
  with `gh pr merge --squash --delete-branch`. Don't rubber-stamp a
  subagent's self-report as "done."
