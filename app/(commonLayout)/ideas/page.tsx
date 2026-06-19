import { HeroHeader } from "@/components/shared/Header";
import IdeasListContent from "@/components/modules/Ideas/IdeasListContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const IdeasPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeroHeader />
      <main className="grow">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-16 w-full" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-xl" />
                ))}
              </div>
            </div>
          }
        >
          <IdeasListContent />
        </Suspense>
      </main>
    </div>
  );
};

export default IdeasPage;
