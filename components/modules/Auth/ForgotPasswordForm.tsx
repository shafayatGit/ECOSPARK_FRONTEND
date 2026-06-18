"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotPasswordAction } from "@/app/(commonLayout)/(authRouteGroup)/forgot-password/_action";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppField from "../../shared/Form/AppField";
import AppSubmitButton from "../../shared/Form/AppSubmitButton";
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/zod/auth.validation";

const ForgotPasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IForgotPasswordPayload) => forgotPasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (result && !result.success) {
          setServerError(result.message || "Failed to submit request.");
          return;
        }

        if (result?.success) {
          setSuccessMessage(result.message || "Password reset OTP sent to your email.");
          // Delay redirect to allow user to see success message
          setTimeout(() => {
            if (result.redirectPath) {
              router.push(result.redirectPath);
            }
          }, 2000);
        }
      } catch (error: any) {
        console.log(`Forgot password request failed: ${error?.message} ${error}`);
        setServerError(`Request failed: ${error?.message || "Unexpected error"}`);
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-xl">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Enter your email address to receive a password reset OTP.
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
            validators={{ onChange: forgotPasswordZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
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
                pendingLabel="Sending OTP..."
                disabled={!canSubmit}
              >
                Send OTP
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

export default ForgotPasswordForm;
