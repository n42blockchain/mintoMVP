"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Wallet, Megaphone } from "lucide-react";

interface MerchantData {
  name: string;
  plan: string;
  status: string;
  registrationDate: string;
  expireDate: string;
  serviceCode: string;
  mintingUsed: number;
  mintingLimit: number;
  transactionUsed: number;
  transactionLimit: number;
  tokenTypeCount: number;
  tokenTypeLimit: number;
}

export default function HomePage() {
  const [merchant, setMerchant] = useState<MerchantData | null>(null);

  useEffect(() => {
    fetch("/api/merchant")
      .then((r) => r.json())
      .then(setMerchant);
  }, []);

  if (!merchant) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const statusVariant = merchant.status === "ACTIVE" ? "success" : "destructive";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Home</h1>

      {/* Merchant Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
                {merchant.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{merchant.name}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={statusVariant}>
                    {merchant.status}
                  </Badge>
                  <Badge variant="outline">{merchant.plan}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Registration date: </span>
              {new Date(merchant.registrationDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium text-foreground">Expire date: </span>
              {new Date(merchant.expireDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium text-foreground">Service code: </span>
              {merchant.serviceCode}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Minting usage</span>
              <span className="text-muted-foreground">
                {merchant.mintingUsed.toLocaleString()} / {merchant.mintingLimit.toLocaleString()}
              </span>
            </div>
            <Progress value={merchant.mintingUsed} max={merchant.mintingLimit} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Transaction usage</span>
              <span className="text-muted-foreground">
                {merchant.transactionUsed.toLocaleString()} / {merchant.transactionLimit.toLocaleString()}
              </span>
            </div>
            <Progress value={merchant.transactionUsed} max={merchant.transactionLimit} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-sm">
              <span>Token types</span>
              <span className="text-muted-foreground">
                {merchant.tokenTypeCount} / {merchant.tokenTypeLimit}
              </span>
            </div>
            <Progress value={merchant.tokenTypeCount} max={merchant.tokenTypeLimit} />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/token/create">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Coins className="mb-3 h-10 w-10 text-primary" />
              <span className="font-semibold">Create credits</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/wallet/management">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Wallet className="mb-3 h-10 w-10 text-primary" />
              <span className="font-semibold">Manage wallets</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/marketing">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Megaphone className="mb-3 h-10 w-10 text-primary" />
              <span className="font-semibold">Marketing Tools</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Tutorials */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold">Tutorials:</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started with Minto by exploring our guides and tutorials.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
