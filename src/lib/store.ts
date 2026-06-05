import bcrypt from "bcryptjs";
import { supabase, PostRow, CommentRow } from "@/lib/supabase";
import { Post, PostFormData, Comment, CommentFormData } from "@/types/post";

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    category: row.category,
    views: row.views,
    likes: row.likes,
    dislikes: row.dislikes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    author: row.author,
    content: row.content,
    createdAt: row.created_at,
  };
}

// ── Posts ──────────────────────────────────────────────

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as PostRow[]).map(toPost);
}

export async function getPost(id: number): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return toPost(data as PostRow);
}

export async function createPost(data: PostFormData): Promise<Post> {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const { data: row, error } = await supabase
    .from("posts")
    .insert({
      title: data.title,
      content: data.content,
      author: data.author,
      category: data.category,
      password: hashedPassword,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toPost(row as PostRow);
}

export async function updatePost(id: number, data: Omit<PostFormData, "password">): Promise<Post | null> {
  const { data: row, error } = await supabase
    .from("posts")
    .update({
      title: data.title,
      content: data.content,
      author: data.author,
      category: data.category,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return null;
  return toPost(row as PostRow);
}

export async function deletePost(id: number): Promise<boolean> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  return !error;
}

export async function verifyPostPassword(id: number, password: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("posts")
    .select("password")
    .eq("id", id)
    .single();

  if (error || !data) return false;
  return bcrypt.compare(password, (data as { password: string }).password);
}

export async function incrementViews(id: number): Promise<void> {
  await supabase.rpc("increment_views", { post_id: id });
}

export async function toggleLike(id: number): Promise<void> {
  await supabase.rpc("increment_likes", { post_id: id });
}

export async function toggleDislike(id: number): Promise<void> {
  await supabase.rpc("increment_dislikes", { post_id: id });
}

// ── Comments ───────────────────────────────────────────

export async function getComments(postId: number): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as CommentRow[]).map(toComment);
}

export async function createComment(postId: number, data: CommentFormData): Promise<Comment> {
  const { data: row, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      author: data.author,
      content: data.content,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toComment(row as CommentRow);
}

export async function deleteComment(id: number): Promise<boolean> {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  return !error;
}
