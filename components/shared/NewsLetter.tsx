"use client";

import { useState } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/service/subscribe.service";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await subscribeToNewsletter({ email: trimmedEmail });

      if (response.success) {
        toast.success(response.message);
        setEmail("");
      } else {
        toast.error(response.message);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-24 px-4 md:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20 border-t border-border/40">
      {/* Decorative gradient glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider mx-auto">
            <Sparkles className="size-3.5" />
            <span>Newsletter</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground font-heading">
            Stay Updated on Green Innovation
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Get weekly curated insights on approved sustainability projects, eco-friendly technologies, and community startup initiatives directly in your inbox.
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="mx-auto max-w-md w-full flex flex-col sm:flex-row items-center gap-3 p-1.5 border border-border bg-card/50 backdrop-blur-xs focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary rounded-2xl sm:rounded-full transition duration-300"
        >
          <div className="relative flex-1 w-full flex items-center px-4">
            <Mail className="size-5 text-muted-foreground shrink-0" />
            <input
              className="bg-transparent border-0 outline-none w-full py-3 pl-3 text-sm text-foreground placeholder:text-muted-foreground"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/95 font-semibold text-sm rounded-xl sm:rounded-full py-6 px-6 sm:px-8 inline-flex items-center justify-center transition active:scale-98 shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Subscribing
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
