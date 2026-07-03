import Footer from "@/components/shared/Footer";
import HowItWorks from "@/components/shared/HowItWorks";
import NewsLetter from "@/components/shared/NewsLetter";
import { Testimonial } from "@/components/shared/Testimonial";
import { HeroSection } from "@/components/ui/hero-3";
import TopCategories from "@/components/modules/Home/TopCategories";
import TopVotedIdeas from "@/components/modules/Home/TopVotedIdeas";
import { getUserInfo } from "@/service/auth.service";
import React from "react";

const CommonLayoutPage = async () => {
  return (
    <div className="flex w-full flex-col">
      <main className="grow">
        <HeroSection />
        <TopCategories />
        <TopVotedIdeas />
        <HowItWorks />
        <Testimonial />
        <NewsLetter />
      </main>
    </div>
  );
};

export default CommonLayoutPage;
