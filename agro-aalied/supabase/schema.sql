-- ===========================================================================
-- Ameer Farms & Agro Allied Enterprises — Supabase schema
-- Paste this whole file into the Supabase SQL Editor and run it once.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric(12,2) not null default 0,
  unit        text not null default 'unit',       -- paint, kg, crate, tuber...
  category    text,
  image_url   text,
  in_stock    boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text unique not null,
  customer_name      text not null,
  phone              text not null,
  total              numeric(12,2) not null default 0,
  status             text not null default 'pending'
                     check (status in ('pending','paid','almost_ready','ready','completed')),
  payment_reference  text,
  receipt_url        text,
  shopping_list_url  text,
  note               text,
  created_at         timestamptz not null default now()
);

create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  product_name  text not null,
  unit          text not null default 'unit',
  unit_price    numeric(12,2) not null default 0,
  quantity      integer not null default 1
);

create table if not exists configs (
  key   text primary key,
  value  text not null,
  type  text not null default 'string' check (type in ('string','number','boolean'))
);

create index if not exists orders_phone_idx      on orders (phone);
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists order_items_order_idx on order_items (order_id);

-- ---------------------------------------------------------------------------
-- 2. Row level security
--    Customers are anonymous: they may read the shelf and create orders.
--    Staff sign in with Supabase Auth and get full access.
-- ---------------------------------------------------------------------------

alter table products    enable row level security;
alter table order_items enable row level security;

-- Products: anyone can read, only signed-in staff can change.
create policy "anyone reads products"
  on products for select using (true);

create policy "staff manage products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "staff manages configs"
  on configs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Orders: anyone can place one; only staff can read or update them.
create policy "anyone places an order"
  on orders for insert with check (true);

create policy "staff read orders"
  on orders for select using (auth.role() = 'authenticated');

create policy "staff update orders"
  on orders for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "staff delete orders"
  on orders for delete using (auth.role() = 'authenticated');

-- Order items: same shape as orders.
create policy "anyone adds order items"
  on order_items for insert with check (true);

create policy "staff read order items"
  on order_items for select using (auth.role() = 'authenticated');

create policy "staff manage order items"
  on order_items for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 3. Public order lookup
--    Customers track an order by number without being able to list every
--    order in the table. Returns status and total only.
-- ---------------------------------------------------------------------------

create or replace function get_order_status(p_order_number text)
returns table (
  order_number text,
  status       text,
  total        numeric,
  created_at   timestamptz
)
language sql
security definer
set search_path = public
as $$
  select o.order_number, o.status, o.total, o.created_at
  from orders o
  where upper(o.order_number) = upper(p_order_number)
  limit 1;
$$;

grant execute on function get_order_status(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Storage buckets
--    'uploads'        — receipts and shopping list photos
--    'product-images' — shelf photos
--    Both are public-read so staff and customers can view images by URL.
--    Tighten to signed URLs before handling anything sensitive.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true), ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "anyone uploads receipts and lists"
  on storage.objects for insert
  with check (bucket_id in ('uploads', 'product-images'));

create policy "anyone views shop images"
  on storage.objects for select
  using (bucket_id in ('uploads', 'product-images'));

create policy "staff delete shop images"
  on storage.objects for delete
  using (bucket_id in ('uploads', 'product-images') and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 5. Starter shelf. Prices are placeholders — edit them in the admin dashboard.
-- ---------------------------------------------------------------------------

insert into products (name, price, unit, category) values
  ('Rice (long grain)',   2500, 'paint',  'Grains'),
  ('Beans (oloyin)',      2800, 'paint',  'Grains'),
  ('Garri (ijebu)',       1200, 'paint',  'Grains'),
  ('Yam tuber',           4000, 'tuber',  'Tubers'),
  ('Irish potato',        2000, 'kg',     'Tubers'),
  ('Sweet potato',        1500, 'kg',     'Tubers'),
  ('Eggs',                6500, 'crate',  'Protein'),
  ('Tomatoes',            1500, 'basket', 'Vegetables'),
  ('Pepper (rodo)',       1200, 'basket', 'Vegetables'),
  ('Onion',               1000, 'kg',     'Vegetables'),
  ('Vegetable oil',       3200, 'litre',  'Oils'),
  ('Palm oil',            2800, 'litre',  'Oils'),
  ('Bread (family loaf)',  1200, 'loaf',   'Bakery'),
  ('Frozen fish (titus)',  3500, 'kg',     'Protein'),
  ('Chicken',             4500, 'kg',     'Protein'),
  ('Turkey',              6000, 'kg',     'Protein')
on conflict do nothing;

insert into configs (key, value) values
  ('company_name', 'Ameer Farms & Agro Allied Enterprises'),
  ('company_address', 'Shop 18, Jaja Shopping Complex, University of Lagos (UNILAG)'),
  ('company_phone', '2348058077502'),
  ('company_email', 'ameerfarm16@gmail.com'),
  ("open", 'true', "boolean")
on conflict do nothing