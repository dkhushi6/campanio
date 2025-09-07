import React from "react";
import { LucideNotebook, Pencil, Sparkles } from "lucide-react";
import { Card } from "../ui/card";
import { Calendar } from "@/components/ui/calendar";

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
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="w-full flex justify-center">
      <div
        className="max-w-7xl w-full flex gap-6 p-8"
        style={{ height: "calc(100vh - 80px)" }}
      >
        {/* Left Column */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Date Box */}
          <div className="p-3 shadow-sm flex items-center gap-3">
            <LucideNotebook className="w-6 h-6 text-primary" />
            <p className="text-xl font-semibold text-primary">{today}</p>
          </div>

          {/* Journal Box */}
          <Card className="rounded-xl bg-[#f59f0b3a] flex flex-col gap-4 relative flex-1 p-6 backdrop-blur-sm">
            <button className="absolute top-4 right-4 p-2 rounded-full">
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              ✍️ Journal
            </h2>
            <div className="overflow-y-auto pr-2 flex-1">
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {content ||
                  "No journal entry yet... Start writing your thoughts!"}
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
              className="flex-1 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center gap-3 text-center"
              style={{
                backgroundColor: bgColor || "",
                color: color || "",
              }}
            >
              <span className="text-4xl">{emoji || "🙂"}</span>
              <span className="text-lg font-medium">
                {name ? `You felt: ${name}` : "No mood selected"}
              </span>
            </Card>
          </div>

          {/* Reflection */}
          <Card className="flex-1 p-6 backdrop-blur-sm bg-[#0bedf54c]">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Reflection
            </h2>
            <div className="overflow-y-auto pr-2 h-full">
              <p className="text-base text-muted-foreground leading-relaxed">
                {/* Placeholder for AI reflection */}
                Here will be the thoughtful reflection generated from your
                journal. It might include insights, encouragement, or gentle
                advice to help you process your day more deeply.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { ReflectionCard };
