"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { getComments } from "@/service/comments.service";
import { initiatePurchase } from "@/service/memberPurchases.service";
import { getPublicIdeaById } from "@/service/publicIdeas.service";
import { getMyVote } from "@/service/votes.service";
import { VoteType } from "@/types/vote.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Lock,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import CommentThread from "./CommentThread";
import VoteButtons from "./VoteButtons";

interface IdeaDetailContentProps {
  ideaId: string;
  isAuthenticated: boolean;
}

const IdeaDetailContent = ({
  ideaId,
  isAuthenticated,
}: IdeaDetailContentProps) => {
  const searchParams = useSearchParams();

  const {
    data: ideaResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["public-idea", ideaId],
    queryFn: () => getPublicIdeaById(ideaId),
  });

  const { data: voteResponse } = useQuery({
    queryKey: ["my-vote", ideaId],
    queryFn: () => getMyVote(ideaId),
    enabled: isAuthenticated && !!ideaResponse?.success,
  });

  const { data: commentsResponse, isLoading: commentsLoading } = useQuery({
    queryKey: ["idea-comments", ideaId],
    queryFn: () => getComments(ideaId),
    enabled: !!ideaResponse?.success && !!ideaResponse.data,
  });

  const purchaseMutation = useMutation({
    mutationFn: () => initiatePurchase(ideaId),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message || "Failed to start checkout");
        return;
      }
      if (result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start checkout");
    },
  });

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      toast.success("Payment completed. Refreshing idea access...");
      refetch();
    } else if (payment === "cancelled") {
      toast.message("Checkout cancelled");
    }
  }, [searchParams, refetch]);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent(`/ideas/${ideaId}`)}`;
      return;
    }
    purchaseMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !ideaResponse?.success || !ideaResponse.data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {ideaResponse?.message || "Idea not found or unavailable."}
          </AlertDescription>
        </Alert>
        <Button variant="link" className="mt-4 px-0" asChild>
          <Link href="/ideas">
            <ArrowLeft data-icon="inline-start" />
            Back to ideas
          </Link>
        </Button>
      </div>
    );
  }

  const idea = ideaResponse.data;
  const hasFullAccess = idea.hasFullAccess;
  const userVote = (voteResponse?.data?.type as VoteType | undefined) ?? null;
  const comments = commentsResponse?.data ?? [];

  return (
    <div className=" mt-10 mx-auto max-w-4xl space-y-8 px-6 py-10">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
        <Link href="/ideas">
          <ArrowLeft data-icon="inline-start" />
          Back to ideas
        </Link>
      </Button>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <VoteButtons
          ideaId={idea.id}
          upvoteCount={idea.upvoteCount}
          downvoteCount={idea.downvoteCount}
          userVote={userVote}
          disabled={!isAuthenticated}
        />

        <div className="min-w-0 flex-1 space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{idea.category.name}</Badge>
              {idea.isPaid && (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="size-3" />
                  {idea.price ? formatCurrency(idea.price) : "Premium"}
                </Badge>
              )}
              {idea.paymentRequired && (
                <Badge variant="outline" className="text-amber-600">
                  Payment required
                </Badge>
              )}
            </div>

            <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              {idea.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>by {idea.author.name}</span>
              <span>·</span>
              <time dateTime={idea.publishedAt || idea.createdAt}>
                {formatDistanceToNow(
                  new Date(idea.publishedAt || idea.createdAt),
                  { addSuffix: true },
                )}
              </time>
              <span>·</span>
              {/* <span className="inline-flex items-center gap-1">
                <MessageSquare className="size-4" />
                {idea._count.comments} comments
              </span> */}
            </div>
          </header>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">
              Problem Statement
            </h2>
            <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {idea.problemStatement}
            </p>
          </section>

          <section className="relative space-y-3">
            <h2 className="font-heading text-xl font-semibold">
              Proposed Solution
            </h2>

            {hasFullAccess && idea.proposedSolution ? (
              <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {idea.proposedSolution}
              </p>
            ) : (
              <div className="relative overflow-hidden rounded-xl border">
                <div className="space-y-2 p-4 blur-sm select-none">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-11/12 rounded bg-muted" />
                  <div className="h-4 w-4/5 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-background via-background/95 to-background/40 p-6 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Lock className="size-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Premium content locked</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      Purchase this idea to unlock the full solution,
                      description, and supporting details.
                    </p>
                  </div>
                  <Button
                    onClick={handlePurchase}
                    disabled={purchaseMutation.isPending}
                  >
                    {purchaseMutation.isPending ? (
                      <Loader2
                        className="animate-spin"
                        data-icon="inline-start"
                      />
                    ) : (
                      <Lock data-icon="inline-start" />
                    )}
                    Unlock for{" "}
                    {idea.price ? formatCurrency(idea.price) : "purchase"}
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground">
                      You&apos;ll be asked to sign in before checkout.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          {hasFullAccess && idea.description && (
            <section className="space-y-3">
              <h2 className="font-heading text-xl font-semibold">
                Extended Description
              </h2>
              <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {idea.description}
              </p>
            </section>
          )}

          {hasFullAccess && idea.imageUrls.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-heading text-xl font-semibold">Images</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {idea.imageUrls.map((url, index) => (
                  <img
                    key={url}
                    src={url}
                    alt={`${idea.title} image ${index + 1}`}
                    className="aspect-video w-full rounded-xl border object-cover"
                  />
                ))}
              </div>
            </section>
          )}

          {idea.isPaid && hasFullAccess && (
            <Alert>
              <AlertDescription>
                You have full access to this premium idea.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <section className="border-t pt-8">
        {commentsLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <CommentThread
            ideaId={ideaId}
            comments={comments}
            isAuthenticated={isAuthenticated}
          />
        )}
      </section>
    </div>
  );
};

export default IdeaDetailContent;
