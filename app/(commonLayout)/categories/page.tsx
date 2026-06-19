import { HeroHeader } from "@/components/shared/Header";
import CategoriesContent from "@/components/modules/Categories/CategoriesContent";

const CategoriesPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeroHeader />
      <main className="grow mt-20">
        <CategoriesContent />
      </main>
    </div>
  );
};

export default CategoriesPage;
