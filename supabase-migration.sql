-- ============================================================
-- Čau Bratislava — Migration v2
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add new columns to listings
alter table public.listings
  add column if not exists user_id       uuid references auth.users(id),
  add column if not exists is_bundle     boolean not null default false,
  add column if not exists bundle_items  jsonb   not null default '[]',
  add column if not exists pickup_lat    double precision,
  add column if not exists pickup_lng    double precision,
  add column if not exists pickup_address text;

-- 2. Favorites table
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  unique (user_id, listing_id)
);

alter table public.favorites enable row level security;

create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- 3. Listing owner policies
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'listings' and policyname = 'Owners can update their listings') then
    create policy "Owners can update their listings"
      on public.listings for update
      using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'listings' and policyname = 'Owners can delete their listings') then
    create policy "Owners can delete their listings"
      on public.listings for delete
      using (auth.uid() = user_id);
  end if;
end $$;

-- 4. Conversations table (real-time chat)
create table if not exists public.conversations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  buyer_email text not null,
  buyer_name  text not null default '',
  unique (listing_id, buyer_email)
);

alter table public.conversations enable row level security;

create policy "Anyone can view conversations"
  on public.conversations for select using (true);

create policy "Anyone can create a conversation"
  on public.conversations for insert with check (true);

-- 5. Chat messages table
create table if not exists public.chat_messages (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  sender_email     text not null,
  sender_name      text not null default '',
  content          text not null
);

alter table public.chat_messages enable row level security;

create policy "Anyone can view chat messages"
  on public.chat_messages for select using (true);

create policy "Anyone can send a chat message"
  on public.chat_messages for insert with check (true);

-- 6. Enable Realtime on chat_messages
alter publication supabase_realtime add table public.chat_messages;

-- 7. Supabase Storage bucket (run separately if needed)
-- insert into storage.buckets (id, name, public)
-- values ('listing-images', 'listing-images', true)
-- on conflict (id) do nothing;
--
-- create policy "Anyone can upload listing images"
--   on storage.objects for insert
--   with check (bucket_id = 'listing-images');
--
-- create policy "Anyone can view listing images"
--   on storage.objects for select
--   using (bucket_id = 'listing-images');

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists listings_user_idx         on public.listings(user_id);
create index if not exists favorites_user_idx        on public.favorites(user_id);
create index if not exists favorites_listing_idx     on public.favorites(listing_id);
create index if not exists conversations_listing_idx on public.conversations(listing_id);
create index if not exists chat_messages_conv_idx    on public.chat_messages(conversation_id);
