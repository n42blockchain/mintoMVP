import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Settings className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Settings page coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
