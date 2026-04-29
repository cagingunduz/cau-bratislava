-- ============================================================
-- Čau Bratislava — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- LISTINGS TABLE
create table if not exists public.listings (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  title         text not null,
  description   text not null,
  price         numeric(8,2) not null check (price >= 0),
  category      text not null check (category in ('furniture','kitchen','electronics','bedding','books','clothes','other')),
  condition     text not null check (condition in ('like_new','good','fair')),
  image_url     text,
  seller_name   text not null,
  seller_email  text not null,
  seller_country text not null default '',
  university    text not null default '',
  leaving_date  date,
  is_urgent     boolean not null default false,
  is_sold       boolean not null default false
);

-- MESSAGES TABLE
create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  listing_id    uuid not null references public.listings(id) on delete cascade,
  sender_name   text not null,
  sender_email  text not null,
  message       text not null
);

-- INDEXES
create index if not exists listings_category_idx on public.listings(category);
create index if not exists listings_price_idx    on public.listings(price);
create index if not exists listings_sold_idx     on public.listings(is_sold);
create index if not exists messages_listing_idx  on public.messages(listing_id);

-- ROW LEVEL SECURITY
alter table public.listings enable row level security;
alter table public.messages  enable row level security;

-- POLICIES — anyone can read listings
create policy "Anyone can view listings"
  on public.listings for select
  using (true);

-- Anyone can insert a listing
create policy "Anyone can create a listing"
  on public.listings for insert
  with check (true);

-- Anyone can send a message
create policy "Anyone can send a message"
  on public.messages for insert
  with check (true);

-- ============================================================
-- SEED DATA — sample listings (optional, delete if not needed)
-- ============================================================
insert into public.listings
  (title, description, price, category, condition, image_url, seller_name, seller_email, seller_country, university, is_urgent)
values
  ('IKEA FLINTAN Office Chair',    'Used 1 semester. Adjustable height, no wheels damaged. Original price €149.',         40,  'furniture',   'good',     'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&q=80&fit=crop', 'Marta',  'marta@example.com',  '🇵🇱', 'Comenius University', true),
  ('IKEA KALLAX 2×4 Shelf Unit',   'White, very good condition. Includes all original fittings.',                          25,  'furniture',   'like_new',  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80&fit=crop', 'Jan',    'jan@example.com',    '🇩🇪', 'STU Bratislava',     false),
  ('Pots, Pans & Utensils Set',    '2 pots, 1 pan, spatulas, ladle. Bought at Tesco.',                                    12,  'kitchen',     'good',     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80&fit=crop', 'Sofia',  'sofia@example.com',  '🇪🇸', 'UK Bratislava',      false),
  ('IKEA HEKTAR Floor Lamp',       'Dark grey, dimmable. Works perfectly. Bulb included.',                                  35,  'electronics', 'like_new',  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80&fit=crop', 'Lukas', 'lukas@example.com',  '🇫🇷', 'EUBA',               true),
  ('Single Duvet + 2 Pillow Covers','Clean, freshly washed. IKEA MYSA duvet 150×200cm.',                                  20,  'bedding',     'good',     'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80&fit=crop', 'Ana',   'ana@example.com',    '🇵🇹', 'Comenius University',false),
  ('Samsung 24" Monitor',          'FHD 1080p, 60Hz, HDMI + VGA. All cables included.',                                   55,  'electronics', 'like_new',  'https://images.unsplash.com/photo-1527443224154-c4a573d667e2?w=500&q=80&fit=crop', 'Karim', 'karim@example.com',  '🇲🇦', 'STU Bratislava',     false),
  ('Economics Textbooks ×4',       'Macro/Micro Economics, Financial Accounting, Statistics.',                              5,  'books',       'good',     'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80&fit=crop', 'Emma',  'emma@example.com',   '🇸🇪', 'EUBA',               false),
  ('Bialetti Moka Pot + Cups',     '4-cup stovetop espresso maker + 2 ceramic cups.',                                      8,  'kitchen',     'like_new',  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80&fit=crop', 'Giulia','giulia@example.com', '🇮🇹', 'UK Bratislava',      true),
  ('Winter Coat — Women M',        'Warm parka, size M. Too big for my suitcase.',                                         15,  'clothes',     'like_new',  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&q=80&fit=crop', 'Ines',  'ines@example.com',   '🇧🇷', 'FIIT STU',           false),
  ('IKEA LACK Table + Plant',      'White side table + healthy pothos plant.',                                             15,  'other',       'like_new',  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80&fit=crop', 'Nadia', 'nadia@example.com',  '🇺🇦', 'Comenius University',false),
  ('Power Strip + EU Adapters ×3', '5-socket power strip + 3 universal travel adapters.',                                  18,  'electronics', 'good',     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&fit=crop', 'Tomás', 'tomas@example.com',  '🇨🇿', 'STU Bratislava',     false),
  ('IKEA NISSEDAL Mirror',         'Black frame, 65×150cm. Perfect condition. Pickup near Ružinov.',                      30,  'furniture',   'like_new',  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80&fit=crop', 'Hana',  'hana@example.com',   '🇨🇿', 'UK Bratislava',      false);
