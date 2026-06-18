"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyEmailAction } from "@/app/(commonLayout)/(authRouteGroup)/verify-email/_action";
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
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppField from "../../shared/Form/AppField";
import AppSubmitButton from "../../shared/Form/AppSubmitButton";
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/auth.validation";

const VerifyEmailFormContent = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IVerifyEmailPayload) => verifyEmailAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: emailParam,
      otp: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (result && !result.success) {
          setServerError(result.message || "Failed to verify email.");
          return;
        }

        if (result?.success) {
          setSuccessMessage(result.message || "Email verified successfully!");
          setTimeout(() => {
            if (result.redirectPath) {
              router.push(result.redirectPath);
            }
          }, 2000);
        }
      } catch (error: any) {
        console.log(`Verify email failed: ${error?.message} ${error}`);
        setServerError(`Verification failed: ${error?.message || "Unexpected error"}`);
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-xl">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Please enter the 6-digit OTP code sent to your email.
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
            validators={{ onChange: verifyEmailZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                disabled={!!emailParam}
              />
            )}
          </form.Field>

          <form.Field
            name="otp"
            validators={{ onChange: verifyEmailZodSchema.shape.otp }}
          >
            {(field) => (
              <AppField
                field={field}
                label="OTP Verification Code"
                type="text"
                placeholder="Enter 6-digit OTP"
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
                pendingLabel="Verifying..."
                disabled={!canSubmit}
              >
                Verify Email
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4 px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          Need help? Contact support or try logging in again.{" "}
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

const VerifyEmailForm = () => {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading Verification Form...</div>}>
      <VerifyEmailFormContent />
    </Suspense>
  );
};

export default VerifyEmailForm;
