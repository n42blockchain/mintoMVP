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
import { useI18n } from "@/lib/i18n";

const navItems = [
  {
    labelKey: "nav.home",
    href: "/home",
    icon: Home,
  },
  {
    labelKey: "nav.token",
    href: "/token",
    icon: Coins,
    children: [
      { labelKey: "nav.token.create", href: "/token/create", icon: PlusCircle },
      { labelKey: "nav.token.management", href: "/token", icon: List },
    ],
  },
  {
    labelKey: "nav.wallet",
    href: "/wallet",
    icon: Wallet,
    children: [
      { labelKey: "nav.wallet.management", href: "/wallet/management", icon: ClipboardList },
    ],
  },
  {
    labelKey: "nav.marketing",
    href: "/marketing",
    icon: Megaphone,
    children: [
      { labelKey: "nav.marketing.airdrop", href: "/marketing/airdrop", icon: Send },
      { labelKey: "nav.marketing.customers", href: "/marketing/customers", icon: Users },
      { labelKey: "nav.marketing.analytics", href: "/marketing/analytics", icon: BarChart3 },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <aside className="flex h-full w-56 flex-col bg-white border-r border-gray-100">
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          minto
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isParentActive =
            pathname === item.href ||
            (!item.children && pathname === item.href) ||
            (item.children && pathname.startsWith(item.href || ""));

          return (
            <div key={item.labelKey} className="mb-0.5">
              <Link
                href={item.href || "#"}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isParentActive
                    ? "bg-primary/8 text-primary"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {isParentActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                )}
                <item.icon className="h-[18px] w-[18px]" />
                {t(item.labelKey)}
              </Link>
              {item.children?.map((child) => {
                const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/");
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 pl-10 text-[13px] transition-all duration-150",
                      isChildActive
                        ? "bg-primary/8 text-primary font-medium"
                        : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                    )}
                  >
                    <child.icon className="h-3.5 w-3.5" />
                    {t(child.labelKey)}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 px-3 py-3">
        <Link
          href="/settings"
          className={cn(
            "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
            pathname === "/settings"
              ? "bg-primary/8 text-primary font-medium"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          {pathname === "/settings" && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
          )}
          <Settings className="h-[18px] w-[18px]" />
          {t("nav.settings")}
        </Link>
      </div>
    </aside>
  );
}
