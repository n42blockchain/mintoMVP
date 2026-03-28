"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Coins,
  PlusCircle,
  List,
  Wallet,
  ClipboardList,
  Megaphone,
  Send,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "/home",
    icon: Home,
  },
  {
    label: "Token",
    href: "/token",
    icon: Coins,
    children: [
      { label: "Create", href: "/token/create", icon: PlusCircle },
      { label: "Management", href: "/token", icon: List },
    ],
  },
  {
    label: "Wallet",
    href: "/wallet",
    icon: Wallet,
    children: [
      { label: "Wallet management", href: "/wallet/management", icon: ClipboardList },
    ],
  },
  {
    label: "Marketing tools",
    href: "/marketing",
    icon: Megaphone,
    children: [
      { label: "Air drop", href: "/marketing/airdrop", icon: Send },
      { label: "My customer", href: "/marketing/customers", icon: Users },
      { label: "Analytics", href: "/marketing/analytics", icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-white">
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-xl font-bold text-primary">minto</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <div key={item.label} className="mb-1">
            {/* Parent item - always a link if href exists */}
            <Link
              href={item.href || "#"}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || (!item.children && pathname === item.href)
                  ? "bg-primary/10 text-primary"
                  : item.children && pathname.startsWith(item.href || "")
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
            {/* Children sub-items */}
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-1.5 pl-10 text-sm transition-colors",
                  pathname === child.href || pathname.startsWith(child.href + "/")
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <child.icon className="h-3.5 w-3.5" />
                {child.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t px-3 py-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
