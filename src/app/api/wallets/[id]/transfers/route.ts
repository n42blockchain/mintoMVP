import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wallet = await prisma.wallet.findUnique({ where: { id: params.id } });
  if (!wallet || wallet.merchantId !== (session.user as any).merchantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const [transfers, total] = await Promise.all([
    prisma.transfer.findMany({
      where: {
        OR: [
          { sourceWalletId: params.id },
          { targetWalletId: params.id },
        ],
      },
      include: {
        token: { select: { name: true, type: true } },
        sourceWallet: { select: { name: true, address: true } },
        targetWallet: { select: { name: true, address: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.transfer.count({
      where: {
        OR: [
          { sourceWalletId: params.id },
          { targetWalletId: params.id },
        ],
      },
    }),
  ]);

  return NextResponse.json({ transfers, total, page, limit });
}
