create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null default '',
  title text not null,
  image_url text not null,
  mobile_image_url text,
  link_url text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hero_slides_active_order_idx
  on public.hero_slides (is_active, sort_order, created_at);

alter table public.hero_slides enable row level security;

drop policy if exists "Public can read active hero slides" on public.hero_slides;
create policy "Public can read active hero slides"
  on public.hero_slides for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Authenticated users can manage hero slides" on public.hero_slides;
create policy "Authenticated users can manage hero slides"
  on public.hero_slides for all
  to authenticated
  using (true)
  with check (true);

insert into public.hero_slides (eyebrow, title, image_url, link_url, sort_order, is_active)
select * from (values
  ('FOR COFFEE SELECTION', 'Kavrulmuş kahvenin en zarif hali.', '/images/slider-coffee-1.png', '', 0, true),
  ('ORIGIN STORIES', 'Her fincanda başka bir coğrafya.', '/images/slider-coffee-2.png', '', 1, true),
  ('BREWING MOMENTS', 'Ritüelinize iyi eşlik eden kahve.', '/images/slider-coffee-3.png', '', 2, true)
) as seed(eyebrow, title, image_url, link_url, sort_order, is_active)
where not exists (select 1 from public.hero_slides);

insert into storage.buckets (id, name, public)
values ('hero-slides', 'hero-slides', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view hero slide images" on storage.objects;
create policy "Public can view hero slide images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'hero-slides');

drop policy if exists "Authenticated users can upload hero slide images" on storage.objects;
create policy "Authenticated users can upload hero slide images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'hero-slides');

drop policy if exists "Authenticated users can update hero slide images" on storage.objects;
create policy "Authenticated users can update hero slide images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'hero-slides')
  with check (bucket_id = 'hero-slides');

drop policy if exists "Authenticated users can delete hero slide images" on storage.objects;
create policy "Authenticated users can delete hero slide images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'hero-slides');
