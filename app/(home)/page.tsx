"use client";
import { FeaturesSection } from "@/components/unautherised/features";
import FinalSection from "@/components/unautherised/final-section";
import HeroSection from "@/components/unautherised/hero-section";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div>
        <HeroSection />
        <FeaturesSection />
        <FinalSection />
      </div>
    );
  }
  return <div>HomePage</div>;
};

export default page;
