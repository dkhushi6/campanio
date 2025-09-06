import { Heart, Mail, Shield, User } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const FinalSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to start your{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              wellness journey?
            </span>
          </h2>
          <p className="text-xl text-foreground/80">
            Join thousands who have found support, understanding, and growth
            with Campanio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-primary-gradient text-lg px-8 py-6"
              asChild
            >
              <Link href="/login">Get Started Free</Link>
            </Button>
          </div>

          {/* Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/50">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 rounded-full bg-background shadow-lg shadow-blue-400/40">
                <Shield className="h-10 w-10 text-blue-500" />
              </div>
              <p className="text-sm font-medium">Private & Secure</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 rounded-full bg-background shadow-lg shadow-purple-400/40">
                <User className="h-10 w-10 text-purple-500" />
              </div>
              <p className="text-sm font-medium">Community Support</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 rounded-full bg-background shadow-lg shadow-pink-400/40">
                <Heart className="h-10 w-10 text-pink-500" />
              </div>
              <p className="text-sm font-medium">Evidence-Based</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="p-4 rounded-full bg-background shadow-lg shadow-green-400/40">
                <Mail className="h-10 w-10 text-green-500" />
              </div>
              <p className="text-sm font-medium">24/7 Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalSection;
