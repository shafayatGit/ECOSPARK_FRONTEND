export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface IdeaVote {
  id: string;
  userId: string;
  ideaId: string;
  type: VoteType;
  createdAt: string;
}

export interface VoteSummary {
  upvoteCount: number;
  downvoteCount: number;
  userVote: VoteType | null;
}
