"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TokenStat {
  id: string;
  name: string;
  type: string;
  totalMinted: number;
  distributed: number;
  recycled: number;
  status: string;
}

export default function TokenOverviewPage() {
  const [tokens, setTokens] = useState<TokenStat[]>([]);

  useEffect(() => {
    fetch("/api/tokens/stats")
      .then((r) => r.json())
      .then(setTokens);
  }, []);

  const tokensByType = tokens.reduce<Record<string, TokenStat[]>>((acc, t) => {
    (acc[t.type] = acc[t.type] || []).push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Token Overview</h1>

      {/* Token Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tokens.map((token) => (
          <Card key={token.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{token.name}</CardTitle>
                <Badge variant="outline">{token.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total minted:</span>
                <span className="font-medium">{token.totalMinted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distributed:</span>
                <span>{token.distributed.toLocaleString()} / {token.totalMinted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recycled:</span>
                <span>{token.recycled.toLocaleString()} / {token.distributed.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Create Credits", type: "CREDIT" },
          { label: "Create Coupons", type: "COUPON" },
          { label: "Create Flyers", type: "FLYER" },
          { label: "Create Membership cards", type: "MEMBERSHIP" },
        ].map((item) => (
          <Link key={item.type} href={`/token/create?type=${item.type}`}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-center p-6">
                <span className="text-center font-semibold text-sm">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold">Case studies & Tutorials:</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn how to effectively use tokens for your business.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
