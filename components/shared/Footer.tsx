"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Logo } from "./Header";

const footerLinks = {
  platform: [
    { label: "About", href: "/about" },
    { label: "How It Works", href: "/" },
  ],
  community: [
    { label: "Browse Ideas", href: "/ideas" },
    { label: "Submit Idea", href: "/register" },
    { label: "Categories", href: "/categories" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              A community platform for sharing and developing sustainability
              ideas.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-medium text-sm mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-medium text-sm mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-medium text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EcoSpark Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
