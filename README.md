# Vansh Dixit — Portfolio

Personal portfolio for Vansh Dixit (Co-Founder & Tech Lead, WaterPlane), built with Next.js 14 (App Router, TypeScript), Tailwind CSS, Supabase, and Firebase Auth. Design language: black base, single red accent, organic curved shapes, scroll-linked motion — modeled on Google product marketing sites (Veo, Android, Antigravity).

## Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS v4
- **Hosting**: Vercel
- **Database**: Supabase (Postgres) — `projects`, `bio_content`, `site_settings` tables, public read via RLS, writes only via the service role from server-side admin routes
- **Storage**: Supabase Storage — `photos` and `music` buckets (public read)
- **Auth**: Firebase Authentication (Google provider only), gating `/admin`. Firebase ID tokens are verified server-side against a two-email allowlist before any write is permitted.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values described below
npm run dev
```

## Environment variables

See `.env.example` for the full list. Summary:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API (anon/publishable key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API (service_role key — **server-only, never commit, never expose to the client**) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` / `AUTH_DOMAIN` / `PROJECT_ID` / `APP_ID` | Firebase console → Project Settings → General → Your apps (Web app config) |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Firebase console → Project Settings → Service accounts → Generate new private key (downloads a JSON file with these three fields) |

## Supabase setup

The schema (`projects`, `bio_content`, `site_settings`) and the `photos`/`music` storage buckets are already provisioned on the project's Supabase instance, with row-level security enabled: public read on all three tables and both buckets, writes only via the service role key (used exclusively in server-side `/api/admin/*` routes).

To reproduce this schema on a fresh Supabase project:

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text,
  tech text[] not null default '{}',
  description text,
  link text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table bio_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text
);

create table site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text
);

alter table projects enable row level security;
alter table bio_content enable row level security;
alter table site_settings enable row level security;

create policy "public read projects" on projects for select to anon, authenticated using (true);
create policy "public read bio_content" on bio_content for select to anon, authenticated using (true);
create policy "public read site_settings" on site_settings for select to anon, authenticated using (true);

insert into storage.buckets (id, name, public) values ('photos', 'photos', true), ('music', 'music', true);

create policy "public read photos" on storage.objects for select to anon, authenticated using (bucket_id = 'photos');
create policy "public read music" on storage.objects for select to anon, authenticated using (bucket_id = 'music');
```

No insert/update/delete policies are defined on purpose — the service role bypasses RLS entirely, and that key is only ever used server-side in `/api/admin/*` routes after verifying the caller's Firebase ID token against the allowlist.

## Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → **Sign-in method** → enable **Google**.
3. **Project Settings** → **General** → **Your apps** → add a Web app → copy the config values into `NEXT_PUBLIC_FIREBASE_*`.
4. **Project Settings** → **Service accounts** → **Generate new private key** → use the `project_id`, `client_email`, and `private_key` fields for `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`. When pasting `private_key` into a single-line env var, keep the literal `\n` sequences — the app un-escapes them at runtime.
5. The admin allowlist is hardcoded in `src/lib/admin/allowlist.ts` to exactly `officialvanshdixit@gmail.com` and `tech.harshit.tiwari@gmail.com`. Update that file (not an env var) if the allowlist needs to change.

## Deploying to Vercel

```bash
npx vercel login
npx vercel link
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
# ...repeat for every variable in .env.example, or paste them in the Vercel dashboard
npx vercel --prod
```

Or connect the GitHub repo directly in the Vercel dashboard (Import Project → select this repo) and add the same environment variables under Project Settings → Environment Variables. Every push to `main` then deploys automatically.

### Keeping the free Supabase project from auto-pausing

Supabase pauses Free Plan projects after about 7 days with no database activity. `vercel.json` already defines a daily cron job (`0 6 * * *` — the maximum frequency allowed on Vercel's free Hobby plan) hitting `GET /api/cron/keep-alive`, which does a trivial read against `site_settings` — comfortably often enough to never hit the 7-day window. It works automatically once the project is deployed on Vercel (cron jobs are picked up from `vercel.json` on deploy), no extra setup required. Optionally set `CRON_SECRET` (any random string) in both `.env.local` and the Vercel project's environment variables — Vercel then sends it automatically as a Bearer token when invoking the cron, so the endpoint rejects any other caller. If a project does pause anyway (e.g. before the first deploy), resume it manually from the Supabase dashboard — data isn't lost for 90 days after pausing.

## Custom domain (Namecheap, via GitHub Student Developer Pack)

1. In Vercel: Project → Settings → Domains → add your domain.
2. Vercel shows the DNS records to add. For an apex domain (`example.com`), it's typically an `A` record pointing at `76.76.21.21`; for a `www` subdomain, a `CNAME` pointing at `cname.vercel-dns.com`. Use whatever Vercel's dashboard shows at the time — it occasionally changes.
3. In Namecheap: **Domain List** → **Manage** → **Advanced DNS** → add the records Vercel gave you (delete Namecheap's default parking-page records first).
4. DNS propagation can take anywhere from a few minutes to ~24 hours. Vercel's Domains tab shows verification status.

## Project structure

```
src/
  app/
    page.tsx          # Hero
    projects/page.tsx # Projects (reads from Supabase)
    bio/page.tsx       # Bio (90s throwback treatment)
    admin/             # Firebase-gated admin panel
    api/admin/         # Server-side admin write routes (service-role Supabase writes)
  components/
    nav/               # Right vertical nav
    blobs/              # Organic background accents
    audio/               # Persistent background-music toggle
    ui/                    # Shared primitives
  lib/
    supabase/            # Browser client (public reads) + service-role server client
    firebase/            # Client auth + Admin SDK token verification
    admin/                 # Allowlist + request verification for admin routes
  types/                    # Supabase row types
```
