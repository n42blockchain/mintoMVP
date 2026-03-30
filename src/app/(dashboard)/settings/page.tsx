"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">{t("settings.title")}</h1>
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-16">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50">
            <Settings className="h-10 w-10 text-gray-500" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{t("settings.comingSoon")}</h3>
          <p className="text-muted-foreground text-sm text-center max-w-sm">
            {t("settings.desc")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
