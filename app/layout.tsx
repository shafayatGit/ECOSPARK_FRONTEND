import {
  Geist,
  Geist_Mono,
  Source_Sans_3,
  DM_Sans,
  Figtree,
} from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import QueryProviders from "@/providers/QueryProvider";
import { Header } from "@/components/ui/header-3";
import { HeroHeader } from "@/components/shared/Header";

const dmSansHeading = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        figtree.variable,
        dmSansHeading.variable,
      )}
    >
      <body>
        <QueryProviders>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
