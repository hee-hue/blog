-- 마일스톤 9: 관리자용 글별 좋아요/북마크 집계
-- Supabase 대시보드 > SQL Editor 에 붙여넣어 실행한다. (0001, 0002 를 먼저 실행해 둘 것)

-- 글 슬러그와 개수만 돌려준다. 이메일, 사용자 ID 등 개인정보는 포함하지 않는다.
-- 일반 사용자는 다른 사람의 행을 읽을 수 없으므로 security definer 로 집계하되,
-- 함수 안에서 호출자가 admin 인지 한 번 더 검사한다(페이지 쪽 확인이 깨져도 DB 에서 막힌다).
create or replace function public.admin_post_stats()
returns table (slug text, like_count bigint, bookmark_count bigint)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  select
    coalesce(l.post_slug, b.post_slug),
    coalesce(l.cnt, 0)::bigint,
    coalesce(b.cnt, 0)::bigint
  from (
    select x.post_slug, count(*) as cnt from public.likes x group by x.post_slug
  ) l
  full outer join (
    select y.post_slug, count(*) as cnt from public.bookmarks y group by y.post_slug
  ) b on l.post_slug = b.post_slug;
end;
$$;

-- 비로그인(anon) 은 호출할 수 없다. 로그인한 사용자만 호출할 수 있고, 관리자가 아니면 함수가 거부한다.
revoke execute on function public.admin_post_stats() from public, anon;
grant execute on function public.admin_post_stats() to authenticated;
