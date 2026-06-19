import Footer from "@/components/shared/Footer";
import { HeroHeader } from "@/components/shared/Header";

export default function CommonLayout({
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
