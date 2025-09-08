"use client";
import { moods, moodMessages } from "@/lib/mood";
import MoodSelector, { Mood } from "@/components/journal/mood-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { BookOpen, Loader2, PenTool, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import Spinner from "../spinner";

type JournalHeroProps = {
  setIsWriting: (v: boolean) => void;
};

const JournalHero = ({ setIsWriting }: JournalHeroProps) => {
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>();
  const { data: session } = useSession();
  const [loadingMood, setLoadingMood] = useState(false);
  const [initialMood, setInitialMood] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [day, setDay] = useState<any>(null);
  const [loadingDay, setLoadingDay] = useState(true);

  // Fetch mood of the day
  useEffect(() => {
    const handleDayFetch = async () => {
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0].replace(/-/g, ".");
      try {
        const res = await axios.post("/api/day", { date: formattedDate });
        setDay(res.data.day);
        setInitialMood(res.data.day?.mood ?? null);
      } catch (err) {
        console.log("Day fetch error:", err);
      } finally {
        setLoadingDay(false); // 👈 done loading
      }
    };

    handleDayFetch();
  }, []);

  // Save new mood
  const handleMoodSave = async () => {
    if (!selectedMood) return;
    setLoadingMood(true);

    const date = new Date().toISOString().split("T")[0].replace(/-/g, ".");
    try {
      if (initialMood) {
        await axios.put("/api/mood/edit", {
          mood: selectedMood.name,
          date,
        });
      } else {
        await axios.post("/api/mood/save", {
          mood: selectedMood.name,
          date,
        });
      }

      setInitialMood(selectedMood.name);
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Error:", err);
      alert("Network error or server issue");
    } finally {
      setLoadingMood(false);
    }
  };

  const moodObj = day?.mood
    ? moods.find((m) => m.name.toLowerCase() === day?.mood?.toLowerCase())
    : null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  if (loadingDay) {
    return (
      <div className="mt-17">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-17 space-y-10 min-h-[calc(100vh-61px)]">
      {/* Greeting */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight">
          {getGreeting()}! {session?.user?.name}🌱
        </h2>
      </div>

      {/* Mood Section */}
      {initialMood && !editing ? (
        <Card
          className="flex-1 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center relative"
          style={{
            backgroundColor: moodObj?.bgColor || "#f3f4f6",
            color: moodObj?.color || "#6b7280",
            border: `2px solid ${moodObj?.color || "#6b7280"}`,
            boxShadow: `0 4px 12px ${moodObj?.color || "#6b7280"}40`,
          }}
        >
          {/* Mood Display */}
          <span
            className="text-7xl animate-bounce rounded-full"
            style={{
              boxShadow: `0 0 25px ${moodObj?.color || "#6b7280"}`,
            }}
          >
            {moodObj?.emoji || "🙂"}
          </span>
          <span className="text-lg font-medium">
            {moodObj
              ? moodMessages[moodObj.id]
              : "No mood selected yet. Choose how you feel today!"}
          </span>

          {/* Edit Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing(true)}
            className="absolute top-3 right-3 flex items-center gap-1"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </Card>
      ) : (
        <Card className="backdrop-blur-md rounded-3xl p-8 shadow-xl border border-muted hover:shadow-2xl transition-shadow duration-300">
          <MoodSelector
            selectedMood={selectedMood}
            onSelect={(mood) => setSelectedMood(mood)}
          />

          <Button
            onClick={handleMoodSave}
            className="mt-6 w-full bg-[#6059E7] hover:bg-[#4d48c6] rounded-lg py-3 text-lg"
            disabled={!selectedMood}
          >
            {loadingMood && <Loader2 className="w-5 h-5 animate-spin" />}
            {loadingMood
              ? "Saving..."
              : initialMood
              ? "Update Mood"
              : "Save Mood"}
          </Button>
        </Card>
      )}

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl self-center">
        {/* Show Start Journal only if no journal exists for the day */}
        {!day?.journal && (
          <Card
            onClick={() => setIsWriting(true)}
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
        )}

        {/* Always show History */}
        <Card className="rounded-xl  cursor-pointer group hover:border-[#22c55e] hover:shadow-[0_8px_25px_rgba(34,197,94,0.6)] transition-all duration-300 shadow-lg">
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
