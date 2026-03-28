"use client";

import { signOut } from "next-auth/react";
import { Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  merchantName?: string;
}

export function Topbar({ merchantName = "Merchant" }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
          {merchantName.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold">{merchantName}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          Languages
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
