"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Ticket, FileText, CreditCard, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface TokenStat {
  id: string;
  name: string;
  type: string;
  totalMinted: number;
  distributed: number;
  recycled: number;
  status: string;
}

const typeConfig: Record<string, { icon: any; color: string; badgeClass: string; progressVariant: "blue" | "green" | "purple" | "orange" }> = {
  CREDIT: { icon: Coins, color: "from-blue-500 to-blue-600", badgeClass: "bg-blue-50 text-blue-700 border-blue-200", progressVariant: "blue" },
  COUPON: { icon: Ticket, color: "from-emerald-500 to-emerald-600", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", progressVariant: "green" },
  FLYER: { icon: FileText, color: "from-violet-500 to-violet-600", badgeClass: "bg-violet-50 text-violet-700 border-violet-200", progressVariant: "purple" },
  MEMBERSHIP: { icon: CreditCard, color: "from-orange-400 to-orange-500", badgeClass: "bg-orange-50 text-orange-700 border-orange-200", progressVariant: "orange" },
};

export default function TokenOverviewPage() {
  const [tokens, setTokens] = useState<TokenStat[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    fetch("/api/tokens/stats")
      .then((r) => r.json())
      .then(setTokens);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">{t("token.title")}</h1>

      {/* Token Stats */}
      {tokens.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Coins className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-muted-foreground">{t("token.empty")}</p>
            <Link href="/token/create" className="mt-4">
              <span className="text-primary font-medium text-sm hover:underline">{t("token.createToken")}</span>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => {
            const config = typeConfig[token.type] || typeConfig.CREDIT;
            const Icon = config.icon;
            const distPercent = token.totalMinted > 0 ? (token.distributed / token.totalMinted) * 100 : 0;

            return (
              <Card key={token.id} className="card-hover overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${config.color}`} />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${config.color} shadow-sm`}>
                        <Icon className="h-4.5 w-4.5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{token.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className={config.badgeClass}>{token.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("token.totalMinted")}</span>
                    <span className="font-semibold">{token.totalMinted.toLocaleString()}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{t("token.distributed")}</span>
                      <span className="text-xs text-muted-foreground">{token.distributed.toLocaleString()} / {token.totalMinted.toLocaleString()}</span>
                    </div>
                    <Progress value={token.distributed} max={token.totalMinted} variant={config.progressVariant} />
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-muted-foreground">{t("token.recycled")}</span>
                    <span>{token.recycled.toLocaleString()} / {token.distributed.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: t("token.createCredits"), type: "CREDIT", icon: Coins, color: "text-blue-500" },
          { label: t("token.createCoupons"), type: "COUPON", icon: Ticket, color: "text-emerald-500" },
          { label: t("token.createFlyers"), type: "FLYER", icon: FileText, color: "text-violet-500" },
          { label: t("token.createMembership"), type: "MEMBERSHIP", icon: CreditCard, color: "text-orange-500" },
        ].map((item) => (
          <Link key={item.type} href={`/token/create?type=${item.type}`}>
            <Card className="group cursor-pointer card-hover">
              <CardContent className="flex flex-col items-center justify-center p-5 gap-2">
                <item.icon className={`h-6 w-6 ${item.color}`} />
                <span className="text-center font-medium text-sm text-gray-700">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-dashed">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{t("token.tutorials")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("token.tutorials.desc")}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300" />
        </CardContent>
      </Card>
    </div>
  );
}
