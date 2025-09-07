"use client";

import { JournalCard } from "@/components/journal/journal-card";
import JournalHero from "@/components/journal/journal-hero";
import React, { useState } from "react";

const Page = () => {
  const [isWriting, setIsWriting] = useState(false);

  return (
    <>
      {isWriting ? (
        <JournalCard onBack={() => setIsWriting(false)} />
      ) : (
        <JournalHero setIsWriting={setIsWriting} />
      )}
    </>
  );
};

export default Page;
