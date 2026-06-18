"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { rejectIdea } from "@/service/adminIdeas.service";
import { AdminIdea } from "@/types/idea.types";
import { IRejectIdeaPayload, rejectIdeaSchema } from "@/zod/idea.validation";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface RejectIdeaDialogProps {
  idea: AdminIdea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const RejectIdeaDialog = ({
  idea,
  open,
  onOpenChange,
  onSuccess,
}: RejectIdeaDialogProps) => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFeedback("");
      setError(null);
    }
  }, [open]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRejectIdeaPayload) =>
      rejectIdea(idea!.id, payload),
  });

  const handleReject = async () => {
    if (!idea) return;

    const parsed = rejectIdeaSchema.safeParse({ rejectionFeedback: feedback });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid feedback");
      return;
    }

    setError(null);

    try {
      const result = await mutateAsync(parsed.data);

      if (!result.success) {
        setError(result.message || "Failed to reject idea.");
        return;
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      setError("Failed to reject idea. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Idea</DialogTitle>
          <DialogDescription>
            Provide feedback for &quot;{idea?.title}&quot;. The author will see
            this message.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejectionFeedback">Rejection feedback</Label>
          <Textarea
            id="rejectionFeedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Explain why this idea was rejected (min. 10 characters)"
            rows={4}
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isPending}
          >
            {isPending ? "Rejecting..." : "Reject Idea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
  variant?: "default" | "destructive";
}

export const ConfirmActionDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending = false,
  variant = "default",
}: ConfirmActionDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
          >
            {isPending ? "Processing..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectIdeaDialog;
