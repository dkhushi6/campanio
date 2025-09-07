"use client";
import React, { useEffect, useState } from "react";
import { LucideNotebook, Pencil, Sparkles } from "lucide-react";
import { Card } from "../ui/card";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { day as DayType } from "@prisma/client";
import { moodMessages, moods } from "@/lib/mood";

type ReflectionCardProps = {
  content?: string;
  emoji?: string;
  name?: string;
  color?: string;
  bgColor?: string;
};

const ReflectionCard = ({
  content,
  name,
  emoji,
  color,
  bgColor,
}: ReflectionCardProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [day, setDay] = useState<DayType | null>(null);

  useEffect(() => {
    const fetchDay = async () => {
      if (!date) return;

      const formattedDate = date.toISOString().split("T")[0].replace(/-/g, ".");

      try {
        const res = await axios.post("/api/day", { date: formattedDate });

        if (res.data.day) {
          setDay(res.data.day);
          console.log(res.data.day.journal);
        } else {
          setDay(null);

          console.log("This day entry was not done ");
        }
      } catch (err) {
        console.error("Error fetching day:", err);
      }
    };

    fetchDay();
  }, [date]);
  const moodObj = day?.mood
    ? moods.find((m) => m.name.toLowerCase() === day?.mood?.toLowerCase())
    : null;
  if (!mounted) {
    // Skeleton loader
    return (
      <div className="w-full mt-17 flex justify-center">
        <div
          className="max-w-7xl w-full flex gap-6 p-8 animate-pulse"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <div className="flex flex-col gap-6 flex-1">
            <div className="h-12 bg-muted rounded-lg"></div>
            <div className="flex-1 bg-muted rounded-lg"></div>
          </div>
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex gap-4">
              <div className="flex-1 h-64 bg-muted rounded-lg"></div>
              <div className="flex-1 h-64 bg-muted rounded-lg"></div>
            </div>
            <div className="flex-1 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full mt-17 flex justify-center">
      <div
        className="max-w-7xl w-full flex gap-6 p-8"
        style={{ height: "calc(100vh - 80px)" }}
      >
        {/* Left Column */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Date Box */}
          <div className="p-3 shadow-sm flex items-center gap-3">
            <LucideNotebook className="w-6 h-6 text-primary" />
            <p className="text-xl font-semibold text-primary">
              {today || "Loading date..."}
            </p>
          </div>

          {/* Journal Box */}

          {/* Reflection */}
          <Card className="flex-1 p-6 backdrop-blur-sm bg-[#0bedf54c]">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Reflection
            </h2>
            <div className="overflow-y-auto pr-2 h-full">
              <p className="text-base text-muted-foreground leading-relaxed">
                {/* Placeholder for AI reflection */}
                {day?.reflection
                  ? day.reflection
                  : "Here will be the thoughtful reflection generated from your journal. It might include insights, encouragement, or gentle advice to help you process your day more deeply."}
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Calendar + Mood side by side */}
          <div className="flex gap-4">
            {/* Calendar */}
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border w-full"
              />
            </div>

            {/* Mood Tracker */}
            <Card
              className="flex-1 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center 6"
              style={{
                backgroundColor: moodObj?.bgColor || "#f3f4f6",
                color: moodObj?.color || "#6b7280",
                border: `2px solid ${moodObj?.color || "#6b7280"}`, // border same as mood color
                boxShadow: `0 4px 12px ${moodObj?.color || "#6b7280"}40`, // shadow with opacity
              }}
            >
              <span className="text-4xl">{moodObj?.emoji || "🙂"}</span>
              <span className="text-lg font-medium">
                {moodObj
                  ? moodMessages[moodObj.id]
                  : "No mood selected yet. Choose how you feel today!"}
              </span>
            </Card>
          </div>
          <Card className="rounded-xl bg-[#f59f0b3a] flex flex-col gap-4 relative flex-1 p-6 backdrop-blur-sm">
            <button className="absolute top-4 right-4 p-2 rounded-full">
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              ✍️ Journal
            </h2>
            <div className="overflow-y-auto pr-2 flex-1">
              <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                <p>{day?.journal ? day.journal : "No journal entry yet..."}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { ReflectionCard };
