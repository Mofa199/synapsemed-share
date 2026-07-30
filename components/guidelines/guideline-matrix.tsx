"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Flag, ShieldCheck, AlertCircle, Pill, Stethoscope, ChevronRight } from "lucide-react"

export interface GuidelineEntry {
  organization: string
  region: string
  flag: string
  firstLineTherapy: string
  diagnosticThreshold: string
  keyDifference: string
  evidenceGrade: string
}

export interface DiseaseGuidelineData {
  diseaseName: string
  category: string
  guidelines: GuidelineEntry[]
}

const sampleGuidelines: DiseaseGuidelineData[] = [
  {
    diseaseName: "Hypertension Management",
    category: "Cardiology",
    guidelines: [
      {
        organization: "WHO (Global)",
        region: "Global",
        flag: "🌐",
        firstLineTherapy: "Thiazide-like diuretic, CCB, or ACE-i/ARB",
        diagnosticThreshold: "BP ≥ 140/90 mmHg",
        keyDifference: "Emphasizes low-cost generic combination therapy for LMICs",
        evidenceGrade: "High (Grade A)"
      },
      {
        organization: "AHA / ACC (USA)",
        region: "North America",
        flag: "🇺🇸",
        firstLineTherapy: "Thiazide, CCB, or ACE-i/ARB (Dual therapy if BP > 20/10 over goal)",
        diagnosticThreshold: "Stage 1 HTN ≥ 130/80 mmHg",
        keyDifference: "Lower threshold for diagnosis (130/80 vs 140/90)",
        evidenceGrade: "High (Grade A)"
      },
      {
        organization: "NICE (UK)",
        region: "Europe",
        flag: "🇬🇧",
        firstLineTherapy: "Step 1: ACE-i/ARB (<55yo) or CCB (≥55yo or Black African/Caribbean origin)",
        diagnosticThreshold: "ABPM/HBPM ≥ 135/85 mmHg",
        keyDifference: "Age and ethnicity-stratified algorithm",
        evidenceGrade: "High (Grade A)"
      },
      {
        organization: "Tanzania National STG",
        region: "East Africa",
        flag: "🇹🇿",
        firstLineTherapy: "Thiazide (Hydrochlorothiazide) + CCB (Amlodipine) or ACE-i (Enalapril)",
        diagnosticThreshold: "BP ≥ 140/90 mmHg",
        keyDifference: "Adapts to local essential medicines list availability & cost",
        evidenceGrade: "National Guideline"
      },
      {
        organization: "South Africa EML",
        region: "Southern Africa",
        flag: "🇿🇦",
        firstLineTherapy: "Hydrochlorothiazide + Amlodipine or Perindopril",
        diagnosticThreshold: "BP ≥ 140/90 mmHg",
        keyDifference: "Prioritizes fixed-dose single-pill combinations in primary care",
        evidenceGrade: "National Guideline"
      }
    ]
  },
  {
    diseaseName: "Type 2 Diabetes Mellitus",
    category: "Endocrinology",
    guidelines: [
      {
        organization: "ADA (USA)",
        region: "North America",
        flag: "🇺🇸",
        firstLineTherapy: "Metformin + SGLT2 inhibitor or GLP-1 RA (regardless of HbA1c if ASCVD/CKD)",
        diagnosticThreshold: "HbA1c ≥ 6.5% or FPG ≥ 126 mg/dL",
        keyDifference: "Early use of SGLT2i/GLP-1RA for organ protection",
        evidenceGrade: "High (Grade A)"
      },
      {
        organization: "EASD / ESC (Europe)",
        region: "Europe",
        flag: "🇪🇺",
        firstLineTherapy: "SGLT2i or GLP-1RA monotherapy first-line if established ASCVD",
        diagnosticThreshold: "HbA1c ≥ 6.5%",
        keyDifference: "Metformin not strictly mandatory first-line if high CVD risk",
        evidenceGrade: "High (Grade A)"
      },
      {
        organization: "Kenya National Clinical Guidelines",
        region: "East Africa",
        flag: "🇰🇪",
        firstLineTherapy: "Metformin 500mg BD (add Glibenclamide / Insulin if glycemic control fails)",
        diagnosticThreshold: "FPG ≥ 7.0 mmol/L (126 mg/dL)",
        keyDifference: "Emphasis on Metformin & Sulfonylureas due to SGLT2i cost constraints",
        evidenceGrade: "National Guideline"
      }
    ]
  }
]

export function GuidelineMatrix() {
  const [selectedDiseaseIndex, setSelectedDiseaseIndex] = useState(0)
  const currentData = sampleGuidelines[selectedDiseaseIndex]

  return (
    <Card className="border-gray-200 shadow-md bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600" />
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 mb-1">
              Global & Regional Matrix
            </Badge>
            <CardTitle className="text-2xl text-[#213874] flex items-center gap-2">
              <Globe className="w-6 h-6 text-teal-600" />
              Medical Guidelines Comparison
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Compare international clinical standards (WHO, NICE, AHA) with African National Treatment Guidelines.
            </CardDescription>
          </div>
        </div>

        {/* Disease Selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {sampleGuidelines.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDiseaseIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedDiseaseIndex === idx
                  ? "bg-[#213874] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.diseaseName}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData.guidelines.map((g, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-slate-50/50 space-y-3 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{g.flag}</span>
                    <span className="font-bold text-[#213874] text-sm">{g.organization}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-white">
                    {g.evidenceGrade}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-gray-500 uppercase tracking-wider block text-[10px]">First-Line Therapy</span>
                    <p className="font-semibold text-gray-900 mt-0.5">{g.firstLineTherapy}</p>
                  </div>

                  <div>
                    <span className="font-bold text-gray-500 uppercase tracking-wider block text-[10px]">Diagnostic Threshold</span>
                    <p className="font-medium text-gray-700 mt-0.5">{g.diagnosticThreshold}</p>
                  </div>

                  <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-900 text-[10px] uppercase tracking-wider block">Key Distinction</span>
                    <p className="text-blue-800 font-medium mt-0.5">{g.keyDifference}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
