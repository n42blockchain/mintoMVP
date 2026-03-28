"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletFormDialog } from "@/components/wallet/wallet-form-dialog";
import { truncateAddress } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

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

export default function WalletManagementPage() {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wallet Management</h1>
        <Button onClick={() => setCreateOpen(true)}>New sub-wallet</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Wallet Address</th>
                  <th className="p-3 text-left font-medium">Type</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Created</th>
                  <th className="p-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet.id} className="border-b">
                    <td className="p-3 font-medium">{wallet.name}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">
                      {truncateAddress(wallet.address)}
                    </td>
                    <td className="p-3">
                      <Badge variant={wallet.type === "MASTER" ? "default" : "outline"}>
                        {wallet.type}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="success">{wallet.status}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(wallet.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Link href={`/wallet/${wallet.id}`}>
                          <Button variant="ghost" size="sm">Detail</Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditWallet(wallet)}
                        >
                          Edit
                        </Button>
                        <Link href={`/wallet/${wallet.id}?transfer=true`}>
                          <Button variant="ghost" size="sm">Transfer</Button>
                        </Link>
                        {wallet.type !== "MASTER" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteWallet(wallet)}
                          >
                            Delete
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
            <DialogTitle>Delete Wallet</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete wallet &quot;{deleteWallet?.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteWallet(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
