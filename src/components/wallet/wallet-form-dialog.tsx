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

interface WalletFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  wallet?: {
    id: string;
    name: string;
    type: string;
    email?: string | null;
    holder?: string | null;
    contact?: string | null;
  };
  onSuccess: () => void;
}

export function WalletFormDialog({
  open,
  onOpenChange,
  mode,
  wallet,
  onSuccess,
}: WalletFormDialogProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletType, setWalletType] = useState(wallet?.type || "MANAGER");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (mode === "create" && password !== confirmPassword) {
      setError(t("walletForm.passwordMismatch"));
      setLoading(false);
      return;
    }

    if (mode === "edit" && password && password !== confirmPassword) {
      setError(t("walletForm.passwordMismatch"));
      setLoading(false);
      return;
    }

    const body: any = {
      name: formData.get("name"),
      type: walletType,
      email: formData.get("email"),
      holder: formData.get("holder"),
      contact: formData.get("contact"),
    };

    if (password) {
      body.password = password;
    }

    const url = mode === "create" ? "/api/wallets" : `/api/wallets/${wallet?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("walletForm.operationFailed"));
      return;
    }

    onOpenChange(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("walletForm.createTitle") : t("walletForm.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? t("walletForm.createDesc")
              : t("walletForm.editDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("walletForm.name")}</Label>
            <Input
              name="name"
              defaultValue={wallet?.name}
              placeholder={t("walletForm.name.placeholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t("walletForm.type")}</Label>
            <Select
              value={walletType}
              onValueChange={setWalletType}
              disabled={wallet?.type === "MASTER"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANAGER">{t("walletForm.type.manager")}</SelectItem>
                <SelectItem value="RECEIVER">{t("walletForm.type.receiver")}</SelectItem>
                <SelectItem value="CASHIER">{t("walletForm.type.cashier")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              {mode === "create" ? t("walletForm.setPassword") : t("walletForm.newPassword")}
            </Label>
            <Input
              name="password"
              type="password"
              placeholder={t("walletForm.password.placeholder")}
              required={mode === "create"}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("walletForm.confirmPassword")}</Label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder={t("walletForm.confirmPassword.placeholder")}
              required={mode === "create"}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("walletForm.email")}</Label>
            <Input
              name="email"
              type="email"
              defaultValue={wallet?.email || ""}
              placeholder={t("walletForm.email.placeholder")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("walletForm.holder")}</Label>
            <Input
              name="holder"
              defaultValue={wallet?.holder || ""}
              placeholder={t("walletForm.holder.placeholder")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("walletForm.contact")}</Label>
            <Input
              name="contact"
              defaultValue={wallet?.contact || ""}
              placeholder={t("walletForm.contact.placeholder")}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("walletForm.saving") : t("common.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
