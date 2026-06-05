"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { verifyPostPasswordAction } from "@/lib/actions";
import { KeyRound } from "lucide-react";

interface AuthorVerifyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number;
  action: "edit" | "delete";
  onConfirm: () => void;
}

export default function AuthorVerifyDialog({
  open,
  onOpenChange,
  postId,
  action,
  onConfirm,
}: AuthorVerifyDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isDelete = action === "delete";

  function handleConfirm() {
    if (!password.trim()) return;

    startTransition(async () => {
      const valid = await verifyPostPasswordAction(postId, password);
      if (valid) {
        setPassword("");
        setError(false);
        onConfirm();
      } else {
        setError(true);
      }
    });
  }

  function handleClose(open: boolean) {
    if (!open) {
      setPassword("");
      setError(false);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            {isDelete ? "게시글 삭제" : "게시글 수정"}
          </DialogTitle>
          <DialogDescription>
            작성 시 설정한 비밀번호를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5 py-1">
          <Label htmlFor="verify-password">비밀번호</Label>
          <Input
            id="verify-password"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            autoFocus
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          />
          {error && (
            <p className="text-xs text-destructive">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={isPending}>
            취소
          </Button>
          <Button
            variant={isDelete ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending || !password.trim()}
          >
            {isPending ? "확인 중..." : isDelete ? "삭제" : "수정 페이지로"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
