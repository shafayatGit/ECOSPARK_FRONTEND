"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AppField from "@/components/shared/Form/AppField";
import { useImageUpload } from "@/hooks/useImageUpload";
import { IMAGE_CONSTRAINTS } from "@/lib/imageUploadUtils";
import { getUserInfo, updateUserProfile } from "@/service/auth.service";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Camera, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

export function ProfileSettingsContent() {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    selectedFile,
    previewUrl,
    error: imageError,
    handleFileSelect: onImageSelect,
    clearFile: onClearImage,
  } = useImageUpload(IMAGE_CONSTRAINTS.PROFILE_IMAGE_MAX_SIZE);

  const { data: userResponse, isLoading: userLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => getUserInfo(),
  });

  const user = userResponse;
  const imagePreview = previewUrl || user?.image || null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onImageSelect(file);
  };

  const clearImage = () => {
    onClearImage();
  };

  const updateMutation = useMutation({
    mutationFn: async (values: ProfileUpdateData) => {
      setServerError(null);
      const result = await updateUserProfile({
        name: values.name,
        image: selectedFile?.file,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },

    onSuccess: (result) => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      onClearImage();

      if (result.data) {
        form.setFieldValue("name", result.data.name ?? "");
      }
    },

    onError: (error: Error) => {
      setServerError(error.message);
      toast.error(error.message);
    },
  });

  const form = useForm({
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  useEffect(() => {
    if (user?.name) {
      form.setFieldValue("name", user.name);
    }
  }, [user?.name, form]);

  const handleSubmit = async (values: ProfileUpdateData) => {
    const parsed = profileUpdateSchema.safeParse(values);

    if (!parsed.success) {
      setServerError(parsed.error.issues[0]?.message || "Invalid form data");
      return;
    }

    updateMutation.mutate(parsed.data);
  };

  if (userLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load profile. Please refresh and try again.
        </AlertDescription>
      </Alert>
    );
  }

  const displayName = user.name || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Profile Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account information and profile picture
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Update your profile information and picture
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewUrl || user.image} alt={user.name} />
                <AvatarFallback className="text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-lg">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {selectedFile
                  ? `New image selected: ${selectedFile.file.name}`
                  : "No new image selected"}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t pt-6" />

          {/* Update Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(form.state.values);
            }}
            className="space-y-4"
          >
            {/* Name Field */}
            <form.Field
              name="name"
              validators={{
                onChange: profileUpdateSchema.shape.name,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Full Name"
                  type="text"
                  placeholder="Enter your name"
                />
              )}
            </form.Field>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative inline-block">
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  width={120}
                  height={120}
                  className="h-28 w-28 rounded-2xl object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-lg transition-transform hover:scale-110"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-2">
              {/* <Label htmlFor="image">Profile Picture</Label> */}
              <div className="relative">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
                <label
                  htmlFor="image"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 px-4 py-6 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Upload className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {selectedFile?.file.name || "Upload image"}
                  </span>
                </label>
              </div>
            </div>

            {/* Error Alert */}
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <form.Subscribe selector={(s) => [s.canSubmit, s.isDirty]}>
              {([canSubmit, isDirty]) => (
                <Button
                  type="submit"
                  disabled={
                    updateMutation.isPending ||
                    (!isDirty && !selectedFile) ||
                    !!imageError
                  }
                  className="w-full"
                >
                  {updateMutation.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="border-t pt-3">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
