import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login first to get started" });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { messages, chatId, date } = body;
  console.log("messages", messages);
  if (!messages) {
    return NextResponse.json({ message: "Message  not found" });
  }
  if (!chatId) {
    return NextResponse.json({ message: "chatId not found" });
  }
  if (!date) {
    return NextResponse.json({ message: "date not found" });
  }
  //check if the day exists
  let oldDay = await prisma.day.findUnique({
    where: {
      userId_date: { userId, date },
    },
  });
  if (!oldDay) {
    oldDay = await prisma.day.create({
      data: {
        date,
        userId,
      },
    });
    console.log({ message: "Day created for today" });
  }
  //segrigating user assistent messages

  const lastMsg = messages[messages.length - 1];
  const prevMsg = messages[messages.length - 2];

  let assistantMsg: any = null;
  let userMsg: any = null;

  if (lastMsg?.role === "assistant") {
    assistantMsg = lastMsg;
  }
  if (prevMsg?.role === "user") {
    userMsg = prevMsg;
  }
  console.log("AssistentMsg", assistantMsg);
  console.log("UserMsg", userMsg);

  let oldChat = await prisma.chat.findFirst({
    where: {
      id: chatId,

      userId,
    },
  });
  if (!oldChat) {
    oldChat = await prisma.chat.create({
      data: {
        id: chatId,
        userId,
        name: "new chat",
        dayId: oldDay.id,
      },
    });
  }
  if (oldChat) {
    await prisma.message.create({
      data: {
        id: userMsg.id,
        chatId: oldChat.id,
        userId,
        parts: userMsg.parts,
        role: userMsg.role,
      },
    });
    await prisma.message.create({
      data: {
        id: assistantMsg.id,
        chatId: oldChat.id,
        userId,
        parts: assistantMsg.parts,
        role: assistantMsg.role,
      },
    });
  }
  return NextResponse.json({
    message: "Messages  created successfully",
  });
}
