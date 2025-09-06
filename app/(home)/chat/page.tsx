"use client";

import ChatCard from "@/components/chat/chat-card";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "I feel stressed, can you help?",
    "Give me a mindfulness tip.",
    "How can I improve my mood today?",
    "I’m feeling anxious, what should I do?",
    "Can you suggest a short meditation?",
    "How do I sleep better at night?",
    "What can I do to boost my confidence?",
    "Share a positive affirmation for me.",
    "I’m feeling lonely, can we chat?",
  ];

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

  return (
    <div className="flex flex-col w-full max-w-8xl mx-auto h-screen mt-15 px-4 py-12">
      {/* Scrollable Chat */}
      <div
        ref={containerRef}
        className="flex-1 max-w-5xl mx-auto w-full overflow-y-auto mb-4 flex flex-col justify-center items-center"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
            <MessageCircle className="w-16 h-16 text-blue-500" />
            <p className="text-lg text-foreground/70">
              Start your conversation! You can talk about anything on your mind.
            </p>
            <div className="flex flex-col space-y-2">
              {suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-4 py-2 bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-zinc-700 transition-colors"
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
        className="flex max-w-5xl mx-auto w-full"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Type your message..."
          className="flex-1 p-4 border border-zinc-300 dark:border-zinc-700 rounded-l-2xl focus:outline-none dark:bg-zinc-900 dark:text-white shadow-inner"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-4 rounded-r-2xl hover:bg-blue-600 transition-colors shadow-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}
