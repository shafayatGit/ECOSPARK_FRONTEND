"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { resetPasswordAction } from "@/app/(commonLayout)/(authRouteGroup)/reset-password/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppField from "../../shared/Form/AppField";
import AppSubmitButton from "../../shared/Form/AppSubmitButton";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";

const ResetPasswordFormContent = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IResetPasswordPayload) => resetPasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: emailParam,
      otp: "",
      newPassword: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (result && !result.success) {
          setServerError(result.message || "Failed to reset password.");
          return;
        }

        if (result?.success) {
          setSuccessMessage(result.message || "Password reset successfully!");
          setTimeout(() => {
            if (result.redirectPath) {
              router.push(result.redirectPath);
            }
          }, 2000);
        }
      } catch (error: any) {
        console.log(`Reset password failed: ${error?.message} ${error}`);
        setServerError(`Reset password failed: ${error?.message || "Unexpected error"}`);
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-xl">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Reset Password
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Enter the OTP sent to your email and your new password.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{ onChange: resetPasswordZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
                disabled={!!emailParam}
              />
            )}
          </form.Field>

          <form.Field
            name="otp"
            validators={{ onChange: resetPasswordZodSchema.shape.otp }}
          >
            {(field) => (
              <AppField
                field={field}
                label="OTP Verification Code"
                type="text"
                placeholder="Enter 6-digit OTP code"
              />
            )}
          </form.Field>

          <form.Field
            name="newPassword"
            validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Resetting Password..."
                disabled={!canSubmit}
              >
                Reset Password
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4 px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Log In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

const ResetPasswordForm = () => {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading Reset Form...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
};

export default ResetPasswordForm;
