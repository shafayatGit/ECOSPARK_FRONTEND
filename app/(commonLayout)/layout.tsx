import Footer from "@/components/shared/Footer";
import HeroHeader from "@/components/shared/Header";
import { getUserInfo } from "@/service/auth.service";
import { ILoginResponse } from "@/types/auth.types";

export const dynamic = "force-dynamic";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <HeroHeader />
      {children}
      <Footer />
    </body>
  );
}

