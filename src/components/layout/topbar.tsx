"use client";

import { signOut } from "next-auth/react";
import { Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, Locale } from "@/lib/i18n";

interface TopbarProps {
  merchantName?: string;
}

export function Topbar({ merchantName = "Merchant" }: TopbarProps) {
  const { t, locale, setLocale } = useI18n();

  function handleToggleLocale() {
    const next: Locale = locale === "en" ? "zh-TW" : "en";
    setLocale(next);
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-sm">
          {merchantName.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-gray-800">{merchantName}</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-gray-500 hover:text-gray-900"
          onClick={handleToggleLocale}
        >
          <Globe className="h-4 w-4" />
          {t("topbar.languages")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-gray-500 hover:text-gray-900"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          {t("topbar.signout")}
        </Button>
      </div>
    </header>
  );
}
