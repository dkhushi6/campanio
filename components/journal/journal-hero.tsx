"use client";

import MoodSelector, { Mood } from "@/components/journal/mood-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, PenTool } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
//save mood api
type JournalHeroProps = {
  setIsWriting: (v: boolean) => void;
};

const JournalHero = ({ setIsWriting }: JournalHeroProps) => {
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined);
  const { data: session } = useSession();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-17 space-y-10 min-h-[calc(100vh-61px)]">
      {/* Greeting */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight">
          {getGreeting()}! {session?.user?.name}🌱
        </h2>
      </div>

      {/* Mood Selection */}
      <Card className="backdrop-blur-md rounded-3xl p-8 shadow-xl border border-muted hover:shadow-2xl transition-shadow duration-300">
        <MoodSelector
          selectedMood={selectedMood}
          onSelect={(mood) => setSelectedMood(mood)}
        />
      </Card>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Start New Journal */}
        <Card
          onClick={() => setIsWriting(true)} // 👈 trigger writing mode
          className="rounded-xl cursor-pointer group hover:border-[#6059E7] hover:shadow-[0_8px_25px_rgba(96,89,231,0.6)] transition-all duration-300 shadow-lg"
        >
          <CardContent className="p-5 text-center h-full flex flex-col justify-center">
            <PenTool className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-[#6059E7] transition-colors" />
            <h3 className="text-2xl font-bold mb-3">Start New Journal</h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              Create a new entry and reflect on your thoughts
            </p>
            <Button className="w-full bg-[#6059E7] hover:bg-[#4d48c6] rounded-lg py-3 text-lg">
              Begin Writing
            </Button>
          </CardContent>
        </Card>

        {/* View Past Journals */}
        <Card className="rounded-xl cursor-pointer group hover:border-[#22c55e] hover:shadow-[0_8px_25px_rgba(34,197,94,0.6)] transition-all duration-300 shadow-lg">
          <CardContent className="p-5 text-center h-full flex flex-col justify-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-[#22c55e] transition-colors" />
            <h3 className="text-2xl font-bold mb-3">View Past Journals</h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              Explore previous entries and track your journey
            </p>
            <Button
              onClick={() => redirect("/journal/history")}
              variant="outline"
              className="w-full rounded-lg py-3 text-lg"
            >
              Browse Entries
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JournalHero;
