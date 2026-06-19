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
    </body>
  );
}
