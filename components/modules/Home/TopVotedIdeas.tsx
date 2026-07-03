import { getPublicIdeas } from "@/service/publicIdeas.service";
import { getUserInfo } from "@/service/auth.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Lock,
  Flame,
  User,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { getVoteScore, truncatePreview } from "@/lib/ideaUtils";

export default async function TopVotedIdeas() {
  const [ideasResponse, user] = await Promise.all([
    getPublicIdeas({ sort: "topVoted", limit: 3 }),
    getUserInfo(),
  ]);

  const ideas = ideasResponse?.success && ideasResponse.data ? ideasResponse.data : [];

  if (ideas.length === 0) {
    return null; // Don't show the section if no ideas exist
  }

  return (
    <section className="relative overflow-hidden py-24 px-4 md:px-6 lg:px-8 bg-background">
      {/* Background Decorative Radial Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider dark:bg-amber-400/10 dark:text-amber-400">
              <Flame className="size-3.5 fill-current animate-pulse" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground font-heading">
              Top Voted Solutions
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Explore the most popular ideas backed by our community. Upvote, discuss, and support innovations that drive green impact.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="rounded-xl font-medium group border-primary/20 hover:bg-primary/5">
            <Link href="/ideas">
              Explore All Ideas
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map((idea) => {
            const score = getVoteScore(idea.upvoteCount, idea.downvoteCount);
            const isPremium = idea.isPaid;

            return (
              <div
                key={idea.id}
                className="group relative flex flex-col rounded-2xl transition-all duration-300"
              >
                {/* Glow border on hover */}
                <div className="absolute -inset-[1px] rounded-2xl bg-linear-to-r from-emerald-500 to-primary opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

                <Card className="relative flex flex-col h-full bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl transition-all duration-300 group-hover:bg-card/90 group-hover:translate-y-[-4px] overflow-hidden">
                  <CardHeader className="p-6 pb-4 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-xs font-medium border-primary/30 text-primary">
                        {idea.category.name}
                      </Badge>
                      {isPremium && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-amber-400/10 dark:text-amber-400">
                          <Lock className="size-3" />
                          <span>{idea.price ? formatCurrency(idea.price) : "Premium"}</span>
                        </Badge>
                      )}
                    </div>

                    <Link href={`/ideas/${idea.id}`} className="block">
                      <h3 className="text-xl font-semibold text-foreground font-heading leading-snug tracking-tight hover:text-primary transition-colors line-clamp-2">
                        {idea.title}
                      </h3>
                    </Link>
                  </CardHeader>

                  <CardContent className="px-6 pb-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                        {truncatePreview(idea.problemStatement, 180)}
                      </p>
                      {isPremium && (
                        <p className="mt-3 text-xs text-muted-foreground/80 italic flex items-center gap-1.5">
                          <Lock className="size-3 text-amber-500" />
                          <span>Purchase to unlock proposed solutions & descriptions.</span>
                        </p>
                      )}
                    </div>

                    {/* Author details */}
                    <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/30">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                        {idea.author?.image ? (
                          <img
                            src={idea.author.image}
                            alt={idea.author.name}
                            className="size-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="size-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {idea.author.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Innovator
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 border-t border-border/30 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground mt-auto">
                    <div className="flex items-center gap-4">
                      <div
                        className="inline-flex items-center gap-1 bg-background/50 border border-border/60 px-2 py-1 rounded-lg"
                        title={`${idea.upvoteCount} upvotes, ${idea.downvoteCount} downvotes`}
                      >
                        <ArrowBigUp className="size-4.5 text-emerald-600 dark:text-emerald-400 fill-current" />
                        <span className="font-semibold text-foreground text-sm">{score}</span>
                        <ArrowBigDown className="size-4.5 text-red-500" />
                      </div>
                      <div className="inline-flex items-center gap-1.5 bg-background/50 border border-border/60 px-2.5 py-1 rounded-lg">
                        <MessageSquare className="size-4" />
                        <span className="font-medium text-foreground text-sm">{idea._count.comments}</span>
                      </div>
                    </div>

                    <div>
                      {user ? (
                        <Link
                          href={`/ideas/${idea.id}`}
                          className="inline-flex items-center text-xs font-semibold text-primary hover:underline group/btn"
                        >
                          View Details
                          <ArrowRight className="ml-1 size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </Link>
                      ) : (
                        <Link
                          href={`/register`}
                          className="inline-flex items-center text-xs font-semibold text-primary hover:underline group/btn"
                        >
                          Join to view
                          <ArrowRight className="ml-1 size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                        </Link>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
