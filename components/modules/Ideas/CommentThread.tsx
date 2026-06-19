"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createComment } from "@/service/comments.service";
import { Comment } from "@/types/comment.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageSquareReply } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MAX_DEPTH = 4;

interface CommentThreadProps {
  ideaId: string;
  comments: Comment[];
  isAuthenticated: boolean;
}

interface CommentItemProps {
  comment: Comment;
  ideaId: string;
  depth: number;
  isAuthenticated: boolean;
}

const CommentItem = ({
  comment,
  ideaId,
  depth,
  isAuthenticated,
}: CommentItemProps) => {
  const queryClient = useQueryClient();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const replyMutation = useMutation({
    mutationFn: () =>
      createComment({
        ideaId,
        content: replyText.trim(),
        parentId: comment.id,
      }),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || "Failed to post reply");
        return;
      }
      toast.success("Reply posted");
      setReplyText("");
      setReplyOpen(false);
      queryClient.invalidateQueries({ queryKey: ["idea-comments", ideaId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to post reply");
    },
  });

  const handleReply = () => {
    if (!isAuthenticated) {
      toast.info("Sign in to reply to comments");
      return;
    }
    if (!replyText.trim()) return;
    replyMutation.mutate();
  };

  return (
    <div
      className={cn(
        "space-y-3",
        depth > 0 && "ml-4 border-l pl-4 sm:ml-6 sm:pl-6",
      )}
    >
      <article className="rounded-lg border bg-card p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">{comment.author.name}</span>
          <span className="text-muted-foreground">·</span>
          <time
            className="text-muted-foreground"
            dateTime={comment.createdAt}
          >
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </time>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {comment.isDeleted ? (
            <span className="italic text-muted-foreground">[comment removed]</span>
          ) : (
            comment.content
          )}
        </p>

        {!comment.isDeleted && depth < MAX_DEPTH && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 h-8 px-2 text-muted-foreground"
            onClick={() => setReplyOpen((open) => !open)}
          >
            <MessageSquareReply data-icon="inline-start" />
            Reply
          </Button>
        )}

        {replyOpen && (
          <div className="mt-3 space-y-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
              maxLength={2000}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={replyMutation.isPending || !replyText.trim()}
                onClick={handleReply}
              >
                {replyMutation.isPending && (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                )}
                Post reply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplyOpen(false);
                  setReplyText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </article>

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          ideaId={ideaId}
          depth={depth + 1}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
};

const CommentThread = ({
  ideaId,
  comments,
  isAuthenticated,
}: CommentThreadProps) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createComment({
        ideaId,
        content: newComment.trim(),
      }),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || "Failed to post comment");
        return;
      }
      toast.success("Comment posted");
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["idea-comments", ideaId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to post comment");
    },
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast.info("Sign in to join the discussion");
      return;
    }
    if (!newComment.trim()) return;
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border bg-card p-4">
        <h3 className="font-heading text-lg font-semibold">Discussion</h3>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            isAuthenticated
              ? "Share your thoughts on this idea..."
              : "Sign in to leave a comment..."
          }
          rows={4}
          maxLength={2000}
          disabled={!isAuthenticated}
        />
        <Button
          disabled={createMutation.isPending || !newComment.trim() || !isAuthenticated}
          onClick={handleSubmit}
        >
          {createMutation.isPending && (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          )}
          Post comment
        </Button>
      </div>

      {comments.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          No comments yet. Be the first to share your perspective.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              ideaId={ideaId}
              depth={0}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
