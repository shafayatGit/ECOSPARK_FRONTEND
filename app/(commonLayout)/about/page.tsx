"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Lightbulb,
  Users,
  Shield,
  Globe2,
  Target,
  Heart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We believe every idea has the potential to create meaningful environmental change.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Collaboration amplifies impact. We connect changemakers worldwide.",
  },
  {
    icon: Shield,
    title: "Trust",
    description:
      "Quality matters. Our moderation ensures ideas are feasible and impactful.",
  },
  {
    icon: Globe2,
    title: "Accessibility",
    description:
      "Sustainability solutions should be available to everyone, everywhere.",
  },
];

const team = [
  { name: "Sarah Chen", role: "Founder & CEO", initials: "SC" },
  { name: "Marcus Williams", role: "Head of Community", initials: "MW" },
  { name: "Elena Rodriguez", role: "Lead Moderator", initials: "ER" },
  { name: "David Okonkwo", role: "Head of Partnerships", initials: "DO" },
];

const milestones = [
  {
    year: "2022",
    event:
      "EcoSpark Hub founded with a mission to democratize sustainability ideas",
  },
  {
    year: "2023",
    event: "Reached 5,000 active members and 1,000 ideas shared",
  },
  {
    year: "2024",
    event: "Launched premium tier with detailed implementation guides",
  },
  {
    year: "2025",
    event: "Expanded to 89 countries and partnered with 50+ organizations",
  },
];

const AboutPage = () => {
  return (
    <div>
      <main className="min-h-screen bg-background pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              About Us
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight mb-4">
              Empowering Sustainable Innovation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              EcoSpark Hub is a community platform where members share
              sustainability-oriented ideas, receive feedback, and turn visions
              into impactful projects.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Target className="w-5 h-5 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground mb-4">
                  We believe that the best solutions to environmental challenges
                  come from collective wisdom. Our platform bridges the gap
                  between great ideas and real-world implementation.
                </p>
                <p className="text-muted-foreground">
                  Every day, community members submit innovative sustainability
                  concepts—from reducing plastic consumption to launching solar
                  power projects. Expert moderators review and surface the best
                  ideas, helping them reach those who can bring them to life.
                </p>
              </div>
              <Card className="p-8">
                <CardHeader className="p-0 mb-6">
                  <CardDescription className="text-sm font-medium mb-2">
                    What We Do
                  </CardDescription>
                  <CardTitle className="text-2xl">
                    Connecting Ideas with Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium">1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Community members share sustainability ideas with detailed
                      plans
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Experts review submissions for feasibility and potential
                      impact
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Featured ideas get support for implementation and wider
                      visibility
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight mb-2">
                Our Values
              </h2>
              <p className="text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title}>
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight mb-3">
              Join Our Community
            </h2>
            <p className="text-muted-foreground mb-6">
              Ready to share your sustainability ideas? Become part of a global
              movement for positive change.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild>
                <Link href="/register">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/ideas">Browse Ideas</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
