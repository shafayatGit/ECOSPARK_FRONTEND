import { Comment } from "@/types/comment.types";

export function buildCommentTree(comments: Comment[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  for (const comment of comments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of map.values()) {
    if (comment.parentId && map.has(comment.parentId)) {
      map.get(comment.parentId)!.replies!.push(comment);
    } else if (!comment.parentId) {
      roots.push(comment);
    }
  }

  return roots;
}

export function truncatePreview(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function getVoteScore(upvotes: number, downvotes: number): number {
  return upvotes - downvotes;
}
