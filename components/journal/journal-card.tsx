"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Loader2, MessageCircle, Sparkles } from "lucide-react";
import { ReflectionCard } from "./reflection-card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AudioJournal } from "./audio-journal";
//save journal api

type JournalCardProps = {
  onBack?: () => void; // 👈 optional back navigation
};
const JournalCard = ({ onBack }: JournalCardProps) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const [loadingJournal, setLoadingJournal] = useState(false);

  const handleJournalSave = async () => {
    setLoadingJournal(true);

    try {
      const res = await axios.post("/api/journal/save", { journal: content });
      console.log(res.data);
    } catch (err) {
      console.error("Error:", err);
      alert("Network error or server issue");
    } finally {
      setLoadingJournal(false);
      router.push("/journal/history");
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  return (
    <div className="flex flex-col px-6 mt-17 py-10 sm:px-12 lg:px-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-primary">
          <Sparkles className="w-7 h-7 text-yellow-500" />
          Dear Diary ✨
        </h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>

      {/* Writing Area */}
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How was your day? Write your thoughts, feelings, or even a secret just for you..."
          className="w-full h-full min-h-[60vh] rounded-xl border border-border/40 p-6 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition placeholder:text-muted-foreground/70"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
        <AudioJournal setContent={setContent} />
        <Button
          onClick={async () => {
            await handleJournalSave(); // wait for API to finish
          }}
          variant="outline"
          className="text-[15px] px-6 py-4 flex items-center justify-center gap-3"
        >
          <MessageCircle className="w-8 h-8" />
          {loadingJournal && <Loader2 className="w-5 h-5 animate-spin" />}
          {loadingJournal ? "Saving..." : " Save & Reflect my Campanio"}
        </Button>
      </div>
    </div>
  );
};

export { JournalCard };
