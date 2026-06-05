"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AuthorVerifyDialog from "@/components/author-verify-dialog";
import { Pencil } from "lucide-react";

interface EditButtonProps {
  postId: number;
}

export default function EditButton({ postId }: EditButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleConfirm() {
    setOpen(false);
    router.push(`/posts/${postId}/edit`);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
        수정
      </Button>

      <AuthorVerifyDialog
        open={open}
        onOpenChange={setOpen}
        postId={postId}
        action="edit"
        onConfirm={handleConfirm}
      />
    </>
  );
}
