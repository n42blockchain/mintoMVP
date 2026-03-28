import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { generateWalletAddress } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchantId = (session.user as any).merchantId;
  const wallets = await prisma.wallet.findMany({
    where: { merchantId },
    include: {
      balances: {
        include: { token: { select: { id: true, name: true, type: true } } },
      },
    },
    orderBy: [{ type: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(wallets);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchantId = (session.user as any).merchantId;
  const body = await request.json();

  const { name, type, password, email, holder, contact } = body;

  if (!name || !type || !password) {
    return NextResponse.json({ error: "Name, type, and password are required" }, { status: 400 });
  }

  const passwordHash = await hash(password, 10);
  const address = generateWalletAddress();

  const wallet = await prisma.wallet.create({
    data: {
      name,
      address,
      type,
      passwordHash,
      email: email || null,
      holder: holder || null,
      contact: contact || null,
      merchantId,
    },
    include: {
      balances: {
        include: { token: { select: { id: true, name: true, type: true } } },
      },
    },
  });

  return NextResponse.json(wallet, { status: 201 });
}
