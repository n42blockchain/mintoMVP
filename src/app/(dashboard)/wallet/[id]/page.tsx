"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletFormDialog } from "@/components/wallet/wallet-form-dialog";
import { TransferDialog } from "@/components/wallet/transfer-dialog";
import { ArrowLeft, ArrowRightLeft, ArrowDownLeft, ArrowUpRight, Pencil } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface WalletDetail {
  id: string;
  name: string;
  address: string;
  type: string;
  status: string;
  email?: string | null;
  holder?: string | null;
  contact?: string | null;
  createdAt: string;
  balances: {
    balance: number;
    token: { id: string; name: string; type: string };
  }[];
}

interface Transfer {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  token: { name: string; type: string };
  sourceWallet: { name: string; address: string };
  targetWallet: { name: string; address: string };
}

interface AllWallet {
  id: string;
  name: string;
  type: string;
}

export default function WalletDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const walletId = params.id as string;

  const [wallet, setWallet] = useState<WalletDetail | null>(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [allWallets, setAllWallets] = useState<AllWallet[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [transferInfo, setTransferInfo] = useState<{
    tokenId: string;
    tokenName: string;
    balance: number;
  } | null>(null);

  function loadData() {
    fetch(`/api/wallets/${walletId}`)
      .then((r) => r.json())
      .then(setWallet);
    fetch(`/api/wallets/${walletId}/transfers`)
      .then((r) => r.json())
      .then((data) => setTransfers(data.transfers || []));
    fetch("/api/wallets")
      .then((r) => r.json())
      .then((data: any[]) =>
        setAllWallets(data.map((w) => ({ id: w.id, name: w.name, type: w.type })))
      );
  }

  useEffect(() => { loadData(); }, [walletId]);

  if (!wallet) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-100">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{wallet.name}</h1>
        <Badge variant={wallet.type === "MASTER" ? "default" : "outline"} className={wallet.type === "MASTER" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0" : ""}>
          {wallet.type}
        </Badge>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            {t("walletDetail.edit")}
          </Button>
        </div>
      </div>

      {/* Wallet Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: t("walletDetail.address"), value: <span className="font-mono text-xs">{wallet.address}</span> },
              { label: t("walletDetail.status"), value: <Badge variant="success">{wallet.status}</Badge> },
              wallet.holder ? { label: t("walletDetail.holder"), value: wallet.holder } : null,
              wallet.email ? { label: t("walletDetail.email"), value: wallet.email } : null,
              wallet.contact ? { label: t("walletDetail.contact"), value: wallet.contact } : null,
            ].filter(Boolean).map((item, i) => (
              <div key={i} className="rounded-lg bg-gray-50 p-3">
                <span className="text-muted-foreground text-xs">{item!.label}</span>
                <div className="mt-1 text-sm font-medium text-gray-900">{item!.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Balances */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t("walletDetail.balances")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {wallet.balances.map((b) => (
              <div key={b.token.id} className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-primary text-xs font-bold">{b.token.name.charAt(0)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{b.token.name}</span>
                    <span className="ml-2 text-muted-foreground text-xs">({b.token.type})</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold tabular-nums text-gray-900">{b.balance.toLocaleString()}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() =>
                      setTransferInfo({
                        tokenId: b.token.id,
                        tokenName: b.token.name,
                        balance: b.balance,
                      })
                    }
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    {t("walletDetail.transfer")}
                  </Button>
                </div>
              </div>
            ))}
            {wallet.balances.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-6">{t("walletDetail.noBalances")}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transfer History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{t("walletDetail.history")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletDetail.id")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletDetail.token")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletDetail.status")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletDetail.amount")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletDetail.fromTo")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletDetail.time")}</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((tf) => {
                  const isOutgoing = tf.sourceWallet.name === wallet.name;
                  return (
                    <tr key={tf.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono text-xs text-muted-foreground">{tf.id.slice(0, 8)}...</td>
                      <td className="p-4 font-medium">{tf.token.name}</td>
                      <td className="p-4">
                        <Badge variant="success">{tf.status}</Badge>
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold tabular-nums ${isOutgoing ? "text-red-600" : "text-emerald-600"}`}>
                          {isOutgoing ? "-" : "+"}{tf.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          {isOutgoing ? (
                            <ArrowUpRight className="h-3.5 w-3.5 text-red-400" />
                          ) : (
                            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-400" />
                          )}
                          {tf.sourceWallet.name} → {tf.targetWallet.name}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(tf.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
                {transfers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      {t("walletDetail.noTransfers")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <WalletFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        wallet={wallet}
        onSuccess={loadData}
      />

      {/* Transfer Dialog */}
      {transferInfo && (
        <TransferDialog
          open={!!transferInfo}
          onOpenChange={(open) => !open && setTransferInfo(null)}
          sourceWalletId={walletId}
          sourceWalletName={wallet.name}
          tokenId={transferInfo.tokenId}
          tokenName={transferInfo.tokenName}
          availableBalance={transferInfo.balance}
          wallets={allWallets}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
