import Link from "next/link";
import { getPosts } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, PenSquare, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const allPosts = await getPosts();

  const filtered = allPosts.filter((post) =>
    !q ||
    post.title.toLowerCase().includes(q.toLowerCase()) ||
    post.author.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 검색 */}
      <form method="GET" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="제목 또는 작성자 검색..."
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Button type="submit" variant="secondary" size="sm">
          검색
        </Button>
        {q && (
          <Link href="/">
            <Button variant="ghost" size="sm">
              초기화
            </Button>
          </Link>
        )}
      </form>

      {/* 게시글 목록 */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <MessageSquare className="h-10 w-10 opacity-30" />
              <p>게시글이 없습니다.</p>
              <Link href="/posts/new">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <PenSquare className="h-4 w-4" />
                  첫 글 작성하기
                </Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      {/* 제목 + 통계 뱃지 */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium">{post.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-0.5 text-xs text-blue-500">
                            <ThumbsUp className="h-3 w-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-0.5 text-xs text-red-400">
                            <ThumbsDown className="h-3 w-3" />
                            {post.dislikes}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-right">
        총 {filtered.length}개의 게시글
      </div>
    </div>
  );
}
