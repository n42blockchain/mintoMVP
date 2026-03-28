import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Analytics dashboard coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
