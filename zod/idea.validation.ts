import { z } from "zod";

export const rejectIdeaSchema = z.object({
  rejectionFeedback: z
    .string()
    .min(10, "Rejection feedback must be at least 10 characters"),
});

export type IRejectIdeaPayload = z.infer<typeof rejectIdeaSchema>;
