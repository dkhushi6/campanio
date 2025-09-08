"use client";
import ChatInterface from "@/components/chat/chat-interface";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ObjectId } from "bson";
import { useSession } from "next-auth/react";
import { UIMessage } from "ai";
import axios from "axios";
import Spinner from "@/components/spinner";

const page = () => {
  const { data: session } = useSession();
  const params = useParams();
  const id = params.id as string;
  const [chatId, setChatId] = useState("");
  const [oldChats, setOldChats] = useState<UIMessage[]>([]);

  if (!session?.user?.id) {
    console.log("login to chat");
  }

  const formattedDate = new Date()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, ".");

  useEffect(() => {
    if (!id || id === "new") {
      const idg = new ObjectId().toHexString();
      setChatId(idg);
      if (idg) {
        console.log("new id generated:", idg);
        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", `/chat/${idg}`);
        }
      } else {
        console.error("new id not generated");
      }
    } else {
      setChatId(id);
    }
  }, []);

  useEffect(() => {
    if (id && id !== "new") {
      const handleReload = async () => {
        const res = await axios.post("/api/chat/particular-chat", {
          chatId: id,
          date: formattedDate,
        });
        console.log("current chat :", res.data);
        setOldChats(res.data.chat.messages);
      };
      handleReload();
    }
  }, []);
  if (oldChats === null) {
    return <Spinner />;
  }
  if (chatId) {
    return (
      <div>
        <ChatInterface
          chatId={chatId}
          formattedDate={formattedDate}
          oldChats={oldChats}
        />
      </div>
    );
  }
};

export default page;
