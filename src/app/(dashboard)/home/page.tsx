"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Wallet, Megaphone, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface MerchantData {
  name: string;
  plan: string;
  status: string;
  registrationDate: string;
  expireDate: string;
  serviceCode: string;
  mintingUsed: number;
  mintingLimit: number;
  transactionUsed: number;
  transactionLimit: number;
  tokenTypeCount: number;
  tokenTypeLimit: number;
}

export default function HomePage() {
  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    fetch("/api/merchant")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch merchant");
        return r.json();
      })
      .then((data) => {
        if (data.name) setMerchant(data);
      })
      .catch(() => {});
  }, []);

  if (!merchant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">{t("home.title")}</h1>

      {/* Merchant Info */}
      <Card className="overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                {merchant.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{merchant.name}</h2>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant={merchant.status === "ACTIVE" ? "success" : "destructive"}>
                    {merchant.status}
                  </Badge>
                  <Badge variant="outline" className="font-medium">{merchant.plan}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-6 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <span className="text-muted-foreground text-xs">{t("home.regDate")}</span>
              <p className="font-semibold text-gray-900 mt-0.5">{new Date(merchant.registrationDate).toLocaleDateString()}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <span className="text-muted-foreground text-xs">{t("home.expDate")}</span>
              <p className="font-semibold text-gray-900 mt-0.5">{new Date(merchant.expireDate).toLocaleDateString()}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <span className="text-muted-foreground text-xs">{t("home.serviceCode")}</span>
              <p className="font-semibold text-gray-900 mt-0.5">{merchant.serviceCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t("home.usage")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">{t("home.mintingUsage")}</span>
              <span className="text-muted-foreground">
                {merchant.mintingUsed.toLocaleString()} / {merchant.mintingLimit.toLocaleString()}
              </span>
            </div>
            <Progress value={merchant.mintingUsed} max={merchant.mintingLimit} variant="blue" />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">{t("home.txUsage")}</span>
              <span className="text-muted-foreground">
                {merchant.transactionUsed.toLocaleString()} / {merchant.transactionLimit.toLocaleString()}
              </span>
            </div>
            <Progress value={merchant.transactionUsed} max={merchant.transactionLimit} variant="green" />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-700">{t("home.tokenTypes")}</span>
              <span className="text-muted-foreground">
                {merchant.tokenTypeCount} / {merchant.tokenTypeLimit}
              </span>
            </div>
            <Progress value={merchant.tokenTypeCount} max={merchant.tokenTypeLimit} variant="purple" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { href: "/token/create", icon: Coins, label: t("home.createCredits"), color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
          { href: "/wallet/management", icon: Wallet, label: t("home.manageWallets"), color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
          { href: "/marketing", icon: Megaphone, label: t("home.marketingTools"), color: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="group cursor-pointer card-hover">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg ${item.shadow}`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <span className="font-semibold text-gray-800">{item.label}</span>
                <ArrowRight className="mt-2 h-4 w-4 text-gray-300 transition-all group-hover:text-primary group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tutorials */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-dashed">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{t("home.tutorials")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("home.tutorials.desc")}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300" />
        </CardContent>
      </Card>
    </div>
  );
}
