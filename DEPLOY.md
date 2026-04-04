# Deploying ShieldRide

Monorepo layout: `apps/web`, `apps/admin`, `services/api`, `packages/shared`.

## Prerequisites

- **PostgreSQL** reachable from the internet (e.g. [Neon](https://neon.tech), Supabase, RDS). Serverless hosts do not run Docker Postgres.
- Set **`DATABASE_URL`** on the API project. For Neon + Prisma serverless, use their pooled connection string and add `?pgbouncer=true` if required by your provider.
- Run migrations from CI or your machine:  
  `cd services/api && npx prisma migrate deploy`

## Vercel (recommended)

Use **three** Vercel projects from the same Git repo.

### 1) API (monorepo **root**)

The serverless entry is **`api/index.ts`** at the repo root (exports the Express `app` directly — Vercel’s supported pattern). Do **not** set Root Directory to `services/api` for CLI uploads; the build needs the full monorepo for `npm ci` and workspaces.

**CLI (from repository root):**

```bash
npx vercel deploy --prod --yes --local-config vercel.api.json
```

Unset `VERCEL_PROJECT_ID` / `VERCEL_ORG_ID` in your shell before this command if you deployed other apps in the same session.

**Git:** connect the repo with **Root Directory = `.` (empty / repository root)** and use the same install/build commands as in `vercel.api.json`, or rely on the linked `vercel.api.json` when Vercel detects it at the root.

Environment variables (API project):

- `DATABASE_URL` (required for DB routes; use Neon/Supabase pooled URL for serverless)
- `JWT_SECRET` (required for OTP verify)
- `OPENWEATHER_API_KEY` (optional but recommended) — live rainfall, heat (feels-like), and AQI from [OpenWeather](https://openweathermap.org/api) Current Weather + Air Pollution; without it the API uses the latest DB seed row, then mock drift
- `ANTHROPIC_API_KEY` (optional, admin AI)
- `CORS_ORIGIN` (optional) — comma-separated origins, e.g. your web + admin Vercel URLs

### 2) Worker PWA (`apps/web` project)

**CLI from repo root** (after linking `apps/web` once with `cd apps/web && vercel link`):

```bash
export VERCEL_ORG_ID=...   # from apps/web/.vercel/project.json
export VERCEL_PROJECT_ID=... 
npx vercel deploy --prod --yes --local-config vercel.web.json --build-env VITE_API_URL=https://YOUR-API.vercel.app
```

**Git:** Root Directory = `apps/web`, install/build must run from monorepo root (see `apps/web/vercel.json`).

### 3) Admin (`apps/admin` project)

Same pattern as web, using `vercel.admin.json` and the admin project’s `VERCEL_PROJECT_ID`.

After the first deploy, set **`CORS_ORIGIN`** on the API to include both frontend production URLs.

## Netlify (static frontends only)

The API is an Express app; run it on **Vercel** (or Railway/Render/Fly) — not as a plain Netlify static site.

For **web** and **admin**:

1. Create two Netlify sites.
2. Set **Base directory** to `apps/web` or `apps/admin`.
3. Use the included `netlify.toml` in each app folder (build runs from repo root via `cd ../..`).

Set **`VITE_API_URL`** in Netlify → Site settings → Environment variables (build-time).

## Local production-like checks

```bash
npm run build:shared
npm run build:web
npm run build:admin
npm run build:api
```

## Notes

- **Redis / Kafka**: not wired in code paths yet; add when you enable caching and events.
- **Razorpay**: keep test keys until you go live; payouts stay sandbox until you switch keys and complete compliance.
