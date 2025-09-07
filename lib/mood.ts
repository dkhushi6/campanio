import { Mood } from "@/components/journal/mood-selector";

export const moods: Mood[] = [
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    color: "#22c55e",
    bgColor: "#dcfce7",
  },
  {
    id: "calm",
    name: "Calm",
    emoji: "😌",
    color: "#06b6d4",
    bgColor: "#cffafe",
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "😞",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
  {
    id: "angry",
    name: "Angry",
    emoji: "😡",
    color: "#ef4444",
    bgColor: "#fee2e2",
  },
  {
    id: "neutral",
    name: "Neutral",
    emoji: "😐",
    color: "#6b7280",
    bgColor: "#f3f4f6",
  },
  {
    id: "tired",
    name: "Tired",
    emoji: "🥱",
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  {
    id: "anxious",
    name: "Anxious",
    emoji: "😰",
    color: "#f97316",
    bgColor: "#fed7aa",
  },
  {
    id: "excited",
    name: "Excited",
    emoji: "🤩",
    color: "#ec4899",
    bgColor: "#fce7f3",
  },
];

export const moodMessages: Record<string, string> = {
  happy: "What a joyful day! Keep spreading those smiles 😊",
  calm: "Feeling peaceful and relaxed, that's wonderful 😌",
  sad: "It's okay to feel down sometimes. Take gentle care 😞",
  angry: "Letting go of frustration is a healthy step 😡",
  neutral: "A balanced day, nice to just be 😐",
  tired: "Rest is important. Take time to recharge 🥱",
  anxious: "Breathe deeply, you've got this 😰",
  excited: "Excitement is energy! Channel it positively 🤩",
};
