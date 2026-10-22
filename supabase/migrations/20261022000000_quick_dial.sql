-- Quick Dial: real-time "now playing" presence.
--
-- Security model
--   * Only quick_dial_public is readable by anonymous visitors (RLS select policy).
--   * Nobody but the service role (used only inside the quick-dial Edge Function) can write
--     anything. There are no insert/update/delete policies at all, and table privileges are
--     revoked from anon/authenticated as a second layer.
--   * Device credentials live in quick_dial_devices as SHA-256 hashes only.
--   * No listening history: quick_dial_sources holds one current row per device and is
--     overwritten in place. A future history feature would be a separate, opt-in table.

create table public.quick_dial_settings (
  owner_id text primary key check (owner_id ~ '^[a-z0-9_-]{1,40}$'),
  sharing_enabled boolean not null default false,
  show_source boolean not null default false,
  policy text not null default 'recent' check (policy in ('recent', 'priority')),
  priority text[] not null default array['browser_extension', 'android_companion']
    check (priority <@ array['browser_extension', 'android_companion']),
  updated_at timestamptz not null default now()
);

create table public.quick_dial_devices (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null references public.quick_dial_settings (owner_id) on delete cascade,
  label text not null check (char_length(label) between 1 and 60),
  source_type text not null check (source_type in ('browser_extension', 'android_companion')),
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_seen_at timestamptz,
  rate_window_start timestamptz,
  rate_window_count integer not null default 0
);

create table public.quick_dial_sources (
  device_id uuid primary key references public.quick_dial_devices (id) on delete cascade,
  owner_id text not null references public.quick_dial_settings (owner_id) on delete cascade,
  source_type text not null check (source_type in ('browser_extension', 'android_companion')),
  session_id text check (char_length(session_id) <= 64),
  last_seq bigint not null default -1,
  title text check (char_length(title) <= 300),
  artist text check (char_length(artist) <= 300),
  album text check (char_length(album) <= 300),
  artwork_url text check (char_length(artwork_url) <= 1000),
  song_url text check (char_length(song_url) <= 1000),
  is_playing boolean not null default false,
  duration_ms integer check (duration_ms between 0 and 86400000),
  progress_ms integer check (progress_ms between 0 and 86400000),
  observed_at timestamptz,  -- device clock, informational only
  received_at timestamptz,  -- server clock
  active_since timestamptz,
  paused_since timestamptz,
  stopped boolean not null default true
);

-- The canonical, public projection: exactly one row per owner, minimal fields.
create table public.quick_dial_public (
  owner_id text primary key references public.quick_dial_settings (owner_id) on delete cascade,
  state text not null default 'hidden' check (state in ('live', 'paused', 'idle', 'hidden')),
  title text check (char_length(title) <= 300),
  artist text check (char_length(artist) <= 300),
  album text check (char_length(album) <= 300),
  artwork_url text check (artwork_url is null or artwork_url ~ '^https://'),
  song_url text check (song_url is null or song_url ~ '^https://music\.youtube\.com/watch\?v=[A-Za-z0-9_-]{11}$'),
  duration_ms integer check (duration_ms between 0 and 86400000),
  progress_ms integer check (progress_ms between 0 and 86400000),
  progress_at timestamptz,
  source_type text check (source_type in ('browser_extension', 'android_companion')),
  last_seen_at timestamptz,
  stale_after timestamptz,
  updated_at timestamptz not null default now(),
  version bigint not null default 0
);

alter table public.quick_dial_settings enable row level security;
alter table public.quick_dial_devices enable row level security;
alter table public.quick_dial_sources enable row level security;
alter table public.quick_dial_public enable row level security;

-- Second layer: no table privileges at all for API roles on private tables, read-only on public.
revoke all on public.quick_dial_settings, public.quick_dial_devices, public.quick_dial_sources from anon, authenticated;
revoke all on public.quick_dial_public from anon, authenticated;
grant select on public.quick_dial_public to anon, authenticated;

create policy "Public status is readable by everyone"
  on public.quick_dial_public for select
  to anon, authenticated
  using (true);

-- Public read method: the status plus the database clock, so the widget judges freshness
-- against server time instead of trusting the visitor's clock.
create or replace function public.quick_dial_status(p_owner_id text)
returns table (
  owner_id text, state text, title text, artist text, album text, artwork_url text, song_url text,
  duration_ms integer, progress_ms integer, progress_at timestamptz, source_type text,
  last_seen_at timestamptz, stale_after timestamptz, updated_at timestamptz, server_now timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select p.owner_id, p.state, p.title, p.artist, p.album, p.artwork_url, p.song_url,
         p.duration_ms, p.progress_ms, p.progress_at, p.source_type,
         p.last_seen_at, p.stale_after, p.updated_at, now()
  from public.quick_dial_public p
  where p.owner_id = p_owner_id
$$;

revoke all on function public.quick_dial_status(text) from public;
grant execute on function public.quick_dial_status(text) to anon, authenticated;

-- Realtime: only the public projection is broadcast, and Realtime applies the RLS policy above.
alter publication supabase_realtime add table public.quick_dial_public;

-- Private by default: sharing starts disabled and the public row starts hidden.
insert into public.quick_dial_settings (owner_id) values ('owner');
insert into public.quick_dial_public (owner_id, state) values ('owner', 'hidden');
