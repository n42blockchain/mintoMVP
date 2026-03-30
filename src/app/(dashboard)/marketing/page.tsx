"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Send, Users, BarChart3, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function MarketingToolsPage() {
  const { t } = useI18n();

  const features = [
    {
      title: t("marketing.airdrop"),
      description: t("marketing.airdrop.desc"),
      href: "/marketing/airdrop",
      icon: Send,
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      title: t("marketing.customer"),
      description: t("marketing.customer.desc"),
      href: "/marketing/customers",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
    },
    {
      title: t("marketing.analytics"),
      description: t("marketing.analytics.desc"),
      href: "/marketing/analytics",
      icon: BarChart3,
      color: "from-violet-500 to-violet-600",
      shadow: "shadow-violet-500/20",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">{t("marketing.title")}</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="group cursor-pointer card-hover h-full">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg ${feature.shadow} transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="mt-2 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-dashed">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{t("marketing.tutorials")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("marketing.tutorials.desc")}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300" />
        </CardContent>
      </Card>
    </div>
  );
}
