"use client";

import { ConfirmActionDialog } from "@/components/modules/Dashboard/Admin/IdeaManagement/RejectIdeaDialog";
import SearchInput from "@/components/shared/Admin/SearchInput";
import TablePagination from "@/components/shared/Admin/TablePagination";
import DateCell from "@/components/shared/Cell/DataCell";
import AppField from "@/components/shared/Form/AppField";
import AppSubmitButton from "@/components/shared/Form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "@/service/category.service";
import { Category } from "@/types/category.types";
import {
  ICreateCategoryPayload,
  createCategorySchema,
} from "@/zod/category.validation";
import { ICategoryListQuery } from "@/zod/listQuery.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, FolderTree, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const CategoryManagementContent = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const queryParams: ICategoryListQuery = {
    page,
    limit: 10,
    sortBy: "name",
    sortOrder: "asc",
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["categories", queryParams],
    queryFn: () => getCategories(queryParams),
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
  });

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);

      const payload: ICreateCategoryPayload = {
        name: value.name,
        slug: value.slug,
        ...(value.description ? { description: value.description } : {}),
      };

      const parsed = createCategorySchema.safeParse(payload);

      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message || "Invalid form data.");
        return;
      }

      const result = await createMutation.mutateAsync(parsed.data);

      if (!result.success) {
        setFormError(result.message || "Failed to create category.");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["categories"] });
      form.reset();
      setSlugTouched(false);
      setCreateOpen(false);
    },
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setActionError(null);
    const result = await deleteMutation.mutateAsync(deleteTarget.id);

    if (!result.success) {
      setActionError(result.message || "Failed to delete category.");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["categories"] });
    setDeleteTarget(null);
  };

  const categories = response?.success ? (response.data ?? []) : [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Category Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage idea categories for the EcoSpark community.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={isFetching ? "animate-spin" : ""}
              data-icon="inline-start"
            />
            Refresh
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus data-icon="inline-start" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
                <DialogDescription>
                  Add a new category for organizing sustainability ideas.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="space-y-4"
              >
                {formError && (
                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <form.Field
                  name="name"
                  validators={{
                    onChange: createCategorySchema.shape.name,
                  }}
                  listeners={{
                    onChange: ({ value }) => {
                      if (!slugTouched) {
                        form.setFieldValue("slug", slugify(value));
                      }
                    },
                  }}
                >
                  {(field) => (
                    <AppField
                      field={field}
                      label="Name"
                      placeholder="Renewable Energy"
                    />
                  )}
                </form.Field>

                <form.Field
                  name="slug"
                  validators={{
                    onChange: createCategorySchema.shape.slug,
                  }}
                  listeners={{
                    onChange: () => setSlugTouched(true),
                  }}
                >
                  {(field) => (
                    <AppField
                      field={field}
                      label="Slug"
                      placeholder="renewable-energy"
                    />
                  )}
                </form.Field>

                <form.Field name="description">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="description">
                        Description (optional)
                      </Label>
                      <Textarea
                        id="description"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Brief description of this category"
                        rows={3}
                      />
                    </div>
                  )}
                </form.Field>

                <AppSubmitButton
                  isPending={createMutation.isPending}
                  pendingLabel="Creating..."
                >
                  Create Category
                </AppSubmitButton>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {actionError && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="gap-4">
          <CardTitle>Categories</CardTitle>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search categories..."
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !response?.success ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>
                {response?.message || "Failed to load categories."}
              </AlertDescription>
            </Alert>
          ) : categories.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderTree />
                </EmptyMedia>
                <EmptyTitle>No categories found</EmptyTitle>
                <EmptyDescription>
                  Create your first category to organize ideas.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Slug
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="text-center">Ideas</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Created
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                          <div className="text-xs text-muted-foreground sm:hidden">
                            {category.slug}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {category.slug}
                        </TableCell>
                        <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                          {category.description || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {category._count?.ideas ?? 0}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <DateCell date={category.createdAt} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteTarget(category)}
                          >
                            <Trash2 data-icon="inline-start" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <TablePagination
                meta={meta}
                onPageChange={setPage}
                isLoading={isFetching}
              />
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmActionDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CategoryManagementContent;
