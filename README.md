# JUNIPER VET. — Premium Veterinary Clinic Platform

A complete, full-stack digital product for a modern veterinary clinic:
editorial, animal-first design + an intelligent adaptive booking system.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · PostgreSQL · Drizzle ORM

---

## Features

- **Smart Booking** (`/appointment`) — understands the animal BEFORE scheduling:
  adaptive questionnaire engine (5–10 relevant questions, never more),
  transparent care recommendation (no diagnosis), emergency triage screen,
  live summary panel, 01–06 phase progress.
- **Real availability** — doctor schedules, breaks, blocked slots, service
  durations, past-slot handling. Double-booking prevented in the DB layer:
  advisory-lock transaction + overlap check + partial unique index.
  Booked slots render crossed out.
- **Accounts** — register / login / logout / forgot & reset password,
  httpOnly sessions (scrypt hashing), protected routes.
- **Pet profiles** — multiple pets, medical history, vaccinations,
  documents architecture.
- **Appointments** — list, cancel, upcoming/completed/cancelled states.
- **Reviews** — only after completed visits, dedupe-enforced, approval-gated.
- **Favorites** — saved doctors with heart interaction.
- **Doctors** — editorial profiles with live "next available" chips.
- **Journal** — 6 editorial articles. **Gallery** — filterable masonry + lightbox.
- **SEO** — metadata, OpenGraph, sitemap, robots, JSON-LD structured data.
- **A11y** — keyboard navigation, ARIA roles, reduced-motion support,
  large touch targets.

## Design system

- Colors: cream `#F8F7F2`, deep green `#19372E`, ink `#111512`,
  moss `#587568`, sage `#DCE5DE`, sand `#E9E3D8`
- Typography: **Manrope Variable** (primary sans) + **Instrument Serif** (italic accents)
- Photography: curated real animal photography (Pexels CDN)

---

## Getting started

```bash
npm install
cp .env.example .env   # set DATABASE_URL
npx drizzle-kit push   # create tables
npm run dev
```

The database seeds itself (services, doctors, schedules + demo data) on
first request. Demo account: `demo@juniper.vet` / `juniper-demo`.

## Environment variables

| Variable       | Required | Description                        |
| -------------- | -------- | ---------------------------------- |
| `DATABASE_URL` | yes      | PostgreSQL connection string       |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel (Next.js is auto-detected).
3. Add a PostgreSQL database (Vercel Postgres / Neon / Supabase) and set
   `DATABASE_URL` in Project Settings → Environment Variables.
4. Create tables once: `npx drizzle-kit push` (run locally against the
   production `DATABASE_URL`), or run the same SQL from any SQL console.

## Project layout

```
src/
├── app/            # routes: pages + API (App Router)
├── components/     # booking/, home/, site/, account/, auth/, gallery/, ui/
├── data/           # clinic, doctors, services, questionnaire engine,
│                   # gallery, articles, image map  (single source of truth)
├── db/             # schema.ts (15 tables), index.ts (pg pool)
├── lib/            # auth, availability engine, recommendation engine,
│                   # seed, account queries, date utils
└── types/          # shared view-model types
```

> All clinic names, phone numbers, credentials and reviews are clearly-marked
> **placeholders** — replace them in `src/data/clinic.ts` before going live.
