"use client";

import AppField from "@/components/shared/Form/AppField";
import AppSubmitButton from "@/components/shared/Form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MultiImageUploadField } from "@/components/shared/Form/ImageUploadField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMultiImageUpload } from "@/hooks/useImageUpload";
import { IMAGE_CONSTRAINTS } from "@/lib/imageUploadUtils";
import { getCategories } from "@/service/category.service";
import {
  createIdea,
  getIdeaById,
  submitIdea,
  updateIdea,
} from "@/service/memberIdeas.service";
import { ICreateIdeaPayload, createIdeaSchema } from "@/zod/idea.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const formDefaultValues = {
  title: "",
  problemStatement: "",
  proposedSolution: "",
  description: "",
  categoryId: "",
  price: "",
};

const CreateIdeaContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ideaId = searchParams.get("id");
  const isEditMode = Boolean(ideaId);
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const initializedIdeaId = useRef<string | null>(null);

  const {
    selectedFiles,
    previewUrls,
    error: imageError,
    handleFilesSelect,
    removeFile,
    clearError: clearImageError,
    fileCount,
  } = useMultiImageUpload(IMAGE_CONSTRAINTS.MAX_IDEA_IMAGES);

  const buildPayload = (
    value: typeof formDefaultValues,
  ): ICreateIdeaPayload => ({
    title: value.title.trim(),
    problemStatement: value.problemStatement.trim(),
    proposedSolution: value.proposedSolution.trim(),
    description: value.description.trim() || undefined,
    categoryId: value.categoryId,
    isPaid,
    ...(isPaid && value.price ? { price: Number(value.price) } : {}),
  });

  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories-for-idea"],
    queryFn: () =>
      getCategories({ page: 1, limit: 100, sortBy: "name", sortOrder: "asc" }),
  });

  const { data: ideaResponse, isLoading: ideaLoading } = useQuery({
    queryKey: ["idea-edit", ideaId],
    queryFn: () => getIdeaById(ideaId!),
    enabled: isEditMode,
  });

  const categories = categoriesResponse?.data ?? [];
  const existingIdea = ideaResponse?.data;

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      // Build FormData for multipart upload
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("problemStatement", payload.problemStatement);
      formData.append("proposedSolution", payload.proposedSolution);
      if (payload.description) {
        formData.append("description", payload.description);
      }
      formData.append("categoryId", payload.categoryId);
      formData.append("isPaid", String(payload.isPaid));
      if (payload.price) {
        formData.append("price", String(payload.price));
      }

      // Add images
      selectedFiles.forEach((item) => {
        formData.append("images", item.file);
      });

      if (isEditMode && ideaId) {
        return updateIdea(ideaId, formData);
      }
      return createIdea(formData);
    },
  });

  const submitMutation = useMutation({
    mutationFn: submitIdea,
  });

  const form = useForm({
    defaultValues: formDefaultValues,
  });

  const saveIdea = async (
    value: typeof formDefaultValues = form.state.values,
  ): Promise<string | null> => {
    setServerError(null);

    const parsed = createIdeaSchema.safeParse(buildPayload(value));

    if (!parsed.success) {
      setServerError(parsed.error.issues[0]?.message || "Invalid form data");
      return null;
    }

    const result = await saveMutation.mutateAsync(parsed.data);

    if (!result.success) {
      setServerError(result.message || "Failed to save idea");
      return null;
    }

    queryClient.invalidateQueries({ queryKey: ["my-ideas"] });

    const savedId = result.data?.id ?? ideaId;

    if (!isEditMode && result.data?.id) {
      router.replace(`/dashboard/create-idea?id=${result.data.id}`);
    }

    return savedId ?? null;
  };

  useEffect(() => {
    if (!existingIdea || initializedIdeaId.current === existingIdea.id) return;

    initializedIdeaId.current = existingIdea.id;
    form.setFieldValue("title", existingIdea.title);
    form.setFieldValue("problemStatement", existingIdea.problemStatement);
    form.setFieldValue("proposedSolution", existingIdea.proposedSolution);
    form.setFieldValue("description", existingIdea.description ?? "");
    form.setFieldValue("categoryId", existingIdea.categoryId);
    form.setFieldValue(
      "price",
      existingIdea.price ? String(existingIdea.price) : "",
    );
    setIsPaid(existingIdea.isPaid);
  }, [existingIdea, form]);

  const handleSaveDraft = async () => {
    const savedId = await saveIdea();

    if (!savedId) return;

    toast.success(
      isEditMode ? "Idea updated successfully" : "Idea saved as draft",
    );
  };

  const handleSubmitForReview = async () => {
    const savedId = await saveIdea();

    if (!savedId) return;

    setServerError(null);

    try {
      const result = await submitMutation.mutateAsync(savedId);

      if (!result.success) {
        setServerError(result.message || "Failed to submit idea for review");
        return;
      }

      toast.success(result.message || "Idea submitted for review");
      queryClient.invalidateQueries({ queryKey: ["my-ideas"] });
      router.push("/dashboard/my-ideas");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit idea for review";
      setServerError(message);
    }
  };

  const isLoading = categoriesLoading || (isEditMode && ideaLoading);
  const isSaving = saveMutation.isPending;
  const isSubmitting = submitMutation.isPending;

  if (isEditMode && ideaResponse && !ideaResponse.success) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {ideaResponse.message || "Failed to load idea for editing."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-2 -ml-2 w-fit"
          >
            <Link href="/dashboard/my-ideas">
              <ArrowLeft data-icon="inline-start" />
              Back to My Ideas
            </Link>
          </Button>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            {isEditMode ? "Edit Idea" : "Create Idea"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update your draft or rejected idea before resubmitting."
              : "Fill in the details below to create a new idea draft."}
          </p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-lg">Idea Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void handleSaveDraft();
              }}
              className="space-y-5"
            >
              {serverError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              <form.Field name="title">
                {(field) => (
                  <AppField
                    field={field}
                    label="Title"
                    placeholder="Give your idea a clear title"
                  />
                )}
              </form.Field>

              <form.Field name="categoryId">
                {(field) => {
                  const categoryError =
                    serverError === "Category is required" ||
                    (serverError?.includes("Category") && !field.state.value);

                  return (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="categoryId"
                        className={
                          categoryError ? "text-destructive" : undefined
                        }
                      >
                        Category
                      </Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger
                          id="categoryId"
                          aria-invalid={categoryError}
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter(
                              (
                                category,
                              ): category is NonNullable<typeof category> =>
                                category != null,
                            )
                            .map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {!field.state.value && serverError && (
                        <p className="text-sm text-destructive" role="alert">
                          Please select a category
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>

              <form.Field name="problemStatement">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>Problem Statement</Label>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Describe the environmental problem your idea addresses"
                      rows={4}
                      aria-invalid={
                        serverError?.includes("Problem statement") ?? false
                      }
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="proposedSolution">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>Proposed Solution</Label>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Explain your proposed sustainability solution"
                      rows={4}
                      aria-invalid={
                        serverError?.includes("Proposed solution") ?? false
                      }
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>
                      Additional Description (optional)
                    </Label>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Any extra context, impact, or implementation notes"
                      rows={3}
                    />
                  </div>
                )}
              </form.Field>

              {/* Images Upload */}
              <MultiImageUploadField
                label="Idea Images (Optional)"
                previewUrls={previewUrls}
                error={imageError}
                isLoading={isSaving}
                disabled={isSaving || isSubmitting}
                onFilesSelect={handleFilesSelect}
                onRemove={removeFile}
                maxFiles={IMAGE_CONSTRAINTS.MAX_IDEA_IMAGES}
                maxSize={IMAGE_CONSTRAINTS.IDEA_IMAGE_MAX_SIZE}
                placeholder="Upload up to 4 images for your idea"
                fileNames={selectedFiles.map((item) => item.file.name)}
              />

              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isPaid"
                    checked={isPaid}
                    onCheckedChange={(checked) => setIsPaid(checked === true)}
                  />
                  <Label htmlFor="isPaid">This is a paid idea</Label>
                </div>

                {isPaid && (
                  <form.Field name="price">
                    {(field) => (
                      <AppField
                        field={field}
                        label="Price (USD)"
                        type="number"
                        placeholder="0.00"
                      />
                    )}
                  </form.Field>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <AppSubmitButton
                  isPending={isSaving}
                  pendingLabel="Saving..."
                  className="w-fit"
                >
                  {isEditMode ? "Save Changes" : "Save as Draft"}
                </AppSubmitButton>

                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSaving || isSubmitting}
                  onClick={() => void handleSubmitForReview()}
                >
                  <Send data-icon="inline-start" />
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateIdeaContent;
