"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/post";
import { createPostAction, updatePostAction } from "@/lib/actions";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

interface PostFormProps {
  post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEdit = !!post;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title   = formData.get("title")   as string;
    const content = formData.get("content") as string;
    const author  = formData.get("author")  as string;
    const password = formData.get("password") as string;

    if (!title.trim() || !content.trim() || !author.trim()) {
      toast.error("모든 필드를 입력해 주세요.");
      return;
    }
    if (!isEdit && !password.trim()) {
      toast.error("비밀번호를 입력해 주세요.");
      return;
    }

    startTransition(async () => {
      try {
        if (isEdit) {
          await updatePostAction(post.id, { title, content, author, category: "소통게시판" });
        } else {
          await createPostAction({ title, content, author, category: "소통게시판", password });
        }
      } catch {
        // redirect throws internally
      }
    });
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "게시글 수정" : "게시글 작성"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="author">작성자</Label>
            <Input
              id="author"
              name="author"
              placeholder="이름을 입력하세요"
              defaultValue={post?.author}
              required
            />
          </div>

          {/* 비밀번호 — 작성 시에만 표시 */}
          {!isEdit && (
            <div className="space-y-1.5">
              <Label htmlFor="password" className="flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" />
                비밀번호
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="수정·삭제 시 필요합니다"
                required
              />
              <p className="text-xs text-muted-foreground">
                게시글 수정 및 삭제에 사용됩니다.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              placeholder="제목을 입력하세요"
              defaultValue={post?.title}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="내용을 입력하세요"
              rows={10}
              defaultValue={post?.content}
              required
              className="resize-none"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
            취소
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "저장 중..." : isEdit ? "수정하기" : "등록하기"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
