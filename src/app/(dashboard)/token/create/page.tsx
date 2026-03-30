"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Coins, Ticket, FileText, CreditCard, Gift, Sparkles, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function TokenCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get("type");
  const { t } = useI18n();

  const tokenTypes = [
    {
      type: "CREDIT",
      label: t("tokenCreate.credits"),
      description: t("tokenCreate.credits.desc"),
      icon: Coins,
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
      hoverBorder: "hover:border-blue-200",
      bg: "hover:bg-blue-50/30",
    },
    {
      type: "COUPON",
      label: t("tokenCreate.coupons"),
      description: t("tokenCreate.coupons.desc"),
      icon: Ticket,
      color: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
      hoverBorder: "hover:border-emerald-200",
      bg: "hover:bg-emerald-50/30",
    },
    {
      type: "FLYER",
      label: t("tokenCreate.flyers"),
      description: t("tokenCreate.flyers.desc"),
      icon: FileText,
      color: "from-violet-500 to-violet-600",
      shadow: "shadow-violet-500/20",
      hoverBorder: "hover:border-violet-200",
      bg: "hover:bg-violet-50/30",
    },
    {
      type: "MEMBERSHIP",
      label: t("tokenCreate.membership"),
      description: t("tokenCreate.membership.desc"),
      icon: CreditCard,
      color: "from-orange-400 to-orange-500",
      shadow: "shadow-orange-500/20",
      hoverBorder: "hover:border-orange-200",
      bg: "hover:bg-orange-50/30",
    },
    {
      type: "GIFT_CARD",
      label: t("tokenCreate.giftCard"),
      description: t("tokenCreate.giftCard.desc"),
      icon: Gift,
      color: "from-pink-500 to-rose-500",
      shadow: "shadow-pink-500/20",
      hoverBorder: "hover:border-pink-200",
      bg: "hover:bg-pink-50/30",
    },
    {
      type: "CUSTOM",
      label: t("tokenCreate.custom"),
      description: t("tokenCreate.custom.desc"),
      icon: Sparkles,
      color: "from-gray-500 to-gray-600",
      shadow: "shadow-gray-500/20",
      hoverBorder: "hover:border-gray-300",
      bg: "hover:bg-gray-50/50",
    },
  ];

  const [selectedType, setSelectedType] = useState<string | null>(preselectedType);
  const [dialogOpen, setDialogOpen] = useState(!!preselectedType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openDialog(type: string) {
    setSelectedType(type);
    setDialogOpen(true);
    setError("");
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        type: selectedType,
        totalMinted: parseInt(formData.get("totalMinted") as string),
        description: formData.get("description"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.toString() || t("tokenCreate.error"));
      return;
    }

    setDialogOpen(false);
    router.push("/token");
    router.refresh();
  }

  const selectedInfo = tokenTypes.find((tt) => tt.type === selectedType);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">{t("tokenCreate.title")}</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {tokenTypes.map((item) => (
          <Card
            key={item.type}
            className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${item.hoverBorder} ${item.bg}`}
            onClick={() => openDialog(item.type)}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg ${item.shadow} transition-transform group-hover:scale-110`}>
                <item.icon className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-base text-gray-800">{item.label}</CardTitle>
              <CardDescription className="mt-2 text-xs leading-relaxed">
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedInfo && (
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${selectedInfo.color}`}>
                  <selectedInfo.icon className="h-4 w-4 text-white" />
                </div>
              )}
              {selectedInfo?.label || t("token.createToken")}
            </DialogTitle>
            <DialogDescription>{selectedInfo?.description}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("tokenCreate.name")}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t("tokenCreate.name.placeholder")}
                className="h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalMinted">{t("tokenCreate.amount")}</Label>
              <Input
                id="totalMinted"
                name="totalMinted"
                type="number"
                min="1"
                placeholder={t("tokenCreate.amount.placeholder")}
                className="h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("tokenCreate.desc")}</Label>
              <Input
                id="description"
                name="description"
                placeholder={t("tokenCreate.desc.placeholder")}
                className="h-10"
              />
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                {loading ? t("tokenCreate.creating") : t("common.confirm")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-dashed">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{t("tokenCreate.tutorials")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("tokenCreate.tutorials.desc")}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300" />
        </CardContent>
      </Card>
    </div>
  );
}
