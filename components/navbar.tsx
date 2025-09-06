"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import ThemeSwitcher from "./theme/theme-switcher";
import { Card } from "./ui/card";
import { Brain } from "lucide-react"; // mental health–related icon

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 w-full flex py-3 px-6 justify-between items-center">
      {/* Brand */}
      <Link
        href="/"
        className="text-2xl font-extrabold tracking-tight text-primary hover:text-primary/80 transition-colors flex gap-2 items-center"
      >
        <Brain className="h-6 w-6 text-primary" /> {/* Mental health icon */}
        CAMPANIO
      </Link>
      <div className="flex gap-3">
        <Link
          href="/chat/new"
          className={buttonVariants({ variant: "outline" })}
        >
          Track Mood
        </Link>
        <Link
          href="/chat/new"
          className={buttonVariants({ variant: "outline" })}
        >
          {" "}
          Chat with Me
        </Link>
        <Link
          href="/chat/new"
          className={buttonVariants({ variant: "outline" })}
        >
          Journal
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        {session?.user?.id ? (
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer">
                <Image
                  alt="user-avatar"
                  src={session.user?.image || "/default.jpg"}
                  width={32}
                  height={32}
                  className="rounded-full border"
                />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-56 p-4 flex flex-col items-center gap-3 text-center">
              <Image
                alt="user-avatar"
                src={session.user?.image || "/default.jpg"}
                width={48}
                height={48}
                className="rounded-full border"
              />
              <p className="text-sm font-semibold">{session.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {session.user?.email}
              </p>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => signOut()}
              >
                Log Out
              </Button>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
