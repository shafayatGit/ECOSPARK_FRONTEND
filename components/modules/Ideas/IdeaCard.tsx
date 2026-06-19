"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { getVoteScore, truncatePreview } from "@/lib/ideaUtils";
import { PublicIdea } from "@/types/idea.types";
import { ArrowBigDown, ArrowBigUp, Lock, MessageSquare } from "lucide-react";
import Link from "next/link";

interface IdeaCardProps {
  idea: PublicIdea;
}

const IdeaCard = ({ idea }: IdeaCardProps) => {
  const score = getVoteScore(idea.upvoteCount, idea.downvoteCount);

  return (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="gap-3 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{idea.category.name}</Badge>
          {idea.isPaid && (
            <Badge variant="secondary" className="gap-1">
              <Lock className="size-3" />
              {idea.price ? formatCurrency(idea.price) : "Premium"}
            </Badge>
          )}
        </div>
        <Link href={`/ideas/${idea.id}`} className="block">
          <h3 className="font-heading line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
            {idea.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground">by {idea.author.name}</p>
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {truncatePreview(idea.problemStatement, 180)}
        </p>
        {idea.isPaid && (
          <p className="mt-3 text-xs text-muted-foreground italic">
            Purchase to unlock the full solution and description.
          </p>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1"
            title={`${idea.upvoteCount} upvotes, ${idea.downvoteCount} downvotes`}
          >
            <ArrowBigUp className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-foreground">{score}</span>
            <ArrowBigDown className="size-4 text-red-500" />
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-4" />
            {idea._count.comments}
          </span>
        </div>
        <Link
          href={`/ideas/${idea.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
