"use client";
import React, { useEffect, useState } from "react";
import ChatHistory from "./chat-history";
import DayStreakGraph from "./contribution-graph";
import { DashboardCard } from "./mood-card";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "../ui/card";
import { ChartAreaDefault } from "./mood-chart";
import { redirect } from "next/navigation";

const Dashboard = () => {
  const [mood, setMood] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [journal, setJournal] = useState<string>("");

  // format helper
  const formatDate = (d: Date) =>
    d.toISOString().split("T")[0].replace(/-/g, ".");

  const formattedDate = date ? formatDate(date) : formatDate(new Date());

  useEffect(() => {
    const handleDayFetch = async () => {
      if (!formattedDate) return;
      try {
        const res = await axios.post("/api/day", { date: formattedDate });
        console.log("day fetch", res.data);

        setMood(res.data?.day?.mood || "");
        setJournal(res.data?.day?.journal || "");
      } catch (err) {
        console.error("Error fetching day:", err);
      }
    };
    handleDayFetch();
  }, [formattedDate]);

  return (
    <div className="space-y-6 flex-col">
      <DashboardCard date={formattedDate} mood={mood} streak={0} />

      {/* Dashboard middle section */}
      <div className="max-w-8xl mx-auto flex  justify-center items-center">
        <div>
          <div className="flex gap-5 ">
            <div className="w-2/4">
              <ChartAreaDefault />
            </div>
            <div
              className="w-1/4 "
              onClick={() => redirect("/journal/history")}
            >
              {" "}
              <Card
                className="
    h-full hover:scale-105
    relative rounded-2xl p-6 shadow-xl
    bg-gradient-to-r from-yellow-100 via-orange-200 to-pink-200
    dark:from-gray-800 dark:via-indigo-900 dark:to-gray-950
    transition-all duration-500
  "
              >
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                  📓 Your Journal
                </h2>
                {journal ? (
                  <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                    {journal}
                  </p>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-gray-400 italic">
                    No journal entry yet for {formattedDate}.
                  </p>
                )}
              </Card>
            </div>
            <div className="w-1/4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border w-full"
              />
              <Card
                className=" mt-4
                  relative overflow-hidden rounded-2xl p-6 shadow-lg
                  bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-300
                  dark:from-indigo-900 dark:via-purple-800 dark:to-slate-900
                  animate-[gradient_10s_ease_infinite]
                  text-white
                "
              >
                <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 animate-pulse"></div>
                <h2 className="text-xl font-bold mb-2 relative z-10">
                  ✨ Reflection ✨
                </h2>
                <p className="text-sm leading-relaxed relative z-10">
                  Take a moment to breathe, celebrate your wins, and release
                  today’s stress. 🌙
                </p>
              </Card>
            </div>
          </div>
          {/* Chat + Reflection/Journal */}
          <div className="   ">
            {/* Chat History */}
            <div>
              <ChatHistory formattedDate={formattedDate} />
            </div>
            {/* Reflection + Journal */}
          </div>
          {/* Day Streak Graph */}
          <div className="w-full mt-8">
            <h2 className="text-xl font-bold mb-10 text-center">
              🔥 Your Day Streak
            </h2>
            <div className=" flex  justify-center items-center  mb-20  ">
              <DayStreakGraph />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
