"use client";

import React from "react";
import { Calendar as CalendarIcon, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { moods } from "@/lib/mood";

interface DashboardCardProps {
  mood?: string; // mood name (optional)
  streak?: number; // streak optional
  date?: string; // YYYY.MM.DD format (optional)
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  mood,
  streak = 0,
  date,
}) => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Friend";
  const userImage = session?.user?.image || null;

  // parse mood by name or default
  const moodObj = moods.find(
    (m) => m.name.toLowerCase() === mood?.toLowerCase()
  ) || {
    name: "Neutral",
    emoji: "🙂",
    color: "#6b7280",
    bgColor: "#f3f4f6",
  };

  const displayDate = date || new Date().toLocaleDateString();

  return (
    <div
      className="
    relative overflow-hidden rounded-2xl p-6 shadow-lg
    bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400
    dark:from-indigo-900 dark:via-slate-800 dark:to-indigo-950
    animate-[gradient_12s_ease_infinite]
    text-slate-900 dark:text-white
  "
    >
      <div className="flex items-center justify-between gap-6">
        {/* Left: User profile + greeting */}
        <div className="flex items-center gap-4">
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userImage}
              alt={userName}
              className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-white/50"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-sm text-slate-700 dark:text-slate-200 text-lg font-bold ring-2 ring-white/30">
              {userName[0]?.toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {mood
                ? `Welcome back, ${userName.split(" ")[0]} 👋`
                : `Hello, ${userName.split(" ")[0]}!`}
            </h2>
            <p className="mt-1 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              {mood ? `Today you’re feeling` : `Ready to start your day?`}
              {mood && (
                <span
                  className="inline-flex items-center gap-1 font-semibold"
                  style={{ color: moodObj.color }}
                >
                  {moodObj.emoji} {moodObj.name}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right: Date + Streak */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
            <CalendarIcon className="w-5 h-5" />
            {displayDate}
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full shadow-md relative
             bg-gradient-to-r from-orange-500/80 to-red-500/80 text-white"
          >
            {/* Firey glow effect */}
            <div className="absolute -inset-1 rounded-full bg-orange-500 blur-md opacity-30 animate-pulse" />

            {/* Flame icon with flicker */}
            <Flame className="w-4 h-4 text-yellow-200 relative z-10 animate-[flicker_1.5s_infinite]" />

            <span className="text-sm font-medium relative z-10">
              {streak > 0 ? `${streak}-day streak` : "No streak yet"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
