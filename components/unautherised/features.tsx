import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  Heart,
  MessageCircle,
  Moon,
  Shield,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: MessageCircle,
    title: "AI Companion Chat",
    description:
      "Have meaningful conversations with your supportive AI companion, available 24/7 whenever you need someone to listen.",
    color: "text-blue-500",
    shadow: "shadow-blue-500/40",
  },
  {
    icon: TrendingUp,
    title: "Mood Tracking",
    description:
      "Monitor your emotional patterns with simple daily check-ins and visualize your progress over time.",
    color: "text-green-500",
    shadow: "shadow-green-500/40",
  },
  {
    icon: Brain,
    title: "Guided Activities",
    description:
      "Access meditation, breathing exercises, and mindfulness practices tailored to your current emotional state.",
    color: "text-purple-500",
    shadow: "shadow-purple-500/40",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your mental health journey is completely private. We use end-to-end encryption to protect your thoughts.",
    color: "text-pink-500",
    shadow: "shadow-pink-500/40",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description:
      "Receive personalized insights and suggestions based on your unique patterns and preferences.",
    color: "text-red-500",
    shadow: "shadow-red-500/40",
  },
  {
    icon: Moon,
    title: "24/7 Support",
    description:
      "Whether it's 3 AM or during a busy day, your AI companion is always there when you need support.",
    color: "text-yellow-500",
    shadow: "shadow-yellow-500/40",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Your mental wellness,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              reimagined
            </span>
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            Campanio combines the latest in AI technology with evidence-based
            mental health practices to provide you with personalized,
            compassionate support.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:scale-105 transition-all duration-300 border-0 bg-transparent shadow-none"
            >
              <CardHeader className="text-center">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`mx-auto mb-4 p-6 rounded-full bg-background shadow-lg ${feature.shadow}`}
                >
                  <feature.icon className={`h-18 w-18  ${feature.color}`} />
                </Button>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-foreground/70 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="btn-primary-gradient text-lg px-8 py-6"
            asChild
          >
            <Link href="/login">Start Your Free Journey</Link>
          </Button>
          <p className="text-sm text-foreground/60 mt-4">
            • Start in under 30 seconds •
          </p>
        </div>
      </div>
    </section>
  );
}
