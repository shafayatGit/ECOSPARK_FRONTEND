"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { getComments } from "@/service/comments.service";
import { initiatePurchase } from "@/service/memberPurchases.service";
import { getPublicIdeaById } from "@/service/publicIdeas.service";
import { getMyVote } from "@/service/votes.service";
import { VoteType } from "@/types/vote.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const router = useRouter();
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

  const shouldFetchComments =
    !!ideaResponse?.success &&
    !!ideaResponse.data &&
    (!ideaResponse.data.isPaid ||
      ideaResponse.data.hasFullAccess ||
      ideaResponse.data.isAuthor);

  const { data: commentsResponse, isLoading: commentsLoading } = useQuery({
    queryKey: ["idea-comments", ideaId],
    queryFn: () => getComments(ideaId),
    enabled: shouldFetchComments,
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

  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentCheckAttempts, setPaymentCheckAttempts] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (!payment) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("payment");
    const nextQuery = nextParams.toString();
    const nextUrl = `/ideas/${ideaId}${nextQuery ? `?${nextQuery}` : ""}`;

    if (payment === "success") {
      toast.success("Payment completed. Refreshing idea access...");
      setIsCheckingPayment(true);
      setPaymentCheckAttempts(0);
      refetch();
    } else if (payment === "cancelled") {
      toast.message("Checkout cancelled");
    }

    router.replace(nextUrl);
  }, [ideaId, refetch, router, searchParams]);

  useEffect(() => {
    if (!isCheckingPayment || isLoading || !ideaResponse?.data) {
      return;
    }

    const idea = ideaResponse.data;
    const hasFullAccess = idea.isPaid ? !!idea.hasFullAccess : true;
    const isPremiumLocked = idea.isPaid && !hasFullAccess;

    if (!isPremiumLocked) {
      setIsCheckingPayment(false);
      return;
    }

    if (paymentCheckAttempts >= 5) {
      toast.error(
        "Payment is still processing. Please wait a moment and refresh the page.",
      );
      setIsCheckingPayment(false);
      return;
    }

    const timer = window.setTimeout(() => {
      refetch();
      setPaymentCheckAttempts((count) => count + 1);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [
    isCheckingPayment,
    paymentCheckAttempts,
    isLoading,
    ideaResponse,
    refetch,
  ]);

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
  const hasFullAccess = idea.isPaid ? !!idea.hasFullAccess : true;
  const isPremiumLocked = idea.isPaid && !hasFullAccess;
  const canViewDiscussion = !isPremiumLocked || idea.isAuthor;
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
          isAuthor={idea.isAuthor}
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

          {isPremiumLocked ? (
            <Alert className="border-amber-300/70 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-950/30">
              <Lock className="size-4" />
              <AlertDescription className="space-y-3">
                <div>
                  <p className="font-medium text-foreground">
                    Unlock this premium idea
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pay once to view the proposed solution, extended
                    description, images, and discussion for this idea.
                  </p>
                </div>
                <Button
                  onClick={handlePurchase}
                  disabled={purchaseMutation.isPending}
                  className="w-fit"
                >
                  {purchaseMutation.isPending
                    ? "Redirecting..."
                    : isAuthenticated
                      ? "Pay now"
                      : "Login to unlock"}
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <section className="relative space-y-3">
                <h2 className="font-heading text-xl font-semibold">
                  Proposed Solution
                </h2>

                <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {idea.proposedSolution}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-heading text-xl font-semibold">
                  Extended Description
                </h2>
                <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {idea.description}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-heading text-xl font-semibold">Images</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {idea.imageUrls.map((url, index) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setSelectedImage(url)}
                      className="overflow-hidden rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`View ${idea.title} image ${index + 1}`}
                    >
                      <img
                        src={url}
                        alt={`${idea.title} image ${index + 1}`}
                        className="aspect-video w-full object-cover transition-transform duration-200 hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </section>

              {idea.isPaid && hasFullAccess && (
                <Alert>
                  <AlertDescription>
                    You have full access to this premium idea.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
          }
        }}
      >
        <DialogContent className="max-w-5xl border-0 bg-background/95 p-0 sm:max-w-5xl">
          {selectedImage ? (
            <div className="p-2">
              <img
                src={selectedImage}
                alt={`${idea.title} full view`}
                className="max-h-[80vh] w-full rounded-lg object-contain"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {canViewDiscussion && (
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
      )}
    </div>
  );
};

export default IdeaDetailContent;
