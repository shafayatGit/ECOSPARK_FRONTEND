import { z } from "zod";

export const baseListQuerySchema = z.object({
  searchTerm: z.string().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  sort: z.enum(["recent", "topVoted", "mostCommented"]).optional(),
  fields: z.string().optional(),
  include: z.string().optional(),
});

export const adminIdeaListQuerySchema = baseListQuerySchema.extend({
  status: z.string().optional(),
  isPaid: z.enum(["true", "false"]).optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
});

export const categoryListQuerySchema = baseListQuerySchema.extend({
  name: z.string().optional(),
  slug: z.string().optional(),
  createdById: z.string().optional(),
});

export const purchaseListQuerySchema = baseListQuerySchema.extend({
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
  gateway: z.string().optional(),
  ideaId: z.string().optional(),
});

export type IAdminIdeaListQuery = z.infer<typeof adminIdeaListQuerySchema>;
export type ICategoryListQuery = z.infer<typeof categoryListQuerySchema>;
export type IPurchaseListQuery = z.infer<typeof purchaseListQuerySchema>;
