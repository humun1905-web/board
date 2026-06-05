"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createPost, updatePost, deletePost,
  incrementViews, toggleLike, toggleDislike,
  verifyPostPassword,
  createComment, deleteComment, verifyCommentPassword,
} from "@/lib/store";
import { PostFormData, CommentFormData } from "@/types/post";

// ── Posts ──────────────────────────────────────────────

export async function createPostAction(data: PostFormData) {
  const post = await createPost(data);
  revalidatePath("/");
  redirect(`/posts/${post.id}`);
}

export async function updatePostAction(id: number, data: Omit<PostFormData, "password">) {
  const post = await updatePost(id, data);
  if (!post) throw new Error("게시글을 찾을 수 없습니다.");
  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}

export async function deletePostAction(id: number) {
  await deletePost(id);
  revalidatePath("/");
  redirect("/");
}

export async function verifyPostPasswordAction(id: number, password: string): Promise<boolean> {
  return verifyPostPassword(id, password);
}

export async function incrementViewsAction(id: number) {
  await incrementViews(id);
  revalidatePath(`/posts/${id}`);
}

export async function likePostAction(id: number) {
  await toggleLike(id);
  revalidatePath(`/posts/${id}`);
}

export async function dislikePostAction(id: number) {
  await toggleDislike(id);
  revalidatePath(`/posts/${id}`);
}

// ── Comments ───────────────────────────────────────────

export async function createCommentAction(postId: number, data: CommentFormData) {
  if (!data.author.trim() || !data.content.trim()) {
    throw new Error("작성자와 내용을 입력해 주세요.");
  }
  await createComment(postId, data);
  revalidatePath(`/posts/${postId}`);
}

export async function verifyCommentPasswordAction(commentId: number, password: string): Promise<boolean> {
  return verifyCommentPassword(commentId, password);
}

export async function deleteCommentAction(commentId: number, postId: number) {
  await deleteComment(commentId);
  revalidatePath(`/posts/${postId}`);
}
