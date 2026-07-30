"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Award, Bot, Clock, MessageSquare, Send, CheckCircle2, AlertCircle, Sparkles, User, RotateCcw } from "lucide-react"

export interface OSCEStationConfig {
  id: string
  title: string
  specialty: string
  timeLimitMinutes: number
  patientPrompt: string
  examinerNotes: string
}

const defaultStation: OSCEStationConfig = {
  id: "chest_pain_osce",
  title: "Station 1: Acute Chest Pain History & Initial Workup",
  specialty: "Internal Medicine / Emergency",
  timeLimitMinutes: 8,
  patientPrompt: "Patient is Mr. John Mwale, 52yo male, complaining of severe retrosternal squeezing chest pain for 2 hours radiating to his left jaw.",
  examinerNotes: "Candidate must take a targeted SOCRATES history, inquire about cardiovascular risk factors, and state top differentials & emergency ECG requirement."
}

export function OSCEStation() {
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState<{ sender: "user" | "patient" | "examiner"; text: string }[]>([
    {
      sender: "examiner",
      text: "Welcome to Station 1. You have 8 minutes to take a targeted history from Mr. Mwale and outline your diagnostic plan to the examiner. You may begin now."
    },
    {
      sender: "patient",
      text: "Doctor, I have this crushing pain in the middle of my chest. It started about 2 hours ago while I was walking upstairs."
    }
  ])

  const [scores, setScores] = useState({
    history: 20,
    exam: 18,
    communication: 22,
    management: 21
  })

  const [isCompleted, setIsCompleted] = useState(false)

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    const newMsgs = [...messages, { sender: "user" as const, text: userInput }]
    setMessages(newMsgs)
    setUserInput("")

    // Simulate AI Patient response
    setTimeout(() => {
      let patientReply = "The pain feels like an elephant sitting on my chest, doctor. I also feel quite nauseous and sweaty."
      if (userInput.toLowerCase().includes("arm") || userInput.toLowerCase().includes("jaw")) {
        patientReply = "Yes, doctor! The pain goes up into my left jaw and down my left arm."
      } else if (userInput.toLowerCase().includes("smok") || userInput.toLowerCase().includes("family")) {
        patientReply = "I've smoked a pack a day for 20 years, and my father died of a heart attack at age 55."
      } else if (userInput.toLowerCase().includes("ecg") || userInput.toLowerCase().includes("troponin")) {
        patientReply = "Examiner Note: Candidate correctly ordered an urgent 12-lead ECG and troponin level. (+) 5 Points."
      }

      setMessages((prev) => [...prev, { sender: "patient", text: patientReply }])
    }, 800)
  }

  const handleFinishStation = () => {
    setIsCompleted(true)
  }

  const totalScore = scores.history + scores.exam + scores.communication + scores.management

  return (
    <Card className="border-gray-200 shadow-xl bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-[#213874] to-indigo-600" />
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mb-1">
              Virtual OSCE Exam Station
            </Badge>
            <CardTitle className="text-2xl text-[#213874] flex items-center gap-2">
              <Award className="w-6 h-6 text-red-600" />
              {defaultStation.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {defaultStation.patientPrompt}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 bg-red-50 text-red-700 font-bold px-3 py-1.5 rounded-xl border border-red-200 text-xs">
            <Clock className="w-4 h-4" /> 06:45 Left
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chat Encounter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-80 bg-slate-50/60 rounded-2xl border border-gray-200 p-4 overflow-y-auto space-y-3 shadow-inner">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {msg.sender !== "user" && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.sender === "examiner" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {msg.sender === "examiner" ? "Ex" : "Pt"}
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-md ${
                      msg.sender === "user"
                        ? "bg-[#213874] text-white rounded-br-none"
                        : msg.sender === "examiner"
                        ? "bg-amber-50 border border-amber-200 text-amber-950 font-semibold"
                        : "bg-white border border-gray-200 text-gray-800 shadow-sm rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Ask the patient or state your clinical plan to the examiner..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="bg-gray-50 border-gray-200 text-xs py-5 rounded-xl"
              />
              <Button onClick={handleSendMessage} className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Real-Time Marking Rubric Sidebar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-4">
            <h4 className="font-bold text-[#213874] text-sm uppercase tracking-wider flex items-center justify-between">
              <span>Examiner Scorecard</span>
              <Badge variant="secondary" className="bg-[#213874] text-white">{totalScore} / 100</Badge>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">1. History Taking</span>
                  <span className="font-bold text-gray-900">{scores.history}/25</span>
                </div>
                <Progress value={(scores.history / 25) * 100} className="h-1.5" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">2. Physical Examination</span>
                  <span className="font-bold text-gray-900">{scores.exam}/25</span>
                </div>
                <Progress value={(scores.exam / 25) * 100} className="h-1.5" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">3. Communication & Empathy</span>
                  <span className="font-bold text-gray-900">{scores.communication}/25</span>
                </div>
                <Progress value={(scores.communication / 25) * 100} className="h-1.5" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-700">4. Differential & Management</span>
                  <span className="font-bold text-gray-900">{scores.management}/25</span>
                </div>
                <Progress value={(scores.management / 25) * 100} className="h-1.5" />
              </div>
            </div>

            <Button onClick={handleFinishStation} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-5 rounded-xl font-bold">
              Submit Station for Marking
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
