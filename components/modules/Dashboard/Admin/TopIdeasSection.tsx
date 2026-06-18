import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatCurrency, truncateText } from "@/lib/formatters";
import {
  TopIdeaByPurchase,
  TopIdeaByVotes,
} from "@/types/dashboard.types";
import { Lightbulb, TrendingUp } from "lucide-react";

interface TopIdeasSectionProps {
  byVotes: TopIdeaByVotes[];
  byPurchases: TopIdeaByPurchase[];
}

const TopIdeasSection = ({ byVotes, byPurchases }: TopIdeasSectionProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Top Ideas by Votes</CardTitle>
          <CardDescription>Most upvoted community ideas</CardDescription>
        </CardHeader>
        <CardContent>
          {byVotes.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Lightbulb />
                </EmptyMedia>
                <EmptyTitle>No voted ideas</EmptyTitle>
                <EmptyDescription>
                  Ideas with votes will be ranked here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Idea</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="text-right">Votes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byVotes.map((idea) => (
                    <TableRow key={idea.id}>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate font-medium">
                          {truncateText(idea.title, 40)}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            {idea.author.name}
                          </span>
                          {idea.isPaid && (
                            <Badge variant="secondary" className="text-[10px]">
                              {idea.price
                                ? formatCurrency(idea.price)
                                : "Paid"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{idea.category.name}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium text-emerald-600 dark:text-emerald-400">
                          +{idea.upvoteCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {idea._count.comments} comments
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Ideas by Purchases</CardTitle>
          <CardDescription>Best performing paid content</CardDescription>
        </CardHeader>
        <CardContent>
          {byPurchases.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TrendingUp />
                </EmptyMedia>
                <EmptyTitle>No purchase data</EmptyTitle>
                <EmptyDescription>
                  Top earning ideas will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Idea</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byPurchases.map((item) => (
                    <TableRow key={item.idea.id}>
                      <TableCell className="max-w-[220px]">
                        <div className="truncate font-medium">
                          {truncateText(item.idea.title, 45)}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {item.idea.author.name} · {item.idea.category.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.purchaseCount}
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.totalRevenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TopIdeasSection;
