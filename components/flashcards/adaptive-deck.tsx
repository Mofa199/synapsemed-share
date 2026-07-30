"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calculateSM2, SM2Input } from "@/lib/spaced-repetition"
import { Brain, RotateCcw, CheckCircle, Sparkles, ChevronRight, Zap, Award } from "lucide-react"

export interface FlashcardItem {
  id: string
  question: string
  answer: string
  highYieldNotes: string
  category: string
  repetitions: number
  easeFactor: number
  interval: number
}

const initialDeck: FlashcardItem[] = [
  {
    id: "card_1",
    question: "What is the most common cause of Community-Acquired Pneumonia (CAP)?",
    answer: "Streptococcus pneumoniae (Pneumococcus)",
    highYieldNotes: "Gram-positive, lancet-shaped diplococci. Look for rust-colored sputum.",
    category: "Pulmonology",
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0
  },
  {
    id: "card_2",
    question: "What is the classic triad of Pulmonary Embolism (PE)?",
    answer: "Dyspnea, Pleuritic Chest Pain, and Hemoptysis",
    highYieldNotes: "Present in only < 20% of patients. Sinus tachycardia is the most common ECG finding.",
    category: "Pulmonology",
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0
  },
  {
    id: "card_3",
    question: "Which drug is first-line for rate control in Atrial Fibrillation with HFrEF?",
    answer: "Beta-blocker (e.g., Metoprolol Succinate or Carvedilol) or Digoxin",
    highYieldNotes: "Avoid Non-dihydropyridine CCBs (Verapamil/Diltiazem) in HFrEF due to negative inotropic effects.",
    category: "Cardiology",
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0
  }
]

export function AdaptiveDeck() {
  const [deck, setDeck] = useState<FlashcardItem[]>(initialDeck)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  const currentCard = deck[currentIndex]

  const handleGrade = (grade: number) => {
    if (!currentCard) return

    // Calculate next SM-2 interval
    const result = calculateSM2({
      repetitions: currentCard.repetitions,
      easeFactor: currentCard.easeFactor,
      interval: currentCard.interval,
      grade
    })

    // Update card in state
    const updatedDeck = [...deck]
    updatedDeck[currentIndex] = {
      ...currentCard,
      repetitions: result.repetitions,
      easeFactor: result.easeFactor,
      interval: result.interval
    }

    setDeck(updatedDeck)
    setIsFlipped(false)
    setCompletedCount((prev) => prev + 1)

    // Move to next card
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setCurrentIndex(0) // Loop back
    }
  }

  return (
    <Card className="border-gray-200 shadow-lg bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mb-1">
              Spaced Repetition Algorithm (SM-2)
            </Badge>
            <CardTitle className="text-2xl text-[#213874] flex items-center gap-2">
              <Brain className="w-6 h-6 text-amber-600" />
              Adaptive Flashcard Engine
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Cards adjust automatically based on your rating to maximize long-term memory retention.
            </CardDescription>
          </div>

          <Badge variant="secondary" className="font-bold bg-[#213874] text-white">
            Reviewed: {completedCount}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {currentCard && (
          <div className="space-y-6">
            {/* Flashcard Stage */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full min-h-[220px] p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-amber-400 bg-gradient-to-br from-amber-50/30 to-white flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs bg-white text-gray-600">
                  {currentCard.category}
                </Badge>
                <span className="text-xs font-bold text-gray-400">
                  Card {currentIndex + 1} of {deck.length} (Click to Flip)
                </span>
              </div>

              <div className="py-6 text-center">
                {!isFlipped ? (
                  <h3 className="text-xl font-bold text-[#213874] leading-relaxed">
                    {currentCard.question}
                  </h3>
                ) : (
                  <div className="space-y-3 animate-in fade-in">
                    <p className="text-xl font-bold text-emerald-800 leading-relaxed">
                      {currentCard.answer}
                    </p>
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-900 font-medium inline-block max-w-md">
                      <span className="font-bold block mb-0.5">High-Yield Pearl:</span>
                      {currentCard.highYieldNotes}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Interval: {currentCard.interval}d</span>
                <span>Ease Factor: {currentCard.easeFactor}</span>
              </div>
            </div>

            {/* Confidence Rating Buttons */}
            {isFlipped ? (
              <div className="grid grid-cols-4 gap-3 animate-in fade-in">
                <Button
                  onClick={() => handleGrade(1)}
                  className="bg-red-500 hover:bg-red-600 text-white flex flex-col py-6"
                >
                  <span className="font-bold text-sm">Again</span>
                  <span className="text-[10px] opacity-80">1 Day</span>
                </Button>
                <Button
                  onClick={() => handleGrade(2)}
                  className="bg-orange-500 hover:bg-orange-600 text-white flex flex-col py-6"
                >
                  <span className="font-bold text-sm">Hard</span>
                  <span className="text-[10px] opacity-80">
                    {Math.max(1, Math.round(currentCard.interval * 1.2))} Days
                  </span>
                </Button>
                <Button
                  onClick={() => handleGrade(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col py-6"
                >
                  <span className="font-bold text-sm">Good</span>
                  <span className="text-[10px] opacity-80">
                    {currentCard.interval === 0 ? "1 Day" : `${Math.round(currentCard.interval * currentCard.easeFactor)} Days`}
                  </span>
                </Button>
                <Button
                  onClick={() => handleGrade(4)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col py-6"
                >
                  <span className="font-bold text-sm">Easy</span>
                  <span className="text-[10px] opacity-80">
                    {currentCard.interval === 0 ? "4 Days" : `${Math.round(currentCard.interval * currentCard.easeFactor * 1.3)} Days`}
                  </span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsFlipped(true)}
                className="w-full py-6 text-base font-bold bg-[#213874] hover:bg-[#1a6ac3] text-white shadow-md"
              >
                Reveal Answer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
