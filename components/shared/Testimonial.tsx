type Testimonial = {
  text: string;
  name: string;
  role: string;
  image: string;
};
export const Testimonial = () => {
  const testimonials = [
    {
      text: "EcoSpark Hub gave our community a real voice. We were able to turn small sustainability ideas into funded, real-world projects.",
      name: "Ayesha Rahman",
      role: "Environmental researcher",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
    },
    {
      text: "The moderation and feedback system is incredibly helpful. It feels like a mix of Reddit’s openness and Medium’s polish.",
      name: "Daniel Carter",
      role: "Product designer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    },
    {
      text: "We launched a solar initiative through EcoSpark Hub and got support faster than any traditional platform.",
      name: "Maria Gonzalez",
      role: "Clean energy startup founder",
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200",
    },
    {
      text: "It’s rare to see a platform where ideas can go from post to payment-backed execution so smoothly.",
      name: "Sakib Hossain",
      role: "Software engineer",
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200",
    },
    {
      text: "EcoSpark Hub gave our community a real voice. We were able to turn small sustainability ideas into funded, real-world projects.",
      name: "Ayesha Rahman",
      role: "Environmental researcher",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
    },
    {
      text: "The moderation and feedback system is incredibly helpful. It feels like a mix of Reddit’s openness and Medium’s polish.",
      name: "Daniel Carter",
      role: "Product designer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    },
  ];

  const rows = [
    { start: 0, end: 3, className: "animate-scroll" },
    { start: 3, end: 6, className: "animate-scroll-reverse" },
  ];

  const renderCard = (testimonial: Testimonial, index: number): any => (
    <div
      key={index}
      className="bg-[#19201F] text-white rounded-xl p-4 shrink-0 w-[350px]"
    >
      <div className="flex mb-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-star text-transparent fill-[#877405]"
              aria-hidden="true"
            >
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
          ))}
      </div>
      <p className=" text-sm mb-6">{testimonial.text}</p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div>
          <p className="font-medium -sm">{testimonial.name}</p>
          <p className=" text-sm">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    *{
                        font-family: "Geist", sans-serif;
                    }

                    @keyframes scroll {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-50%);
                        }
                    }
                    @keyframes scrollReverse {
                        0% {
                            transform: translateX(-50%);
                        }
                        100% {
                            transform: translateX(0);
                        }
                    }
                    .animate-scroll {
                        animation: scroll 15s linear infinite;
                    }
                    .animate-scroll-reverse {
                        animation: scrollReverse 15s linear infinite;
                    }
                `}
      </style>
      <section className=" py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block rounded-full px-4 py-1 mb-3">
              <span className="text-xs ">Loved by clients</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium  mb-4">
              What people are saying
            </h2>
            <p className="text-muted-foreground text-sm max-w-96 mx-auto">
              Real feedback from founders, developers and teams building
              production-ready products.
            </p>
          </div>

          <div className="space-y-6">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-28 bg-linear-to-r z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-28 bg-linear-to-l z-10 pointer-events-none"></div>

                <div className={`flex gap-6 ${row.className}`}>
                  {[
                    ...testimonials.slice(row.start, row.end),
                    ...testimonials.slice(row.start, row.end),
                  ].map((testimonial, index) => renderCard(testimonial, index))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
