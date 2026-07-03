"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action";
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
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mapErrorMessage } from "@/lib/errorMapping";
import AppField from "../../shared/Form/AppField";
import AppSubmitButton from "../../shared/Form/AppSubmitButton";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

const LoginForm = () => {
  // const queryClient = useQueryClient();

  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") ?? undefined;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (result && !result.success) {
          const userFriendlyMessage = mapErrorMessage(
            result.message || "Login failed. Please try again.",
            { context: "login" },
          );
          setServerError(userFriendlyMessage);
          return;
        }

        if (result?.success && result?.redirectPath) {
          router.push(result.redirectPath);
        }
      } catch (error: any) {
        console.log(`Login failed: ${error?.message} ${error}`);
        const userFriendlyMessage = mapErrorMessage(
          error?.message || "Unexpected error",
          { context: "login" },
        );
        setServerError(userFriendlyMessage);
      }
    },
  });
  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-xl">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Welcome Back!
        </CardTitle>

        <CardDescription className="text-sm sm:text-base">
          Please enter your credentials to log in.
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
            validators={{ onChange: loginZodSchema.shape.email }}
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

          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="text-sm sm:text-base"
                aria-label={showPassword ? "Hide password" : "Show password"}
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

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          {serverError && (
            <Alert variant="destructive" className="space-y-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <AlertDescription className="text-sm">
                  {serverError}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Logging In..."
                disabled={!canSubmit}
              >
                Log In
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-xs sm:text-sm uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full h-11 text-sm sm:text-base"
          onClick={() => {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            window.location.href = `${baseUrl}/auth/login/google`;
          }}
        >
          <svg className="w-5 h-5 mr-2 shrink-0" viewBox="0 0 24 24">
            {/* SVG Paths */}
          </svg>

          <span className="truncate">Sign in with Google</span>
        </Button>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4 px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
