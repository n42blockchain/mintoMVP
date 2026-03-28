"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      setError(data.error || "Airdrop failed");
      return;
    }

    const data = await res.json();
    setResult(`Successfully airdropped to ${data.count} wallets!`);
    setSelectedTargets([]);
    setAmount("");

    // Reload wallets to update balances
    fetch("/api/wallets")
      .then((r) => r.json())
      .then(setWallets);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Air Drop</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Send tokens to multiple wallets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Source Wallet</Label>
              <Select value={sourceWalletId} onValueChange={setSourceWalletId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source wallet" />
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
              <Label>Token</Label>
              <Select value={tokenId} onValueChange={setTokenId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
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
            <Label>Amount per wallet</Label>
            <Input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount to send to each wallet"
            />
          </div>

          <div className="space-y-2">
            <Label>Target Wallets ({selectedTargets.length} selected)</Label>
            <div className="flex flex-wrap gap-2">
              {targetWallets.map((w) => (
                <Badge
                  key={w.id}
                  variant={selectedTargets.includes(w.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTarget(w.id)}
                >
                  {w.name} ({w.type})
                </Badge>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {result && <p className="text-sm text-green-600">{result}</p>}

          <Button
            onClick={handleAirdrop}
            disabled={loading || !sourceWalletId || !tokenId || !selectedTargets.length || !amount}
          >
            {loading ? "Sending..." : "Send Airdrop"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
