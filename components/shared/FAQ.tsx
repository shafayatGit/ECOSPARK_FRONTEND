"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: "What is EcoSpark Hub?",
    answer: "EcoSpark Hub is a community-driven portal where innovators and sustainability advocates share, vote on, and discuss eco-friendly ideas. It blends community submissions (like Reddit) with editorial curation and moderation (like Medium) and premium monetization models (via Stripe).",
  },
  {
    question: "How does the idea review and approval process work?",
    answer: "Once you submit an idea, it enters a review queue with a status of PENDING. EcoSpark Hub moderators review the concept for feasibility, safety, and real-world environmental impact. Approved ideas are published publicly, while rejected ones receive constructive admin feedback for revision.",
  },
  {
    question: "Can I monetize my sustainability ideas?",
    answer: "Yes! High-impact, detailed ideas can be monetized. You can mark your idea as a premium resource and set a price. Other community members can purchase access via our secure Stripe payment gateway, and transaction access is verified asynchronously via secure webhooks.",
  },
  {
    question: "How does the voting system work?",
    answer: "To maintain platform integrity, we enforce a strict 'one vote per member per idea' rule at the database level. You can upvote ideas that you support or downvote ideas that need refinement. Upvotes directly determine the featured status and top placement of ideas.",
  },
  {
    question: "What are nested comments?",
    answer: "Discussions on EcoSpark Hub are organized in nested, Reddit-style threads. You can reply directly to any comment, making it easy to have detailed discussions about specific aspects of an idea. We support nesting up to 3-4 levels for optimal readability on mobile.",
  },
  {
    question: "Is my personal information secure?",
    answer: "Absolutely. We use modern authentication mechanisms to secure your account. Payment processing is handled securely off-site via Stripe, meaning we never store your payment card details.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden py-24 px-4 md:px-6 lg:px-8 bg-linear-to-b from-muted/20 to-background border-t border-border/40">
      {/* Decorative background grid/elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative gradient glow background */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="size-3.5" />
            <span>FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Have questions about EcoSpark Hub? Find detailed answers on how to submit, vote, review, and monetize sustainability concepts.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="group border border-border/80 bg-card/45 backdrop-blur-xs rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:bg-card/70"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors duration-200">
                    {item.question}
                  </span>
                  <div
                    className={`size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 ml-4 transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary ${
                      isOpen ? "rotate-180 bg-primary/15 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="size-4 transition-transform duration-300" />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 border-t border-border/40" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-6 text-sm md:text-base leading-relaxed text-muted-foreground bg-muted/20">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
