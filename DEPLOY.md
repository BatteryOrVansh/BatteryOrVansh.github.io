# Deploying the site

Plain steps, in order. You can do everything from the GitHub website; the
command-line versions are there if you prefer them.

The redesign lives on the `redesign` branch. The old site is safe on the
`old-site` branch. The live site is served from `main` by GitHub Pages at
https://batteryorvansh.github.io.

---

## 1. Preview the redesign before merging

Pick **one** of these. All three build the branch with `npm run build` and serve
the `dist` folder.

### Option A: on your computer (fastest)

1. Install [Node.js](https://nodejs.org) 20 or newer.
2. In a terminal:

   ```bash
   git clone https://github.com/BatteryOrVansh/BatteryOrVansh.github.io.git
   cd BatteryOrVansh.github.io
   git checkout redesign
   npm install
   npm run build
   npm run preview
   ```

3. Open http://localhost:4173.

### Option B: Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Choose **Import** next to `BatteryOrVansh.github.io`.
3. Leave the settings as they are (`vercel.json` already says: build
   `npm run build`, output `dist`). Click **Deploy**.
4. Vercel gives every branch its own preview link. Open the project, then
   **Deployments**, then the one whose branch says `redesign`.

> If you already have an older Vercel project for this repo (the one at
> `battery-or-vansh-github-io.vercel.app`), it redeploys on every push. That is
> fine for previewing; it will start building the new Vite site. See step 2's
> note about that project before you merge.

### Option C: Netlify or Cloudflare Pages

1. **Netlify:** [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → GitHub → pick the repo → set **Branch to
   deploy** to `redesign`. `netlify.toml` fills in the rest.
2. **Cloudflare Pages:** Workers & Pages → **Create** → **Pages** → connect the
   repo → production branch `redesign`. Build command `npm run build`, output
   directory `dist`, and add the variable `NODE_VERSION` = `22`.
3. Open the link they give you.

### What to check in the preview

- The intro appears on your first visit. Both **Enter with sound** and **Enter
  silent** work, and music starts only after you click.
- Arrow keys, swipe and the charge bar move between cells; `/#work` opens Work.
- Project panels open and close; the music card opens from the top-right button.
- Orange `TODO(Vansh)` marks show what is still unfilled (see `CONTENT_TODO.md`).

---

## 2. Merge `redesign` into `main` (with a merge commit)

> **Before you merge:** `main` is what the world sees. Make sure you have the
> `old-site` branch on GitHub (you do) and have read step 5 so you know how to
> undo this.
>
> **Old Vercel project:** the earlier site also deployed from `main` to Vercel.
> Once you merge, that Vercel project will rebuild `main`. Either leave it (it
> will build the new site too) or open it in Vercel → **Settings** → **Git** and
> disconnect it, or delete the project. The old Supabase and Firebase projects
> from the previous site are not used by this one; you can pause or delete them
> in their own dashboards when you are ready.

1. Open the repository on GitHub → **Pull requests** → **New pull request**.
2. Set **base: `main`** and **compare: `redesign`**. Click **Create pull request**.
3. Wait for the green check (the CI workflow runs lint, build, the JavaScript
   size check and Lighthouse). If it is red, open **Details** to see why.
4. Click the arrow on the green button and choose **Create a merge commit**
   (not "Squash and merge", not "Rebase and merge").
5. Click **Merge pull request**, then **Confirm merge**.

Command-line version:

```bash
git checkout main
git pull
git merge --no-ff redesign
git push origin main
```

---

## 3. Turn on GitHub Pages (once)

1. In the repository, open **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. That is the only setting. The workflow `.github/workflows/deploy.yml` builds
   the site and publishes it every time `main` changes.
4. If the merge already happened before you changed this setting, open the
   **Actions** tab → **Deploy to GitHub Pages** → **Run workflow** → **Run
   workflow** to publish now.

---

## 4. Check the live site

1. Open the **Actions** tab. The newest **Deploy to GitHub Pages** run should
   have a green tick (about a minute).
2. Open https://batteryorvansh.github.io (a hard refresh, Ctrl+Shift+R or
   Cmd+Shift+R, avoids a cached copy).
3. Run the checklist from step 1, plus:
   - https://batteryorvansh.github.io/nope shows the "This cell is flat" 404 page.
   - https://batteryorvansh.github.io/sitemap.xml and `/robots.txt` load.
   - Paste the link into a chat app or the
     [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to
     see the preview image.
4. If the page is blank or old: wait two minutes, hard refresh, and check the
   Actions tab for a red run.

---

## 5. Go back to the old version if you need to

The old site is on the `old-site` branch (a copy of `main` from before the
redesign). The simplest safe undo is to **revert the merge**; it keeps history
intact and needs no force-push.

On GitHub:

1. Open **Pull requests** → **Closed** → the redesign pull request you merged.
2. Click **Revert** near the bottom. GitHub opens a new pull request that
   undoes the merge.
3. **Create pull request**, then **Merge pull request** (merge commit again).

Command line:

```bash
git checkout main
git pull
git log --merges -1           # note the merge commit id at the top
git revert -m 1 <that-id>
git push origin main
```

After the revert, `main` is the old Next.js site again. The old site needed
Vercel (it had a server and database), so it comes back on Vercel, not on
GitHub Pages. The GitHub Pages workflow is removed by the revert, so Pages stops
updating. To bring the redesign back later, revert the revert, or merge
`redesign` again.

You can always look at, or copy files from, the old code on the `old-site`
branch: GitHub → branch dropdown → `old-site`.

---

## 6. Add a custom domain later

1. Buy or pick the domain (for example from Namecheap).
2. In the repository: **Settings** → **Pages** → **Custom domain** → type the
   domain (for example `example.com`) → **Save**.
3. At your domain provider, open the DNS settings and add these records.
   Delete any older `A`, `AAAA` or `CNAME` records for the same name first
   (the old Vercel or parking records).
   - Four `A` records for the bare domain (`@`), each pointing to one of:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` record for `www` pointing to `batteryorvansh.github.io`
4. Back in **Settings** → **Pages**, wait for the green "DNS check successful"
   (minutes to a day), then tick **Enforce HTTPS**.
5. Tell the site its new address so the canonical link, sitemap and share
   preview use it: in `content/site.json`, change `meta.url` to the new address
   (keep the trailing `/`), commit, and let it deploy (step 7).
6. The share image links use `meta.url` too, so no image needs redoing.

---

## 7. Update the content by editing `content/site.json`

Every word on the site is in this one file.

### On GitHub (no tools needed)

1. Open the repository → `content` → `site.json`.
2. Click the pencil icon (**Edit this file**).
3. Find the text you want. Use Ctrl+F (Cmd+F on Mac). Search for `TODO(Vansh)`
   to find everything still waiting for you.
4. Change only the text between the quotes. Keep the quote marks, the commas at
   the ends of lines, and the brackets exactly as they are. A missing quote or
   comma breaks the build.
5. Click **Commit changes**. Choose **Create a new branch** (for example
   `content-update`) and **Propose changes**, then **Create pull request**.
6. Wait for the green check, which also validates the JSON and scans the copy
   for banned words. Then **Merge pull request**.
7. The **Actions** tab publishes it within a couple of minutes.

(Committing straight to `main` also works and publishes the same way, but a pull
request gives you the check before it goes live.)

### On your computer

1. `npm install` (once), then `npm run dev` and open http://localhost:5173.
2. Edit `content/site.json`. The page reloads each time you save.
3. `npm run lint` checks the JSON and the copy. `npm run todos` lists what is
   left to fill in.
4. Commit and push (to a branch, then merge as in step 2).

### Where things are in the file

- `slides.about`, `slides.work`, `slides.toolkit`, `slides.now`,
  `slides.contact`: the text of each cell.
- `slides.work.projects`: one entry per project (name, year, tagline, summary,
  role, stack, links).
- `slides.toolkit.groups`: skills by level. `level` is `3` (full charge), `2`
  (holding charge) or `1` (charging).
- `slides.contact.links`: email, GitHub, LinkedIn, resume. For the resume, put a
  PDF at `public/resume.pdf` and set the link to `/resume.pdf`.
- `meta`: page title, description and address used for search and sharing.
- If you change your name or the one-liner, regenerate the share image:
  `node scripts/make-og.cjs` (needs Playwright; or ask for it to be redone).

### If the build fails

Open the failed run in the **Actions** tab and read the red step. The usual
cause is a missing comma or quote in `site.json`, or one of the banned words
(`passionate`, `leverage`, `seamless`, `elevate`, `cutting-edge`, `crafting`,
`journey`, `tapestry`).
