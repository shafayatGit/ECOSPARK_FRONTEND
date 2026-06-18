"use client";

import AppField from "@/components/shared/Form/AppField";
import AppSubmitButton from "@/components/shared/Form/AppSubmitButton";
import StatusBadge from "@/components/shared/Admin/StatusBadge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserInfo, updateProfile } from "@/service/auth.service";
import { updateProfileSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MyProfileContent = () => {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserInfo,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        setServerError(null);
      } else {
        setServerError(res.message || "Failed to update profile");
      }
    },
    onError: (error: Error) => {
      setServerError(error.message || "An unexpected error occurred");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const parsed = updateProfileSchema.safeParse(value);

      if (!parsed.success) {
        setServerError(parsed.error.issues[0]?.message || "Invalid form data");
        return;
      }

      mutation.mutate(parsed.data);
    },
  });

  useEffect(() => {
    if (profile?.name) {
      form.setFieldValue("name", profile.name);
    }
  }, [profile?.name, form]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full max-w-xl" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load profile. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          My Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          View and update your account information.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Field
              name="name"
              validators={{ onChange: updateProfileSchema.shape.name }}
            >
              {(field) => <AppField field={field} label="Full Name" />}
            </form.Field>

            <div className="space-y-1.5">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Role</p>
                <StatusBadge status={profile.role} />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Status</p>
                <StatusBadge status={profile.status} />
              </div>
            </div>

            <AppSubmitButton
              isPending={mutation.isPending}
              pendingLabel="Saving..."
              className="w-fit"
            >
              Save Changes
            </AppSubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfileContent;
