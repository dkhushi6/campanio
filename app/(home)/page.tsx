"use client";
import Dashboard from "@/components/autherised/dashboard";
import { FeaturesSection } from "@/components/unautherised/features";
import FinalSection from "@/components/unautherised/final-section";
import HeroSection from "@/components/unautherised/hero-section";
import { useSession } from "next-auth/react";
import Spinner from "@/components/spinner"; // your spinner component
import React from "react";

const page = () => {
  const { data: session, status } = useSession();

  // While NextAuth is checking session, show spinner
  if (status === "loading") {
    return <Spinner />;
  }

  // User not logged in
  if (!session) {
    return (
      <div>
        <HeroSection />
        <FeaturesSection />
        <FinalSection />
      </div>
    );
  }

  // User logged in
  return (
    <div className="mt-15">
      <Dashboard />
    </div>
  );
};

export default page;
