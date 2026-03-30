"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletFormDialog } from "@/components/wallet/wallet-form-dialog";
import { truncateAddress } from "@/lib/utils";
import { Eye, Pencil, ArrowRightLeft, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";

interface WalletData {
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

const typeColors: Record<string, string> = {
  MASTER: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0",
  MANAGER: "bg-indigo-50 text-indigo-700 border-indigo-200",
  CASHIER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RECEIVER: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function WalletManagementPage() {
  const { t } = useI18n();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editWallet, setEditWallet] = useState<WalletData | null>(null);
  const [deleteWallet, setDeleteWallet] = useState<WalletData | null>(null);
  const [deleting, setDeleting] = useState(false);

  function loadWallets() {
    fetch("/api/wallets")
      .then((r) => r.json())
      .then(setWallets);
  }

  useEffect(() => { loadWallets(); }, []);

  async function handleDelete() {
    if (!deleteWallet) return;
    setDeleting(true);
    await fetch(`/api/wallets/${deleteWallet.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteWallet(null);
    loadWallets();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t("walletMgmt.title")}</h1>
        <Button onClick={() => setCreateOpen(true)} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20">
          <Plus className="h-4 w-4" />
          {t("walletMgmt.newSub")}
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80">
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletMgmt.name")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletMgmt.address")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletMgmt.type")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletMgmt.status")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletMgmt.created")}</th>
                  <th className="p-4 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{t("walletMgmt.action")}</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{wallet.name}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {truncateAddress(wallet.address)}
                    </td>
                    <td className="p-4">
                      <Badge className={typeColors[wallet.type] || ""}>{wallet.type}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="success">{wallet.status}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(wallet.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Link href={`/wallet/${wallet.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600" title={t("walletMgmt.detail")}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-amber-600"
                          title={t("walletMgmt.edit")}
                          onClick={() => setEditWallet(wallet)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Link href={`/wallet/${wallet.id}?transfer=true`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-emerald-600" title={t("walletMgmt.transfer")}>
                            <ArrowRightLeft className="h-4 w-4" />
                          </Button>
                        </Link>
                        {wallet.type !== "MASTER" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                            title={t("walletMgmt.delete")}
                            onClick={() => setDeleteWallet(wallet)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <WalletFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        onSuccess={loadWallets}
      />

      {/* Edit Dialog */}
      {editWallet && (
        <WalletFormDialog
          open={!!editWallet}
          onOpenChange={(open) => !open && setEditWallet(null)}
          mode="edit"
          wallet={editWallet}
          onSuccess={loadWallets}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteWallet} onOpenChange={(open) => !open && setDeleteWallet(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-4 w-4 text-red-600" />
              </div>
              {t("walletMgmt.deleteTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("walletMgmt.deleteConfirm", { name: deleteWallet?.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteWallet(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? t("walletMgmt.deleting") : t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
