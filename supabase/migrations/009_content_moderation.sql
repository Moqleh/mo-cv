-- Content moderation audit trail used by the authenticated cv-moderate Edge Function.
-- Raw resume text is never stored here; only a SHA-256 content hash and categories.
create table if not exists public.content_moderation_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  severity text not null check (severity in ('standard','severe')),
  categories text[] not null default '{}',
  action text not null check (action in ('blocked','suspended')),
  content_hash text not null
);
alter table public.content_moderation_events enable row level security;
revoke all on table public.content_moderation_events from anon, authenticated;
revoke all on sequence public.content_moderation_events_id_seq from anon, authenticated;
create index if not exists content_moderation_events_user_created_idx on public.content_moderation_events(user_id,created_at desc);
