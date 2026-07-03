/**
 * Error message mapping and formatting utilities
 * Maps common API error messages to user-friendly messages
 */

export interface ErrorContext {
  code?: string;
  context?: "login" | "register" | "upload" | "general";
}

/**
 * Map API error messages to user-friendly messages
 */
export function mapErrorMessage(
  errorMessage: string,
  context: ErrorContext = {},
): string {
  const msg = errorMessage.toLowerCase();

  // Email validation errors
  if (msg.includes("email") && msg.includes("not found")) {
    return "Email address not found. Please check your email or create a new account.";
  }

  if (msg.includes("email") && msg.includes("already")) {
    return "This email is already registered. Please log in or use a different email.";
  }

  if (msg.includes("email") && msg.includes("invalid")) {
    return "Please enter a valid email address or password.";
  }

  if (msg.includes("email") && msg.includes("not verified")) {
    return "Email not verified. Please check your email for verification link.";
  }

  // Password errors
  if (msg.includes("password") && msg.includes("incorrect")) {
    return "Incorrect password. Please try again.";
  }

  if (msg.includes("password") && msg.includes("weak")) {
    return "Password is too weak. Use uppercase, lowercase, numbers, and special characters.";
  }

  if (msg.includes("password") && msg.includes("required")) {
    return "Password is required.";
  }

  if (msg.includes("password") && msg.includes("mismatch")) {
    return "Passwords do not match.";
  }

  // Credentials
  if (
    msg.includes("invalid credentials") ||
    msg.includes("invalid email or password")
  ) {
    return "Invalid email or password. Please check and try again.";
  }

  // Account status
  if (msg.includes("disabled") || msg.includes("suspended")) {
    return "Your account has been disabled. Please contact support.";
  }

  if (msg.includes("locked")) {
    return "Your account is locked. Please try again later or reset your password.";
  }

  // Rate limiting
  if (msg.includes("too many attempts") || msg.includes("rate limit")) {
    return "Too many login attempts. Please try again later or reset your password.";
  }

  if (msg.includes("throttled")) {
    return "Please wait a moment before trying again.";
  }

  // Network errors
  if (msg.includes("network") || msg.includes("connection")) {
    return "Network error. Please check your connection and try again.";
  }

  if (msg.includes("timeout")) {
    return "Request timed out. Please check your connection and try again.";
  }

  // Upload errors
  if (context.context === "upload") {
    if (
      msg.includes("body exceeded") ||
      msg.includes("body size") ||
      msg.includes("payload") ||
      msg.includes("server actions")
    ) {
      return "Upload failed because the request body was too large. Please choose a smaller image and try again.";
    }

    if (msg.includes("file") && msg.includes("size")) {
      return "File size is too large. Please choose a smaller file.";
    }

    if (msg.includes("file") && msg.includes("type")) {
      return "File type not supported. Please use JPG, PNG, WebP, or GIF.";
    }

    if (msg.includes("file") && msg.includes("required")) {
      return "File is required.";
    }

    if (msg.includes("limit") || msg.includes("exceed")) {
      return "You have exceeded the upload limit. Please try again later.";
    }
  }

  // Generic errors
  if (msg.includes("not found")) {
    return "The requested resource was not found.";
  }

  if (msg.includes("forbidden") || msg.includes("unauthorized")) {
    return "You do not have permission to perform this action.";
  }

  if (msg.includes("conflict")) {
    return "This item already exists. Please choose a different name or value.";
  }

  if (msg.includes("server") || msg.includes("internal error")) {
    return "Server error. Please try again later or contact support.";
  }

  // Return original message if no mapping found
  return errorMessage;
}

/**
 * Format error for display in UI
 */
export function formatErrorDisplay(error: any, context?: ErrorContext): string {
  if (!error) {
    return "An unexpected error occurred.";
  }

  // Handle error object
  if (typeof error === "object") {
    const message =
      error.message ||
      error.data?.message ||
      error.response?.data?.message ||
      "An unexpected error occurred.";
    return mapErrorMessage(message, context);
  }

  // Handle string error
  if (typeof error === "string") {
    return mapErrorMessage(error, context);
  }

  return "An unexpected error occurred.";
}

/**
 * Check if error is retriable
 */
export function isRetriableError(error: any): boolean {
  if (!error) return false;

  const msg = String(
    error?.message || error?.data?.message || "",
  ).toLowerCase();

  return (
    msg.includes("network") ||
    msg.includes("timeout") ||
    msg.includes("connection") ||
    msg.includes("throttled") ||
    msg.includes("too many attempts") ||
    msg.includes("503") ||
    msg.includes("502")
  );
}

/**
 * Get error severity level
 */
export function getErrorSeverity(error: any): "error" | "warning" | "info" {
  if (!error) return "error";

  const msg = String(
    error?.message || error?.data?.message || "",
  ).toLowerCase();

  if (msg.includes("throttled") || msg.includes("too many attempts")) {
    return "warning";
  }

  if (msg.includes("info")) {
    return "info";
  }

  return "error";
}
