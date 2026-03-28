"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletFormDialog } from "@/components/wallet/wallet-form-dialog";
import { TransferDialog } from "@/components/wallet/transfer-dialog";
import { ArrowLeft, ArrowRightLeft } from "lucide-react";

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
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{wallet.name}</h1>
        <Badge variant={wallet.type === "MASTER" ? "default" : "outline"}>
          {wallet.type}
        </Badge>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </div>
      </div>

      {/* Wallet Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Address: </span>
              <span className="font-mono text-xs">{wallet.address}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status: </span>
              <Badge variant="success">{wallet.status}</Badge>
            </div>
            {wallet.holder && (
              <div>
                <span className="text-muted-foreground">Holder: </span>
                {wallet.holder}
              </div>
            )}
            {wallet.email && (
              <div>
                <span className="text-muted-foreground">Email: </span>
                {wallet.email}
              </div>
            )}
            {wallet.contact && (
              <div>
                <span className="text-muted-foreground">Contact: </span>
                {wallet.contact}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Token Balances */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Token Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {wallet.balances.map((b) => (
              <div key={b.token.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <span className="font-medium">{b.token.name}</span>
                  <span className="ml-2 text-muted-foreground text-sm">({b.token.type})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{b.balance.toLocaleString()}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setTransferInfo({
                        tokenId: b.token.id,
                        tokenName: b.token.name,
                        balance: b.balance,
                      })
                    }
                  >
                    <ArrowRightLeft className="mr-1 h-3 w-3" />
                    Transfer
                  </Button>
                </div>
              </div>
            ))}
            {wallet.balances.length === 0 && (
              <p className="text-muted-foreground text-sm">No token balances</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transfer History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transfer History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Token Type</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Amount</th>
                  <th className="p-3 text-left font-medium">From/To</th>
                  <th className="p-3 text-left font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t) => (
                  <tr key={t.id} className="border-b">
                    <td className="p-3 font-mono text-xs">{t.id.slice(0, 8)}...</td>
                    <td className="p-3">{t.token.name}</td>
                    <td className="p-3">
                      <Badge variant="success">{t.status}</Badge>
                    </td>
                    <td className="p-3 font-medium">{t.amount.toLocaleString()}</td>
                    <td className="p-3 text-muted-foreground">
                      {t.sourceWallet.name} → {t.targetWallet.name}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {transfers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      No transfers yet
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
