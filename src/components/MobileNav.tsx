"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, FileCheck, ScrollText, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/disruptions", label: "Triggers", icon: Zap },
  { href: "/claims", label: "Claims", icon: FileCheck },
  { href: "/policy", label: "Policy", icon: ScrollText },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

export function MobileNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
      <div className="mx-auto flex max-w-lg justify-around px-1 py-2 safe-area-pb">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? path === "/"
              : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]",
                active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
