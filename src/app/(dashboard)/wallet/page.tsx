"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight } from "lucide-react";
import { WalletFormDialog } from "@/components/wallet/wallet-form-dialog";
import { useI18n } from "@/lib/i18n";

interface WalletData {
  id: string;
  name: string;
  address: string;
  type: string;
  status: string;
  balances: {
    balance: number;
    token: { id: string; name: string; type: string };
  }[];
}

export default function WalletOverviewPage() {
  const { t } = useI18n();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  function loadWallets() {
    fetch("/api/wallets")
      .then((r) => r.json())
      .then(setWallets);
  }

  useEffect(() => { loadWallets(); }, []);

  const masterWallet = wallets.find((w) => w.type === "MASTER");
  const subWallets = wallets.filter((w) => w.type !== "MASTER");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t("wallet.title")}</h1>
        <Link href="/wallet/management">
          <Button variant="outline" size="sm" className="gap-1">
            {t("wallet.management")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Master Wallet */}
        {masterWallet && (
          <Link href={`/wallet/${masterWallet.id}`}>
            <Card className="cursor-pointer card-hover overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t("wallet.master")}: {masterWallet.name}</CardTitle>
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">MASTER</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                {masterWallet.balances.map((b) => (
                  <div key={b.token.id} className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground">{b.token.name}:</span>
                    <span className="font-semibold tabular-nums">{b.balance.toLocaleString()}</span>
                  </div>
                ))}
                {masterWallet.balances.length === 0 && (
                  <p className="text-muted-foreground py-2">{t("wallet.noTokens")}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Sub Wallets */}
        {subWallets.map((wallet) => (
          <Link key={wallet.id} href={`/wallet/${wallet.id}`}>
            <Card className="cursor-pointer card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t("wallet.sub")}: {wallet.name}</CardTitle>
                  <Badge variant="outline">{wallet.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                {wallet.balances.map((b) => (
                  <div key={b.token.id} className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground">{b.token.name}:</span>
                    <span className="font-semibold tabular-nums">{b.balance.toLocaleString()}</span>
                  </div>
                ))}
                {wallet.balances.length === 0 && (
                  <p className="text-muted-foreground py-2">{t("wallet.noTokens")}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* New Sub-Wallet Card */}
        <Card
          className="cursor-pointer border-dashed transition-all duration-200 hover:shadow-md hover:border-primary/40 group"
          onClick={() => setCreateOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-primary/10 transition-colors">
              <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">{t("wallet.newSub")}</span>
          </CardContent>
        </Card>
      </div>

      <WalletFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSuccess={loadWallets}
      />

      <Card className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-dashed">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{t("wallet.tutorials")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("wallet.tutorials.desc")}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-300" />
        </CardContent>
      </Card>
    </div>
  );
}
