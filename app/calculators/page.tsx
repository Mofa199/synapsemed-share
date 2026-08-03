"use client"

import React, { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FloatingAIAssistant } from "@/components/floating-ai-assistant"
import { CalculatorCard, CalculatorConfig } from "@/components/calculators/calculator-card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calculator, Search, Heart, Activity, Brain, ShieldAlert, Sparkles, 
  Baby, Flame, TestTube, Scale, Stethoscope, Droplets, AlertTriangle, FileText, ChevronRight
} from "lucide-react"
import Link from "next/link"

const allCalculators: CalculatorConfig[] = [
  // CARDIOLOGY
  {
    id: "chads2vasc",
    name: "CHA₂DS₂-VASc Score",
    subtitle: "Atrial Fibrillation Stroke Risk Stratification",
    category: "Cardiology",
    formula: "Score = C(1) + H(1) + A2(2) + D(1) + S2(2) + V(1) + A(1) + Sc(1)",
    hints: [
      "Age ≥ 75 and prior Stroke/TIA get 2 points each.",
      "DOACs (Apixaban, Rivaroxaban, Dabigatran) are preferred over Warfarin for non-valvular AF.",
      "Female sex category (Sc) alone (score of 1) does not require anticoagulation."
    ],
    riskTable: [
      { score: "0 (Male) / 1 (Female)", risk: "Low (0%/yr)", action: "No oral anticoagulation required." },
      { score: "1 (Male)", risk: "Moderate (1.3%/yr)", action: "Consider DOAC oral anticoagulation." },
      { score: "≥ 2 (Male) / ≥ 3 (Female)", risk: "High (2.2% - 6.7%+/yr)", action: "Oral Anticoagulation strongly recommended." }
    ],
    referenceLabValues: [
      { parameter: "INR Target (Warfarin)", conventional: "2.0 - 3.0", si: "2.0 - 3.0" },
      { parameter: "Fasting Glucose", conventional: "70 - 99 mg/dL", si: "3.9 - 5.5 mmol/L" }
    ],
    criteria: [
      { id: "c", label: "Congestive Heart Failure / LV Dysfunction", points: 1, description: "LVEF ≤ 40% or clinical HF" },
      { id: "h", label: "Hypertension", points: 1, description: "BP > 140/90 or treated" },
      { id: "a2", label: "Age ≥ 75 years", points: 2, description: "Major age factor" },
      { id: "d", label: "Diabetes Mellitus", points: 1, description: "Fasting glucose > 126 mg/dL or meds" },
      { id: "s2", label: "Stroke / TIA / Thromboembolism", points: 2, description: "Prior ischemic stroke/TIA" },
      { id: "v", label: "Vascular Disease", points: 1, description: "Prior MI, PAD, or Aortic Plaque" },
      { id: "a", label: "Age 65–74 years", points: 1, description: "Moderate age factor" },
      { id: "sc", label: "Sex Category (Female)", points: 1, description: "Female sex category" }
    ],
    calculateRisk: (score) => {
      if (score === 0) return { riskLevel: "Low", interpretation: "Annual Stroke Risk: 0%", recommendation: "No anticoagulation needed.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score === 1) return { riskLevel: "Moderate", interpretation: "Annual Stroke Risk: 1.3%", recommendation: "Consider DOAC anticoagulation.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "High", interpretation: `Annual Stroke Risk: ${score >= 4 ? "4.0% - 6.7%+" : "2.2% - 3.2%"}`, recommendation: "Oral Anticoagulation (DOAC) strongly indicated.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "has_bled",
    name: "HAS-BLED Bleeding Risk Score",
    subtitle: "Bleeding Risk Assessment on Anticoagulation in Atrial Fibrillation",
    category: "Cardiology",
    formula: "Score = H(1) + A(1) + S(1) + B(1) + L(1) + E(1) + D(1 or 2)",
    hints: [
      "HAS-BLED identifies modifiable bleeding risk factors (e.g. uncontrolled HTN, labile INR, alcohol).",
      "High HAS-BLED score (≥3) is NOT a reason to withhold anticoagulation, but mandates closer clinical follow-up."
    ],
    riskTable: [
      { score: "0 - 1", risk: "Low", action: "1.13% - 1.02% bleeding risk per year. Standard follow-up." },
      { score: "2", risk: "Moderate", action: "1.88% bleeding risk per year. Address modifiable risk factors." },
      { score: "≥ 3", risk: "High", action: "3.74% - 12.5% bleeding risk per year. Frequent monitoring & risk reduction." }
    ],
    criteria: [
      { id: "h", label: "Hypertension (Uncontrolled SBP > 160 mmHg)", points: 1 },
      { id: "a", label: "Abnormal Renal or Liver Function", points: 1, description: "Dialysis, Cr > 2.2 mg/dL, Cirrhosis, or Bilirubin > 2x upper limit" },
      { id: "s", label: "Stroke History", points: 1 },
      { id: "b", label: "Bleeding History / Predisposition", points: 1, description: "Prior major GI/brain bleed or anemia" },
      { id: "l", label: "Labile INR (TTR < 60%)", points: 1 },
      { id: "e", label: "Elderly (Age > 65 years)", points: 1 },
      { id: "d_drugs", label: "Drugs (Antiplatelet agents or NSAIDs)", points: 1 },
      { id: "d_alcohol", label: "Alcohol (≥ 8 drinks/week)", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score <= 1) return { riskLevel: "Low", interpretation: "Bleeding Risk: ~1.1%/yr", recommendation: "Low risk. Standard anticoagulation monitoring.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score === 2) return { riskLevel: "Moderate", interpretation: "Bleeding Risk: 1.88%/yr", recommendation: "Moderate risk. Address modifiable factors (BP control, NSAID discontinuation).", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "High", interpretation: `Bleeding Risk: ${score >= 4 ? "8.7% - 12.5%" : "3.74%"} per year`, recommendation: "High bleeding risk. Monitor closely and correct reversible risk factors.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "timi_stemi",
    name: "TIMI Risk Score for STEMI",
    subtitle: "30-Day Mortality in ST-Elevation Myocardial Infarction",
    category: "Cardiology",
    formula: "Score = Age(2 or 3) + Diabetes/HTN/Angina(1) + SBP<100(3) + HR>100(2) + Killip II-IV(2-5) + Weight<67kg(1) + Anterior STEMI/LBBB(1) + Time to Reperfusion>4h(1)",
    hints: [
      "Systolic BP < 100 mmHg adds 3 points; Heart Rate > 100 bpm adds 2 points.",
      "High scores correlate with severe cardiogenic shock and pulmonary edema."
    ],
    riskTable: [
      { score: "0 - 2", risk: "Low", action: "30-Day Mortality: 0.8% - 1.4%." },
      { score: "3 - 5", risk: "Moderate", action: "30-Day Mortality: 4.4% - 7.3%." },
      { score: "≥ 6", risk: "High / Severe", action: "30-Day Mortality: 13.4% - 35.9%+. Immediate PCI/Cath lab." }
    ],
    criteria: [
      { id: "age_65", label: "Age 65-74 years (+2) OR Age ≥75 years (+3)", points: 2 },
      { id: "history", label: "Diabetes, Hypertension, or Angina history", points: 1 },
      { id: "sbp", label: "Systolic BP < 100 mmHg", points: 3 },
      { id: "hr", label: "Heart Rate > 100 bpm", points: 2 },
      { id: "killip", label: "Killip Class II-IV (Rales, S3, or Pulmonary Edema)", points: 2 },
      { id: "weight", label: "Weight < 67 kg (150 lbs)", points: 1 },
      { id: "anterior", label: "Anterior STEMI or new LBBB", points: 1 },
      { id: "delay", label: "Time to reperfusion > 4 hours", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score <= 2) return { riskLevel: "Low", interpretation: "30-Day Mortality: ~1%", recommendation: "Low acute mortality. Proceed with standard post-reperfusion protocol.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score <= 5) return { riskLevel: "Moderate", interpretation: "30-Day Mortality: 4.4% - 7.3%", recommendation: "Moderate risk. Intensive cardiac care unit monitoring.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "30-Day Mortality: 13.4% - 36%", recommendation: "High risk of mortality. Emergency invasive PCI strategy & hemodynamics support.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },

  // CRITICAL CARE & ER
  {
    id: "qsofa",
    name: "qSOFA (Quick SOFA Score)",
    subtitle: "Bedside Identification of Patients at Risk for Sepsis Complications",
    category: "Critical Care",
    formula: "Score = RR ≥ 22(1) + Altered Mental Status(1) + SBP ≤ 100(1)",
    hints: [
      "qSOFA is a bedside screening tool outside the ICU.",
      "Score ≥ 2 indicates higher risk of ICU admission and in-hospital mortality (>10%)."
    ],
    riskTable: [
      { score: "0 - 1", risk: "Low", action: "Low risk of sepsis mortality. Re-evaluate if clinical deterioration occurs." },
      { score: "2 - 3", risk: "High", action: "High risk of poor outcome (3-14x mortality). Assess for organ dysfunction (full SOFA), draw blood cultures, start IV antibiotics & fluids." }
    ],
    criteria: [
      { id: "rr", label: "Respiratory Rate ≥ 22 breaths/min", points: 1, description: "Tachypnea" },
      { id: "gcs", label: "Altered Mental Status (GCS < 15)", points: 1, description: "New confusion or drop in Glasgow Coma Scale" },
      { id: "sbp", label: "Systolic Blood Pressure ≤ 100 mmHg", points: 1, description: "Hypotension" }
    ],
    calculateRisk: (score) => {
      if (score < 2) return { riskLevel: "Low", interpretation: "qSOFA Negative", recommendation: "Low risk of sepsis mortality. Continue standard care and clinical monitoring.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      return { riskLevel: "Severe", interpretation: "qSOFA Positive (≥2)", recommendation: "High risk of sepsis complications! Immediate blood cultures, broad-spectrum IV antibiotics, serum lactate, and IV fluid resuscitation.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "apgar",
    name: "APGAR Score in Newborns",
    subtitle: "Newborn Clinical Health Assessment at 1 and 5 Minutes",
    category: "Pediatrics & OB/GYN",
    formula: "Score = Appearance(0-2) + Pulse(0-2) + Grimace(0-2) + Activity(0-2) + Respiration(0-2)",
    hints: [
      "Evaluated at 1 min and 5 min post-delivery (and every 5 min if score remains <7).",
      "5-minute APGAR < 7 warrants ongoing neonatal resuscitation."
    ],
    groupSelects: [
      {
        id: "appearance",
        label: "Appearance (Skin Color)",
        options: [
          { value: 0, label: "Blue/Pale all over" },
          { value: 1, label: "Acrocyanosis (body pink, extremities blue)" },
          { value: 2, label: "Completely pink" }
        ]
      },
      {
        id: "pulse",
        label: "Pulse (Heart Rate)",
        options: [
          { value: 0, label: "Absent (0 bpm)" },
          { value: 1, label: "< 100 bpm" },
          { value: 2, label: "≥ 100 bpm" }
        ]
      },
      {
        id: "grimace",
        label: "Grimace (Reflex Irritability)",
        options: [
          { value: 0, label: "No response to stimulation" },
          { value: 1, label: "Grimace / weak cry" },
          { value: 2, label: "Crying, coughing, or sneezing" }
        ]
      },
      {
        id: "activity",
        label: "Activity (Muscle Tone)",
        options: [
          { value: 0, label: "Limp / Flaccid" },
          { value: 1, label: "Some flexion of arms and legs" },
          { value: 2, label: "Active motion / flexed extremities" }
        ]
      },
      {
        id: "respiration",
        label: "Respiration (Respiratory Effort)",
        options: [
          { value: 0, label: "Absent" },
          { value: 1, label: "Weak, irregular, hypoventilation" },
          { value: 2, label: "Good, strong cry" }
        ]
      }
    ],
    calculateRisk: (score) => {
      if (score >= 7) return { riskLevel: "Low", interpretation: "Normal Newborn Status (7 - 10)", recommendation: "Standard post-natal care, warming, and bonding.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score >= 4) return { riskLevel: "Moderate", interpretation: "Moderately Abnormal (4 - 6)", recommendation: "Tactile stimulation, airway suctioning, and supplemental O2.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "Critically Low APGAR (0 - 3)", recommendation: "Immediate neonatal resuscitation! Bag-valve-mask ventilation / chest compressions per NRP.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },

  // HEPATOLOGY & GASTROENTEROLOGY
  {
    id: "meld3",
    name: "MELD 3.0 Score",
    subtitle: "End-Stage Liver Disease Mortality & Transplant Allocation",
    category: "Gastroenterology",
    formula: "MELD 3.0 = f(Bilirubin, Creatinine, INR, Sodium, Albumin, Sex)",
    hints: [
      "MELD 3.0 incorporates serum albumin and female sex adjustment for improved transplant equity.",
      "Upper limit for serum creatinine is capped at 3.0 mg/dL (or 4.0 mg/dL if on dialysis)."
    ],
    referenceLabValues: [
      { parameter: "Serum Bilirubin", conventional: "0.2 - 1.2 mg/dL", si: "3.4 - 20.5 µmol/L" },
      { parameter: "Serum Creatinine", conventional: "0.6 - 1.2 mg/dL", si: "53 - 106 µmol/L" },
      { parameter: "Serum Sodium", conventional: "135 - 145 mEq/L", si: "135 - 145 mmol/L" },
      { parameter: "Serum Albumin", conventional: "3.5 - 5.0 g/dL", si: "35 - 50 g/L" }
    ],
    criteria: [
      { id: "dialysis", label: "Hemodialysis ≥ 2 times in past week", points: 4 },
      { id: "bili_high", label: "Bilirubin > 3.0 mg/dL (51 µmol/L)", points: 3 },
      { id: "inr_high", label: "INR > 2.0", points: 3 },
      { id: "na_low", label: "Hyponatremia (Sodium < 130 mEq/L)", points: 2 },
      { id: "female", label: "Female sex adjustment", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score < 15) return { riskLevel: "Low", interpretation: "3-Month Mortality: < 5%", recommendation: "Routine outpatient hepatology follow-up.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score < 25) return { riskLevel: "Moderate", interpretation: "3-Month Mortality: 10% - 30%", recommendation: "Liver transplant evaluation recommended.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "3-Month Mortality: > 50%", recommendation: "High priority liver transplant list allocation.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },

  // NEPHROLOGY
  {
    id: "egfr_ckdepi",
    name: "eGFR (CKD-EPI 2021 Race-Free)",
    subtitle: "Estimated Glomerular Filtration Rate using Serum Creatinine",
    category: "Nephrology",
    formula: "eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^Age [× 1.012 if female]",
    hints: [
      "The 2021 race-free CKD-EPI equation is recommended by KDIGO & ASN for all adult patients.",
      "CKD Stage 3a is defined as eGFR 45-59; Stage 5 (End-Stage Renal Disease) is eGFR < 15."
    ],
    referenceLabValues: [
      { parameter: "Serum Creatinine (Male)", conventional: "0.7 - 1.3 mg/dL", si: "62 - 115 µmol/L" },
      { parameter: "Serum Creatinine (Female)", conventional: "0.5 - 1.1 mg/dL", si: "44 - 97 µmol/L" }
    ],
    criteria: [
      { id: "ckd_3a", label: "eGFR 45–59 mL/min/1.73m² (Stage 3a CKD)", points: 1 },
      { id: "ckd_3b", label: "eGFR 30–44 mL/min/1.73m² (Stage 3b CKD)", points: 2 },
      { id: "ckd_4", label: "eGFR 15–29 mL/min/1.73m² (Stage 4 Severe CKD)", points: 3 },
      { id: "ckd_5", label: "eGFR < 15 mL/min/1.73m² (Stage 5 Kidney Failure)", points: 4 }
    ],
    calculateRisk: (score) => {
      if (score === 0) return { riskLevel: "Low", interpretation: "eGFR ≥ 60 mL/min/1.73m² (Normal or Mild Reduction)", recommendation: "Monitor annually. Adjust nephrotoxic drug doses if appropriate.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score <= 2) return { riskLevel: "Moderate", interpretation: "eGFR 30–59 mL/min/1.73m² (Moderate CKD)", recommendation: "Nephrology co-management. Avoid NSAIDs and iodinated contrast.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "eGFR < 30 mL/min/1.73m² (Severe CKD / Failure)", recommendation: "Urgent nephrology referral & renal replacement therapy / transplant planning.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },

  // PULMONOLOGY
  {
    id: "curb65",
    name: "CURB-65 Pneumonia Severity Score",
    subtitle: "Pneumonia Mortality Risk & Treatment Location Guidance",
    category: "Pulmonology",
    formula: "Score = C(1) + U(1) + R(1) + B(1) + A(1)",
    hints: [
      "Confusion = new disorientation to person, place, or time.",
      "Urea > 7 mmol/L is equivalent to BUN > 19 mg/dL."
    ],
    riskTable: [
      { score: "0 - 1", risk: "Low Risk (Mortality < 1.5%)", action: "Outpatient oral antibiotics (Amoxicillin, Doxycycline, or Macrolide)." },
      { score: "2", risk: "Moderate Risk (Mortality 9.2%)", action: "Inpatient admission or close outpatient supervision." },
      { score: "≥ 3", risk: "High Risk (Mortality 15% - 40%+)", action: "Urgent hospital admission. Evaluate for ICU if score ≥ 4." }
    ],
    criteria: [
      { id: "c", label: "Confusion (New Orientation Loss)", points: 1 },
      { id: "u", label: "Urea > 7 mmol/L (BUN > 19 mg/dL)", points: 1 },
      { id: "r", label: "Respiratory Rate ≥ 30 breaths/min", points: 1 },
      { id: "b", label: "Blood Pressure (SBP < 90 or DBP ≤ 60 mmHg)", points: 1 },
      { id: "a", label: "Age ≥ 65 years", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score <= 1) return { riskLevel: "Low", interpretation: "30-Day Mortality: 0.6% - 1.5%", recommendation: "Outpatient treatment suitable.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score === 2) return { riskLevel: "Moderate", interpretation: "30-Day Mortality: 9.2%", recommendation: "Hospital admission or short-stay observation.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: `30-Day Mortality: ${score === 3 ? "14.5%" : "40%+"}`, recommendation: "Inpatient hospital admission (ICU evaluation if ≥4).", color: "bg-red-50 border-red-200 text-red-900" }
    }
  }
]

export default function CalculatorsHubPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "All Calculators", icon: Calculator },
    { id: "Cardiology", label: "Cardiology", icon: Heart },
    { id: "Critical Care", label: "Critical Care / ER", icon: ShieldAlert },
    { id: "Pediatrics & OB/GYN", label: "Pediatrics & OB/GYN", icon: Baby },
    { id: "Gastroenterology", label: "Gastroenterology", icon: Droplets },
    { id: "Nephrology", label: "Nephrology & Renal", icon: TestTube },
    { id: "Pulmonology", label: "Pulmonology", icon: Stethoscope },
    { id: "Conversions", label: "Unit Conversions", icon: Scale },
    { id: "Lab Monographs", label: "Lab Interpretation", icon: FileText }
  ]

  const filteredCalculators = allCalculators.filter((calc) => {
    const matchesSearch = calc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          calc.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          calc.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || calc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navigation />

      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#213874] via-[#1a4a90] to-[#1a6ac3] text-white pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Interactive Clinical Decision Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Interactive Medical Calculators & Lab Hub</h1>
          <p className="text-blue-100 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Evidence-based medical equations, risk stratification tools, lab unit conversions, and clinical monographs categorized by specialty.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search calculators (e.g. CHA2DS2-VASc, CURB-65, eGFR, MELD)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-base rounded-2xl border-0 shadow-2xl bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Specialty Tabs */}
      <main className="container mx-auto px-4 py-10 flex-1 space-y-8">
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <TabsList className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm inline-flex h-auto gap-1">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold gap-2 data-[state=active]:bg-[#213874] data-[state=active]:text-white transition-all"
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-6 space-y-8">
            {filteredCalculators.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredCalculators.map((calc) => (
                  <CalculatorCard key={calc.id} config={calc} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-dashed border-gray-300">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Calculator className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">No Calculators Found</h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm">
                    No calculator matching "{searchTerm}" was found in this category. Try adjusting your search term.
                  </p>
                  <Button variant="outline" onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <FloatingAIAssistant />
    </div>
  )
}
