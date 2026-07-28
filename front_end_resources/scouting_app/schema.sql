-- schema.sql -- run this once in your Supabase project's SQL Editor
-- (Project -> SQL Editor -> New query -> paste -> Run). Not applied
-- automatically by anything in this app; see 02_data_beyond_the_
-- spreadsheet/concept.md for the full walkthrough.

create table entries (
  id uuid primary key default gen_random_uuid(),
  team_number integer not null,
  match_number integer not null,
  alliance text not null check (alliance in ('red', 'blue')),
  scouter_name text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

-- Row Level Security is on by default for new Supabase tables and blocks
-- every query until a policy explicitly allows one. This app has no
-- login system (that's out of scope for this primer), so the policy
-- below allows anyone with your anon key -- which is meant to be public,
-- unlike a service-role key -- to read and write. Fine for a team tool
-- behind an unlisted URL; not what you'd ship for a product with real
-- user accounts and private data.
alter table entries enable row level security;

create policy "Allow anonymous read" on entries
  for select using (true);

create policy "Allow anonymous insert" on entries
  for insert with check (true);
