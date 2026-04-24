-- Run this in the Supabase SQL editor before testing persistence.
-- Table used by the EaaS Fit Check MVP.

create extension if not exists pgcrypto;

create table if not exists public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  respondent_role text null,
  target_industry text null,
  asset_category text null,
  company_size text null,
  source text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  answers_json jsonb not null,
  total_fit_score integer not null,
  recommended_stage text not null,
  dominant_value_driver text null,
  strengths_json jsonb not null default '[]'::jsonb,
  blockers_json jsonb not null default '[]'::jsonb,
  interpretation text null,
  next_step text null,
  avoid_for_now text null,
  email text null
);

create index if not exists assessment_responses_created_at_idx
  on public.assessment_responses (created_at desc);

create index if not exists assessment_responses_recommended_stage_idx
  on public.assessment_responses (recommended_stage);

create index if not exists assessment_responses_target_industry_idx
  on public.assessment_responses (target_industry);

create index if not exists assessment_responses_email_idx
  on public.assessment_responses (email)
  where email is not null;

alter table public.assessment_responses enable row level security;

-- Recommended production path:
-- 1. Add SUPABASE_SERVICE_ROLE_KEY to your server environment.
-- 2. Keep this table locked down and let the Next.js API routes write/read via the server.
--
-- If you do that, you do not need public RLS policies here because the service role bypasses RLS.
--
-- If you insist on running without a service role key, you will need explicit anon policies.
-- Example policies are below. Uncomment only if you understand the tradeoff: they allow public access.

-- create policy "anon can insert assessment responses"
--   on public.assessment_responses
--   for insert
--   to anon
--   with check (true);
--
-- create policy "anon can update assessment emails"
--   on public.assessment_responses
--   for update
--   to anon
--   using (true)
--   with check (true);
--
-- create policy "anon can read assessment responses"
--   on public.assessment_responses
--   for select
--   to anon
--   using (true);
