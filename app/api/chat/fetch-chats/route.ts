import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//fetch all chats for the day
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login first to get started" });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { date } = body;
  if (!date) {
    return NextResponse.json({ message: "date not found" });
  }
  const oldDay = await prisma.day.findFirst({
    where: { date, userId },
    include: {
      chat: {
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });
  if (!oldDay) {
    return NextResponse.json({ message: "no day entry found" });
  }
  return NextResponse.json({ dayChats: oldDay });
}

//fetch days
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "login first" }, { status: 401 });
  }

  const userId = session.user.id;

  const days = await prisma.day.findMany({
    where: {
      userId,
    },
    orderBy: { date: "asc" },
    include: { chat: true },
  });

  return NextResponse.json({ days });
}
