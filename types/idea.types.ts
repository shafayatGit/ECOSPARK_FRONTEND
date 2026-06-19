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

export interface MemberIdea {
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
  category: IdeaCategory;
  _count: {
    comments: number;
    votes: number;
  };
}

export interface PublicIdea {
  id: string;
  title: string;
  problemStatement: string;
  proposedSolution: string | null;
  description: string | null;
  isPaid: boolean;
  price: string | number | null;
  imageUrls: string[];
  upvoteCount: number;
  downvoteCount: number;
  publishedAt: string | null;
  createdAt: string;
  authorId: string;
  categoryId: string;
  author: IdeaAuthor;
  category: IdeaCategory;
  hasFullAccess?: boolean;
  paymentRequired?: boolean;
  _count: {
    comments: number;
    votes: number;
  };
}

export interface PublicIdeaDetail extends PublicIdea {
  hasFullAccess: boolean;
  paymentRequired?: boolean;
  proposedSolution: string | null;
  description: string | null;
  isAuthor?: boolean;
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
