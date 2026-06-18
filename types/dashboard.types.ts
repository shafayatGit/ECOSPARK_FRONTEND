export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export type IdeaStatus =
  | "DRAFT"
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type PurchaseStatus = "PENDING" | "COMPLETED" | "FAILED";

export type UserRole = "MEMBER" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface CountByStatus {
  status: string;
  count: number;
}

export interface TrendDataPoint {
  date: string;
  count: number;
}

export interface RevenueTrendDataPoint {
  date: string;
  count: number;
  amount: number;
}

export interface CategoryCount {
  categoryId: string;
  name: string;
  slug: string;
  count: number;
}

export interface DashboardUserSummary {
  total: number;
  members: number;
  admins: number;
  active: number;
  inactive: number;
  emailVerified: number;
}

export interface DashboardIdeaSummary {
  total: number;
  draft: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  paid: number;
  free: number;
}

export interface DashboardEngagementSummary {
  votes: number;
  comments: number;
  activeComments: number;
}

export interface DashboardCategorySummary {
  total: number;
}

export interface DashboardNewsletterSummary {
  total: number;
  active: number;
  inactive: number;
}

export interface DashboardPurchaseSummary {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  totalRevenue: number;
}

export interface DashboardOverview {
  users: DashboardUserSummary;
  ideas: DashboardIdeaSummary;
  engagement: DashboardEngagementSummary;
  categories: DashboardCategorySummary;
  newsletter: DashboardNewsletterSummary;
  purchases: DashboardPurchaseSummary;
}

export interface DashboardTrends {
  ideasLast30Days: TrendDataPoint[];
  purchasesLast30Days: TrendDataPoint[];
  revenueLast30Days: RevenueTrendDataPoint[];
}

export interface DashboardAuthor {
  id: string;
  name: string;
}

export interface DashboardCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface RecentPurchaseUser {
  id: string;
  name: string;
  email: string;
}

export interface RecentPurchaseIdea {
  id: string;
  title: string;
  isPaid: boolean;
}

export interface RecentPurchase {
  id: string;
  transactionId: string;
  amountPaid: number;
  completedAt: string;
  user: RecentPurchaseUser;
  idea: RecentPurchaseIdea;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
}

export interface DashboardRecent {
  pendingIdeas: unknown[];
  recentPurchases: RecentPurchase[];
  recentUsers: RecentUser[];
}

export interface TopIdeaByVotes {
  id: string;
  title: string;
  upvoteCount: number;
  downvoteCount: number;
  isPaid: boolean;
  price: number | null;
  publishedAt: string | null;
  author: DashboardAuthor;
  category: DashboardCategoryRef;
  _count: {
    votes: number;
    comments: number;
    purchases: number;
  };
}

export interface TopIdeaByPurchaseIdea {
  id: string;
  title: string;
  isPaid: boolean;
  price: string | number | null;
  author: DashboardAuthor;
  category: DashboardCategoryRef;
}

export interface TopIdeaByPurchase {
  purchaseCount: number;
  totalRevenue: number;
  idea: TopIdeaByPurchaseIdea;
}

export interface DashboardTopIdeas {
  byVotes: TopIdeaByVotes[];
  byPurchases: TopIdeaByPurchase[];
}

export interface IAdminDashboardData {
  overview: DashboardOverview;
  ideasByStatus: CountByStatus[];
  ideasByCategory: CategoryCount[];
  purchasesByStatus: CountByStatus[];
  trends: DashboardTrends;
  recent: DashboardRecent;
  topIdeas: DashboardTopIdeas;
}
