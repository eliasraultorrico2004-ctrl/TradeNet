-- TradeNet: schema, invariants and least-privilege access. No demo accounts or listings.
create schema tradenet_private;
revoke all on schema tradenet_private from public, anon, authenticated;
grant usage on schema tradenet_private to anon, authenticated;

create table tradenet_private.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table tradenet_private.admins enable row level security;
revoke all on tradenet_private.admins from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 60),
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_avatar_owner check (avatar_path is null or split_part(avatar_path, '/', 1) = id::text)
);
create table public.categories (
  id text primary key,
  name text not null unique,
  sort_order smallint not null unique
);
create table public.cities (
  id text primary key,
  name text not null unique,
  country_code text not null default 'BO' check (country_code = 'BO')
);
create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 5 and 100),
  description text not null check (char_length(btrim(description)) between 20 and 3000),
  category_id text not null references public.categories(id),
  city_id text not null references public.cities(id),
  price numeric(14,2) not null check (price > 0 and price <> 'NaN'::numeric),
  currency text not null default 'BOB' check (currency = 'BOB'),
  condition text not null check (condition in ('Nuevo', 'Usado')),
  status text not null default 'borrador' check (status in ('borrador', 'activa', 'pausada', 'vendida')),
  hidden_at timestamptz,
  hidden_reason text check (char_length(hidden_reason) <= 1000),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  position smallint not null check (position between 0 and 4),
  created_at timestamptz not null default now(),
  constraint product_images_position_key unique (product_id, position) deferrable initially deferred,
  constraint product_image_path check (storage_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$')
);
create table public.favorites (
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  buyer_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  product_title_snapshot text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, buyer_id),
  check (buyer_id <> seller_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  reporter_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  reason text not null check (reason in ('misleading', 'inappropriate', 'prohibited', 'other')),
  detail text not null default '' check (char_length(detail) <= 1000),
  status text not null default 'pendiente' check (status in ('pendiente', 'descartado', 'oculto')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index reports_one_pending on public.reports(product_id, reporter_id) where status = 'pendiente';
create table tradenet_private.moderation_events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (action in ('oculto', 'descartado', 'restaurado')),
  reason text not null,
  created_at timestamptz not null default now()
);
alter table tradenet_private.moderation_events enable row level security;
revoke all on tradenet_private.moderation_events from public, anon, authenticated;

create index products_seller on public.products(seller_id);
create index products_category on public.products(category_id);
create index products_city on public.products(city_id);
create index products_catalog on public.products(created_at desc, id) where status = 'activa' and hidden_at is null and deleted_at is null;
create index products_price on public.products(price, id) where status = 'activa' and hidden_at is null and deleted_at is null;
create index product_images_product on public.product_images(product_id);
create index favorites_product on public.favorites(product_id);
create index conversations_buyer on public.conversations(buyer_id, updated_at desc);
create index conversations_seller on public.conversations(seller_id, updated_at desc);
create index messages_thread on public.messages(conversation_id, created_at, id);
create index messages_sender on public.messages(sender_id);
create index reports_product on public.reports(product_id);
create index reports_reporter on public.reports(reporter_id);
create index reports_queue on public.reports(status, created_at);
create index moderation_events_product on tradenet_private.moderation_events(product_id);
create index moderation_events_actor on tradenet_private.moderation_events(actor_id);

-- Helpers are outside the exposed API schema and pin an empty search_path.
create function tradenet_private.is_confirmed_user() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from auth.users where id = (select auth.uid()) and email_confirmed_at is not null);
$$;
create function tradenet_private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select tradenet_private.is_confirmed_user() and exists(select 1 from tradenet_private.admins where user_id = (select auth.uid()));
$$;
create function tradenet_private.owns_product(p_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.products where id = p_id and seller_id = (select auth.uid()));
$$;
create function tradenet_private.can_read_product(p_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.products where id = p_id and
    ((deleted_at is null and hidden_at is null and status in ('activa', 'vendida'))
     or seller_id = (select auth.uid()) or tradenet_private.is_admin()));
$$;
create function tradenet_private.can_read_conversation(p_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select tradenet_private.is_confirmed_user() and exists(select 1 from public.conversations
    where id = p_id and (buyer_id = (select auth.uid()) or seller_id = (select auth.uid())));
$$;

create function tradenet_private.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch before update on public.profiles for each row execute function tradenet_private.touch_updated_at();

create function tradenet_private.create_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_name text;
begin
  v_name := btrim(left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 60));
  if char_length(v_name) < 2 then v_name := 'Usuario'; end if;
  insert into public.profiles(id, display_name) values (new.id, v_name);
  return new;
end; $$;
create trigger tradenet_create_profile after insert on auth.users for each row execute function tradenet_private.create_profile();

create function tradenet_private.guard_avatar() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.avatar_path is not null and new.avatar_path is distinct from old.avatar_path then
    if new.avatar_path !~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
       or split_part(new.avatar_path, '/', 1) <> new.id::text
       or not exists(select 1 from storage.objects where bucket_id = 'avatars' and name = new.avatar_path)
    then raise exception 'Avatar inválido o no cargado' using errcode = '23514'; end if;
  end if;
  return new;
end; $$;
create trigger profiles_guard_avatar before update of avatar_path on public.profiles for each row execute function tradenet_private.guard_avatar();

create function tradenet_private.guard_product() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.title := btrim(new.title); new.description := btrim(new.description); new.updated_at := now();
  if tg_op = 'INSERT' then
    if new.status <> 'borrador' then raise exception 'Crea un borrador antes de publicar' using errcode = '23514'; end if;
  else
    if old.deleted_at is not null and not tradenet_private.is_admin() then raise exception 'Publicación eliminada' using errcode = '42501'; end if;
    if old.hidden_at is not null and new.status is distinct from old.status and not tradenet_private.is_admin()
    then raise exception 'Solo moderación puede restaurar la visibilidad' using errcode = '42501'; end if;
    if old.status = 'vendida' and new.status <> 'vendida' then raise exception 'Una venta finalizada no se reactiva' using errcode = '23514'; end if;
    if old.deleted_at is null and new.deleted_at is not null then new.deleted_at := now(); end if;
  end if;
  if new.status in ('activa', 'vendida') and new.deleted_at is null
     and not exists(select 1 from public.product_images where product_id = new.id)
  then raise exception 'Añade al menos una foto antes de publicar' using errcode = '23514'; end if;
  return new;
end; $$;
create trigger products_guard before insert or update on public.products for each row execute function tradenet_private.guard_product();

create function tradenet_private.guard_product_image() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_product public.products; v_id uuid;
begin
  if tg_op = 'DELETE' then v_id := old.product_id; else v_id := new.product_id; end if;
  select * into v_product from public.products where id = v_id for update;
  if tg_op = 'DELETE' then
    if v_product.status in ('activa','vendida') and v_product.deleted_at is null
      and (select count(*) from public.product_images where product_id = v_id) <= 1
    then raise exception 'La publicación debe conservar una foto; páusala antes de retirarla' using errcode = '23514'; end if;
    return old;
  end if;
  if tg_op = 'INSERT' and (v_product.deleted_at is not null
    or split_part(new.storage_path, '/', 1) <> v_product.seller_id::text
    or split_part(new.storage_path, '/', 2) <> v_product.id::text
    or not exists(select 1 from storage.objects where bucket_id = 'product-images' and name = new.storage_path))
  then raise exception 'La foto debe pertenecer a esta publicación y existir en Storage' using errcode = '23514'; end if;
  return new;
end; $$;
create trigger product_images_guard before insert or update or delete on public.product_images for each row execute function tradenet_private.guard_product_image();

create function tradenet_private.prepare_conversation() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_product public.products;
begin
  select * into v_product from public.products where id = new.product_id for share;
  if not found or v_product.status <> 'activa' or v_product.hidden_at is not null or v_product.deleted_at is not null
    or v_product.seller_id = (select auth.uid()) or not tradenet_private.is_confirmed_user()
  then raise exception 'No puedes iniciar esta conversación' using errcode = '42501'; end if;
  new.buyer_id := auth.uid(); new.seller_id := v_product.seller_id; new.product_title_snapshot := v_product.title;
  return new;
end; $$;
create trigger conversations_prepare before insert on public.conversations for each row execute function tradenet_private.prepare_conversation();
create function tradenet_private.message_activity() returns trigger
language plpgsql security definer set search_path = '' as $$ begin
  update public.conversations set updated_at = now() where id = new.conversation_id; return new;
end; $$;
create trigger messages_activity after insert on public.messages for each row execute function tradenet_private.message_activity();

-- Explicit grants remove Supabase default table/function grants from these new objects only.
revoke all on public.profiles, public.categories, public.cities, public.products, public.product_images,
  public.favorites, public.conversations, public.messages, public.reports from public, anon, authenticated;
grant select on public.profiles, public.categories, public.cities, public.products, public.product_images to anon, authenticated;
grant select on public.favorites, public.conversations, public.messages, public.reports to authenticated;
grant update(display_name, avatar_path) on public.profiles to authenticated;
grant insert(title, description, category_id, city_id, price, condition) on public.products to authenticated;
grant update(title, description, category_id, city_id, price, condition, status, deleted_at) on public.products to authenticated;
grant insert(product_id, storage_path, position), update(position), delete on public.product_images to authenticated;
grant insert(product_id), delete on public.favorites to authenticated;
grant insert(product_id) on public.conversations to authenticated;
grant insert(conversation_id, body) on public.messages to authenticated;
grant insert(product_id, reason, detail) on public.reports to authenticated;
grant all on public.profiles, public.categories, public.cities, public.products, public.product_images,
  public.favorites, public.conversations, public.messages, public.reports to service_role;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.cities enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reports enable row level security;
create policy profiles_read on public.profiles for select to anon, authenticated using (true);
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid()) and (select tradenet_private.is_confirmed_user())) with check (id = (select auth.uid()));
create policy categories_read on public.categories for select to anon, authenticated using (true);
create policy cities_read on public.cities for select to anon, authenticated using (true);
create policy products_read on public.products for select to anon, authenticated using (
  (status in ('activa','vendida') and hidden_at is null and deleted_at is null)
  or seller_id = (select auth.uid()) or (select tradenet_private.is_admin()));
create policy products_create_own on public.products for insert to authenticated with check (
  seller_id = (select auth.uid()) and (select tradenet_private.is_confirmed_user()) and status = 'borrador');
create policy products_update_own on public.products for update to authenticated
  using (seller_id = (select auth.uid()) and deleted_at is null and (select tradenet_private.is_confirmed_user()))
  with check (seller_id = (select auth.uid()));
create policy images_read on public.product_images for select to anon, authenticated using (tradenet_private.can_read_product(product_id));
create policy images_insert_own on public.product_images for insert to authenticated with check (
  tradenet_private.owns_product(product_id) and (select tradenet_private.is_confirmed_user()));
create policy images_update_own on public.product_images for update to authenticated using (
  tradenet_private.owns_product(product_id) and (select tradenet_private.is_confirmed_user())) with check (tradenet_private.owns_product(product_id));
create policy images_delete_own on public.product_images for delete to authenticated using (
  tradenet_private.owns_product(product_id) and (select tradenet_private.is_confirmed_user()));
create policy favorites_read_own on public.favorites for select to authenticated using (user_id = (select auth.uid()) and (select tradenet_private.is_confirmed_user()));
create policy favorites_insert_own on public.favorites for insert to authenticated with check (
  user_id = (select auth.uid()) and (select tradenet_private.is_confirmed_user())
  and exists(select 1 from public.products where id = product_id and status = 'activa' and hidden_at is null and deleted_at is null));
create policy favorites_delete_own on public.favorites for delete to authenticated using (user_id = (select auth.uid()));
create policy conversations_read_participants on public.conversations for select to authenticated using (
  (buyer_id = (select auth.uid()) or seller_id = (select auth.uid())) and (select tradenet_private.is_confirmed_user()));
create policy conversations_insert_buyer on public.conversations for insert to authenticated with check (
  buyer_id = (select auth.uid()) and buyer_id <> seller_id and (select tradenet_private.is_confirmed_user()));
create policy messages_read_participants on public.messages for select to authenticated using (tradenet_private.can_read_conversation(conversation_id));
create policy messages_insert_participants on public.messages for insert to authenticated with check (
  sender_id = (select auth.uid()) and tradenet_private.can_read_conversation(conversation_id));
create policy reports_read on public.reports for select to authenticated using (
  (reporter_id = (select auth.uid()) and (select tradenet_private.is_confirmed_user())) or (select tradenet_private.is_admin()));
create policy reports_insert on public.reports for insert to authenticated with check (
  reporter_id = (select auth.uid()) and (select tradenet_private.is_confirmed_user()) and exists (
    select 1 from public.products where id = product_id and seller_id <> (select auth.uid())
      and status = 'activa' and hidden_at is null and deleted_at is null));

create function public.moderate_report(p_report_id uuid, p_action text, p_reason text) returns void
language plpgsql security definer set search_path = '' as $$
declare v_product_id uuid;
begin
  if not tradenet_private.is_admin() then raise exception 'Solo administradores' using errcode = '42501'; end if;
  if p_action not in ('oculto','descartado') or p_action is null or p_reason is null or char_length(btrim(p_reason)) not between 3 and 1000
  then raise exception 'Acción o motivo inválido' using errcode = '23514'; end if;
  select product_id into v_product_id from public.reports where id = p_report_id and status = 'pendiente' for update;
  if not found then raise exception 'Reporte no pendiente' using errcode = '23514'; end if;
  update public.reports set status = p_action, reviewed_at = now() where product_id = v_product_id and status = 'pendiente';
  if p_action = 'oculto' then update public.products set hidden_at = now(), hidden_reason = btrim(p_reason) where id = v_product_id; end if;
  insert into tradenet_private.moderation_events(product_id, actor_id, action, reason) values(v_product_id, auth.uid(), p_action, btrim(p_reason));
end; $$;
create function public.restore_product(p_product_id uuid, p_reason text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not tradenet_private.is_admin() then raise exception 'Solo administradores' using errcode = '42501'; end if;
  if p_reason is null or char_length(btrim(p_reason)) not between 3 and 1000 then raise exception 'Motivo requerido' using errcode = '23514'; end if;
  update public.products set hidden_at = null, hidden_reason = null where id = p_product_id and hidden_at is not null and deleted_at is null;
  if not found then raise exception 'No hay una publicación oculta para restaurar' using errcode = '23514'; end if;
  insert into tradenet_private.moderation_events(product_id, actor_id, action, reason) values(p_product_id, auth.uid(), 'restaurado', btrim(p_reason));
end; $$;
create function public.reorder_product_images(p_product_id uuid, p_image_ids uuid[]) returns void
language plpgsql security invoker set search_path = '' as $$
declare v_count integer;
begin
  if not tradenet_private.owns_product(p_product_id) or not tradenet_private.is_confirmed_user() then raise exception 'Publicación ajena' using errcode = '42501'; end if;
  perform id from public.products where id = p_product_id for update;
  select count(*) into v_count from public.product_images where product_id = p_product_id;
  if p_image_ids is null or cardinality(p_image_ids) <> v_count or v_count = 0 or exists (
    select 1 from unnest(p_image_ids) x(id) where x.id is null or not exists(select 1 from public.product_images i where i.id = x.id and i.product_id = p_product_id))
    or (select count(distinct x) from unnest(p_image_ids) x) <> v_count
  then raise exception 'Incluye todas las fotos una sola vez' using errcode = '23514'; end if;
  update public.product_images i set position = (x.ordinality - 1)::smallint from unnest(p_image_ids) with ordinality x(id, ordinality) where i.id = x.id and i.product_id = p_product_id;
end; $$;

revoke all on all functions in schema tradenet_private from public, anon, authenticated;
grant execute on function tradenet_private.is_confirmed_user(), tradenet_private.is_admin(),
  tradenet_private.owns_product(uuid), tradenet_private.can_read_product(uuid), tradenet_private.can_read_conversation(uuid) to anon, authenticated;
revoke all on function public.moderate_report(uuid,text,text), public.restore_product(uuid,text), public.reorder_product_images(uuid,uuid[]) from public, anon, authenticated;
grant execute on function public.moderate_report(uuid,text,text), public.restore_product(uuid,text), public.reorder_product_images(uuid,uuid[]) to authenticated;

insert into public.categories(id,name,sort_order) values
 ('tecnologia','Tecnología',1),('hogar','Hogar y muebles',2),('moda','Moda y accesorios',3),
 ('deportes','Deportes y aire libre',4),('entretenimiento','Libros y entretenimiento',5),('otros','Otros',6);
insert into public.cities(id,name) values
 ('la-paz','La Paz'),('el-alto','El Alto'),('santa-cruz','Santa Cruz de la Sierra'),('cochabamba','Cochabamba'),
 ('sucre','Sucre'),('oruro','Oruro'),('potosi','Potosí'),('tarija','Tarija'),('trinidad','Trinidad'),('cobija','Cobija');
notify pgrst, 'reload schema';
