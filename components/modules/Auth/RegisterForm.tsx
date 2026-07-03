"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/register/_action";
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
import { ImageUploadField } from "@/components/shared/Form/ImageUploadField";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useImageUpload } from "@/hooks/useImageUpload";
import { IMAGE_CONSTRAINTS } from "@/lib/imageUploadUtils";
import { mapErrorMessage } from "@/lib/errorMapping";
import AppField from "../../shared/Form/AppField";
import AppSubmitButton from "../../shared/Form/AppSubmitButton";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    selectedFile,
    previewUrl,
    error: imageError,
    handleFileSelect: onImageSelect,
    clearFile: onClearImage,
    clearError: clearImageError,
  } = useImageUpload(IMAGE_CONSTRAINTS.PROFILE_IMAGE_MAX_SIZE);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const registerPayload: any = {
          ...value,
        };

        if (selectedFile?.file) {
          registerPayload.image = selectedFile.file;
        }

        const result = (await mutateAsync(registerPayload)) as any;

        if (result && !result.success) {
          const userFriendlyMessage = mapErrorMessage(
            result.message || "Registration failed. Please try again.",
            { context: "register" },
          );
          setServerError(userFriendlyMessage);
          return;
        }

        if (result?.success && result?.redirectPath) {
          router.push(result.redirectPath);
        }
      } catch (error: any) {
        console.log(`Registration failed: ${error?.message} ${error}`);
        const userFriendlyMessage = mapErrorMessage(
          error?.message || "Unexpected error",
          { context: "register" },
        );
        setServerError(userFriendlyMessage);
      }
    },
  });

  const handleImageSelect = (file: File) => {
    onImageSelect(file);
    clearImageError();
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md rounded-xl">
      <CardHeader className="text-center px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Create an Account
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Join the EcoSpark Hub community to share sustainability ideas.
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
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
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

          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
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
            validators={{ onChange: registerZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Choose a password"
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

          <ImageUploadField
            label="Profile Picture (Optional)"
            previewUrl={previewUrl}
            error={imageError}
            isLoading={false}
            disabled={isPending}
            onFileSelect={handleImageSelect}
            onClear={onClearImage}
            maxSize={IMAGE_CONSTRAINTS.PROFILE_IMAGE_MAX_SIZE}
            placeholder="Upload your profile picture"
            fileName={selectedFile?.file.name}
          />

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
                pendingLabel="Signing Up..."
                disabled={!canSubmit || !!imageError}
              >
                Sign Up
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

        {/* Google Register */}
        <Button
          variant="outline"
          className="w-full h-11 text-sm sm:text-base"
          onClick={() => {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            window.location.href = `${baseUrl}/auth/login/google`;
          }}
        >
          <svg className="w-5 h-5 mr-2 shrink-0" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="truncate">Sign up with Google</span>
        </Button>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4 px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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

export default RegisterForm;
