import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login first" }, { status: 401 });
  }
  const userId = session.user.id;
  const todayStr = new Date().toISOString().split("T")[0].replace(/-/g, ".");

  let oldDay = await prisma.day.findUnique({
    where: {
      userId_date: { userId, date: todayStr },
    },
  });
  if (!oldDay) {
    oldDay = await prisma.day.create({
      data: {
        date: todayStr,
        userId,
      },
    });
    console.log({ message: "Day created for today" });
  }
  const { mood } = body;
  if (!mood) {
    return NextResponse.json({ message: "no mood found" });
  }
  const oldMood = oldDay.mood;
  if (oldMood) {
    return NextResponse.json({ message: " mood Already saved for the day" });
  }
  // push journal in day
  oldDay = await prisma.day.update({
    where: {
      userId_date: { userId, date: todayStr },
    },
    data: { mood },
  });

  return NextResponse.json({
    message: "mood saved in DataBAse successfully",
  });
}
