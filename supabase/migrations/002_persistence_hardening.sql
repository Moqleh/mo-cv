-- MO CV production persistence hardening
alter table public.resumes add column if not exists document_id text;
update public.resumes set document_id=substr(replace(replace(replace(encode(gen_random_bytes(18),'base64'),'/','_'),'+','-'),'=',''),1,21) where document_id is null;
alter table public.resumes alter column document_id set not null;
create unique index if not exists resumes_document_id_uidx on public.resumes(document_id);
alter table public.resumes drop constraint if exists resumes_document_id_format;
alter table public.resumes add constraint resumes_document_id_format check(document_id ~ '^[A-Za-z0-9_-]{21}$');
alter table public.resume_revisions add column if not exists write_version bigint not null default 1;
create or replace function public.touch_resume_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
drop trigger if exists resumes_touch_updated_at on public.resumes;
create trigger resumes_touch_updated_at before update on public.resumes for each row execute function public.touch_resume_updated_at();
create or replace function public.update_resume_if_version(p_document_id text,p_expected_version bigint,p_title text,p_locale text,p_template_id text,p_content jsonb)
returns public.resumes language plpgsql security invoker as $$ declare r public.resumes; begin
 update public.resumes set title=p_title,locale=p_locale,template_id=p_template_id,content=p_content,write_version=write_version+1
 where document_id=p_document_id and user_id=auth.uid() and write_version=p_expected_version returning * into r;
 if r.id is null then raise exception 'RESUME_VERSION_CONFLICT'; end if; return r; end $$;
