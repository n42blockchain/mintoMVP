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
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (mode === "edit" && password && password !== confirmPassword) {
      setError("Passwords don't match");
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
      setError(data.error || "Operation failed");
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
            {mode === "create" ? "Create Sub-Wallet" : "Edit Wallet"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new sub-wallet for your team"
              : "Update wallet information"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              name="name"
              defaultValue={wallet?.name}
              placeholder="Wallet name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={walletType}
              onValueChange={setWalletType}
              disabled={wallet?.type === "MASTER"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="RECEIVER">Receiver</SelectItem>
                <SelectItem value="CASHIER">Cashier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              {mode === "create" ? "Set Password" : "New Password (leave blank to keep)"}
            </Label>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required={mode === "create"}
            />
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required={mode === "create"}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              defaultValue={wallet?.email || ""}
              placeholder="Email address"
            />
          </div>

          <div className="space-y-2">
            <Label>Holder</Label>
            <Input
              name="holder"
              defaultValue={wallet?.holder || ""}
              placeholder="Holder name"
            />
          </div>

          <div className="space-y-2">
            <Label>Contact</Label>
            <Input
              name="contact"
              defaultValue={wallet?.contact || ""}
              placeholder="Contact number"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Confirm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
