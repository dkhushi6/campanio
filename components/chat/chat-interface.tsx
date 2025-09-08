"use client";

import ChatCard from "@/components/chat/chat-card";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { suggestions } from "@/components/chat/suggestion";
import { DefaultChatTransport, UIMessage } from "ai";
import axios from "axios";
import Spinner from "../spinner";
type ChatInterfaceProps = {
  chatId: string;
  formattedDate: string;
  oldChats: UIMessage[];
};
export default function ChatInterface({
  chatId,
  formattedDate,
  oldChats,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [oldChatLoading, setOldLoading] = useState(true);

  const { messages, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId, date: formattedDate },
    }),
    onFinish: async (message) => {
      if (!chatId) {
        console.log("chatId from usechat", chatId);

        return;
      } else {
        console.log("chatId from usechat", chatId);
        console.log("message from usechat", message.messages);
        const res = await axios.post("/api/chat/save-chat", {
          messages: message.messages,
          chatId,
          date: formattedDate,
        });
        console.log(res.data);
      }
    },
  });
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadOldChats = async () => {
      setOldLoading(true); // Start loading
      try {
        if (!oldChats || oldChats.length === 0) {
          console.log("THIS IS A NEW CHAT");
          return;
        }

        console.log("oldchats from chatInterface:", oldChats);

        // Add a small delay to simulate loading for UX (optional)
        await new Promise((resolve) => setTimeout(resolve, 300));

        setMessages(oldChats);
      } catch (error) {
        console.error("Error loading old chats:", error);
      } finally {
        setOldLoading(false); // Always stop loading
      }
    };

    loadOldChats();
  }, [oldChats, setMessages]);

  // Scroll to bottom only if already near bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    if (isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  if (oldChatLoading) {
    return <Spinner />;
  }
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto h-screen px-4 py-6">
      {/* Scrollable Chat Area */}
      <div
        ref={containerRef}
        className="flex-1 w-full overflow-y-auto mb-4 items-center flex px-2"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-12 space-y-4">
            <MessageCircle className="w-16 h-16 text-[#6059E7]" />
            <p className="text-lg text-foreground/70 max-w-md">
              Start your conversation! You can talk about anything on your mind.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-zinc-800 
                             text-[#6059E7] dark:text-blue-300 
                             rounded-full hover:bg-blue-200 dark:hover:bg-zinc-700 
                             transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ChatCard messages={messages} />
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim() === "") return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex items-center gap-2 w-full bg-background rounded-xl 
             shadow-[0_0_8px_rgba(96,89,231,0.4)] 
             focus-within:shadow-[0_0_15px_rgba(96,89,231,0.8)] 
             transition-shadow px-3 py-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg 
               focus:outline-none border-0 bg-transparent"
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-lg bg-[#6059E7] hover:bg-[#4d48c6] shadow-none focus:outline-none"
        >
          <Send className="h-6 w-6 text-white" />
        </Button>
      </form>
    </div>
  );
}
