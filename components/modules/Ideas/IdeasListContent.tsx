"use client";

import SearchInput from "@/components/shared/Admin/SearchInput";
import TablePagination from "@/components/shared/Admin/TablePagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from "@/service/category.service";
import { getPublicIdeas } from "@/service/publicIdeas.service";
import { IPublicIdeaListQuery } from "@/zod/listQuery.validation";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Lightbulb, RefreshCw, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import IdeaCard from "./IdeaCard";

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "topVoted", label: "Top voted" },
  { value: "mostCommented", label: "Most commented" },
];

const PAID_OPTIONS = [
  { value: "all", label: "All ideas" },
  { value: "true", label: "Premium only" },
  { value: "false", label: "Free only" },
];

interface IdeasListContentProps {
  initialCategory?: string;
}

const IdeasListContent = ({ initialCategory, user }: IdeasListContentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(user);

  const categoryParam =
    searchParams.get("category") ||
    searchParams.get("categoryId") ||
    initialCategory ||
    "";
  const sortParam = searchParams.get("sort") || "recent";
  const paidParam = searchParams.get("isPaid") || "all";
  const pageParam = Number(searchParams.get("page") || "1");
  const qParam = searchParams.get("q") || "";

  const [search, setSearch] = useState(qParam);
  const [debouncedSearch, setDebouncedSearch] = useState(qParam);

  useEffect(() => {
    setSearch(qParam);
    setDebouncedSearch(qParam);
  }, [qParam]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (!("page" in updates)) {
        params.delete("page");
      }

      const query = params.toString();
      router.push(query ? `/ideas?${query}` : "/ideas");
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== qParam) {
      updateParams({ q: debouncedSearch || null, page: null });
    }
  }, [debouncedSearch, qParam, updateParams]);

  const { data: categoriesResponse } = useQuery({
    queryKey: ["public-categories"],
    queryFn: () =>
      getCategories({ limit: 100, sortBy: "name", sortOrder: "asc" }),
  });

  const categories = (
    categoriesResponse?.success && categoriesResponse.data
      ? categoriesResponse.data
      : []
  ).filter((cat) => cat !== null);

  const activeCategory = categories.find(
    (cat) => cat.slug === categoryParam || cat.id === categoryParam,
  );

  const queryParams: IPublicIdeaListQuery = {
    page: pageParam,
    limit: 12,
    sort: sortParam as IPublicIdeaListQuery["sort"],
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
    ...(categoryParam
      ? activeCategory
        ? { category: activeCategory.slug }
        : { categoryId: categoryParam }
      : {}),
    ...(paidParam !== "all" ? { isPaid: paidParam as "true" | "false" } : {}),
  };

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["public-ideas", queryParams],
    queryFn: () => getPublicIdeas(queryParams),
  });

  const ideas = response?.success ? (response.data ?? []) : [];
  const meta = response?.meta;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-10 mt-20">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Explore Ideas
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse approved sustainability ideas from the community. Filter by
          category, sort by votes, and unlock premium content with a purchase.
        </p>
      </div>

      {activeCategory && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtered by</span>
          <Badge variant="secondary" className="gap-2 pr-1">
            {activeCategory.name}
            <button
              type="button"
              aria-label="Clear category filter"
              className="rounded-full p-0.5 hover:bg-muted"
              onClick={() =>
                updateParams({ category: null, categoryId: null, page: null })
              }
            >
              <X className="size-3" />
            </button>
          </Badge>
          <Button variant="link" size="sm" className="h-auto p-0" asChild>
            <Link href="/categories">Browse categories</Link>
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search ideas..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={activeCategory?.id || "all"}
            onValueChange={(value) =>
              updateParams({
                category:
                  value === "all"
                    ? null
                    : categories.find((c) => c.id === value)?.slug || value,
                categoryId: null,
                page: null,
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                  {category._count?.ideas != null && (
                    <span className="text-muted-foreground">
                      {" "}
                      ({category._count.ideas})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortParam}
            onValueChange={(value) => updateParams({ sort: value, page: null })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paidParam}
            onValueChange={(value) =>
              updateParams({
                isPaid: value === "all" ? null : value,
                page: null,
              })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {PAID_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh ideas"
          >
            <RefreshCw className={isFetching ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {!response?.success && !isLoading ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {response?.message || "Failed to load ideas."}
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lightbulb />
            </EmptyMedia>
            <EmptyTitle>No ideas found</EmptyTitle>
            <EmptyDescription>
              {debouncedSearch || categoryParam || paidParam !== "all"
                ? "Try adjusting your filters or search terms."
                : "Approved ideas will appear here once published."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} user={user} />
            ))}
          </div>

          {meta && (
            <TablePagination
              meta={meta}
              onPageChange={(page) =>
                updateParams({ page: page > 1 ? String(page) : null })
              }
              isLoading={isFetching}
            />
          )}
        </>
      )}
    </div>
  );
};

export default IdeasListContent;
