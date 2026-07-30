"use client"

import React, { useState } from "react"
import { Navigation } from "@/components/navigation"
import { FloatingAIAssistant } from "@/components/floating-ai-assistant"
import { OSCEStation } from "@/components/osce/osce-station"
import { DifferentialMatrix } from "@/components/clinical/differential-matrix"
import { PatientEducation } from "@/components/patient/patient-education"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Award, Stethoscope, HeartHandshake, Sparkles } from "lucide-react"

export default function OSCESimulatorPage() {
  const [activeTab, setActiveTab] = useState("osce")

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navigation />

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#213874] via-[#1a4a90] to-[#1a6ac3] text-white pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100">OSCE & Clinical Reasoning Academy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Virtual OSCE & Clinical Workspace
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Simulate real practical exam encounters, calculate differential probabilities, and generate multilingual patient handouts.
          </p>
        </div>
      </section>

      {/* Workspace Tabs */}
      <section className="py-8 container mx-auto px-4 space-y-8">
        <Tabs defaultValue="osce" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-white border border-gray-200 p-1.5 shadow-sm rounded-2xl flex-wrap justify-center h-auto gap-1">
              <TabsTrigger value="osce" className="rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-red-500" /> AI OSCE Examiner
              </TabsTrigger>
              <TabsTrigger value="differential" className="rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-500" /> Differential Matrix
              </TabsTrigger>
              <TabsTrigger value="patient" className="rounded-xl px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-500" /> Multilingual Patient Handouts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="osce">
            <OSCEStation />
          </TabsContent>

          <TabsContent value="differential">
            <DifferentialMatrix />
          </TabsContent>

          <TabsContent value="patient">
            <PatientEducation />
          </TabsContent>
        </Tabs>
      </section>

      <FloatingAIAssistant context="study" />
    </div>
  )
}
