create or replace function public.consume_ai_quota_for_user(p_user_id uuid,p_limit integer default 30)
returns boolean language plpgsql security definer set search_path=public as $$
declare w timestamptz:=date_trunc('hour',now()); n integer;
begin
 if p_user_id is null then return false; end if;
 insert into public.ai_usage(user_id,window_start,request_count) values(p_user_id,w,1)
 on conflict(user_id,window_start) do update set request_count=public.ai_usage.request_count+1
 returning request_count into n;
 delete from public.ai_usage where user_id=p_user_id and window_start<now()-interval '48 hours';
 return n<=greatest(1,least(p_limit,100));
end $$;
revoke all on function public.consume_ai_quota_for_user(uuid,integer) from public,anon,authenticated;
grant execute on function public.consume_ai_quota_for_user(uuid,integer) to service_role;
revoke execute on function public.consume_ai_quota(integer) from public,anon,authenticated;
grant execute on function public.consume_ai_quota(integer) to service_role;
