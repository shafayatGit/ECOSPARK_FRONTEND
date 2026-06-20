"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { cn } from "@/lib/utils";

export default function PublicHeaderShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const updateHeaderBackground = useCallback(() => {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    setHasScrolled(scrollTop > 20);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    
    updateHeaderBackground();
    window.addEventListener("scroll", updateHeaderBackground, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateHeaderBackground);
    };
  }, [updateHeaderBackground]);

  // On the server and during initial hydration, isMounted is false.
  // We want to ensure that the initial render matches the server.
  // If pathname is null during hydration, we should default to a state that matches the server.
  const isHomePage = pathname === "/";
  
  // During hydration, hasScrolled is always false.
  // We only want hasScrolled to affect the UI after the component has mounted
  // to prevent hydration mismatches if the user has already scrolled.
  const isScrolled = !isHomePage || (isMounted && hasScrolled);

  return (
    <header
      className={cn(
        "group/site-header fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow,color] duration-300",
        isScrolled
          ? "border-border bg-background/95 text-foreground shadow-sm"
          : "border-white/10 bg-transparent text-white shadow-none",
      )}
      data-scrolled={isScrolled}
    >
      {children}
    </header>
  );
}
