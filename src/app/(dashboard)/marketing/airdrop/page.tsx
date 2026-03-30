"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

interface WalletData {
  id: string;
  name: string;
  type: string;
  balances: {
    balance: number;
    token: { id: string; name: string; type: string };
  }[];
}

export default function AirdropPage() {
  const { t } = useI18n();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [sourceWalletId, setSourceWalletId] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/wallets")
      .then((r) => r.json())
      .then(setWallets);
  }, []);

  const sourceWallet = wallets.find((w) => w.id === sourceWalletId);
  const availableTokens = sourceWallet?.balances || [];
  const targetWallets = wallets.filter((w) => w.id !== sourceWalletId);

  function toggleTarget(id: string) {
    setSelectedTargets((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleAirdrop() {
    setLoading(true);
    setError("");
    setResult(null);

    const res = await fetch("/api/airdrop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceWalletId,
        targetWalletIds: selectedTargets,
        tokenId,
        amountPerWallet: parseInt(amount),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("airdrop.failed"));
      return;
    }

    const data = await res.json();
    setResult(t("airdrop.success", { count: data.count }));
    setSelectedTargets([]);
    setAmount("");

    fetch("/api/wallets")
      .then((r) => r.json())
      .then(setWallets);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900">{t("airdrop.title")}</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            {t("airdrop.sendTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t("airdrop.source")}</Label>
              <Select value={sourceWalletId} onValueChange={setSourceWalletId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={t("airdrop.source.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name} ({w.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t("airdrop.token")}</Label>
              <Select value={tokenId} onValueChange={setTokenId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={t("airdrop.token.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {availableTokens.map((b) => (
                    <SelectItem key={b.token.id} value={b.token.id}>
                      {b.token.name} (Balance: {b.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t("airdrop.amountPerWallet")}</Label>
            <Input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("airdrop.amountPerWallet.placeholder")}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("airdrop.targets", { count: selectedTargets.length })}
            </Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50/50 min-h-[48px]">
              {targetWallets.map((w) => (
                <Badge
                  key={w.id}
                  variant={selectedTargets.includes(w.id) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${selectedTargets.includes(w.id) ? "bg-primary shadow-sm" : "hover:border-primary/50"}`}
                  onClick={() => toggleTarget(w.id)}
                >
                  {selectedTargets.includes(w.id) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {w.name} ({w.type})
                </Badge>
              ))}
              {targetWallets.length === 0 && (
                <span className="text-sm text-muted-foreground">{t("airdrop.noWallets")}</span>
              )}
            </div>
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
          {result && <p className="text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" />{result}</p>}

          <Button
            onClick={handleAirdrop}
            disabled={loading || !sourceWalletId || !tokenId || !selectedTargets.length || !amount}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20"
          >
            <Send className="h-4 w-4" />
            {loading ? t("airdrop.sending") : t("airdrop.send")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
