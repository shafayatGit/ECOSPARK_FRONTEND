/**
 * React hook for managing image uploads with preview and validation
 */

import { useState, useCallback } from "react";
import {
  validateImageFile,
  validateMultipleImages,
  createImagePreviewUrl,
  revokeImagePreviewUrl,
  ImageValidationError,
  IMAGE_CONSTRAINTS,
} from "@/lib/imageUploadUtils";

export interface ImagePreviewData {
  file: File;
  previewUrl: string;
}

export interface UseImageUploadReturn {
  selectedFile: ImagePreviewData | null;
  previewUrl: string | null;
  error: ImageValidationError | null;
  isLoading: boolean;
  handleFileSelect: (file: File) => void;
  clearFile: () => void;
  clearError: () => void;
}

/**
 * Hook for single image upload with preview
 */
export function useImageUpload(
  maxSize: number = IMAGE_CONSTRAINTS.MAX_FILE_SIZE,
): UseImageUploadReturn {
  const [selectedFile, setSelectedFile] = useState<ImagePreviewData | null>(
    null,
  );
  const [error, setError] = useState<ImageValidationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null);
      setIsLoading(true);

      // Validate file
      const validationError = validateImageFile(file, maxSize);

      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      // Create preview
      const previewUrl = createImagePreviewUrl(file);

      setSelectedFile({
        file,
        previewUrl,
      });

      setIsLoading(false);
    },
    [maxSize],
  );

  const clearFile = useCallback(() => {
    if (selectedFile?.previewUrl) {
      revokeImagePreviewUrl(selectedFile.previewUrl);
    }
    setSelectedFile(null);
    setError(null);
  }, [selectedFile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    selectedFile,
    previewUrl: selectedFile?.previewUrl ?? null,
    error,
    isLoading,
    handleFileSelect,
    clearFile,
    clearError,
  };
}

export interface UseMultiImageUploadReturn {
  selectedFiles: ImagePreviewData[];
  previewUrls: string[];
  error: ImageValidationError | null;
  isLoading: boolean;
  handleFilesSelect: (files: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  clearError: () => void;
  fileCount: number;
}

/**
 * Hook for multiple image uploads with preview
 */
export function useMultiImageUpload(
  maxFiles: number = IMAGE_CONSTRAINTS.MAX_IDEA_IMAGES,
): UseMultiImageUploadReturn {
  const [selectedFiles, setSelectedFiles] = useState<ImagePreviewData[]>([]);
  const [error, setError] = useState<ImageValidationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilesSelect = useCallback(
    (files: File[]) => {
      setError(null);
      setIsLoading(true);

      // Validate files
      const validationError = validateMultipleImages(files, maxFiles);

      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      // Create previews
      const newFiles: ImagePreviewData[] = files.map((file) => ({
        file,
        previewUrl: createImagePreviewUrl(file),
      }));

      setSelectedFiles(newFiles);
      setIsLoading(false);
    },
    [maxFiles],
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed?.previewUrl) {
        revokeImagePreviewUrl(removed.previewUrl);
      }
      return newFiles;
    });
  }, []);

  const clearFiles = useCallback(() => {
    selectedFiles.forEach((item) => {
      if (item.previewUrl) {
        revokeImagePreviewUrl(item.previewUrl);
      }
    });
    setSelectedFiles([]);
    setError(null);
  }, [selectedFiles]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    selectedFiles,
    previewUrls: selectedFiles.map((item) => item.previewUrl),
    error,
    isLoading,
    handleFilesSelect,
    removeFile,
    clearFiles,
    clearError,
    fileCount: selectedFiles.length,
  };
}
