"use client";
import ChatInterface from "@/components/chat/chat-interface";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ObjectId } from "bson";
import { useSession } from "next-auth/react";

const page = () => {
  const { data: session } = useSession();
  const params = useParams();
  const id = params.id as string;
  const [chatId, setChatId] = useState("");
  if (!session?.user?.id) {
    console.log("login to chat");
    redirect("/login");
  }
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
  if (chatId) {
    return (
      <div>
        <ChatInterface />
      </div>
    );
  }
};

export default page;
