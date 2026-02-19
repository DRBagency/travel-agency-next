-- Add profile_photo column to clientes (separate from logo_url which is the agency logo)
alter table clientes add column if not exists profile_photo text;

-- Create storage bucket for public assets (avatars, uploads)
insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

-- Allow public read access to the bucket
create policy "Public read access on public-assets"
  on storage.objects for select
  using (bucket_id = 'public-assets');

-- Allow service role to insert/update/delete
create policy "Service role full access on public-assets"
  on storage.objects for all
  using (bucket_id = 'public-assets')
  with check (bucket_id = 'public-assets');
