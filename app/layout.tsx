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
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

const dmSansHeading = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
export const metadata: Metadata = {
  title: "EcoSpark Hub",
  description:
    "A platform for hobbyists to connect, share, and discover new activities. Users can create profiles, join communities, and participate in events.",
};

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
        dmSans.variable,
        dmSansHeading.variable,
      )}
    >
      <body>
        <Toaster />
        <QueryProviders>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
