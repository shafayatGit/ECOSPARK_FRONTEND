import { z } from "zod";

const countByStatusSchema = z.object({
  status: z.string(),
  count: z.number().int().min(0),
});

const trendDataPointSchema = z.object({
  date: z.string(),
  count: z.number().int().min(0),
});

const revenueTrendDataPointSchema = z.object({
  date: z.string(),
  count: z.number().int().min(0),
  amount: z.number().min(0),
});

const categoryCountSchema = z.object({
  categoryId: z.string(),
  name: z.string(),
  slug: z.string(),
  count: z.number().int().min(0),
});

const dashboardOverviewSchema = z.object({
  users: z.object({
    total: z.number().int().min(0),
    members: z.number().int().min(0),
    admins: z.number().int().min(0),
    active: z.number().int().min(0),
    inactive: z.number().int().min(0),
    emailVerified: z.number().int().min(0),
  }),
  ideas: z.object({
    total: z.number().int().min(0),
    draft: z.number().int().min(0),
    pending: z.number().int().min(0),
    underReview: z.number().int().min(0),
    approved: z.number().int().min(0),
    rejected: z.number().int().min(0),
    paid: z.number().int().min(0),
    free: z.number().int().min(0),
  }),
  engagement: z.object({
    votes: z.number().int().min(0),
    comments: z.number().int().min(0),
    activeComments: z.number().int().min(0),
  }),
  categories: z.object({
    total: z.number().int().min(0),
  }),
  newsletter: z.object({
    total: z.number().int().min(0),
    active: z.number().int().min(0),
    inactive: z.number().int().min(0),
  }),
  purchases: z.object({
    total: z.number().int().min(0),
    pending: z.number().int().min(0),
    completed: z.number().int().min(0),
    failed: z.number().int().min(0),
    totalRevenue: z.number().min(0),
  }),
});

const dashboardAuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const dashboardCategoryRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

const recentPurchaseSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  amountPaid: z.number().min(0),
  completedAt: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  idea: z.object({
    id: z.string(),
    title: z.string(),
    isPaid: z.boolean(),
  }),
});

const recentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["MEMBER", "ADMIN"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  emailVerified: z.boolean(),
  createdAt: z.string(),
});

const topIdeaByVotesSchema = z.object({
  id: z.string(),
  title: z.string(),
  upvoteCount: z.number().int().min(0),
  downvoteCount: z.number().int().min(0),
  isPaid: z.boolean(),
  price: z.number().nullable(),
  publishedAt: z.string().nullable(),
  author: dashboardAuthorSchema,
  category: dashboardCategoryRefSchema,
  _count: z.object({
    votes: z.number().int().min(0),
    comments: z.number().int().min(0),
    purchases: z.number().int().min(0),
  }),
});

const topIdeaByPurchaseSchema = z.object({
  purchaseCount: z.number().int().min(0),
  totalRevenue: z.number().min(0),
  idea: z.object({
    id: z.string(),
    title: z.string(),
    isPaid: z.boolean(),
    price: z.union([z.string(), z.number()]).nullable(),
    author: dashboardAuthorSchema,
    category: dashboardCategoryRefSchema,
  }),
});

export const adminDashboardDataSchema = z.object({
  overview: dashboardOverviewSchema,
  ideasByStatus: z.array(countByStatusSchema),
  ideasByCategory: z.array(categoryCountSchema),
  purchasesByStatus: z.array(countByStatusSchema),
  trends: z.object({
    ideasLast30Days: z.array(trendDataPointSchema),
    purchasesLast30Days: z.array(trendDataPointSchema),
    revenueLast30Days: z.array(revenueTrendDataPointSchema),
  }),
  recent: z.object({
    pendingIdeas: z.array(z.unknown()),
    recentPurchases: z.array(recentPurchaseSchema),
    recentUsers: z.array(recentUserSchema),
  }),
  topIdeas: z.object({
    byVotes: z.array(topIdeaByVotesSchema),
    byPurchases: z.array(topIdeaByPurchaseSchema),
  }),
});

export type IAdminDashboardDataValidated = z.infer<
  typeof adminDashboardDataSchema
>;

export const adminDashboardResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: adminDashboardDataSchema,
});
