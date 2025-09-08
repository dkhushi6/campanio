import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Login first to get started" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const body = await req.json();
  const { date, chatId } = body;

  if (!date || !chatId) {
    return NextResponse.json(
      { message: "date and chatId are required" },
      { status: 400 }
    );
  }

  const day = await prisma.day.findFirst({
    where: { date, userId },
  });

  if (!day) {
    return NextResponse.json(
      { message: "no day entry found" },
      { status: 404 }
    );
  }

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      userId,
      dayId: day.id,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chat) {
    return NextResponse.json({ message: "chat not found" }, { status: 404 });
  }

  return NextResponse.json({ chat });
}
