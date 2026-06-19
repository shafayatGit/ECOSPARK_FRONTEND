import { HeroSection } from "@/components/ui/hero-3";
import React from "react";

const CommonLayoutPage = () => {
  return (
    <div className="flex w-full flex-col">
      <main className="grow">
        <HeroSection />
      </main>
    </div>
  );
};

export default CommonLayoutPage;
