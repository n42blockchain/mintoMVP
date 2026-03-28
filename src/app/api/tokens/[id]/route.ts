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

  const token = await prisma.token.findUnique({
    where: { id: params.id },
  });

  if (!token || token.merchantId !== (session.user as any).merchantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(token);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await prisma.token.findUnique({ where: { id: params.id } });
  if (!token || token.merchantId !== (session.user as any).merchantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const updated = await prisma.token.update({
    where: { id: params.id },
    data: {
      name: body.name,
      status: body.status,
      description: body.description,
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

  const token = await prisma.token.findUnique({ where: { id: params.id } });
  if (!token || token.merchantId !== (session.user as any).merchantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.token.update({
    where: { id: params.id },
    data: { status: "EXPIRED" },
  });

  return NextResponse.json({ success: true });
}
