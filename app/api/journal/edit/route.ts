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
  const { date, journal } = body;
  if (!date || !journal) {
    return NextResponse.json(
      { message: "Date and journal are required" },
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
      { message: "No journal found for this date" },
      { status: 404 }
    );
  }

  // Update journal
  existingDay = await prisma.day.update({
    where: { userId_date: { userId, date } },
    data: { journal },
  });

  // Generate new reflection
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are a warm and supportive journaling companion named Campanio. 
The user has edited their journal entry. Please create a fresh reflection.

Guidelines:
- Focus on the updated journal content.
- Highlight positive progress, even if it's small.
- Encourage resilience and learning from challenges.
- Keep the tone uplifting, empathetic, and motivational.
- End with an empowering affirmation.

User’s Updated Journal Entry:
"""
${journal}
"""
    `,
  });

  // Save reflection
  await prisma.day.update({
    where: { userId_date: { userId, date } },
    data: { reflection: text },
  });

  return NextResponse.json({
    message: "Journal updated and reflection regenerated",
    reflection: text,
  });
}
