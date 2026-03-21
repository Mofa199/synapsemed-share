"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, ChevronRight, ChevronLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function RandomPracticePage() {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch from an API
    setTimeout(() => {
      setQuestions([
        {
          id: 1,
          question: "A 45-year-old male presents with sudden onset chest pain radiating to the left arm. What is the most likely diagnosis?",
          options: ["Myocardial Infarction", "Pneumonia", "Gastroesophageal Reflux", "Costochondritis"],
          correctAnswer: 0,
          explanation: "The presentation of sudden chest pain radiating to the left arm is a classic symptom of Myocardial Infarction (MI)."
        },
        {
          id: 2,
          question: "Which organ is primarily responsible for the detoxification of drugs in the human body?",
          options: ["Kidney", "Liver", "Lungs", "Spleen"],
          correctAnswer: 1,
          explanation: "The liver is the primary organ for drug metabolism and detoxification."
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-[#213874] mb-4" />
        <p className="text-gray-600 font-medium">Preparing random questions...</p>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  const handleOptionSelect = (idx: number) => {
    if (showExplanation) return
    setSelectedOption(idx)
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setShowExplanation(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#213874]">Random Practice</h1>
          <Link href="/student/questions">
            <Button variant="outline">Exit</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
              <HelpCircle className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.options.map((option: string, idx: number) => (
              <Button
                key={idx}
                variant={selectedOption === idx ? (idx === currentQuestion.correctAnswer ? "default" : "destructive") : "outline"}
                className={`w-full justify-start h-auto py-4 px-6 text-left whitespace-normal ${
                  showExplanation && idx === currentQuestion.correctAnswer ? "border-green-500 bg-green-50 text-green-900" : ""
                }`}
                onClick={() => handleOptionSelect(idx)}
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                  {showExplanation && idx === currentQuestion.correctAnswer && <CheckCircle2 className="h-5 w-5 ml-auto text-green-600" />}
                  {showExplanation && selectedOption === idx && idx !== currentQuestion.correctAnswer && <XCircle className="h-5 w-5 ml-auto text-red-600" />}
                </div>
              </Button>
            ))}

            {showExplanation && (
              <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Explanation
                </h4>
                <p className="text-blue-800 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                <Button className="mt-6 w-full md:w-auto" onClick={nextQuestion}>
                  {currentIndex < questions.length - 1 ? (
                    <>Next Question <ChevronRight className="ml-2 h-4 w-4" /></>
                  ) : (
                    "Finish Session"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
