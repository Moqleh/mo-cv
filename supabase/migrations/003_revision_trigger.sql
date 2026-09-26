-- Capture immutable revisions for every successful resume update.
create or replace function public.capture_resume_revision() returns trigger language plpgsql security invoker as $$ begin
 insert into public.resume_revisions(resume_id,user_id,content,template_id,reason,write_version)
 values(old.id,old.user_id,old.content,old.template_id,'update',old.write_version);
 return new; end $$;
drop trigger if exists resumes_capture_revision on public.resumes;
create trigger resumes_capture_revision before update on public.resumes for each row execute function public.capture_resume_revision();
create index if not exists resume_revisions_resume_created_idx on public.resume_revisions(resume_id,created_at desc);
