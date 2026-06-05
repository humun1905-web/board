import { notFound } from "next/navigation";
import { getPost } from "@/lib/store";
import PostForm from "@/components/post-form";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPost(Number(id));
  if (!post) notFound();
  return <PostForm post={post} />;
}
