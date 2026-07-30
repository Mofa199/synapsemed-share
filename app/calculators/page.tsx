"use client"

import React, { useState } from "react"
import { Navigation } from "@/components/navigation"
import { FloatingAIAssistant } from "@/components/floating-ai-assistant"
import { CalculatorCard, CalculatorConfig } from "@/components/calculators/calculator-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Search, Activity, Heart, Stethoscope, Brain, ShieldAlert, Sparkles } from "lucide-react"

const calculatorConfigs: CalculatorConfig[] = [
  {
    id: "curb65",
    name: "CURB-65 Score",
    subtitle: "Pneumonia Severity & Mortality Risk Assessment",
    category: "Pulmonology",
    criteria: [
      { id: "c", label: "Confusion", points: 1, description: "New disorientation in person, place, or time" },
      { id: "u", label: "Urea > 7 mmol/L (BUN > 19 mg/dL)", points: 1, description: "Elevated blood urea nitrogen" },
      { id: "r", label: "Respiratory Rate ≥ 30 breaths/min", points: 1, description: "Tachypnea" },
      { id: "b", label: "Blood Pressure (SBP < 90 or DBP ≤ 60 mmHg)", points: 1, description: "Hypotension" },
      { id: "a", label: "Age ≥ 65 years", points: 1, description: "Advanced age" }
    ],
    calculateRisk: (score) => {
      if (score === 0 || score === 1) {
        return {
          riskLevel: "Low",
          interpretation: "30-Day Mortality: 0.6% - 1.5%",
          recommendation: "Consider outpatient oral antibiotic therapy. Low risk of complications.",
          color: "bg-emerald-50 border-emerald-200 text-emerald-900"
        }
      } else if (score === 2) {
        return {
          riskLevel: "Moderate",
          interpretation: "30-Day Mortality: 9.2%",
          recommendation: "Consider inpatient admission or close outpatient observation. IV/Oral antibiotics.",
          color: "bg-amber-50 border-amber-200 text-amber-900"
        }
      } else {
        return {
          riskLevel: "Severe",
          interpretation: `30-Day Mortality: ${score === 3 ? "14.5%" : score === 4 ? "40%" : "57%"}`,
          recommendation: "Urgent inpatient hospital admission. Evaluate immediately for ICU admission (especially if score ≥ 4).",
          color: "bg-red-50 border-red-200 text-red-900"
        }
      }
    }
  },
  {
    id: "chads2vasc",
    name: "CHA₂DS₂-VASc Score",
    subtitle: "Atrial Fibrillation Stroke Risk & Anticoagulation Recommendation",
    category: "Cardiology",
    criteria: [
      { id: "c", label: "Congestive Heart Failure / LV Dysfunction", points: 1, description: "Signs/symptoms of HF or LVEF ≤ 40%" },
      { id: "h", label: "Hypertension", points: 1, description: "Resting BP > 140/90 or treated HTN" },
      { id: "a2", label: "Age ≥ 75 years", points: 2, description: "Major age risk factor" },
      { id: "d", label: "Diabetes Mellitus", points: 1, description: "Fasting glucose > 126 mg/dL or on oral hypoglycemics/insulin" },
      { id: "s2", label: "Stroke / TIA / Thromboembolism", points: 2, description: "Prior ischemic stroke or TIA" },
      { id: "v", label: "Vascular Disease", points: 1, description: "Prior MI, Peripheral Artery Disease, or Aortic Plaque" },
      { id: "a", label: "Age 65–74 years", points: 1, description: "Moderate age risk factor" },
      { id: "sc", label: "Sex Category (Female)", points: 1, description: "Female sex category" }
    ],
    calculateRisk: (score) => {
      if (score === 0) {
        return {
          riskLevel: "Low",
          interpretation: "Annual Stroke Risk: 0%",
          recommendation: "No oral anticoagulation (OAC) therapy required.",
          color: "bg-emerald-50 border-emerald-200 text-emerald-900"
        }
      } else if (score === 1) {
        return {
          riskLevel: "Moderate",
          interpretation: "Annual Stroke Risk: 1.3%",
          recommendation: "Consider oral anticoagulation (DOAC preferred over Warfarin). Individualize treatment.",
          color: "bg-amber-50 border-amber-200 text-amber-900"
        }
      } else {
        return {
          riskLevel: "High",
          interpretation: `Annual Stroke Risk: ${score === 2 ? "2.2%" : score === 3 ? "3.2%" : score === 4 ? "4.0%" : "6.7%+"}`,
          recommendation: "Oral Anticoagulation strongly recommended (DOAC: Apixaban, Rivaroxaban, Dabigatran).",
          color: "bg-red-50 border-red-200 text-red-900"
        }
      }
    }
  },
  {
    id: "wells_pe",
    name: "Wells Criteria for PE",
    subtitle: "Pulmonary Embolism Clinical Probability Assessment",
    category: "Pulmonology",
    criteria: [
      { id: "dvt_signs", label: "Clinical signs and symptoms of DVT", points: 3, description: "Objective leg swelling and pain with palpation" },
      { id: "pe_likely", label: "PE is #1 diagnosis or equally likely", points: 3, description: "No alternative diagnosis explains presentation as well" },
      { id: "hr", label: "Heart Rate > 100 bpm", points: 1.5, description: "Tachycardia" },
      { id: "immob", label: "Immobilization ≥ 3 days or Surgery in past 4 weeks", points: 1.5, description: "Recent bed rest or major surgical procedure" },
      { id: "prior_pe", label: "Previous objectively diagnosed PE or DVT", points: 1.5, description: "History of venous thromboembolism" },
      { id: "hemoptysis", label: "Hemoptysis", points: 1, description: "Coughing up blood" },
      { id: "malignancy", label: "Malignancy (treated within 6 mo or palliative)", points: 1, description: "Active cancer" }
    ],
    calculateRisk: (score) => {
      if (score <= 1.5) {
        return {
          riskLevel: "Low",
          interpretation: "PE Risk: Low (< 10%)",
          recommendation: "Order D-Dimer test (PERC rule can also be applied). If D-dimer is negative, PE is ruled out.",
          color: "bg-emerald-50 border-emerald-200 text-emerald-900"
        }
      } else if (score <= 6) {
        return {
          riskLevel: "Moderate",
          interpretation: "PE Risk: Moderate (20 - 30%)",
          recommendation: "Order High-Sensitivity D-Dimer or proceed directly to CT Pulmonary Angiography (CTPA).",
          color: "bg-amber-50 border-amber-200 text-amber-900"
        }
      } else {
        return {
          riskLevel: "High",
          interpretation: "PE Risk: High (> 50%)",
          recommendation: "Proceed immediately to CTPA. Consider initiating empiric anticoagulation if imaging is delayed.",
          color: "bg-red-50 border-red-200 text-red-900"
        }
      }
    }
  },
  {
    id: "gcs",
    name: "Glasgow Coma Scale (GCS)",
    subtitle: "Objective Assessment of Consciousness & Brain Injury",
    category: "Neurology",
    groupSelects: [
      {
        id: "eye",
        label: "Eye Opening Response (E)",
        options: [
          { value: 4, label: "Spontaneous (4)" },
          { value: 3, label: "To Sound / Speech (3)" },
          { value: 2, label: "To Pressure / Pain (2)" },
          { value: 1, label: "None (1)" }
        ]
      },
      {
        id: "verbal",
        label: "Verbal Response (V)",
        options: [
          { value: 5, label: "Oriented (5)" },
          { value: 4, label: "Confused (4)" },
          { value: 3, label: "Inappropriate Words (3)" },
          { value: 2, label: "Incomprehensible Sounds (2)" },
          { value: 1, label: "None (1)" }
        ]
      },
      {
        id: "motor",
        label: "Motor Response (M)",
        options: [
          { value: 6, label: "Obeys Commands (6)" },
          { value: 5, label: "Localizes Pain (5)" },
          { value: 4, label: "Normal Flexion / Withdrawal (4)" },
          { value: 3, label: "Abnormal Flexion (Decorticate) (3)" },
          { value: 2, label: "Extension (Decerebrate) (2)" },
          { value: 1, label: "None (1)" }
        ]
      }
    ],
    calculateRisk: (score) => {
      if (score >= 13) {
        return {
          riskLevel: "Low",
          interpretation: `GCS Score: ${score}/15 - Mild Brain Injury`,
          recommendation: "Monitor neurological status closely. Perform non-contrast head CT if red flags are present.",
          color: "bg-emerald-50 border-emerald-200 text-emerald-900"
        }
      } else if (score >= 9) {
        return {
          riskLevel: "Moderate",
          interpretation: `GCS Score: ${score}/15 - Moderate Brain Injury`,
          recommendation: "Urgent non-contrast head CT. Frequent neurological observations in step-down or ICU setting.",
          color: "bg-amber-50 border-amber-200 text-amber-900"
        }
      } else {
        return {
          riskLevel: "Severe",
          interpretation: `GCS Score: ${score}/15 - Severe Brain Injury`,
          recommendation: "GCS ≤ 8: Secure Airway Immediately (Intubate!). Urgent neurosurgical consultation and ICU admission.",
          color: "bg-red-50 border-red-200 text-red-900"
        }
      }
    }
  },
  {
    id: "meld",
    name: "MELD Score Calculator",
    subtitle: "Model for End-Stage Liver Disease 3-Month Mortality",
    category: "Hepatology",
    groupSelects: [
      {
        id: "bili",
        label: "Bilirubin Level (mg/dL)",
        options: [
          { value: 1, label: "< 2.0 mg/dL (Normal/Mild)" },
          { value: 5, label: "2.0 – 5.0 mg/dL (Moderate)" },
          { value: 12, label: "> 5.0 mg/dL (Severe Jaundice)" }
        ]
      },
      {
        id: "inr",
        label: "INR (International Normalized Ratio)",
        options: [
          { value: 1, label: "< 1.3 (Normal)" },
          { value: 6, label: "1.3 – 2.0 (Elevated)" },
          { value: 14, label: "> 2.0 (Marked Coagulopathy)" }
        ]
      },
      {
        id: "cr",
        label: "Serum Creatinine (mg/dL)",
        options: [
          { value: 1, label: "< 1.2 mg/dL (Normal)" },
          { value: 7, label: "1.2 – 2.0 mg/dL (Mild AKI)" },
          { value: 15, label: "> 2.0 mg/dL or Dialysis (Severe Renal Dysfunction)" }
        ]
      }
    ],
    calculateRisk: (score) => {
      if (score <= 9) {
        return {
          riskLevel: "Low",
          interpretation: "Estimated 3-Month Mortality: 1.9%",
          recommendation: "Low priority for liver transplantation. Continue routine outpatient liver clinic management.",
          color: "bg-emerald-50 border-emerald-200 text-emerald-900"
        }
      } else if (score <= 19) {
        return {
          riskLevel: "Moderate",
          interpretation: "Estimated 3-Month Mortality: 6.0% - 19.6%",
          recommendation: "Evaluate for liver transplantation referral. Monitor renal function and ascites.",
          color: "bg-amber-50 border-amber-200 text-amber-900"
        }
      } else {
        return {
          riskLevel: "Severe",
          interpretation: "Estimated 3-Month Mortality: 52.6% - 71.3%",
          recommendation: "High priority for liver transplantation. Inpatient ICU management for acute decompensation.",
          color: "bg-red-50 border-red-200 text-red-900"
        }
      }
    }
  },
  {
    id: "sofa",
    name: "SOFA Score (Sequential Organ Failure)",
    subtitle: "ICU Organ Dysfunction & Sepsis Mortality Prediction",
    category: "Critical Care",
    groupSelects: [
      {
        id: "pao2",
        label: "Respiration: PaO₂/FiO₂ ratio (mmHg)",
        options: [
          { value: 0, label: "≥ 400 (Normal)" },
          { value: 1, label: "< 400" },
          { value: 2, label: "< 300" },
          { value: 3, label: "< 200 with ventilatory support" },
          { value: 4, label: "< 100 with ventilatory support" }
        ]
      },
      {
        id: "platelets",
        label: "Coagulation: Platelets (x10³/µL)",
        options: [
          { value: 0, label: "≥ 150" },
          { value: 1, label: "< 150" },
          { value: 2, label: "< 100" },
          { value: 3, label: "< 50" },
          { value: 4, label: "< 20" }
        ]
      },
      {
        id: "cvs",
        label: "Cardiovascular: MAP & Vasopressors",
        options: [
          { value: 0, label: "MAP ≥ 70 mmHg" },
          { value: 1, label: "MAP < 70 mmHg" },
          { value: 2, label: "Dopamine ≤ 5 or Dobutamine (any dose)" },
          { value: 3, label: "Dopamine > 5 or Norepinephrine ≤ 0.1" },
          { value: 4, label: "Dopamine > 15 or Norepinephrine > 0.1" }
        ]
      }
    ],
    calculateRisk: (score) => {
      if (score <= 3) {
        return {
          riskLevel: "Low",
          interpretation: "ICU Mortality: < 10%",
          recommendation: "Low organ dysfunction. Continue supportive ICU care and targeted antimicrobial therapy.",
          color: "bg-emerald-50 border-emerald-200 text-emerald-900"
        }
      } else if (score <= 7) {
        return {
          riskLevel: "Moderate",
          interpretation: "ICU Mortality: 15% - 20%",
          recommendation: "Moderate multi-organ failure. Optimize hemodynamic support and fluid resuscitation.",
          color: "bg-amber-50 border-amber-200 text-amber-900"
        }
      } else {
        return {
          riskLevel: "Severe",
          interpretation: `ICU Mortality: ${score >= 12 ? "> 80%" : "40% - 50%"}`,
          recommendation: "Severe multi-organ failure / Septic Shock. Immediate escalation of vasopressors and ventilatory support.",
          color: "bg-red-50 border-red-200 text-red-900"
        }
      }
    }
  }
]

export default function MedicalCalculatorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredConfigs = calculatorConfigs.filter((calc) => {
    const matchesSearch =
      calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedTab === "all" || calc.category.toLowerCase() === selectedTab.toLowerCase()

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navigation />

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#213874] via-[#1a4a90] to-[#1a6ac3] text-white pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Point-of-Care Decision Support</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Interactive Medical Calculators
          </h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Evidence-based clinical calculators, risk stratifications, and guideline-driven care recommendations at your fingertips.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search calculators (e.g., CURB-65, Wells, GCS, MELD)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-base bg-white text-gray-900 rounded-2xl shadow-xl border-none focus-visible:ring-2 focus-visible:ring-blue-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 container mx-auto px-4">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white border border-gray-200 p-1.5 shadow-sm rounded-2xl flex-wrap justify-center h-auto gap-1">
              <TabsTrigger value="all" className="rounded-xl px-5 py-2.5 text-sm font-semibold">
                All Calculators ({calculatorConfigs.length})
              </TabsTrigger>
              <TabsTrigger value="cardiology" className="rounded-xl px-5 py-2.5 text-sm font-semibold">
                Cardiology
              </TabsTrigger>
              <TabsTrigger value="pulmonology" className="rounded-xl px-5 py-2.5 text-sm font-semibold">
                Pulmonology
              </TabsTrigger>
              <TabsTrigger value="neurology" className="rounded-xl px-5 py-2.5 text-sm font-semibold">
                Neurology
              </TabsTrigger>
              <TabsTrigger value="critical care" className="rounded-xl px-5 py-2.5 text-sm font-semibold">
                Critical Care
              </TabsTrigger>
              <TabsTrigger value="hepatology" className="rounded-xl px-5 py-2.5 text-sm font-semibold">
                Hepatology
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {/* Calculators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConfigs.map((config) => (
            <CalculatorCard key={config.id} config={config} />
          ))}
        </div>

        {filteredConfigs.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Calculator className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-xl font-bold text-[#213874]">No calculators found</h3>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search query or selected category.</p>
          </div>
        )}
      </section>

      <FloatingAIAssistant context="study" />
    </div>
  )
}
