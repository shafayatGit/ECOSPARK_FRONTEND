import Footer from "@/components/shared/Footer";
import { HeroHeader } from "@/components/shared/Header";
import { getUserInfo } from "@/service/auth.service";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userInfo = await getUserInfo();
  return (
    <body>
      <HeroHeader userInfo={userInfo} />
      {children}
      <Footer />
    </body>
  );
}
