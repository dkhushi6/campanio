"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Mic, MicOff } from "lucide-react";

type AudioJournalProps = {
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onstart?: (() => void) | null;
  onend?: (() => void) | null;
  onerror: ((event: any) => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const AudioJournal = ({ setContent }: AudioJournalProps) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRec) {
      console.warn("⚠️ SpeechRecognition not supported in this browser.");
      return;
    }

    const recog: ISpeechRecognition = new SpeechRec();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";

    recog.onstart = () => {
      console.log("🎤 Microphone started listening...");
    };

    recog.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Log both final and interim transcripts
      if (finalTranscript) console.log("🖊️ Final transcript:", finalTranscript);
      if (interimTranscript)
        console.log("⌛ Interim transcript:", interimTranscript);

      // Optionally update state if provided
      if (setContent && finalTranscript) {
        setContent((prev) => (prev ? prev + finalTranscript : finalTranscript));
      }
    };

    recog.onerror = (e) => console.error("❌ SpeechRecognition error:", e);

    recog.onend = () => {
      console.log("🛑 Microphone stopped listening");
      setListening(false);
    };

    recognitionRef.current = recog;
  }, [setContent]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (!listening) {
      try {
        recognition.start();
        setListening(true);
      } catch (err) {
        console.error("❌ Failed to start recognition:", err);
      }
    } else {
      recognition.stop();
    }
  };

  return (
    <Button
      onClick={toggleListening}
      variant={listening ? "destructive" : "outline"}
      className="flex items-center gap-2 w-fit"
    >
      {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      {listening ? "Stop Dictation" : "Start Dictation"}
    </Button>
  );
};

export { AudioJournal };
