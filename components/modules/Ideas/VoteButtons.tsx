"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { castVote, removeVote } from "@/service/votes.service";
import { VoteType } from "@/types/vote.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface VoteButtonsProps {
  ideaId: string;
  upvoteCount: number;
  downvoteCount: number;
  userVote: VoteType | null;
  disabled?: boolean;
  isAuthor?: boolean;
  className?: string;
}

const VoteButtons = ({
  ideaId,
  upvoteCount,
  downvoteCount,
  userVote,
  disabled = false,
  isAuthor = false,
  className,
}: VoteButtonsProps) => {
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (type: VoteType | "REMOVE") => {
      if (type === "REMOVE") {
        return removeVote(ideaId);
      }
      return castVote({ ideaId, type });
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || "Failed to update vote");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["public-idea", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["public-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["my-vote", ideaId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update vote");
    },
  });

  const handleVote = (type: VoteType) => {
    if (isAuthor) {
      toast.error("You cannot vote on your own idea.");
      return;
    }

    if (disabled) {
      toast.info("Sign in to vote on ideas", {
        action: {
          label: "Login",
          onClick: () => {
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
          },
        },
      });
      return;
    }

    if (userVote === type) {
      voteMutation.mutate("REMOVE");
      return;
    }

    voteMutation.mutate(type);
  };

  const score = upvoteCount - downvoteCount;
  const isPending = voteMutation.isPending;

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center rounded-lg border bg-muted/30",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={isPending}
        aria-label="Upvote"
        aria-pressed={userVote === "UPVOTE"}
        className={cn(
          "rounded-b-none hover:bg-emerald-500/10 hover:text-emerald-600",
          userVote === "UPVOTE" && "bg-emerald-500/10 text-emerald-600",
        )}
        onClick={() => handleVote("UPVOTE")}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowBigUp className="size-5" />
        )}
      </Button>

      <span className="px-2 py-1 text-sm font-semibold tabular-nums">
        {score}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={isPending}
        aria-label="Downvote"
        aria-pressed={userVote === "DOWNVOTE"}
        className={cn(
          "rounded-t-none hover:bg-red-500/10 hover:text-red-500",
          userVote === "DOWNVOTE" && "bg-red-500/10 text-red-500",
        )}
        onClick={() => handleVote("DOWNVOTE")}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowBigDown className="size-5" />
        )}
      </Button>

      {disabled && (
        <Link
          href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : `/ideas/${ideaId}`)}`}
          className="sr-only"
        >
          Login to vote
        </Link>
      )}
    </div>
  );
};

export default VoteButtons;
