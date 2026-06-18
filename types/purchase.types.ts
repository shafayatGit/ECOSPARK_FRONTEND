import { PurchaseStatus } from "./dashboard.types";

export interface PurchaseIdea {
  id: string;
  title: string;
  isPaid: boolean;
  price: string | number | null;
  status?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface PurchaseUser {
  id: string;
  name: string;
  email: string;
}

export interface Purchase {
  id: string;
  transactionId: string;
  paymentStatus: PurchaseStatus;
  amountPaid: string | number;
  gateway: string;
  stripeEventId?: string | null;
  completedAt: string | null;
  createdAt: string;
  userId: string;
  ideaId: string;
  idea: PurchaseIdea;
  user?: PurchaseUser;
}

export interface PurchaseOverview {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  totalRevenue: number;
}
