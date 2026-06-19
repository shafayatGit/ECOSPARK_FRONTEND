import { z } from "zod";

export const castVoteSchema = z.object({
  ideaId: z.string().min(1, "Idea is required"),
  type: z.enum(["UPVOTE", "DOWNVOTE"]),
});

export type ICastVotePayload = z.infer<typeof castVoteSchema>;
