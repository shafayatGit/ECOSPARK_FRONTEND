import { IdeaStatus } from "./dashboard.types";

export interface IdeaAuthor {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface IdeaCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AdminIdea {
  id: string;
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string | null;
  status: IdeaStatus;
  isPaid: boolean;
  price: string | number | null;
  imageUrls: string[];
  rejectionFeedback: string | null;
  upvoteCount: number;
  downvoteCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryId: string;
  author: IdeaAuthor;
  category: IdeaCategory;
  _count: {
    comments: number;
    votes: number;
  };
}
