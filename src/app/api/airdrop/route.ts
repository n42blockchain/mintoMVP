import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchantId = (session.user as any).merchantId;
  const body = await request.json();

  const { sourceWalletId, targetWalletIds, tokenId, amountPerWallet } = body;

  if (!sourceWalletId || !targetWalletIds?.length || !tokenId || !amountPerWallet) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const totalAmount = amountPerWallet * targetWalletIds.length;

  try {
    const transfers = await prisma.$transaction(async (tx) => {
      const sourceWallet = await tx.wallet.findUnique({ where: { id: sourceWalletId } });
      if (!sourceWallet || sourceWallet.merchantId !== merchantId) {
        throw new Error("Source wallet not found");
      }

      const sourceBalance = await tx.walletBalance.findUnique({
        where: { walletId_tokenId: { walletId: sourceWalletId, tokenId } },
      });

      if (!sourceBalance || sourceBalance.balance < totalAmount) {
        throw new Error("Insufficient balance for airdrop");
      }

      // Deduct total from source
      await tx.walletBalance.update({
        where: { walletId_tokenId: { walletId: sourceWalletId, tokenId } },
        data: { balance: { decrement: totalAmount } },
      });

      const results = [];
      for (const targetId of targetWalletIds) {
        await tx.walletBalance.upsert({
          where: { walletId_tokenId: { walletId: targetId, tokenId } },
          update: { balance: { increment: amountPerWallet } },
          create: { walletId: targetId, tokenId, balance: amountPerWallet },
        });

        const transfer = await tx.transfer.create({
          data: {
            sourceWalletId,
            targetWalletId: targetId,
            tokenId,
            amount: amountPerWallet,
            status: "COMPLETED",
          },
        });
        results.push(transfer);
      }

      await tx.merchant.update({
        where: { id: merchantId },
        data: { transactionUsed: { increment: targetWalletIds.length } },
      });

      return results;
    });

    return NextResponse.json({ transfers, count: transfers.length }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Airdrop failed" }, { status: 400 });
  }
}
