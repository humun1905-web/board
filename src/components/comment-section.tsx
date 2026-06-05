"use client";

import { useTransition, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createCommentAction,
  deleteCommentAction,
  verifyCommentPasswordAction,
} from "@/lib/actions";
import { Comment } from "@/types/post";
import { MessageSquare, Trash2, User, KeyRound } from "lucide-react";
import { toast } from "sonner";

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  // 삭제 다이얼로그 상태
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      author: (formData.get("author") as string).trim(),
      content: (formData.get("content") as string).trim(),
      password: (formData.get("password") as string),
    };

    if (!data.author || !data.content || !data.password) {
      toast.error("모든 항목을 입력해 주세요.");
      return;
    }

    startTransition(async () => {
      try {
        await createCommentAction(postId, data);
        formRef.current?.reset();
        toast.success("댓글이 등록되었습니다.");
      } catch {
        toast.error("댓글 등록에 실패했습니다.");
      }
    });
  }

  function openDeleteDialog(commentId: number) {
    setDeleteTargetId(commentId);
    setDeletePassword("");
    setDeleteError(false);
  }

  function closeDeleteDialog() {
    setDeleteTargetId(null);
    setDeletePassword("");
    setDeleteError(false);
  }

  function handleDeleteConfirm() {
    if (!deletePassword.trim() || deleteTargetId === null) return;

    startDeleteTransition(async () => {
      const valid = await verifyCommentPasswordAction(deleteTargetId, deletePassword);
      if (!valid) {
        setDeleteError(true);
        return;
      }
      try {
        await deleteCommentAction(deleteTargetId, postId);
        closeDeleteDialog();
        toast.success("댓글이 삭제되었습니다.");
      } catch {
        toast.error("댓글 삭제에 실패했습니다.");
      }
    });
  }

  return (
    <div className="space-y-4 px-6 py-5">
      {/* 헤더 */}
      <div className="flex items-center gap-2 text-sm font-semibold">
        <MessageSquare className="h-4 w-4" />
        댓글 {comments.length}개
      </div>

      {/* 댓글 목록 */}
      {comments.length > 0 && (
        <div className="space-y-0 rounded-lg border divide-y overflow-hidden">
          {comments.map((comment) => (
            <div key={comment.id} className="px-4 py-3 bg-background">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <User className="h-3 w-3" />
                      {comment.author}
                    </span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => openDeleteDialog(comment.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          첫 댓글을 작성해 보세요.
        </p>
      )}

      <Separator />

      {/* 댓글 작성 폼 */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="comment-author">작성자</Label>
            <Input
              id="comment-author"
              name="author"
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="comment-password">비밀번호</Label>
            <Input
              id="comment-password"
              name="password"
              type="password"
              placeholder="삭제 시 필요합니다"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comment-content">댓글 내용</Label>
          <Textarea
            id="comment-content"
            name="content"
            placeholder="댓글을 입력하세요"
            rows={3}
            className="resize-none"
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "등록 중..." : "댓글 등록"}
          </Button>
        </div>
      </form>

      {/* 댓글 삭제 비밀번호 다이얼로그 */}
      <Dialog open={deleteTargetId !== null} onOpenChange={(open) => { if (!open) closeDeleteDialog(); }}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              댓글 삭제
            </DialogTitle>
            <DialogDescription>
              작성 시 설정한 비밀번호를 입력해 주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5 py-1">
            <Label htmlFor="delete-comment-password">비밀번호</Label>
            <Input
              id="delete-comment-password"
              type="password"
              placeholder="비밀번호 입력"
              value={deletePassword}
              autoFocus
              onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleDeleteConfirm()}
            />
            {deleteError && (
              <p className="text-xs text-destructive">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog} disabled={isDeleting}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting || !deletePassword.trim()}
            >
              {isDeleting ? "확인 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
