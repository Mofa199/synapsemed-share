"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Loader2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface AIPatientProps {
  caseData: {
    id: string;
    title: string;
    patientAge: number;
    patientGender: string;
    chiefComplaint: string;
    description: string;
  };
}

export function AIPatient({ caseData }: AIPatientProps) {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [patientResponse, setPatientResponse] = useState("Hello doctor. I don't feel so well.");
  const [speechMuted, setSpeechMuted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          if (event.error === 'no-speech' || event.error === 'network') {
            // Ignore no-speech and network errors gracefully
            setIsListening(false);
            if (event.error === 'network') {
              toast({
                title: "Speech Service Offline",
                description: "Browser's speech service is unavailable. Please try again later.",
                variant: "destructive"
              });
            }
            return;
          }
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast({
            title: "Microphone Error",
            description: "Could not access the microphone or speech recognition failed.",
            variant: "destructive"
          });
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Your browser does not support the Web Speech API. Please try Google Chrome.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      handleQuestion(transcript);
    } else {
      if (synthRef.current) synthRef.current.cancel(); // Stop patient speaking
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleQuestion = async (question: string) => {
    if (!question.trim()) return;

    setIsThinking(true);
    try {
      const res = await fetch("/api/ai/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, caseData }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setPatientResponse(data.reply);
      speak(data.reply);
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection Error",
        description: "The patient could not hear you.",
        variant: "destructive"
      });
    } finally {
      setIsThinking(false);
    }
  };

  const speak = (text: string) => {
    if (speechMuted || !synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to map voice based on gender
    const voices = synthRef.current.getVoices();
    const isFemale = caseData.patientGender.toLowerCase() === "female";
    
    // Simple heuristic to find a matching voice
    let selectedVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (isFemale ? (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Victoria')) 
                : (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Alex')))
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.95; // Slightly slower for patient
    utterance.pitch = isFemale ? 1.1 : 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Ensure voices are loaded (Chrome sometimes needs a little time)
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices are now available
      };
    }
  }, []);

  return (
    <Card className="glass-card p-4 overflow-hidden relative group">
      {/* Dynamic Soundwave Background when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse scale-150"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Avatar Area */}
        <div className="flex-shrink-0 relative">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${isSpeaking ? 'border-primary animate-pulse shadow-[0_0_15px_rgba(33,56,116,0.5)]' : 'border-gray-200'} bg-gray-100 transition-all duration-300`}>
             <UserRound className={`w-10 h-10 ${isSpeaking ? 'text-primary' : 'text-gray-400'}`} />
          </div>
          <div className="absolute -bottom-2 -right-2">
            <Button
              size="icon"
              variant={isListening ? "destructive" : "default"}
              className={`rounded-full shadow-lg ${isListening ? 'animate-pulse' : ''}`}
              onClick={toggleListening}
              disabled={isThinking}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-w-0 w-full space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{caseData.patientAge}yo {caseData.patientGender} Patient</h3>
              <p className="text-xs text-gray-500">Hold microphone to ask a question</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setSpeechMuted(!speechMuted);
                if (synthRef.current) synthRef.current.cancel();
                setIsSpeaking(false);
              }}
              className="text-gray-400 hover:text-gray-700"
            >
              {speechMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-sm min-h-[60px] border border-gray-100 shadow-inner">
            {isThinking ? (
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="italic">Patient is thinking...</span>
              </div>
            ) : isListening ? (
              <p className="text-gray-600 italic">"{transcript || 'Listening...'}"</p>
            ) : (
              <p className="text-gray-800">"{patientResponse}"</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
