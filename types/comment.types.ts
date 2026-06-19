export interface CommentAuthor {
  id: string;
  name: string;
  image?: string | null;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  ideaId: string;
  parentId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
  replies?: Comment[];
}
