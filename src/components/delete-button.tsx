"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deletePostAction } from "@/lib/actions";
import AuthorVerifyDialog from "@/components/author-verify-dialog";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  postId: number;
}

export default function DeleteButton({ postId }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    setOpen(false);
    startTransition(async () => {
      try {
        await deletePostAction(postId);
      } catch {
        // redirect throws internally
      }
    });
  }

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
        삭제
      </Button>

      <AuthorVerifyDialog
        open={open}
        onOpenChange={setOpen}
        postId={postId}
        action="delete"
        onConfirm={handleConfirm}
      />
    </>
  );
}
