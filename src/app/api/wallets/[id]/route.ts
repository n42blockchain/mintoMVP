import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wallet = await prisma.wallet.findUnique({
    where: { id: params.id },
    include: {
      balances: {
        include: { token: { select: { id: true, name: true, type: true } } },
      },
    },
  });

  if (!wallet || wallet.merchantId !== (session.user as any).merchantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(wallet);
}

export async function PUT(
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

  const body = await request.json();
  const updateData: any = {};

  if (body.name) updateData.name = body.name;
  if (body.type && wallet.type !== "MASTER") updateData.type = body.type;
  if (body.email !== undefined) updateData.email = body.email || null;
  if (body.holder !== undefined) updateData.holder = body.holder || null;
  if (body.contact !== undefined) updateData.contact = body.contact || null;
  if (body.password) {
    updateData.passwordHash = await hash(body.password, 10);
  }

  const updated = await prisma.wallet.update({
    where: { id: params.id },
    data: updateData,
    include: {
      balances: {
        include: { token: { select: { id: true, name: true, type: true } } },
      },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
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

  if (wallet.type === "MASTER") {
    return NextResponse.json({ error: "Cannot delete master wallet" }, { status: 403 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.transfer.deleteMany({
      where: {
        OR: [
          { sourceWalletId: params.id },
          { targetWalletId: params.id },
        ],
      },
    });
    await tx.walletBalance.deleteMany({ where: { walletId: params.id } });
    await tx.wallet.delete({ where: { id: params.id } });
  });

  return NextResponse.json({ success: true });
}
