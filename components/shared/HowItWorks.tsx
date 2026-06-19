"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb, MessageSquare, Shield, Rocket } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Lightbulb,
    title: "Share Your Idea",
    description:
      "Submit your sustainability concept with details and implementation plan.",
  },
  {
    id: 2,
    icon: MessageSquare,
    title: "Get Feedback",
    description:
      "Receive feedback from the community to refine and improve your idea.",
  },
  {
    id: 3,
    icon: Shield,
    title: "Admin Review",
    description:
      "Expert moderators review submissions for feasibility and impact.",
  },
  {
    id: 4,
    icon: Rocket,
    title: "Launch Project",
    description:
      "Approved ideas get support for implementation and wider visibility.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-3">
            How EcoSpark Hub Works
          </h2>
          <p className="text-muted-foreground text-sm max-w-96 mx-auto">
            From idea to impact in four simple steps
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.id}
                className="bg-[#0e201d] border-2 border-[#19201F]"
              >
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
