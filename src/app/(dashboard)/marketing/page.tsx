"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Send, Users, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Air Drop",
    description: "Send flyers or coupons directly to the customer",
    href: "/marketing/airdrop",
    icon: Send,
  },
  {
    title: "My Customer",
    description: "Manage your customer base and interactions",
    href: "/marketing/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    description: "View insights and performance metrics",
    href: "/marketing/analytics",
    icon: BarChart3,
  },
];

export default function MarketingToolsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Marketing Tools</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md h-full">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <feature.icon className="mb-4 h-12 w-12 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="mt-2">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold">Tutorials:</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn how to leverage marketing tools to grow your business.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
