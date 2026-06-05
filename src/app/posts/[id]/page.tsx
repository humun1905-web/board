import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, incrementViews, getComments } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DeleteButton from "@/components/delete-button";
import EditButton from "@/components/edit-button";
import ReactionButtons from "@/components/reaction-buttons";
import CommentSection from "@/components/comment-section";
import { ArrowLeft, Eye, User, Calendar } from "lucide-react";

interface PostPageProps {
  params: Promise<{ id: string }>;
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

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const postId = Number(id);
  const [post, comments] = await Promise.all([
    getPost(postId),
    getComments(postId),
  ]);

  if (!post) notFound();

  await incrementViews(postId);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Link href="/">
        <Button variant="ghost" size="sm" className="gap-1.5 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Button>
      </Link>

      <Card>
        <CardHeader className="space-y-3 pb-4">
          <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              {post.views}
            </span>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="py-6">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{post.content}</div>
        </CardContent>

        <Separator />

        <ReactionButtons
          postId={post.id}
          initialLikes={post.likes}
          initialDislikes={post.dislikes}
        />

        <Separator />

        <CardFooter className="flex justify-end gap-2 pt-4">
          <EditButton postId={post.id} />
          <DeleteButton postId={post.id} />
        </CardFooter>
      </Card>

      {/* 댓글 */}
      <Card>
        <CommentSection postId={post.id} comments={comments} />
      </Card>
    </div>
  );
}
