-- 마일스톤 8: 좋아요와 북마크
-- Supabase 대시보드 > SQL Editor 에 붙여넣어 실행한다. (0001 을 먼저 실행해 둘 것)

-- 1) 테이블: 사용자당 글 하나에 한 번만 (기본키로 중복 방지)
create table if not exists public.likes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  post_slug text not null
    check (char_length(post_slug) between 1 and 100 and post_slug !~ '[[:space:]/]'),
  created_at timestamptz not null default now(),
  primary key (user_id, post_slug)
);

create table if not exists public.bookmarks (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  post_slug text not null
    check (char_length(post_slug) between 1 and 100 and post_slug !~ '[[:space:]/]'),
  created_at timestamptz not null default now(),
  primary key (user_id, post_slug)
);

-- 글별 집계를 빠르게 하기 위한 인덱스
create index if not exists likes_post_slug_idx on public.likes (post_slug);
create index if not exists bookmarks_post_slug_idx on public.bookmarks (post_slug);

-- 2) RLS: 본인 행만 읽고, 추가하고, 삭제할 수 있다. update 정책은 없으므로 수정할 수 없다.
alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;

drop policy if exists "likes_select_own" on public.likes;
create policy "likes_select_own" on public.likes
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "likes_insert_own" on public.likes;
create policy "likes_insert_own" on public.likes
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "likes_delete_own" on public.likes;
create policy "likes_delete_own" on public.likes
  for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "bookmarks_select_own" on public.bookmarks;
create policy "bookmarks_select_own" on public.bookmarks
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "bookmarks_insert_own" on public.bookmarks;
create policy "bookmarks_insert_own" on public.bookmarks
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "bookmarks_delete_own" on public.bookmarks;
create policy "bookmarks_delete_own" on public.bookmarks
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 3) 권한: 'Automatically expose new tables' 를 끈 프로젝트이므로 직접 부여한다.
revoke all on public.likes, public.bookmarks from anon, authenticated;
grant select, insert, delete on public.likes, public.bookmarks to authenticated;

-- 4) 글별 좋아요 수: 로그인하지 않은 방문자도 볼 수 있어야 하지만 다른 사용자의 행은 읽을 수 없다.
--    그래서 개수만 돌려주는 함수를 공개한다. 누가 눌렀는지는 노출되지 않는다.
create or replace function public.get_like_count(p_slug text)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select count(*) from public.likes where post_slug = p_slug;
$$;

revoke execute on function public.get_like_count(text) from public;
grant execute on function public.get_like_count(text) to anon, authenticated;
