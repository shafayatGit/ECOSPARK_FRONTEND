import { z } from "zod";

const booleanFromString = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "off", ""].includes(normalized)) return false;
  }
  return value;
}, z.boolean());

const numberFromString = z.preprocess((value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return undefined;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
}, z.number());

const paidIdeaRefinement = (
  data: { isPaid?: boolean; price?: number },
  ctx: z.RefinementCtx,
) => {
  if (data.isPaid && (data.price === undefined || data.price <= 0)) {
    ctx.addIssue({
      code: "custom",
      message: "Price is required and must be greater than 0 for paid ideas",
      path: ["price"],
    });
  }
  if (!data.isPaid && data.price !== undefined) {
    ctx.addIssue({
      code: "custom",
      message: "Price should not be set for free ideas",
      path: ["price"],
    });
  }
};

export const createIdeaSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    problemStatement: z
      .string()
      .min(20, "Problem statement must be at least 20 characters"),
    proposedSolution: z
      .string()
      .min(20, "Proposed solution must be at least 20 characters"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    isPaid: booleanFromString.optional().default(false),
    price: numberFromString
      .optional()
      .refine(
        (value) => value === undefined || value > 0,
        "Price must be greater than 0",
      ),
  })
  .superRefine(paidIdeaRefinement);

export const updateIdeaSchema = z
  .object({
    title: z.string().min(5).optional(),
    problemStatement: z.string().min(20).optional(),
    proposedSolution: z.string().min(20).optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1).optional(),
    isPaid: booleanFromString.optional(),
    price: numberFromString
      .optional()
      .refine(
        (value) => value === undefined || value > 0,
        "Price must be greater than 0",
      ),
  })
  .superRefine(paidIdeaRefinement);

export const rejectIdeaSchema = z.object({
  rejectionFeedback: z
    .string()
    .min(10, "Rejection feedback must be at least 10 characters"),
});

export type ICreateIdeaPayload = z.infer<typeof createIdeaSchema>;
export type IUpdateIdeaPayload = z.infer<typeof updateIdeaSchema>;
export type IRejectIdeaPayload = z.infer<typeof rejectIdeaSchema>;
