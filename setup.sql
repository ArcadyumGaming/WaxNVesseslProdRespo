-- Wax n Vessels: paste this whole file into Supabase > SQL Editor > Run. Once.

create sequence if not exists product_seq start 1;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null default ('WNV-' || lpad(nextval('product_seq')::text, 4, '0')),
  name text not null,
  category text not null default 'Candles',
  price numeric not null default 0,
  sale_price numeric,
  description text default '',
  images text[] not null default '{}',
  in_stock boolean not null default true,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id int primary key check (id = 1),
  brand_name text default 'Wax n Vessels',
  whatsapp text default '923295423551',
  logo_url text default '',
  hero_url text default '',
  hero_title text default 'Thoughtful Gifts, Beautifully Made.',
  hero_text text default 'Handcrafted candles, meaningful frames, and curated gift boxes for the moments that matter.',
  about_text text default 'Wax n Vessels is a small Pakistani brand making handmade candles, frames and gift boxes. Every piece is made to be given. Want something personal? Tell us on WhatsApp.',
  instagram text default '',
  facebook text default '',
  tiktok text default ''
);
insert into settings (id) values (1) on conflict do nothing;

-- Everyone can read the shop. Any signed-in user (your admin account) can change things.
alter table products enable row level security;
alter table settings enable row level security;
create policy "read products" on products for select using (published or auth.uid() is not null);
create policy "edit products" on products for all to authenticated using (true) with check (true);
create policy "read settings" on settings for select using (true);
create policy "edit settings" on settings for all to authenticated using (true) with check (true);

-- Image storage (public bucket "site")
insert into storage.buckets (id, name, public) values ('site', 'site', true) on conflict (id) do nothing;
create policy "upload images" on storage.objects for insert to authenticated with check (bucket_id = 'site');
create policy "replace images" on storage.objects for update to authenticated using (bucket_id = 'site');
create policy "delete images" on storage.objects for delete to authenticated using (bucket_id = 'site');

-- Live updates on the website
alter publication supabase_realtime add table products, settings;
