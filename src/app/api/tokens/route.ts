import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createTokenSchema } from "@/lib/validators/token";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchantId = (session.user as any).merchantId;
  const tokens = await prisma.token.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tokens);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchantId = (session.user as any).merchantId;
  const body = await request.json();

  const parsed = createTokenSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
  if (!merchant) {
    return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
  }

  // Check plan limits
  const tokenCount = await prisma.token.count({ where: { merchantId } });
  if (tokenCount >= merchant.tokenTypeLimit) {
    return NextResponse.json({ error: "Token type limit reached" }, { status: 403 });
  }

  if (merchant.mintingUsed + parsed.data.totalMinted > merchant.mintingLimit) {
    return NextResponse.json({ error: "Minting limit exceeded" }, { status: 403 });
  }

  const token = await prisma.$transaction(async (tx) => {
    const newToken = await tx.token.create({
      data: {
        name: parsed.data.name,
        type: parsed.data.type,
        totalMinted: parsed.data.totalMinted,
        description: parsed.data.description,
        merchantId,
      },
    });

    // Add minted tokens to master wallet
    const masterWallet = await tx.wallet.findFirst({
      where: { merchantId, type: "MASTER" },
    });

    if (masterWallet) {
      await tx.walletBalance.create({
        data: {
          walletId: masterWallet.id,
          tokenId: newToken.id,
          balance: parsed.data.totalMinted,
        },
      });
    }

    // Update merchant minting usage
    await tx.merchant.update({
      where: { id: merchantId },
      data: { mintingUsed: { increment: parsed.data.totalMinted } },
    });

    return newToken;
  });

  return NextResponse.json(token, { status: 201 });
}
