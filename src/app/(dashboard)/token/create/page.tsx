"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
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
import { Coins, Ticket, FileText, CreditCard, Gift, Sparkles } from "lucide-react";

const tokenTypes = [
  {
    type: "CREDIT",
    label: "Create Credits",
    description: "Store money for prepaid card or gift card",
    icon: Coins,
  },
  {
    type: "COUPON",
    label: "Create Coupons",
    description: "Coupons for special products or promotion",
    icon: Ticket,
  },
  {
    type: "FLYER",
    label: "Create Flyers",
    description: "Non-transferable and automatically expired advertisements",
    icon: FileText,
  },
  {
    type: "MEMBERSHIP",
    label: "Create Membership cards",
    description: "Membership cards for loyal customers",
    icon: CreditCard,
  },
  {
    type: "GIFT_CARD",
    label: "Create Gift Card",
    description: "Gift cards for special occasions",
    icon: Gift,
  },
  {
    type: "CUSTOM",
    label: "Customize",
    description: "Create a custom token type",
    icon: Sparkles,
  },
];

export default function TokenCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get("type");

  const [selectedType, setSelectedType] = useState<string | null>(preselectedType);
  const [dialogOpen, setDialogOpen] = useState(!!preselectedType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openDialog(type: string) {
    setSelectedType(type);
    setDialogOpen(true);
    setError("");
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        type: selectedType,
        totalMinted: parseInt(formData.get("totalMinted") as string),
        description: formData.get("description"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.toString() || "Failed to create token");
      return;
    }

    setDialogOpen(false);
    router.push("/token");
    router.refresh();
  }

  const selectedInfo = tokenTypes.find((t) => t.type === selectedType);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create / Mint</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {tokenTypes.map((item) => (
          <Card
            key={item.type}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => openDialog(item.type)}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <item.icon className="mb-3 h-10 w-10 text-primary" />
              <CardTitle className="text-base">{item.label}</CardTitle>
              <CardDescription className="mt-2 text-xs">
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedInfo?.label || "Create Token"}</DialogTitle>
            <DialogDescription>{selectedInfo?.description}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Store Credit"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalMinted">Initial Mint Amount</Label>
              <Input
                id="totalMinted"
                name="totalMinted"
                type="number"
                min="1"
                placeholder="e.g. 10000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                name="description"
                placeholder="Description"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold">Case studies & Tutorials:</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn best practices for creating and managing tokens.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
