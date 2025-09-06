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
    <div className="flex flex-col items-center justify-start  p-4  space-y-8">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        How are you feeling today?
      </h2>

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
