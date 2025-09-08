"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";

type ChatHistoryProps = {
  formattedDate: string;
};

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: any;
  createdAt: string;
};

type Chat = {
  id: string;
  name: string;
  messages: Message[];
};

const ChatHistory = ({ formattedDate }: ChatHistoryProps) => {
  const [dayChats, setDayChats] = useState<Chat[]>([]);

  useEffect(() => {
    const handleDayChatsFetch = async () => {
      try {
        const res = await axios.post("/api/chat/fetch-chats", {
          date: formattedDate,
        });
        setDayChats(res.data?.dayChats?.chat ?? []);
      } catch (error) {
        console.error("Error fetching chats", error);
        setDayChats([]);
      }
    };
    handleDayChatsFetch();
  }, [formattedDate]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground flex text-ce">
        Recent Conversations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dayChats.length > 0 ? (
          dayChats.map((chat) => {
            const firstMessage = chat.messages[0];
            const lastMessage = chat.messages[chat.messages.length - 1];

            const preview =
              firstMessage?.parts?.text ??
              firstMessage?.parts?.[0]?.text ??
              "No messages yet...";

            return (
              <div
                key={chat.id}
                className="flex items-start gap-3 p-4 rounded-xl shadow-sm bg-muted hover:bg-muted/80 cursor-pointer transition"
              >
                {/* Left icon/avatar */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageSquare size={18} />
                </div>

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {preview}
                  </p>
                  {lastMessage && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(lastMessage.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>

                {/* Meta info */}
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {chat.messages.length} msgs
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm">
            No chats for this day.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
