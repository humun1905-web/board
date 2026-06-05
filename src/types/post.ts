export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  views: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

export type PostFormData = Omit<Post, "id" | "views" | "likes" | "dislikes" | "createdAt" | "updatedAt"> & {
  password: string;
};

export interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
}

export type CommentFormData = Pick<Comment, "author" | "content">;
