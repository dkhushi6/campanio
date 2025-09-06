import { UIMessage } from "ai";
import React from "react";
type ChatCardProps = {
  messages: UIMessage[];
};
const ChatCard = ({ messages }: ChatCardProps) => {
  return (
    <div className="flex-1 overflow-y-auto my-4 p-6   flex-col gap-4  ">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[60%] px-4 py-2 rounded-xl break-words shadow ${
              message.role === "user"
                ? "bg-[#716AEA] text-white rounded-br-none"
                : "bg-gray-200 dark:bg-zinc-800 text-black dark:text-white rounded-bl-none"
            }`}
          >
            {message.parts.map((part, i) => {
              if (part.type === "text") return <div key={i}>{part.text}</div>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatCard;
