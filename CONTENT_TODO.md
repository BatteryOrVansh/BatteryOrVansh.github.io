# CONTENT_TODO

Everything Vansh still needs to fill in or confirm. The site builds and runs with
these placeholders; each `TODO(Vansh)` string shows on the page as a small orange
dashed mark so nothing ships unnoticed.

How to edit: open `content/site.json`, find the path below, replace the
`TODO(Vansh): ...` text with the real text, then run `npm run todos` to see what is
left. Step-by-step instructions are in `DEPLOY.md` (section 7).

## In content/site.json

- [ ] `slides.about.joining.todo` — confirm the exact title and wording InMobi used in your offer.
- [ ] `slides.about.todo` — confirm current year of study and that the defence-background line is how you want to put it.
- [ ] `slides.work.projects[0].year` — year
- [ ] `slides.work.projects[0].tagline` — one line on what FocusBoard does and who it's for.
- [ ] `slides.work.projects[0].summary` — two or three sentences: the problem, what you built, what you learned.
- [ ] `slides.work.projects[0].role` — your role.
- [ ] `slides.work.projects[0].stack[0]` — stack
- [ ] `slides.work.projects[0].links[0].href` — repo or demo URL
- [ ] `slides.work.projects[1].year` — year
- [ ] `slides.work.projects[1].summary` — A separate, free platform with labs, quizzes and certificates for people learning business, data and ad analysis. TODO(Vansh): one or two sentences on what you built and what you learned.
- [ ] `slides.work.projects[1].role` — your role.
- [ ] `slides.work.projects[1].stack[0]` — stack
- [ ] `slides.work.projects[1].links[0].href` — repo or demo URL
- [ ] `slides.work.projects[2].year` — year
- [ ] `slides.work.projects[2].tagline` — one line on what AdPulse does.
- [ ] `slides.work.projects[2].summary` — two or three sentences: the problem, what you built, what you learned.
- [ ] `slides.work.projects[2].role` — your role.
- [ ] `slides.work.projects[2].stack[0]` — stack
- [ ] `slides.work.projects[2].links[0].href` — repo or demo URL
- [ ] `slides.toolkit.todo` — move each skill to the level you would defend in an interview. Groups are a first draft from the old site's skill list.
- [ ] `slides.now.now.items[2].text` — anything else you're building right now.
- [ ] `slides.now.next.todo` — confirm exact wording, team name and location if you want them shown.
- [ ] `slides.contact.links[3].href` — resume URL (or drop a PDF at public/resume.pdf and use /resume.pdf)

## Outside site.json

- [ ] Resume: drop a PDF at `public/resume.pdf` and set `slides.contact.links[3].href`
      to `/resume.pdf` (listed above).
- [ ] Replace the generated demo music with your own tracks, or keep it (see `MUSIC.md`).
      Remember audio in a public repo can be downloaded by anyone.
- [ ] Decide whether the hackathon "field log" on the About cell stays. It comes from
      the old site; keep only what you can talk about in an interview.
- [ ] Confirm `officialvanshdixit@gmail.com` should be public on the site.
- [ ] LeetCode: the old site used both `vanshdixit` and `VanshDixit`. Add it to
      `slides.contact.links` if you want it shown, with the right handle.
- [ ] Decide what to do with the old Vercel project and the old Supabase/Firebase
      projects (see `DEPLOY.md`, step 2). They are not used by this site.
- [ ] Custom domain (optional, later): follow `DEPLOY.md` step 6, then update `meta.url`.
- [ ] After changing your name or one-liner: regenerate the share image with
      `node scripts/make-og.cjs`.

## Done

- [x] `old-site` backup branch created on GitHub.
