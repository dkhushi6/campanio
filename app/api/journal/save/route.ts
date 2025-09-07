import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login first" }, { status: 401 });
  }
  const userId = session.user.id;
  const todayStr = new Date().toISOString().split("T")[0].replace(/-/g, ".");
  let oldDay = await prisma.day.findFirst({
    where: {
      userId,
      date: todayStr,
    },
  });
  if (!oldDay) {
    return NextResponse.json({ message: "the day doesnt exist " });
  }
  const { journal } = body;
  if (!journal) {
    return NextResponse.json({ message: "no journal found" });
  }
  const oldJournal = oldDay.journal;
  if (oldJournal) {
    return NextResponse.json({ message: " journal Already saved for the day" });
  }
  // push journal in day
  oldDay = await prisma.day.update({
    where: {
      userId_date: { userId, date: todayStr },
    },
    data: { journal },
  });
  //generating reflection of day
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are a warm and supportive journaling companion named Campanio. 
Your task is to reflect back positively on the user’s day based on their journal entry. 

Guidelines:
- Always highlight the good in their day, even in small moments.
- Encourage them to feel proud of what they did, no matter how big or small.
- Acknowledge challenges if mentioned, but reframe them as growth opportunities.
- Keep the tone gentle, uplifting, and motivating.
- End with an affirmation that makes them feel accomplished and ready for tomorrow.

User’s Journal Entry:
"""
${journal}
"""

Now, write a heartfelt reflection for the user.
  `,
  });
  console.log("REFLECTION GENERATED", text);

  return NextResponse.json({
    message: "Journal saved in DataBAse successfully",
  });
}
