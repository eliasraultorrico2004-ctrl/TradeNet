-- Private buckets: public URLs must not bypass visibility rules.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values
 ('product-images','product-images',false,5242880,array['image/jpeg','image/png','image/webp']),
 ('avatars','avatars',false,5242880,array['image/jpeg','image/png','image/webp']);

create function tradenet_private.can_manage_product_file(p_path text) returns boolean
language sql stable security definer set search_path = '' as $$
  select tradenet_private.is_confirmed_user()
    and p_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
    and split_part(p_path, '/', 1) = (select auth.uid())::text
    and exists(select 1 from public.products where id::text = split_part(p_path, '/', 2) and seller_id = (select auth.uid()));
$$;
create function tradenet_private.can_read_product_file(p_path text) returns boolean
language sql stable security definer set search_path = '' as $$
  select tradenet_private.can_manage_product_file(p_path) or exists (
    select 1 from public.product_images where storage_path = p_path and tradenet_private.can_read_product(product_id));
$$;
revoke all on function tradenet_private.can_manage_product_file(text), tradenet_private.can_read_product_file(text) from public, anon, authenticated;
grant execute on function tradenet_private.can_manage_product_file(text), tradenet_private.can_read_product_file(text) to anon, authenticated;

create policy tradenet_product_files_read on storage.objects for select to anon, authenticated using (
  bucket_id = 'product-images' and tradenet_private.can_read_product_file(name));
create policy tradenet_product_files_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'product-images' and tradenet_private.can_manage_product_file(name)
  and exists(select 1 from public.products where id::text = split_part(name, '/', 2) and deleted_at is null));
-- Remove the image row first. The active-listing invariant prevents removing its final image.
create policy tradenet_product_files_delete on storage.objects for delete to authenticated using (
  bucket_id = 'product-images' and tradenet_private.can_manage_product_file(name)
  and not exists(select 1 from public.product_images where storage_path = name));

create policy tradenet_avatars_read on storage.objects for select to anon, authenticated using (
  bucket_id = 'avatars' and (split_part(name, '/', 1) = (select auth.uid())::text
    or exists(select 1 from public.profiles where avatar_path = name)));
create policy tradenet_avatars_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'avatars' and (select tradenet_private.is_confirmed_user())
  and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
  and split_part(name, '/', 1) = (select auth.uid())::text);
create policy tradenet_avatars_delete on storage.objects for delete to authenticated using (
  bucket_id = 'avatars' and (select tradenet_private.is_confirmed_user())
  and split_part(name, '/', 1) = (select auth.uid())::text
  and not exists(select 1 from public.profiles where avatar_path = name));
-- No UPDATE policies: upload a fresh UUID path instead of replacing an existing file.
notify pgrst, 'reload schema';
