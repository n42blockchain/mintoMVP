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
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
      setError(t("transferDialog.insufficientBalance"));
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
      setError(data.error || t("transferDialog.failed"));
      return;
    }

    onOpenChange(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("transferDialog.title", { token: tokenName })}</DialogTitle>
          <DialogDescription>
            {t("transferDialog.from", { wallet: sourceWalletName, balance: availableBalance.toLocaleString() })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("transferDialog.target")}</Label>
            <Select value={targetWalletId} onValueChange={setTargetWalletId} required>
              <SelectTrigger>
                <SelectValue placeholder={t("transferDialog.target.placeholder")} />
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
            <Label>{t("transferDialog.amount")}</Label>
            <Input
              name="amount"
              type="number"
              min="1"
              max={availableBalance}
              placeholder={t("transferDialog.amount.placeholder")}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading || !targetWalletId}>
              {loading ? t("transferDialog.transferring") : t("common.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
