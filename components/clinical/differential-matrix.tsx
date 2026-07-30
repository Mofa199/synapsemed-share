"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Stethoscope, Activity, CheckCircle, AlertTriangle, ArrowRight, RotateCcw } from "lucide-react"

export interface SymptomItem {
  id: string
  label: string
  category: "Symptoms" | "Signs" | "Risk Factors"
}

export interface DifferentialItem {
  name: string
  category: string
  probability: number // 0 - 100%
  discriminatingTest: string
  redFlagWarning?: string
}

const symptomsList: SymptomItem[] = [
  { id: "pleuritic_pain", label: "Pleuritic Chest Pain (Sharp with inspiration)", category: "Symptoms" },
  { id: "dyspnea", label: "Acute Onset Dyspnea", category: "Symptoms" },
  { id: "hemoptysis", label: "Hemoptysis (Coughing blood)", category: "Symptoms" },
  { id: "fever", label: "Fever & Chills (> 38.5°C)", category: "Symptoms" },
  { id: "calf_swelling", label: "Unilateral Calf Swelling & Tenderness", category: "Signs" },
  { id: "tachycardia", label: "Tachycardia (HR > 100 bpm)", category: "Signs" },
  { id: "crackles", label: "Focal Lung Crackles / Bronchial Breath Sounds", category: "Signs" },
  { id: "friction_rub", label: "Pericardial Friction Rub", category: "Signs" },
  { id: "immobilization", label: "Recent Surgery / Bed Rest ≥ 3 days", category: "Risk Factors" },
]

export function DifferentialMatrix() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, boolean>>({
    pleuritic_pain: true,
    dyspnea: true,
    tachycardia: true
  })

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleReset = () => {
    setSelectedSymptoms({})
  }

  // Dynamic Differential Probability Calculation Engine
  const calculateDifferentials = (): DifferentialItem[] => {
    const s = selectedSymptoms

    let peScore = 0
    let pneumoniaScore = 0
    let pericarditisScore = 0
    let acsScore = 0
    let pneumothoraxScore = 0

    if (s.pleuritic_pain) { peScore += 25; pneumoniaScore += 20; pericarditisScore += 35; pneumothoraxScore += 30 }
    if (s.dyspnea) { peScore += 30; pneumoniaScore += 20; acsScore += 20; pneumothoraxScore += 25 }
    if (s.hemoptysis) { peScore += 25; pneumoniaScore += 15 }
    if (s.fever) { pneumoniaScore += 45; pericarditisScore += 15 }
    if (s.calf_swelling) { peScore += 40 }
    if (s.tachycardia) { peScore += 20; acsScore += 15; pneumoniaScore += 10 }
    if (s.crackles) { pneumoniaScore += 40 }
    if (s.friction_rub) { pericarditisScore += 50 }
    if (s.immobilization) { peScore += 35 }

    const rawList = [
      {
        name: "Pulmonary Embolism (PE)",
        category: "Pulmonology / Vascular",
        probability: Math.min(95, peScore),
        discriminatingTest: "CT Pulmonary Angiography (CTPA) or High-Sensitivity D-Dimer",
        redFlagWarning: peScore > 50 ? "High risk PE: Assess hemodynamic stability & RV strain" : undefined
      },
      {
        name: "Lobar Pneumonia",
        category: "Infectious Disease",
        probability: Math.min(95, pneumoniaScore),
        discriminatingTest: "Chest X-Ray (CXR) showing lobar consolidation & Sputum Culture"
      },
      {
        name: "Acute Pericarditis",
        category: "Cardiology",
        probability: Math.min(90, pericarditisScore),
        discriminatingTest: "12-Lead ECG (Diffuse concave ST elevation & PR depression)"
      },
      {
        name: "Acute Coronary Syndrome (ACS)",
        category: "Cardiology",
        probability: Math.min(85, acsScore),
        discriminatingTest: "Serial High-Sensitivity Troponin I/T & 12-Lead ECG"
      },
      {
        name: "Spontaneous Pneumothorax",
        category: "Pulmonology",
        probability: Math.min(85, pneumothoraxScore),
        discriminatingTest: "Erect Inspiratory Chest X-Ray or Lung Point-of-Care Ultrasound"
      }
    ]

    return rawList.sort((a, b) => b.probability - a.probability)
  }

  const differentials = calculateDifferentials()

  return (
    <Card className="border-gray-200 shadow-lg bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500" />
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-1">
              Clinical Reasoning Engine
            </Badge>
            <CardTitle className="text-2xl text-[#213874] flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-blue-600" />
              Symptom-to-Differential Probability Matrix
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Select patient presentation clusters to compute weighted differential diagnoses and rule-in testing.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-400 hover:text-gray-700">
            <RotateCcw className="w-4 h-4 mr-1" /> Clear
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Symptom Checkboxes */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Presenting Symptoms & Clinical Signs</h4>
          <div className="grid md:grid-cols-3 gap-3">
            {symptomsList.map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedSymptoms[item.id]
                    ? "bg-blue-50/70 border-blue-300 shadow-sm"
                    : "bg-gray-50/50 border-gray-100 hover:bg-gray-50"
                }`}
              >
                <Checkbox
                  checked={!!selectedSymptoms[item.id]}
                  onCheckedChange={() => toggleSymptom(item.id)}
                />
                <span className="text-xs font-semibold text-gray-800">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calculated Differential Probabilities */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Differential Diagnosis Ranking</h4>
          
          <div className="space-y-3">
            {differentials.map((diff, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-slate-50/50 space-y-2 hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#213874] text-base">#{idx + 1} {diff.name}</span>
                    <Badge variant="outline" className="text-[10px] bg-white">
                      {diff.category}
                    </Badge>
                  </div>
                  <span className="font-bold text-blue-700 text-sm">{diff.probability}% Probability</span>
                </div>

                <Progress value={diff.probability} className="h-2" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                  <div className="text-gray-600">
                    <span className="font-bold text-gray-800">Rule-In Test: </span>
                    {diff.discriminatingTest}
                  </div>
                  {diff.redFlagWarning && (
                    <Badge className="bg-red-100 text-red-700 border-none font-bold shrink-0">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Red Flag Warning
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
