import { HeroHeader } from "@/components/shared/Header";

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <HeroHeader />
        {children}
      </body>
    </html>
  );
}
