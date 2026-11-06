-- IMPORTANT: Replace REPLACE_WITH_OWNERS_UUID with the cookbook owner's UUID
-- from Supabase > Authentication > Users. Use the SAME UUID in config.js.
-- Run only in the RECIPIENT'S OWN NEW Supabase project.
create table if not exists public.recipes (
 id text primary key, user_id uuid not null,
 title text not null, category text, time text, servings text,
 description text, ingredients jsonb not null default '[]',
 method jsonb not null default '[]', notes text, image text,
 created_at timestamptz not null default now()
);
create table if not exists public.cookbook_settings (
 id text primary key, user_id uuid not null, settings jsonb not null default '{}'
);
alter table public.recipes enable row level security;
alter table public.cookbook_settings enable row level security;

drop policy if exists "Public read recipes" on public.recipes;
drop policy if exists "Owner insert recipes" on public.recipes;
drop policy if exists "Owner update recipes" on public.recipes;
drop policy if exists "Owner delete recipes" on public.recipes;
create policy "Public read recipes" on public.recipes for select to anon,authenticated using(true);
create policy "Owner insert recipes" on public.recipes for insert to authenticated with check (auth.uid()='REPLACE_WITH_OWNERS_UUID'::uuid and user_id=auth.uid());
create policy "Owner update recipes" on public.recipes for update to authenticated using(auth.uid()='REPLACE_WITH_OWNERS_UUID'::uuid and user_id=auth.uid()) with check(auth.uid()='REPLACE_WITH_OWNERS_UUID'::uuid and user_id=auth.uid());
create policy "Owner delete recipes" on public.recipes for delete to authenticated using(auth.uid()='REPLACE_WITH_OWNERS_UUID'::uuid and user_id=auth.uid());

drop policy if exists "Public read settings" on public.cookbook_settings;
drop policy if exists "Owner insert settings" on public.cookbook_settings;
drop policy if exists "Owner update settings" on public.cookbook_settings;
create policy "Public read settings" on public.cookbook_settings for select to anon,authenticated using(true);
create policy "Owner insert settings" on public.cookbook_settings for insert to authenticated with check(auth.uid()='REPLACE_WITH_OWNERS_UUID'::uuid and user_id=auth.uid());
create policy "Owner update settings" on public.cookbook_settings for update to authenticated using(auth.uid()='REPLACE_WITH_OWNERS_UUID'::uuid and user_id=auth.uid()) with check(auth.uid()='REPLACE_WITH_OWNERS_UUID'::uuid and user_id=auth.uid());

grant select on public.recipes,public.cookbook_settings to anon,authenticated;
grant insert,update,delete on public.recipes to authenticated;
grant insert,update on public.cookbook_settings to authenticated;
revoke insert,update,delete on public.recipes,public.cookbook_settings from anon;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('recipe-images','recipe-images',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true;
drop policy if exists "Owner uploads photos" on storage.objects;
create policy "Owner uploads photos" on storage.objects for insert to authenticated
with check(bucket_id='recipe-images' and auth.uid()='REPLACE_WITH_OWNERS_UUID'::uuid and (storage.foldername(name))[1]=auth.uid()::text);
