-- Keep AI quota cleanup scoped to the authenticated user's own rows.
create or replace function public.consume_ai_quota(p_limit integer default 30)
returns boolean language plpgsql security definer set search_path=public as $$ declare w timestamptz:=date_trunc('hour',now()); n integer; begin
 if auth.uid() is null then return false; end if;
 insert into public.ai_usage(user_id,window_start,request_count) values(auth.uid(),w,1)
 on conflict(user_id,window_start) do update set request_count=public.ai_usage.request_count+1
 returning request_count into n;
 delete from public.ai_usage where user_id=auth.uid() and window_start<now()-interval '48 hours';
 return n<=greatest(1,least(p_limit,100));
end $$;
revoke all on function public.consume_ai_quota(integer) from public,anon;
grant execute on function public.consume_ai_quota(integer) to authenticated;
