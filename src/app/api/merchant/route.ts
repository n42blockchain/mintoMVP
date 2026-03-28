import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchantId = (session.user as any).merchantId;
  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    include: {
      _count: { select: { tokens: true } },
    },
  });

  if (!merchant) {
    return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...merchant,
    tokenTypeCount: merchant._count.tokens,
  });
}
