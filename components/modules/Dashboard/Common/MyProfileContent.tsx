"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Mail, Edit2, Upload, X, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserInfo } from "@/types/user.types";
import { updateUserProfile } from "@/service/auth.service";

interface MyProfileContentProps {
  userInfo: UserInfo;
}

export default function MyProfileContent({ userInfo }: MyProfileContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, startTransition] = useTransition();

  // Form states
  const [name, setName] = useState(userInfo?.name);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userInfo?.image || null,
  );

  const getRoleColor = (role: string | undefined) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MEMBER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setProfileImage(null);
    setImagePreview(userInfo.image || null);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    startTransition(async () => {
      const res = await updateUserProfile({
        name: name.trim(),
        image: profileImage || undefined,
      });

      if (res.success) {
        toast.success("Profile updated successfully!");
        setIsOpen(false);
        setProfileImage(null);
        // Optionally reload the page to get updated user info
        window.location.reload();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Profile Header Card */}
      <section className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-foreground/5">
        {/* Decorative header */}
        <div className="h-24 bg-linear-to-r from-primary/10 via-primary/5 to-transparent" />

        {/* Profile Info */}
        <div className="relative -mt-12 px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar className="size-24 rounded-2xl ring-4 ring-card shadow-lg">
                <AvatarImage
                  src={userInfo?.image || ""}
                  alt={userInfo?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {userInfo?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-normal text-foreground">
                  {userInfo?.name}
                </h1>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" />
                  {userInfo?.email}
                </p>
                <Badge className={`${getRoleColor(userInfo?.role)} capitalize`}>
                  {userInfo?.role.toLowerCase()}
                </Badge>
              </div>
            </div>

            {/* Edit Button */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2 sm:w-auto">
                  <Edit2 className="size-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Your Profile</DialogTitle>
                  <DialogDescription>
                    Update your name and profile picture
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="h-10 rounded-xl"
                    />
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative inline-block">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        width={120}
                        height={120}
                        className="h-28 w-28 rounded-2xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-lg transition-transform hover:scale-110"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Profile Picture</Label>
                    <div className="relative">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor="image"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 px-4 py-6 transition-colors hover:border-primary hover:bg-primary/5"
                      >
                        <Upload className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {profileImage ? profileImage.name : "Upload image"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      {isUpdating ? "Updating..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Account Details Section */}
      <section className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Account Information
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <User className="size-5 text-primary" />
              <span className="text-sm text-muted-foreground">User ID</span>
            </div>
            <code className="rounded bg-background px-2 py-1 text-xs font-mono text-foreground">
              {userInfo?.id}
            </code>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Email Address
              </span>
            </div>
            <span className="font-medium text-foreground">
              {userInfo?.email}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Account Role
              </span>
            </div>
            <Badge className={getRoleColor(userInfo?.role)}>
              {userInfo?.role}
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
