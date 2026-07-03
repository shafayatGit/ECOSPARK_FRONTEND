"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, MessageSquare, Shield, Rocket, Sparkles } from "lucide-react";

const steps = [
  {
    id: "01",
    icon: Lightbulb,
    title: "Share Your Idea",
    description:
      "Submit your sustainability concept with details, problems it solves, and pricing models.",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    id: "02",
    icon: MessageSquare,
    title: "Get Feedback",
    description:
      "Receive constructive feedback, upvotes, and comments from a community that cares.",
    glow: "group-hover:shadow-teal-500/10",
  },
  {
    id: "03",
    icon: Shield,
    title: "Admin Review",
    description:
      "EcoSpark moderators verify all submissions for feasibility, safety, and true environmental impact.",
    glow: "group-hover:shadow-cyan-500/10",
  },
  {
    id: "04",
    icon: Rocket,
    title: "Launch Project",
    description:
      "Get featured, unlock paid premium tiers, and connect with supporters to turn ideas into reality.",
    glow: "group-hover:shadow-primary/10",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-24 px-4 md:px-6 lg:px-8 bg-linear-to-b from-muted/20 to-background border-t border-border/40">
      {/* Decorative background grid/elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Workflow</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground font-heading">
            How EcoSpark Hub Works
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            From initial concept to community-backed execution in four streamlined steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="group relative flex flex-col h-full">
                {/* Connector line between cards on desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 left-[calc(100%-1.5rem)] right-[-1.5rem] h-[2px] bg-linear-to-r from-border/80 to-transparent z-10 pointer-events-none group-hover:from-primary/50 transition-colors duration-300" />
                )}

                {/* Glow border on hover */}
                <div className="absolute -inset-[1px] rounded-2xl bg-linear-to-r from-primary to-emerald-500 opacity-0 blur-xs transition-opacity duration-300 group-hover:opacity-100" />

                <Card className="relative flex flex-col h-full bg-card/40 backdrop-blur-xs border border-border/80 rounded-2xl transition-all duration-300 group-hover:bg-card/80 group-hover:translate-y-[-6px] overflow-hidden group-hover:shadow-xl">
                  {/* Step Number Background Accent */}
                  <div className="absolute top-4 right-6 text-7xl font-bold font-sans select-none pointer-events-none text-muted-foreground/5 dark:text-muted-foreground/10 group-hover:text-primary/15 transition-colors duration-300">
                    {step.id}
                  </div>

                  <CardHeader className="p-6 pb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl font-heading font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-2 flex-1">
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
