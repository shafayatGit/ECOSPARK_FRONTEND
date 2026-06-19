import { z } from "zod";

export const createCommentSchema = z.object({
  ideaId: z.string().min(1, "Idea is required"),
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be at most 2000 characters"),
  parentId: z.string().optional(),
});

export type ICreateCommentPayload = z.infer<typeof createCommentSchema>;
