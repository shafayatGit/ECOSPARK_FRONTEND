import IdeaDetailContent from "@/components/modules/Ideas/IdeaDetailContent";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserInfo } from "@/service/auth.service";
import { Suspense } from "react";

interface IdeaDetailPageProps {
  params: Promise<{ id: string }>;
}

const IdeaDetailPage = async ({ params }: IdeaDetailPageProps) => {
  const { id } = await params;
  const user = await getUserInfo();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="grow">
        <Suspense
          fallback={
            <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          <IdeaDetailContent ideaId={id} isAuthenticated={!!user} />
        </Suspense>
      </main>
    </div>
  );
};

export default IdeaDetailPage;
