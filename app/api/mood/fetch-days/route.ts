import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// get all days with only mood + date
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "login first" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const days = await prisma.day.findMany({
      where: { userId },
      select: {
        date: true,
        mood: true,
      },
    });

    return NextResponse.json({ days });
  } catch (err) {
    console.error("Error fetching days:", err);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
