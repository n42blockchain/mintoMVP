"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { WalletFormDialog } from "@/components/wallet/wallet-form-dialog";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wallet Overview</h1>
        <Link href="/wallet/management">
          <Button variant="outline" size="sm">Wallet Management</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Master Wallet */}
        {masterWallet && (
          <Link href={`/wallet/${masterWallet.id}`}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Master Wallet: {masterWallet.name}</CardTitle>
                  <Badge variant="default">MASTER</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {masterWallet.balances.map((b) => (
                  <div key={b.token.id} className="flex justify-between">
                    <span className="text-muted-foreground">{b.token.name}:</span>
                    <span className="font-medium">{b.balance.toLocaleString()}</span>
                  </div>
                ))}
                {masterWallet.balances.length === 0 && (
                  <p className="text-muted-foreground">No tokens yet</p>
                )}
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Sub Wallets */}
        {subWallets.map((wallet) => (
          <Link key={wallet.id} href={`/wallet/${wallet.id}`}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Sub-Wallet: {wallet.name}</CardTitle>
                  <Badge variant="outline">{wallet.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {wallet.balances.map((b) => (
                  <div key={b.token.id} className="flex justify-between">
                    <span className="text-muted-foreground">{b.token.name}:</span>
                    <span className="font-medium">{b.balance.toLocaleString()}</span>
                  </div>
                ))}
                {wallet.balances.length === 0 && (
                  <p className="text-muted-foreground">No tokens yet</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* New Sub-Wallet Card */}
        <Card
          className="cursor-pointer border-dashed transition-shadow hover:shadow-md"
          onClick={() => setCreateOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Plus className="mb-2 h-8 w-8 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">New Sub-Wallet</span>
          </CardContent>
        </Card>
      </div>

      <WalletFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSuccess={loadWallets}
      />

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold">Tutorials:</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn how to set up and manage your wallet hierarchy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
