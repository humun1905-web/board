"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { likePostAction, dislikePostAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface ReactionButtonsProps {
  postId: number;
  initialLikes: number;
  initialDislikes: number;
}

export default function ReactionButtons({ postId, initialLikes, initialDislikes }: ReactionButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [voted, setVoted] = useState<"like" | "dislike" | null>(null);

  function handleLike() {
    if (voted) return;
    setLikes((n) => n + 1);
    setVoted("like");
    startTransition(async () => {
      await likePostAction(postId);
    });
  }

  function handleDislike() {
    if (voted) return;
    setDislikes((n) => n + 1);
    setVoted("dislike");
    startTransition(async () => {
      await dislikePostAction(postId);
    });
  }

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Button
        variant="outline"
        size="lg"
        onClick={handleLike}
        disabled={isPending || !!voted}
        className={cn(
          "gap-2 px-6 transition-all",
          voted === "like" && "border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-50"
        )}
      >
        <ThumbsUp className={cn("h-5 w-5", voted === "like" && "fill-blue-500 text-blue-500")} />
        <span className="text-base font-semibold">{likes}</span>
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={handleDislike}
        disabled={isPending || !!voted}
        className={cn(
          "gap-2 px-6 transition-all",
          voted === "dislike" && "border-red-400 bg-red-50 text-red-500 hover:bg-red-50"
        )}
      >
        <ThumbsDown className={cn("h-5 w-5", voted === "dislike" && "fill-red-400 text-red-400")} />
        <span className="text-base font-semibold">{dislikes}</span>
      </Button>
    </div>
  );
}
