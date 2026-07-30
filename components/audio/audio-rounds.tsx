"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Volume2, Play, Pause, RotateCcw, Headphones, Sparkles, FastForward } from "lucide-react"

export interface AudioRoundsProps {
  topicTitle: string
  audioSummaryText?: string
}

export function AudioRounds({ topicTitle, audioSummaryText }: AudioRoundsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  const defaultSummary = audioSummaryText || `Welcome to SynapseMed 3-Minute Audio Rounds for ${topicTitle}. Key high-yield points: Always evaluate hemodynamics first. Primary etiology involves inflammatory cascade leading to tissue hypoperfusion. First-line therapy includes immediate stabilization and targeted pharmacological intervention.`

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(defaultSummary)
      utterance.rate = playbackSpeed
      utterance.onend = () => setIsPlaying(false)
      setSpeechUtterance(utterance)
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [topicTitle, defaultSummary, playbackSpeed])

  const togglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      } else {
        window.speechSynthesis.cancel()
        if (speechUtterance) {
          speechUtterance.rate = playbackSpeed
          window.speechSynthesis.speak(speechUtterance)
        }
      }
      setIsPlaying(true)
    }
  }

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  return (
    <Card className="border-blue-100 shadow-md bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white overflow-hidden">
      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Headphones className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Badge className="bg-blue-600 text-white text-[10px]">3-Min Audio Rounds</Badge>
              <span className="text-xs text-gray-500 font-medium">Hands-Free Learning</span>
            </div>
            <h4 className="font-bold text-[#213874] text-base leading-tight">{topicTitle} Audio Overview</h4>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Speed Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs font-bold">
            {[1, 1.25, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => changeSpeed(s)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  playbackSpeed === s ? "bg-[#213874] text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <Button onClick={togglePlay} className="bg-[#213874] hover:bg-[#1a6ac3] text-white rounded-xl shadow-md px-5">
            {isPlaying ? (
              <><Pause className="w-4 h-4 mr-2" /> Pause</>
            ) : (
              <><Play className="w-4 h-4 mr-2 fill-current" /> Listen</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
