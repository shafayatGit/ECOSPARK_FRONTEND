import { HeroHeader } from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header-3";
import { HeroSection } from "@/components/ui/hero-3";

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <HeroHeader />
      <main className="grow">
        <HeroSection />
      </main>
    </div>
  );
}
