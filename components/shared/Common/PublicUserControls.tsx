"use client";

import Link from "next/link";
import { useTransition } from "react";
import { LogOut, ShoppingCart, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import type { UserInfo } from "@/types/user.types";
import { logoutUser } from "@/service/auth.service";

const transparentHeaderButtonClassName =
  "group-data-[scrolled=false]/site-header:border-white/25 group-data-[scrolled=false]/site-header:bg-white/5 group-data-[scrolled=false]/site-header:text-white group-data-[scrolled=false]/site-header:hover:bg-white/10 group-data-[scrolled=false]/site-header:hover:text-white";

interface PublicUserControlsProps {
  userInfo: UserInfo | null;
}

function getInitials(name?: string) {
  return (name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PublicUserControls({
  userInfo,
}: PublicUserControlsProps) {
  const [isPending, startTransition] = useTransition();

  if (!userInfo) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Button
          asChild
          variant="outline"
          className={transparentHeaderButtonClassName}
        >
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Button
        variant="outline"
        className={transparentHeaderButtonClassName}
        disabled={isPending}
        onClick={() => startTransition(() => logoutUser())}
      >
        <LogOut className="size-4" />
        Logout
      </Button>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="rounded-full group-data-[scrolled=false]/site-header:hover:bg-white/10"
        aria-label="Open profile"
      >
        <Link href={getDefaultDashboardRoute(userInfo.role)}>
          <Avatar>
            {userInfo.image ? (
              <AvatarImage src={userInfo.image} alt={userInfo.name} />
            ) : null}
            <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
          </Avatar>
          <UserRound className="sr-only" />
        </Link>
      </Button>
    </div>
  );
}
