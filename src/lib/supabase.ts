import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PostRow = {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  views: number;
  likes: number;
  dislikes: number;
  password: string;
  created_at: string;
  updated_at: string;
};

export type CommentRow = {
  id: number;
  post_id: number;
  author: string;
  content: string;
  password: string;
  created_at: string;
};
