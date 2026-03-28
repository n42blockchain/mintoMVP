"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Wallet {
  id: string;
  name: string;
  type: string;
}

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceWalletId: string;
  sourceWalletName: string;
  tokenId: string;
  tokenName: string;
  availableBalance: number;
  wallets: Wallet[];
  onSuccess: () => void;
}

export function TransferDialog({
  open,
  onOpenChange,
  sourceWalletId,
  sourceWalletName,
  tokenId,
  tokenName,
  availableBalance,
  wallets,
  onSuccess,
}: TransferDialogProps) {
  const [targetWalletId, setTargetWalletId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otherWallets = wallets.filter((w) => w.id !== sourceWalletId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const amount = parseInt(formData.get("amount") as string);

    if (amount > availableBalance) {
      setError("Insufficient balance");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/wallets/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceWalletId,
        targetWalletId,
        tokenId,
        amount,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Transfer failed");
      return;
    }

    onOpenChange(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer {tokenName}</DialogTitle>
          <DialogDescription>
            From {sourceWalletName} (Balance: {availableBalance.toLocaleString()})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Target Wallet</Label>
            <Select value={targetWalletId} onValueChange={setTargetWalletId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select wallet" />
              </SelectTrigger>
              <SelectContent>
                {otherWallets.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name} ({w.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              name="amount"
              type="number"
              min="1"
              max={availableBalance}
              placeholder="Enter amount"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !targetWalletId}>
              {loading ? "Transferring..." : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
