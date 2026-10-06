-- 마일스톤 7: 프로필(역할)과 관리자 화이트리스트
-- Supabase 대시보드 > SQL Editor 에 붙여넣어 실행한다.
-- 관리자 이메일은 공개 저장소에 올리지 않기 위해 이 파일에 넣지 않는다.
-- 파일 맨 아래 안내를 참고해 별도로 등록한다.

-- 1) 관리자 이메일 화이트리스트: RLS 를 켜고 정책을 만들지 않아 클라이언트는 읽을 수도 없다.
create table if not exists public.admin_emails (
  email text primary key
);
alter table public.admin_emails enable row level security;
revoke all on public.admin_emails from anon, authenticated;

-- 2) 프로필: 사용자당 1행, 역할은 reader 또는 admin
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'reader' check (role in ('reader', 'admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- 본인의 행만 읽을 수 있다. insert/update/delete 정책이 없으므로 클라이언트가 role 을 바꿀 수 없다.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

revoke insert, update, delete on public.profiles from anon, authenticated;

-- 3) 가입 시 프로필 자동 생성. 화이트리스트에 있는 이메일이면 admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (
    new.id,
    case
      when exists (
        select 1 from public.admin_emails a where lower(a.email) = lower(new.email)
      ) then 'admin'
      else 'reader'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) 이미 가입한 사용자의 프로필 보정 (이 SQL 실행 전에 가입한 계정이 있을 때)
insert into public.profiles (id, role)
select u.id,
       case when exists (
         select 1 from public.admin_emails a where lower(a.email) = lower(u.email)
       ) then 'admin' else 'reader' end
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 관리자 등록 (별도로 실행, 이 파일에는 이메일을 적지 않는다):
--
--   insert into public.admin_emails (email) values ('관리자@이메일')
--   on conflict do nothing;
--
--   -- 관리자가 이미 가입했다면 역할도 올려 준다:
--   update public.profiles set role = 'admin'
--   where id in (select id from auth.users where lower(email) in
--                (select lower(email) from public.admin_emails));
-- ---------------------------------------------------------------------------
