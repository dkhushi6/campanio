"use client";

import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/ui/kibo-ui/contribution-graph";
import axios from "axios";
import { useEffect, useState } from "react";
import { eachDayOfInterval, startOfYear, endOfYear, format } from "date-fns";

const maxLevel = 4;
const now = new Date();

const DayStreakGraph = () => {
  const [data, setData] = useState<
    { date: string; count: number; level: number }[]
  >([]);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const res = await axios.get("/api/chat/fetch-chats");
        const daysFromDb = res.data.days;

        const yearDays = eachDayOfInterval({
          start: startOfYear(now),
          end: endOfYear(now),
        }).map((d) => format(d, "yyyy-MM-dd"));

        const mapped = yearDays.map((date) => {
          const dbDay = daysFromDb.find(
            (d: any) => format(new Date(d.date), "yyyy-MM-dd") === date
          );
          if (!dbDay) return { date, count: 0, level: 0 };

          let count = 0;
          if (dbDay.journal) count++;
          if (dbDay.mood) count++;
          if (dbDay.reflection) count++;
          if (dbDay.chat?.length > 0) count++;

          return { date, count, level: Math.min(count, maxLevel) };
        });

        setData(mapped);
      } catch (err) {
        console.error("Error fetching days", err);
      }
    };

    fetchDays();
  }, []);

  return (
    <ContributionGraph
      data={data}
      blockSize={18} // scale up block size
      blockMargin={4} // space between blocks
      fontSize={14} // adjust label font
    >
      <ContributionGraphCalendar>
        {({ activity, dayIndex, weekIndex }) => {
          const baseColor = (() => {
            switch (activity.level) {
              case 0:
                return "#e5e7eb"; // empty
              case 1:
                return "#FEF3C7"; // amber-100
              case 2:
                return "#FCD34D"; // amber-300
              case 3:
                return "#F59E0B"; // amber-500
              case 4:
                return "#B45309"; // amber-700
              default:
                return "#f3f4f6";
            }
          })();

          // style for fully-complete days (level 4)
          const extraStyle =
            activity.level === 4
              ? {
                  stroke: "#92400E", // dark amber border
                  strokeWidth: 2,
                  filter: "drop-shadow(0 0 4px rgba(180,83,9,0.6))",
                }
              : {};

          return (
            <ContributionGraphBlock
              activity={activity}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
              style={{
                fill: baseColor,
                transition: "all 0.2s ease-in-out",
                cursor: activity.level > 0 ? "pointer" : "default",
                ...extraStyle,
              }}
            />
          );
        }}
      </ContributionGraphCalendar>

      <ContributionGraphFooter>
        <ContributionGraphTotalCount />
        <ContributionGraphLegend>
          {({ level }) => {
            const colors = [
              "#d1d5db", // gray-300 (empty)
              "#fde68a", // amber-200
              "#fbbf24", // amber-400
              "#f59e0b", // amber-500
              "#b45309", // amber-700
            ];

            return (
              <svg key={level} height={18} width={18}>
                <rect
                  x={0}
                  y={0}
                  width={18}
                  height={18}
                  rx={2}
                  ry={2}
                  fill={colors[level]}
                />
              </svg>
            );
          }}
        </ContributionGraphLegend>{" "}
      </ContributionGraphFooter>
    </ContributionGraph>
  );
};

export default DayStreakGraph;
