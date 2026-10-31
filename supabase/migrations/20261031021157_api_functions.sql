-- Keep elevated implementations in a non-exposed schema; expose invoker-only wrappers.
alter function public.moderate_report(uuid,text,text) set schema tradenet_private;
alter function public.restore_product(uuid,text) set schema tradenet_private;
create function public.moderate_report(p_report_id uuid, p_action text, p_reason text) returns void
language sql security invoker set search_path = '' as $$
  select tradenet_private.moderate_report(p_report_id, p_action, p_reason);
$$;
create function public.restore_product(p_product_id uuid, p_reason text) returns void
language sql security invoker set search_path = '' as $$
  select tradenet_private.restore_product(p_product_id, p_reason);
$$;
revoke all on function public.moderate_report(uuid,text,text), public.restore_product(uuid,text) from public, anon, authenticated;
grant execute on function public.moderate_report(uuid,text,text), public.restore_product(uuid,text) to authenticated;
-- Some Supabase projects ship this event-trigger helper in the exposed schema.
-- Restrict API execution without changing the event trigger itself.
do $$ begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end; $$;
notify pgrst, 'reload schema';
