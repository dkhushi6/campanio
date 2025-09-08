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

export const moodDescriptions: Record<string, string> = {
  happy:
    "You’re carrying a warm, light energy today — like sunlight poking through the clouds. Celebrate the small wins, savor the laughs, and let this gentle glow remind you that joy can show up in tiny moments.",
  calm: "A steady, peaceful current runs through your day. This calm is a gift: breathe into it, notice how your body relaxes, and maybe share a quiet moment with yourself — a walk, tea, or just sitting with your thoughts.",
  sad: "It’s okay to sit with sadness — it doesn’t make you weak. Allow yourself time: slow breaths, a soft playlist, or jotting down the feeling can help. Be gentle; healing is a process, not a race.",
  angry:
    "Anger is energy trying to be heard. Notice where it lives in your body, let the breath move through it, and if possible, use a safe outlet — a brisk walk, journaling, or drawing — to let some steam out.",
  neutral:
    "A neutral day can be quietly grounding. Nothing dramatic happened — and that’s fine. Small moments of comfort (a favorite song, a cozy snack) matter on these steady days.",
  tired:
    "Your body and mind are telling you they need rest. Permission to pause: nap, hydrate, or do a low-effort activity. Rest is productive too — it rebuilds your energy for tomorrow.",
  anxious:
    "When worry feels loud, try a gentle anchor: 4-4-8 breathing, naming five things you can see, or a short walk. Tiny tactics add up and remind you that the moment will pass.",
  excited:
    "That buzz of excitement is pure momentum — ride it! Channel the energy into something creative, start a small project, or write down ideas before they flutter away.",
};
