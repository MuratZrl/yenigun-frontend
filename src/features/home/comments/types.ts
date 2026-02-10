// src/features/home/comments/types.ts
export type CommentAuthor = {
  title: string;
  image: string;
  location: string;
  job: string;
};

export type CommentItem = {
  title: string;
  comment: string;
  star: number;
  author: CommentAuthor;
};
