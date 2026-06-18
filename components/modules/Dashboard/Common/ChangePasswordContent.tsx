"use client";

import AppField from "@/components/shared/Form/AppField";
import AppSubmitButton from "@/components/shared/Form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { changePassword } from "@/service/auth.service";
import { changePasswordSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Eye, EyeOff, Key } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordContent = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Password changed successfully");
        form.reset();
        setServerError(null);
      } else {
        setServerError(res.message || "Failed to change password");
      }
    },
    onError: (error: Error) => {
      setServerError(error.message || "An unexpected error occurred");
    },
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const parsed = changePasswordSchema.safeParse(value);

      if (!parsed.success) {
        setServerError(parsed.error.issues[0]?.message || "Invalid form data");
        return;
      }

      mutation.mutate(parsed.data);
    },
  });

  const passwordToggle = (show: boolean, setShow: (v: boolean) => void) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setShow(!show)}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          Change Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="h-5 w-5" />
            Password Settings
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
              name="currentPassword"
              validators={{
                onChange: changePasswordSchema.shape.currentPassword,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Current Password"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  append={passwordToggle(showCurrent, setShowCurrent)}
                />
              )}
            </form.Field>

            <form.Field
              name="newPassword"
              validators={{ onChange: changePasswordSchema.shape.newPassword }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="New Password"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  append={passwordToggle(showNew, setShowNew)}
                />
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{
                onChange: changePasswordSchema.shape.confirmPassword,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Confirm New Password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  append={passwordToggle(showConfirm, setShowConfirm)}
                />
              )}
            </form.Field>

            <AppSubmitButton
              isPending={mutation.isPending}
              pendingLabel="Updating..."
              className="w-fit"
            >
              Update Password
            </AppSubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordContent;
