"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import Image from "next/image";
import Link from "next/link";
// import ThemeSwitcher from "../theme/theme-switcher";
import { Cable } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";

const Navbar = () => {
  const { data: session, status } = useSession();
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between">
      <div>
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-primary hover:text-primary/80 transition-colors flex gap-2 items-center"
        >
          <Cable />
          Visionary AI
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {/* <ThemeSwitcher /> */}
        <div>
          {session?.user?.id ? (
            <div>
              <HoverCard>
                <HoverCardTrigger>
                  <Image
                    alt="user-image"
                    src={session.user.image || "default.jpg"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </HoverCardTrigger>
                <HoverCardContent>
                  <Button variant="ghost" onClick={() => signOut()}>
                    LogOut
                  </Button>
                </HoverCardContent>
              </HoverCard>
            </div>
          ) : (
            <div>
              {" "}
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline" })}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
