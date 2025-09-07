import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// get day
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "login first" });
  }
  const userId = session.user.id;
  const body = await req.json();
  const { date } = body;
  if (!date) {
    return NextResponse.json({ message: "date not found " }, { status: 400 });
  }
  const thatDay = await prisma.day.findFirst({
    where: { userId, date },
  });
  if (!thatDay) {
    return NextResponse.json({ message: "thatDay not found " });
  }
  return NextResponse.json({ message: "thatDay found!!! ", day: thatDay });
}
