"use client";
import React, { useEffect, useState } from "react";
import { Loader2, LucideNotebook, Pencil, Sparkles } from "lucide-react";
import { Card } from "../ui/card";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { day as DayType } from "@prisma/client";
import { moodMessages, moods } from "@/lib/mood";
import { Button } from "../ui/button";

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [day, setDay] = useState<DayType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loadingDay, setLoadingDay] = useState(true);

  const formattedDate = date?.toISOString().split("T")[0].replace(/-/g, ".");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchDay = async () => {
      if (!date) return;

      try {
        const res = await axios.post("/api/day", { date: formattedDate });

        if (res.data.day) {
          setDay(res.data.day);
          setJournalText(res.data.day.journal || "");
        } else {
          setDay(null);
          setJournalText("");
        }
      } catch (err) {
        console.error("Error fetching day:", err);
        setDay(null);
        setJournalText("");
      } finally {
        setLoadingDay(false);
      }
    };

    fetchDay();
  }, [date]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true); // start spinner
    try {
      const res = await axios.put("/api/journal/edit", {
        date: formattedDate,
        journal: journalText,
      });

      console.log(res.data);
      setDay((prev) =>
        prev
          ? { ...prev, journal: journalText, reflection: res.data.reflection }
          : prev
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating journal:", err);
    } finally {
      setIsSaving(false);
    }
  };
  const moodObj = day?.mood
    ? moods.find((m) => m.name.toLowerCase() === day?.mood?.toLowerCase())
    : null;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  if (loadingDay) {
    return <p className="mt-17">Loading...</p>;
  }
  if (!mounted) {
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
          <div className="p-3 shadow-sm flex items-center gap-3">
            <LucideNotebook className="w-6 h-6 text-primary" />
            <p className="text-xl font-semibold text-primary">{today}</p>
          </div>

          {!isEditing && (
            <Card className="flex-1 p-6 backdrop-blur-sm bg-[#0bedf54c]">
              <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Reflection
              </h2>
              <div className="overflow-y-auto pr-2 h-full">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {day?.reflection
                    ? day.reflection
                    : "Here will be the thoughtful reflection generated from your journal. It might include insights, encouragement, or gentle advice to help you process your day more deeply."}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex gap-4">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border w-full"
              />
            </div>

            <Card
              className="flex-1 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center"
              style={{
                backgroundColor: moodObj?.bgColor || "#f3f4f6",
                color: moodObj?.color || "#6b7280",
                border: `2px solid ${moodObj?.color || "#6b7280"}`,
                boxShadow: `0 4px 12px ${moodObj?.color || "#6b7280"}40`,
              }}
            >
              <span
                className="text-7xl animate-pulse rounded-full"
                style={{
                  boxShadow: `0 0 25px ${moodObj?.color || "#6b7280"}`,
                }}
              >
                {moodObj?.emoji || "🙂"}
              </span>{" "}
              <span className="text-lg font-medium">
                {moodObj
                  ? moodMessages[moodObj.id]
                  : "No mood selected yet. Choose how you feel today!"}
              </span>
            </Card>
          </div>

          <Card className="rounded-xl bg-[#f59f0b3a] flex flex-col gap-4 relative flex-1 p-6 backdrop-blur-sm">
            {!isEditing ? (
              <>
                <Button
                  onClick={handleEditClick}
                  variant="outline"
                  className="absolute top-4 right-4 p-2 rounded-full"
                >
                  <Pencil className="w-5 h-5 text-muted-foreground" />
                </Button>
                <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                  ✍️ Journal
                </h2>
                <div className="overflow-y-auto pr-2 flex-1">
                  <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {day?.journal || "No journal entry yet..."}
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                  ✍️ Edit Journal
                </h2>
                <textarea
                  className="w-full h-64 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-primary"
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                />
                <Button onClick={handleSave} className="mt-4 self-end">
                  {isSaving && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export { ReflectionCard };
