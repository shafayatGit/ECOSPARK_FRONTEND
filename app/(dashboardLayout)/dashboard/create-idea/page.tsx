import CreateIdeaContent from "@/components/modules/Dashboard/Member/CreateIdea/CreateIdeaContent";
import { Suspense } from "react";

const CreateIdeaPage = () => {
  return (
    <Suspense fallback={null}>
      <CreateIdeaContent />
    </Suspense>
  );
};

export default CreateIdeaPage;
