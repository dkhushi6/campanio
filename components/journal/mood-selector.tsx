"use client";

import { moods } from "@/lib/mood";
import { Button } from "../ui/button";
import { BookOpen, PenTool } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

export type Mood = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
};

export default function MoodSelector({
  selectedMood,
  onSelect,
}: {
  selectedMood?: Mood;
  onSelect: (mood: Mood) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-start bg-transparent  p-3  ">
      {/* Title */}
      <h2 className=" font-semibold text-muted-foreground text-[23px]  tracking-tight">
        How are you feeling today?
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed pb-3">
        Take a moment to check in with yourself. Your thoughts and feelings
        matter.
      </p>

      {/* Mood Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-5 w-full max-w-3xl">
        {moods.map((mood) => {
          const isSelected = selectedMood?.id === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => onSelect(mood)}
              className={`flex flex-col items-center justify-center rounded-xl p-5 transition-all duration-200 hover:scale-105 hover:shadow-lg`}
              style={{
                backgroundColor: isSelected ? mood.bgColor : "",
                border: isSelected
                  ? `2px solid ${mood.color}`
                  : "1px solid #333",
              }}
            >
              <span className="text-4xl sm:text-5xl">{mood.emoji}</span>
              <span
                className="mt-2 text-sm sm:text-base font-medium"
                style={{ color: isSelected ? mood.color : "" }}
              >
                {mood.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
