import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { transferSchema } from "@/lib/validators/transfer";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchantId = (session.user as any).merchantId;
  const body = await request.json();

  const parsed = transferSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { sourceWalletId, targetWalletId, tokenId, amount } = parsed.data;

  if (sourceWalletId === targetWalletId) {
    return NextResponse.json({ error: "Cannot transfer to same wallet" }, { status: 400 });
  }

  try {
    const transfer = await prisma.$transaction(async (tx) => {
      // Verify wallets belong to merchant
      const [sourceWallet, targetWallet] = await Promise.all([
        tx.wallet.findUnique({ where: { id: sourceWalletId } }),
        tx.wallet.findUnique({ where: { id: targetWalletId } }),
      ]);

      if (!sourceWallet || sourceWallet.merchantId !== merchantId) {
        throw new Error("Source wallet not found");
      }
      if (!targetWallet || targetWallet.merchantId !== merchantId) {
        throw new Error("Target wallet not found");
      }

      // Check source balance
      const sourceBalance = await tx.walletBalance.findUnique({
        where: { walletId_tokenId: { walletId: sourceWalletId, tokenId } },
      });

      if (!sourceBalance || sourceBalance.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // Deduct from source
      await tx.walletBalance.update({
        where: { walletId_tokenId: { walletId: sourceWalletId, tokenId } },
        data: { balance: { decrement: amount } },
      });

      // Add to target (upsert)
      await tx.walletBalance.upsert({
        where: { walletId_tokenId: { walletId: targetWalletId, tokenId } },
        update: { balance: { increment: amount } },
        create: { walletId: targetWalletId, tokenId, balance: amount },
      });

      // Update token distributed count
      await tx.token.update({
        where: { id: tokenId },
        data: { distributed: { increment: amount } },
      });

      // Increment merchant transaction usage
      await tx.merchant.update({
        where: { id: merchantId },
        data: { transactionUsed: { increment: 1 } },
      });

      // Create transfer record
      return tx.transfer.create({
        data: {
          sourceWalletId,
          targetWalletId,
          tokenId,
          amount,
          status: "COMPLETED",
        },
        include: {
          token: { select: { name: true, type: true } },
          sourceWallet: { select: { name: true } },
          targetWallet: { select: { name: true } },
        },
      });
    });

    return NextResponse.json(transfer, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Transfer failed" },
      { status: 400 }
    );
  }
}
