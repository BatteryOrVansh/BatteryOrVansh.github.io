# CONTENT_TODO

Everything Vansh still needs to fill in or confirm. The site builds and runs
with these placeholders; TODO strings render as small ember "pending" marks so
nothing ships unnoticed.

How to edit: open `content/site.json`, find the path below, replace the
`TODO(Vansh): ...` string with real text, run `npm run todos` to see what is
left, then regenerate this list (see the bottom of this file).

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

- [ ] Create the `old-site` branch on GitHub from the old main (commit f3ce870) as a backup.
      `git tag old-site-v1 f3ce870 && git push origin old-site-v1`
- [ ] Decide whether the hackathon "field log" on the About cell stays (it is
      from the old site; keep only what you can talk about).
- [ ] Confirm the email `officialvanshdixit@gmail.com` should be public on the site.
- [ ] LeetCode: the old site used both `vanshdixit` and `VanshDixit`. Add it to
      `slides.contact.links` if you want it shown, with the right handle.
- [ ] Replace the demo music with your own tracks (see `MUSIC.md`).
- [ ] Optional: `public/resume.pdf`.

## Regenerating this list

`node scripts/list-todos.mjs --md` prints the site.json section above.
