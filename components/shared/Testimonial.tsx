"use client";

import { Sparkles, Star } from "lucide-react";

type TestimonialData = {
  text: string;
  name: string;
  role: string;
  image: string;
};

export const Testimonial = () => {
  const testimonials: TestimonialData[] = [
    {
      text: "EcoSpark Hub gave our community a real voice. We were able to turn small sustainability ideas into funded, real-world projects.",
      name: "Ayesha Rahman",
      role: "Environmental Researcher",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
    },
    {
      text: "The moderation and feedback system is incredibly helpful. It feels like a mix of Reddit’s openness and Medium’s polish.",
      name: "Daniel Carter",
      role: "Product Designer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    },
    {
      text: "We launched a solar initiative through EcoSpark Hub and got support faster than any traditional platform.",
      name: "Maria Gonzalez",
      role: "Clean Energy Startup Founder",
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200",
    },
    {
      text: "It’s rare to see a platform where ideas can go from post to payment-backed execution so smoothly.",
      name: "Sakib Hossain",
      role: "Software Engineer",
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200",
    },
    {
      text: "EcoSpark Hub gave our community a real voice. We were able to turn small sustainability ideas into funded, real-world projects.",
      name: "Ayesha Rahman",
      role: "Environmental Researcher",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
    },
    {
      text: "The moderation and feedback system is incredibly helpful. It feels like a mix of Reddit’s openness and Medium’s polish.",
      name: "Daniel Carter",
      role: "Product Designer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    },
  ];

  const rows = [
    { start: 0, end: 3, className: "animate-scroll" },
    { start: 3, end: 6, className: "animate-scroll-reverse" },
  ];

  const renderCard = (testimonial: TestimonialData, index: number) => (
    <div
      key={index}
      className="bg-card/45 backdrop-blur-md border border-border/80 text-foreground rounded-2xl p-6 shrink-0 w-[350px] shadow-xs transition-colors duration-300 hover:bg-card/75"
    >
      <div className="flex gap-1 mb-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Star
              key={i}
              className="size-4.5 text-amber-500 fill-amber-500"
              aria-hidden="true"
            />
          ))}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground mb-6 italic">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover border border-primary/20"
        />
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden bg-background">
      <style>
        {`
          @keyframes marquee-scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          @keyframes marquee-scroll-reverse {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
          .animate-scroll {
            animation: marquee-scroll 25s linear infinite;
          }
          .animate-scroll-reverse {
            animation: marquee-scroll-reverse 25s linear infinite;
          }
          .animate-scroll:hover,
          .animate-scroll-reverse:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* Decorative gradient glow background */}
      <div className="absolute bottom-0 right-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground font-heading">
            Loved by Changemakers
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            Real feedback from innovators, developers, and teams building community-backed eco solutions.
          </p>
        </div>

        <div className="space-y-8 relative">
          {/* Left and Right Fade Gradient Masks for marquee */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="relative overflow-hidden w-full">
              <div className={`flex gap-6 w-max ${row.className}`}>
                {[
                  ...testimonials.slice(row.start, row.end),
                  ...testimonials.slice(row.start, row.end),
                  ...testimonials.slice(row.start, row.end),
                  ...testimonials.slice(row.start, row.end),
                ].map((testimonial, index) => renderCard(testimonial, index))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
