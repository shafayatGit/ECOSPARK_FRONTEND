import { redirect } from "next/navigation";

const MyPurchasedIdeasRedirectPage = () => {
  redirect("/dashboard/my-purchases");
};

export default MyPurchasedIdeasRedirectPage;
