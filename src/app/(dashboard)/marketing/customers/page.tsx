import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Customer</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Users className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Customer management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
