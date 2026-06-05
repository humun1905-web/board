-- ============================================================
-- 공인검사실 소통게시판 — Supabase Schema
-- ============================================================

-- ── 1. posts 테이블 ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS posts (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  author     TEXT        NOT NULL,
  category   TEXT        NOT NULL DEFAULT '소통게시판',
  password   TEXT        NOT NULL DEFAULT '',
  views      INTEGER     NOT NULL DEFAULT 0,
  likes      INTEGER     NOT NULL DEFAULT 0,
  dislikes   INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. comments 테이블 ───────────────────────────────────

CREATE TABLE IF NOT EXISTS comments (
  id         BIGSERIAL PRIMARY KEY,
  post_id    BIGINT      NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author     TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. RLS 정책 (공개 게시판 — 전체 허용) ───────────────
--
--  Supabase는 내부적으로 FORCE ROW LEVEL SECURITY를 적용하므로
--  DISABLE 대신 전체 허용 정책을 사용합니다.

ALTER TABLE posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_all_posts"    ON posts;
DROP POLICY IF EXISTS "public_all_comments" ON comments;

CREATE POLICY "public_all_posts" ON posts
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "public_all_comments" ON comments
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ── 4. 시퀀스 권한 부여 ──────────────────────────────────

GRANT USAGE, SELECT ON SEQUENCE posts_id_seq    TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE comments_id_seq TO anon, authenticated;

-- ── 5. 조회수 / 좋아요 / 싫어요 증가 함수 ───────────────

CREATE OR REPLACE FUNCTION increment_views(post_id BIGINT)
RETURNS VOID AS $$
  UPDATE posts SET views = views + 1 WHERE id = post_id;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_likes(post_id BIGINT)
RETURNS VOID AS $$
  UPDATE posts SET likes = likes + 1 WHERE id = post_id;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_dislikes(post_id BIGINT)
RETURNS VOID AS $$
  UPDATE posts SET dislikes = dislikes + 1 WHERE id = post_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ── 6. 기존 posts 테이블에 password 컬럼 추가 (마이그레이션) ──

ALTER TABLE posts ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT '';
