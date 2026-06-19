"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from "@/service/category.service";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, FolderTree } from "lucide-react";
import Link from "next/link";

const CategoriesContent = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ["public-categories"],
    queryFn: () =>
      getCategories({ limit: 100, sortBy: "name", sortOrder: "asc" }),
  });

  const categories = (
    response?.success && response.data ? response.data : []
  ).filter((category) => category !== null);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Categories
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Explore sustainability ideas organized by topic. Select a category to
          browse approved ideas in that area.
        </p>
      </div>

      {!response?.success && !isLoading ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {response?.message || "Failed to load categories."}
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderTree />
            </EmptyMedia>
            <EmptyTitle>No categories yet</EmptyTitle>
            <EmptyDescription>
              Categories will appear here once created by admins.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/ideas?category=${encodeURIComponent(category.slug)}`}
              className="group block h-full"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                      <FolderTree className="size-5" />
                    </div>
                    {category._count?.ideas != null && (
                      <Badge variant="secondary">
                        {category._count.ideas}{" "}
                        {category._count.ideas === 1 ? "idea" : "ideas"}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-heading text-xl transition-colors group-hover:text-primary">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {category.description ||
                      `Browse sustainability ideas in ${category.name.toLowerCase()}.`}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    View ideas
                    <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesContent;
