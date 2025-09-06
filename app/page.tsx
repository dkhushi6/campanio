"use client";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const { data: session } = useSession();
  if (session) {
    console.log("user logged in", session);
  }
  return <div>HomePage</div>;
};

export default page;
