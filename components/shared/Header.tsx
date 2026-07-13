import Link from "next/link";
import { ChefHat, LayoutDashboard, LogOut, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import PublicHeaderShell from "@/components/shared/Common/PublicHeaderShell";
import PublicUserControls from "@/components/shared/Common/PublicUserControls";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo, logoutUser } from "@/service/auth.service";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/ideas", label: "Ideas" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export default async function HeroHeader() {
  const userInfo = await getUserInfo();

  return (
    <PublicHeaderShell>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Logo />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className="text-muted-foreground group-data-[scrolled=false]/site-header:hover:bg-white/10 group-data-[scrolled=false]/site-header:hover:text-white"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <PublicUserControls userInfo={userInfo} />

        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="md:hidden group-data-[scrolled=false]/site-header:border-white/25 group-data-[scrolled=false]/site-header:bg-white/5 group-data-[scrolled=false]/site-header:text-white group-data-[scrolled=false]/site-header:hover:bg-white/10"
              size="icon"
              variant="outline"
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 grid gap-2 px-4">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant="ghost"
                  className="justify-start"
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}

              {userInfo ? (
                <>
                  <form action={logoutUser} className="mt-3">
                    <Button className="w-full" variant="outline">
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </form>
                </>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </PublicHeaderShell>
  );
}

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#06564d"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-brain-icon lucide-brain"
      >
        <path d="M12 18V5" />
        <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
        <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
        <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
        <path d="M18 18a4 4 0 0 0 2-7.464" />
        <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
        <path d="M6 18a4 4 0 0 1-2-7.464" />
        <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
      </svg>
      <h1 className="font-medium">EcoSpark Hub</h1>
    </div>
  );
};
