export interface CategoryCreator {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdById: string;
  createdAt: string;
  createdBy: CategoryCreator;
  _count?: {
    ideas: number;
  };
}
