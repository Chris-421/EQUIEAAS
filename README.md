# EaaS Fit Check (EQUI)

Premium MVP diagnostic web app built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

## App flow

- Landing page (`/`)
- Multi-step assessment (`/fit-check`)
- Analysis transition (`/fit-check/analyzing`)
- Result page with optional email capture (`/fit-check/results`)

## Architecture

- `src/lib/data/fit-check.ts`: typed question bank, stage copy, audience options
- `src/lib/scoring/fit-check.ts`: fit score, recommendation overrides, strengths/blockers logic
- `src/lib/types/fit-check.ts`: core domain types
- `src/lib/storage/fit-check.ts`: client-only session storage adapter
- `src/lib/tracking.ts`: `source` and UTM capture utilities
- `src/lib/persistence.ts`: server-side assessment insert/update/list logic
- `src/lib/supabase.ts`: Supabase client helpers and env handling
- `src/app/api/assessment/route.ts`: save completed assessments
- `src/app/api/assessment/email/route.ts`: update email or fallback-insert full response
- `src/app/admin/responses/page.tsx`: lightweight internal response viewer
- `supabase/schema.sql`: SQL schema for `assessment_responses`
- `src/components/fit-check/*`: flow components and result presentation
- `src/components/ui/*`: reusable shadcn-style primitives

## Supabase Setup

This MVP is wired so the app still shows results even if Supabase is missing or fails. Persistence is additive, not blocking.

### 1. Create a Supabase project

Create a project in Supabase and open:

- `Project Settings -> API`
- `SQL Editor`

### 2. Add environment variables

Copy [.env.example](/mnt/c/Users/chris/Documents/EQUI/.env.example) to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` is safe to expose client-side.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose client-side.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it with `NEXT_PUBLIC_`.
- The app can boot without `SUPABASE_SERVICE_ROLE_KEY`, but the recommended setup is to add it so the Next.js server routes can write/read without public RLS policies.

### 3. Run the SQL schema

Open the Supabase SQL editor and run:

- [supabase/schema.sql](/mnt/c/Users/chris/Documents/EQUI/supabase/schema.sql)

This creates:

- the `assessment_responses` table
- practical indexes
- RLS guidance comments

### 4. Where the keys are used

- [src/lib/supabase.ts](/mnt/c/Users/chris/Documents/EQUI/src/lib/supabase.ts)
- [src/lib/persistence.ts](/mnt/c/Users/chris/Documents/EQUI/src/lib/persistence.ts)
- [src/app/api/assessment/route.ts](/mnt/c/Users/chris/Documents/EQUI/src/app/api/assessment/route.ts)
- [src/app/api/assessment/email/route.ts](/mnt/c/Users/chris/Documents/EQUI/src/app/api/assessment/email/route.ts)

### 5. How persistence works

On assessment completion:

1. The app computes results locally as before.
2. The analyzing screen calls `POST /api/assessment`.
3. The server recalculates the deterministic result and attempts to insert into `assessment_responses`.
4. If persistence fails, the user still reaches the result page.

On email capture:

1. The result page calls `POST /api/assessment/email`.
2. If a saved assessment row already exists, the route updates the `email`.
3. If no row exists yet, the route inserts the full assessment plus `email`.

### 6. How to test if saving works

1. Start the app with `npm run dev`.
2. Complete the fit check.
3. Open your Supabase table editor and confirm a new row exists in `assessment_responses`.
4. Submit the optional email on the result page.
5. Confirm the same row was updated with `email`, or a fallback row was inserted if the first save failed.

### 7. How to access the internal admin page

Open:

- `/admin/responses`

This page shows:

- total responses
- responses with email
- response counts by stage
- filters for stage and target industry
- a raw submission table for internal review

If Supabase is missing or fails, the page shows a non-crashing fallback state.

### 8. Client-side vs server-side exposure

Safe to expose client-side:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do not expose client-side:

- `SUPABASE_SERVICE_ROLE_KEY`

The write/read logic is routed through Next.js server handlers, not direct browser inserts.

## What You Still Need To Do Manually

1. Create the Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Paste your real `NEXT_PUBLIC_SUPABASE_URL`.
4. Paste your real `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Paste your `SUPABASE_SERVICE_ROLE_KEY` if you want the recommended secure setup.
6. Run [supabase/schema.sql](/mnt/c/Users/chris/Documents/EQUI/supabase/schema.sql) in the Supabase SQL editor.
7. Start the app with `npm run dev`.
8. Complete one assessment and verify the row is saved.
9. Open `/admin/responses` and verify the response appears.

## Notes

- The four free-text metadata inputs were removed from the assessment flow. The database columns remain in place so you can add metadata capture back later without changing the schema.
- Because the local runtime in this environment is limited, verify `npm run typecheck` and `npm run build` on your machine after adding your real env values.
