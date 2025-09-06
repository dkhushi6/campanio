"use client";

import { ArrowRight, Heart, MessageCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import girl from "@/public/girl.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background/95 to-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                You’re{" "}
                <motion.span
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: "100% 50%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: "linear",
                  }}
                  className="bg-gradient-to-r from-primary to-accent bg-[length:200%_200%] bg-clip-text text-transparent"
                >
                  not alone
                </motion.span>
              </h1>
              <p className="text-xl sm:text-2xl text-foreground/80 max-w-2xl mx-auto lg:mx-0">
                Talk, reflect, and grow with Campanio – your gentle AI companion
                for mental wellness
              </p>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {[
                {
                  icon: MessageCircle,
                  text: "AI Companion",
                  color: "text-primary",
                },
                {
                  icon: TrendingUp,
                  text: "Mood Tracking",
                  color: "text-accent",
                },
                {
                  icon: Heart,
                  text: "Guided Activities",
                  color: "text-secondary",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50 shadow-sm"
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="btn-primary-gradient text-lg px-8 py-6"
                onClick={() => router.push("/login")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-foreground/60 mb-2">
                💝 Safe • Private • Supportive
              </p>
              <p className="text-xs text-foreground/50">
                Your thoughts are always kept private and secure
              </p>
            </div>
          </motion.div>

          {/* Right Column - Illustration */}
          {/* Right Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md flex items-center justify-center">
              {/* Floating gradient orb */}
              <motion.div
                animate={{ y: [0, -15, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-72 h-72 bg-gradient-to-tr from-primary to-accent rounded-full blur-3xl opacity-30"
              />

              {/* Floating image (no card) */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={girl}
                  alt="Campanio illustration"
                  width={900}
                  height={900}
                  className=""
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
