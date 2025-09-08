import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";

export async function PUT(req: NextRequest) {
  const session = await auth();
  const body = await req.json();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login first" }, { status: 401 });
  }
  const { date, mood } = body;
  if (!date || !mood) {
    return NextResponse.json(
      { message: "Date and mood are required" },
      { status: 400 }
    );
  }

  const userId = session.user.id;

  // Ensuring  the journal entry exists
  let existingDay = await prisma.day.findFirst({
    where: { userId, date },
  });

  if (!existingDay) {
    return NextResponse.json(
      { message: "No mood found for this date" },
      { status: 404 }
    );
  }

  // Update journal
  existingDay = await prisma.day.update({
    where: { userId_date: { userId, date } },
    data: { mood },
  });

  return NextResponse.json({
    message: "mood updated",
  });
}
