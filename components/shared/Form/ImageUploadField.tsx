/**
 * Reusable image upload field component with preview
 */

"use client";

import { X, Upload, Image as ImageIcon } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { getReadableFileSize } from "@/lib/imageUploadUtils";

interface ImageUploadFieldProps {
  label: string;
  previewUrl: string | null;
  error: { code: string; message: string } | null;
  isLoading?: boolean;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  maxSize?: number;
  placeholder?: string;
  className?: string;
  fileName?: string;
}

export function ImageUploadField({
  label,
  previewUrl,
  error,
  isLoading,
  disabled,
  onFileSelect,
  onClear,
  maxSize,
  placeholder = "Upload an image",
  className,
  fileName,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      {/* Preview Section */}
      {previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-32 w-32 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
          />
          {onClear && (
            <button
              onClick={onClear}
              disabled={disabled || isLoading}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90 disabled:opacity-50"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!previewUrl && (
        <div
          onClick={handleClick}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5 dark:border-gray-600",
            disabled && "cursor-not-allowed opacity-50",
            error && "border-destructive/50 bg-destructive/5",
          )}
        >
          <Upload className="size-6 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              {maxSize ? `Max size: ${getReadableFileSize(maxSize)}` : ""}
            </p>
          </div>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        disabled={disabled || isLoading}
        className="hidden"
        aria-label={label}
      />

      {/* File Info */}
      {previewUrl && fileName && (
        <p className="text-xs text-muted-foreground">{fileName}</p>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Validating image...
        </div>
      )}
    </div>
  );
}

interface MultiImageUploadFieldProps {
  label: string;
  previewUrls: string[];
  error: { code: string; message: string } | null;
  isLoading?: boolean;
  disabled?: boolean;
  onFilesSelect: (files: File[]) => void;
  onRemove?: (index: number) => void;
  maxFiles?: number;
  maxSize?: number;
  placeholder?: string;
  className?: string;
  fileNames?: string[];
}

export function MultiImageUploadField({
  label,
  previewUrls,
  error,
  isLoading,
  disabled,
  onFilesSelect,
  onRemove,
  maxFiles = 4,
  maxSize,
  placeholder = "Upload images",
  className,
  fileNames,
}: MultiImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      onFilesSelect(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = previewUrls.length < maxFiles;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="text-xs text-muted-foreground">
          {previewUrls.length} / {maxFiles}
        </span>
      </div>

      {/* Preview Grid */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="aspect-square w-full rounded-lg border border-gray-200 object-cover dark:border-gray-700"
              />
              {onRemove && (
                <button
                  onClick={() => onRemove(index)}
                  disabled={disabled || isLoading}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90 disabled:opacity-50"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="size-3" />
                </button>
              )}
              {fileNames?.[index] && (
                <p className="absolute bottom-1 left-1 right-1 truncate bg-black/50 px-1 text-xs text-white">
                  {fileNames[index]}
                </p>
              )}
            </div>
          ))}

          {/* Add More Button */}
          {canAddMore && (
            <div
              onClick={handleClick}
              className={cn(
                "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-primary/50 hover:bg-primary/5 dark:border-gray-600",
                disabled && "cursor-not-allowed opacity-50",
                error && "border-destructive/50 bg-destructive/5",
              )}
            >
              <Upload className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Add</span>
            </div>
          )}
        </div>
      )}

      {/* Initial Upload Area */}
      {previewUrls.length === 0 && (
        <div
          onClick={handleClick}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 px-6 py-12 transition-colors hover:border-primary/50 hover:bg-primary/5 dark:border-gray-600",
            disabled && "cursor-not-allowed opacity-50",
            error && "border-destructive/50 bg-destructive/5",
          )}
        >
          <ImageIcon className="size-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              {maxFiles ? `Up to ${maxFiles} images` : ""}
              {maxSize ? `, Max ${getReadableFileSize(maxSize)} each` : ""}
            </p>
          </div>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        disabled={disabled || isLoading || !canAddMore}
        className="hidden"
        aria-label={label}
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Validating images...
        </div>
      )}
    </div>
  );
}
