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
  // ✅ Get today's date (without time, only YYYY-MM-DD)
  const today = new Date();
  const date = today.toISOString().split("T")[0];
  //  "2025-09-06"
  let oldDay = await prisma.day.findUnique({
    where: {
      userId_date: { userId, date }, // composite unique
    },
  });
  if (!oldDay) {
    const day = await prisma.day.create({
      data: {
        date,
        userId,
      },
    });
  }
  const { journal } = body;
  if (!journal) {
    return NextResponse.json({ message: "no journal found" });
  }
  oldDay = await prisma.day.update({
    where: {
      userId_date: { userId, date },
    },
    data: { journal },
  });

  return NextResponse.json({
    message: "Date picked successfully",
    date,
  });
}
