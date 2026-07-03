/**
 * Image upload utility functions with validation and error handling
 */

export interface ImageValidationError {
  code: string;
  message: string;
}

export const IMAGE_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "webp", "gif"],
  PROFILE_IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB for profile
  IDEA_IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB per idea image
  MAX_IDEA_IMAGES: 4,
};

/**
 * Validate a single image file
 */
export function validateImageFile(
  file: File,
  maxSize: number = IMAGE_CONSTRAINTS.MAX_FILE_SIZE,
): ImageValidationError | null {
  // Check file type
  if (!IMAGE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    return {
      code: "INVALID_TYPE",
      message: `Invalid file type. Allowed types: ${IMAGE_CONSTRAINTS.ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      code: "FILE_TOO_LARGE",
      message: `File size exceeds ${sizeMB}MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`,
    };
  }

  // Check file name extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = IMAGE_CONSTRAINTS.ALLOWED_EXTENSIONS.some((ext) =>
    fileName.endsWith(`.${ext}`),
  );

  if (!hasValidExtension) {
    return {
      code: "INVALID_EXTENSION",
      message: "Invalid file extension",
    };
  }

  return null;
}

/**
 * Validate multiple image files for idea upload
 */
export function validateMultipleImages(
  files: File[],
  maxFiles: number = IMAGE_CONSTRAINTS.MAX_IDEA_IMAGES,
): ImageValidationError | null {
  if (files.length > maxFiles) {
    return {
      code: "TOO_MANY_FILES",
      message: `Maximum ${maxFiles} files allowed. You selected ${files.length}`,
    };
  }

  for (const file of files) {
    const error = validateImageFile(
      file,
      IMAGE_CONSTRAINTS.IDEA_IMAGE_MAX_SIZE,
    );
    if (error) {
      return {
        ...error,
        message: `${file.name}: ${error.message}`,
      };
    }
  }

  return null;
}

/**
 * Create a preview URL for an image file
 */
export function createImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Clean up a preview URL to prevent memory leaks
 */
export function revokeImagePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Convert file to FormData for upload
 */
export function fileToFormData(
  file: File,
  fieldName: string = "image",
): FormData {
  const formData = new FormData();
  formData.append(fieldName, file);
  return formData;
}

/**
 * Convert multiple files to FormData for upload
 */
export function filesToFormData(
  files: File[],
  fieldName: string = "images",
): FormData {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(fieldName, file);
  });
  return formData;
}

/**
 * Get file size in MB
 */
export function getFileSizeInMB(file: File): string {
  return (file.size / (1024 * 1024)).toFixed(2);
}

/**
 * Get human-readable file size
 */
export function getReadableFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
