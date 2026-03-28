import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchantId = (session.user as any).merchantId;
  const tokens = await prisma.token.findMany({
    where: { merchantId },
    select: {
      id: true,
      name: true,
      type: true,
      totalMinted: true,
      distributed: true,
      recycled: true,
      status: true,
    },
  });

  return NextResponse.json(tokens);
}
