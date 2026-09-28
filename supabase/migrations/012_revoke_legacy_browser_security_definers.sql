revoke execute on function public.delete_my_account() from public,anon,authenticated;
grant execute on function public.delete_my_account() to service_role;
