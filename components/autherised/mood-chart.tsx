"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import axios from "axios";
import { moods } from "@/lib/mood";

const moodScores: Record<string, number> = {
  happy: 7,
  excited: 6,
  calm: 5,
  neutral: 4,
  tired: 3,
  anxious: 2,
  sad: 1,
  angry: 0,
};

const getMoodIdByName = (name: string) => {
  const mood = moods.find((m) => m.name.toLowerCase() === name.toLowerCase());
  return mood?.id ?? "neutral";
};

const moodColors: Record<string, string> = moods.reduce((acc, mood) => {
  acc[mood.id] = mood.color;
  return acc;
}, {} as Record<string, string>);

const chartConfig = {
  mood: {
    label: "Mood Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartAreaDefault() {
  const [chartData, setChartData] = useState<{ month: string; mood: number }[]>(
    []
  );
  const [showMood, setShowMood] = useState(true); // toggle

  useEffect(() => {
    const fetchDaysMood = async () => {
      try {
        const res = await axios.get("/api/mood/fetch-days");
        const days = res.data.days || [];

        const monthMap: Record<string, { total: number; count: number }> = {};

        days.forEach((d: { date: string; mood: string }) => {
          if (!d.mood) return;

          const moodId = getMoodIdByName(d.mood);
          const score = moodScores[moodId] ?? 0;

          const [year, month] = d.date.split(".");
          const monthKey = `${year}-${month}`;

          if (!monthMap[monthKey]) monthMap[monthKey] = { total: 0, count: 0 };
          monthMap[monthKey].total += score;
          monthMap[monthKey].count += 1;
        });

        const data = Object.entries(monthMap)
          .sort(
            ([a], [b]) =>
              new Date(a + "-01").getTime() - new Date(b + "-01").getTime()
          )
          .map(([monthKey, val]) => {
            const [year, month] = monthKey.split("-");
            const date = new Date(Number(year), Number(month) - 1);
            const monthName = date.toLocaleString("default", {
              month: "short",
            });
            return { month: monthName, mood: val.total / val.count };
          });

        setChartData(data);
      } catch (err) {
        console.error("Error fetching moods:", err);
      }
    };

    fetchDaysMood();
  }, []);

  // Custom tooltip with toggle
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded-lg shadow-lg border">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold">{payload[0].payload.month}</span>
            <span>— Mood: {payload[0].value.toFixed(1)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-[530px] flex flex-col">
      <CardHeader>
        <CardTitle>Monthly Mood Chart</CardTitle>
        <CardDescription>Average mood trends per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{ height: "340px" }}>
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12 }}
            height={300}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis domain={[0, 7]} ticks={[0, 1, 2, 3, 4, 5, 6, 7]} />
            <Tooltip content={<CustomTooltip />} />
            {showMood && (
              <Area
                dataKey="mood"
                type="natural"
                fill="var(--color-mood)"
                fillOpacity={0.4}
                stroke="var(--color-mood)"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Your average mood is trending upward{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Based on monthly reflections
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
