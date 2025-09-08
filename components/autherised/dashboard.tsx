"use client";
import React, { useEffect } from "react";
import ChatHistory from "./chat-history";
import DayStreakGraph from "./contribution-graph";

const Dashboard = () => {
  const formattedDate = new Date()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, ".");

  return (
    <div>
      dashboard
      <DayStreakGraph />
      <ChatHistory formattedDate={formattedDate} />
    </div>
  );
};

export default Dashboard;
