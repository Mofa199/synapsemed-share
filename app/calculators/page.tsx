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
  Baby, Flame, TestTube, Scale, Stethoscope, Droplets, AlertTriangle, FileText, CheckCircle2, ChevronRight
} from "lucide-react"

const allCalculators: CalculatorConfig[] = [
  // ================= CARDIOLOGY =================
  {
    id: "chads2vasc",
    name: "CHA₂DS₂-VASc Score",
    subtitle: "Atrial Fibrillation Stroke Risk Stratification",
    category: "Cardiology",
    formula: "Score = C(1) + H(1) + A2(2) + D(1) + S2(2) + V(1) + A(1) + Sc(1)",
    hints: [
      "Age ≥ 75 and prior Stroke/TIA receive 2 points each.",
      "DOACs (Apixaban, Rivaroxaban, Dabigatran) preferred over Warfarin.",
      "Female sex category (Sc) alone (score 1) does not warrant anticoagulation."
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
      "HAS-BLED identifies modifiable bleeding risk factors (uncontrolled HTN, alcohol, NSAIDs).",
      "High HAS-BLED score (≥3) is NOT a contraindication to anticoagulation, but mandates closer follow-up."
    ],
    riskTable: [
      { score: "0 - 1", risk: "Low", action: "1.13% bleeding risk/yr. Standard monitoring." },
      { score: "2", risk: "Moderate", action: "1.88% bleeding risk/yr. Correct reversible factors." },
      { score: "≥ 3", risk: "High", action: "3.74% - 12.5% bleeding risk/yr. Close monitoring required." }
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
      if (score === 2) return { riskLevel: "Moderate", interpretation: "Bleeding Risk: 1.88%/yr", recommendation: "Moderate risk. Address modifiable factors (BP control, NSAID stop).", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "High", interpretation: `Bleeding Risk: ${score >= 4 ? "8.7% - 12.5%" : "3.74%"} per year`, recommendation: "High bleeding risk. Monitor closely and correct reversible risk factors.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "timi_stemi",
    name: "TIMI Risk Score for STEMI",
    subtitle: "30-Day Mortality in ST-Elevation Myocardial Infarction",
    category: "Cardiology",
    formula: "Score = Age(2/3) + History(1) + SBP<100(3) + HR>100(2) + Killip(2-5) + Weight<67kg(1) + Anterior/LBBB(1) + Delay>4h(1)",
    hints: [
      "SBP < 100 mmHg adds 3 points; Heart Rate > 100 bpm adds 2 points.",
      "Scores ≥ 6 indicate high acute 30-day mortality (>13%). Emergency PCI required."
    ],
    criteria: [
      { id: "age", label: "Age 65-74 yrs (+2) OR Age ≥ 75 yrs (+3)", points: 2 },
      { id: "history", label: "Diabetes, Hypertension, or Angina history", points: 1 },
      { id: "sbp", label: "Systolic BP < 100 mmHg", points: 3 },
      { id: "hr", label: "Heart Rate > 100 bpm", points: 2 },
      { id: "killip", label: "Killip Class II-IV (Rales, S3, or Pulmonary Edema)", points: 2 },
      { id: "weight", label: "Weight < 67 kg (150 lbs)", points: 1 },
      { id: "anterior", label: "Anterior STEMI or new LBBB", points: 1 },
      { id: "delay", label: "Time to reperfusion > 4 hours", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score <= 2) return { riskLevel: "Low", interpretation: "30-Day Mortality: ~1%", recommendation: "Low risk. Standard post-reperfusion protocol.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score <= 5) return { riskLevel: "Moderate", interpretation: "30-Day Mortality: 4.4% - 7.3%", recommendation: "Moderate risk. Intensive cardiac care monitoring.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "30-Day Mortality: 13.4% - 36%", recommendation: "High acute mortality. Emergency invasive PCI strategy & hemodynamic support.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "friedewald_ldl",
    name: "Friedewald Equation for LDL-C",
    subtitle: "Calculated LDL Cholesterol Concentration",
    category: "Cardiology",
    formula: "LDL-C = Total Cholesterol - HDL-C - (Triglycerides / 5) [in mg/dL]",
    hints: [
      "In SI units (mmol/L), divide Triglycerides by 2.2 instead of 5.",
      "Equation is INVALID if serum Triglycerides > 400 mg/dL (4.52 mmol/L). Use direct LDL assay."
    ],
    referenceLabValues: [
      { parameter: "Desirable Total Cholesterol", conventional: "< 200 mg/dL", si: "< 5.18 mmol/L" },
      { parameter: "Optimal LDL-C", conventional: "< 100 mg/dL", si: "< 2.59 mmol/L" },
      { parameter: "High Triglycerides", conventional: "150 - 499 mg/dL", si: "1.7 - 5.6 mmol/L" }
    ],
    criteria: [
      { id: "tc_high", label: "Total Cholesterol > 240 mg/dL (6.21 mmol/L)", points: 2 },
      { id: "hdl_low", label: "Low HDL Cholesterol (< 40 mg/dL male, < 50 female)", points: 1 },
      { id: "tg_high", label: "Elevated Triglycerides (> 150 mg/dL)", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score === 0) return { riskLevel: "Low", interpretation: "Optimal Lipid Panel Profile", recommendation: "Maintain healthy diet and lifestyle. Re-evaluate in 3-5 years.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score === 1) return { riskLevel: "Moderate", interpretation: "Borderline High Atherogenic Risk", recommendation: "Lifestyle intervention (diet, exercise). Calculate 10-yr ASCVD risk.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "High", interpretation: "High Atherogenic Risk / Dyslipidemia", recommendation: "Initiate statin therapy (Moderate to High Intensity) & lipid-lowering lifestyle changes.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },

  // ================= CRITICAL CARE & ER =================
  {
    id: "gcs",
    name: "Glasgow Coma Scale (GCS)",
    subtitle: "Neurological Impairment & Level of Consciousness Assessment",
    category: "Critical Care",
    formula: "GCS = Eye Response (1-4) + Verbal Response (1-5) + Motor Response (1-6)",
    hints: [
      "GCS ≤ 8 mandates endotracheal intubation ('GCS less than 8, intubate').",
      "Lowest possible GCS is 3 (deep coma / brain death); highest is 15 (fully alert)."
    ],
    groupSelects: [
      {
        id: "eye",
        label: "Eye Opening Response (E)",
        options: [
          { value: 1, label: "E1: None" },
          { value: 2, label: "E2: To pressure/pain" },
          { value: 3, label: "E3: To sound/speech" },
          { value: 4, label: "E4: Spontaneous" }
        ]
      },
      {
        id: "verbal",
        label: "Verbal Response (V)",
        options: [
          { value: 1, label: "V1: None" },
          { value: 2, label: "V2: Incomprehensible sounds" },
          { value: 3, label: "V3: Inappropriate words" },
          { value: 4, label: "V4: Confused conversation" },
          { value: 5, label: "V5: Oriented & conversational" }
        ]
      },
      {
        id: "motor",
        label: "Motor Response (M)",
        options: [
          { value: 1, label: "M1: None" },
          { value: 2, label: "M2: Extension (Decerebrate posture)" },
          { value: 3, label: "M3: Abnormal flexion (Decorticate posture)" },
          { value: 4, label: "M4: Normal flexion / Withdrawal from pain" },
          { value: 5, label: "M5: Localizes pain" },
          { value: 6, label: "M6: Obeys commands" }
        ]
      }
    ],
    calculateRisk: (score) => {
      if (score >= 13) return { riskLevel: "Low", interpretation: "Mild Head Injury / Alert (GCS 13-15)", recommendation: "Monitor neurological signs every 2-4 hours. CT head if high-risk features.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score >= 9) return { riskLevel: "Moderate", interpretation: "Moderate Head Injury (GCS 9-12)", recommendation: "Urgent CT Head. ICU admission for frequent neuro-checks.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "Severe Head Injury / Coma (GCS 3-8)", recommendation: "Urgent Endotracheal Intubation for Airway Protection! Neurosurgery consult.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "qsofa",
    name: "qSOFA (Quick SOFA Score)",
    subtitle: "Bedside Sepsis Complication Screening",
    category: "Critical Care",
    formula: "Score = RR ≥ 22(1) + Altered Mental Status(1) + SBP ≤ 100(1)",
    hints: [
      "qSOFA is a rapid bedside screen outside the ICU.",
      "Score ≥ 2 indicates 3-14x increased risk of ICU admission and mortality."
    ],
    criteria: [
      { id: "rr", label: "Respiratory Rate ≥ 22 breaths/min", points: 1 },
      { id: "gcs", label: "Altered Mental Status (GCS < 15)", points: 1 },
      { id: "sbp", label: "Systolic Blood Pressure ≤ 100 mmHg", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score < 2) return { riskLevel: "Low", interpretation: "qSOFA Negative", recommendation: "Low risk of sepsis mortality. Continue routine clinical monitoring.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      return { riskLevel: "Severe", interpretation: "qSOFA Positive (≥2)", recommendation: "High risk of sepsis complications! Blood cultures, broad IV antibiotics, IV fluids, lactate.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "perc_rule",
    name: "PERC Rule (Pulmonary Embolism Rule-Out)",
    subtitle: "Rule Out PE in Low Clinical Probability Patients",
    category: "Critical Care",
    formula: "PE ruled out if 0 criteria present in low clinical pre-test probability patient.",
    hints: [
      "Apply ONLY if clinical gestalt indicates low PE probability (<15%).",
      "If ALL 8 criteria are met (Score = 0), PE risk is < 1.8%. No D-dimer needed!"
    ],
    criteria: [
      { id: "age", label: "Age ≥ 50 years", points: 1 },
      { id: "hr", label: "Heart Rate ≥ 100 bpm", points: 1 },
      { id: "o2", label: "O2 Saturation < 95% on room air", points: 1 },
      { id: "leg", label: "Unilateral leg swelling", points: 1 },
      { id: "hemoptysis", label: "Hemoptysis", points: 1 },
      { id: "surgery", label: "Recent surgery or trauma (past 4 weeks)", points: 1 },
      { id: "vte", label: "Prior DVT or PE", points: 1 },
      { id: "estrogen", label: "Exogenous estrogen use", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score === 0) return { riskLevel: "Low", interpretation: "PERC Rule Negative (0 criteria)", recommendation: "PE ruled out! No D-dimer or imaging testing required.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      return { riskLevel: "Moderate", interpretation: "PERC Rule Positive (≥1 criterion)", recommendation: "Cannot rule out PE by PERC. Order high-sensitivity D-dimer or CTPA.", color: "bg-amber-50 border-amber-200 text-amber-900" }
    }
  },

  // ================= PEDIATRICS & OB/GYN =================
  {
    id: "apgar",
    name: "APGAR Score in Newborns",
    subtitle: "Newborn Health & Resuscitation Assessment",
    category: "Pediatrics & OB/GYN",
    formula: "APGAR = Appearance + Pulse + Grimace + Activity + Respiration",
    hints: [
      "Evaluated at 1 min and 5 min post-delivery.",
      "5-minute APGAR < 7 mandates ongoing neonatal resuscitation."
    ],
    groupSelects: [
      { id: "appearance", label: "Appearance", options: [{ value: 0, label: "Blue/Pale" }, { value: 1, label: "Acrocyanosis" }, { value: 2, label: "Completely Pink" }] },
      { id: "pulse", label: "Pulse", options: [{ value: 0, label: "Absent" }, { value: 1, label: "< 100 bpm" }, { value: 2, label: "≥ 100 bpm" }] },
      { id: "grimace", label: "Grimace", options: [{ value: 0, label: "None" }, { value: 1, label: "Grimace/Weak cry" }, { value: 2, label: "Crying/Cough" }] },
      { id: "activity", label: "Activity", options: [{ value: 0, label: "Flaccid" }, { value: 1, label: "Some flexion" }, { value: 2, label: "Active motion" }] },
      { id: "respiration", label: "Respiration", options: [{ value: 0, label: "Absent" }, { value: 1, label: "Weak/Irregular" }, { value: 2, label: "Strong cry" }] }
    ],
    calculateRisk: (score) => {
      if (score >= 7) return { riskLevel: "Low", interpretation: "Normal Newborn (7-10)", recommendation: "Standard post-natal care and bonding.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score >= 4) return { riskLevel: "Moderate", interpretation: "Moderately Low (4-6)", recommendation: "Tactile stimulation, airway clearance, O2 support.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "Critically Low (0-3)", recommendation: "Immediate neonatal resuscitation (BVM / chest compressions).", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "edd_naegele",
    name: "Estimated Date of Delivery (EDD - Naegele's Rule)",
    subtitle: "Obstetric Pregnancy Due Date Calculation",
    category: "Pediatrics & OB/GYN",
    formula: "EDD = Last Menstrual Period (LMP) + 1 year - 3 months + 7 days",
    hints: [
      "Assumes regular 28-day menstrual cycle with ovulation on day 14.",
      "First-trimester crown-rump length (CRL) ultrasound is most accurate for dating."
    ],
    criteria: [
      { id: "lmp_known", label: "LMP date certain with 28-day regular cycle", points: 1 },
      { id: "us_confirm", label: "First-trimester ultrasound confirmed", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score === 2) return { riskLevel: "Low", interpretation: "High Accuracy Dating", recommendation: "EDD confirmed by LMP and 1st trimester ultrasound.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      return { riskLevel: "Moderate", interpretation: "Standard LMP Dating", recommendation: "Perform 1st trimester ultrasound to confirm gestational age.", color: "bg-amber-50 border-amber-200 text-amber-900" }
    }
  },

  // ================= GASTROENTEROLOGY & HEPATOLOGY =================
  {
    id: "meld3",
    name: "MELD 3.0 Score",
    subtitle: "End-Stage Liver Disease Mortality & Transplant Priority",
    category: "Gastroenterology",
    formula: "MELD 3.0 = f(Bilirubin, Creatinine, INR, Sodium, Albumin, Sex)",
    hints: [
      "Incorporates serum albumin and female sex adjustment for improved transplant equity.",
      "MELD 3.0 ≥ 15 indicates liver transplant candidacy."
    ],
    criteria: [
      { id: "dialysis", label: "Hemodialysis ≥ 2x in past week", points: 4 },
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
  {
    id: "child_pugh",
    name: "Child-Pugh Score for Cirrhosis",
    subtitle: "Severity of Chronic Liver Disease & Surgical Risk",
    category: "Gastroenterology",
    formula: "Score = Encephalopathy(1-3) + Ascites(1-3) + Bilirubin(1-3) + Albumin(1-3) + INR(1-3)",
    hints: [
      "Child-Pugh Class A: 100% 1-year survival; Class C: 45% 1-year survival.",
      "Class C carries extreme mortality for abdominal surgery."
    ],
    groupSelects: [
      { id: "enceph", label: "Hepatic Encephalopathy", options: [{ value: 1, label: "None" }, { value: 2, label: "Grade 1-2 (Mild)" }, { value: 3, label: "Grade 3-4 (Severe)" }] },
      { id: "ascites", label: "Ascites", options: [{ value: 1, label: "None" }, { value: 2, label: "Mild / Controlled" }, { value: 3, label: "Moderate to Severe" }] },
      { id: "bili", label: "Bilirubin (mg/dL)", options: [{ value: 1, label: "< 2.0 (< 34 µmol/L)" }, { value: 2, label: "2.0 - 3.0 (34 - 51 µmol/L)" }, { value: 3, label: "> 3.0 (> 51 µmol/L)" }] },
      { id: "alb", label: "Albumin (g/dL)", options: [{ value: 1, label: "> 3.5 (> 35 g/L)" }, { value: 2, label: "2.8 - 3.5 (28 - 35 g/L)" }, { value: 3, label: "< 2.8 (< 28 g/L)" }] },
      { id: "inr", label: "INR", options: [{ value: 1, label: "< 1.7" }, { value: 2, label: "1.7 - 2.3" }, { value: 3, label: "> 2.3" }] }
    ],
    calculateRisk: (score) => {
      if (score <= 6) return { riskLevel: "Low", interpretation: "Child-Pugh Class A (Score 5-6)", recommendation: "Well-compensated cirrhosis. 1-Yr Survival: 100%. Low surgical risk.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score <= 9) return { riskLevel: "Moderate", interpretation: "Child-Pugh Class B (Score 7-9)", recommendation: "Significant functional compromise. 1-Yr Survival: 80%. Evaluate for transplant.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "Child-Pugh Class C (Score 10-15)", recommendation: "Decompensated cirrhosis. 1-Yr Survival: 45%. Urgent liver transplant priority.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },

  // ================= NEPHROLOGY =================
  {
    id: "egfr_ckdepi",
    name: "eGFR (CKD-EPI 2021 Race-Free)",
    subtitle: "Estimated Glomerular Filtration Rate using Serum Creatinine",
    category: "Nephrology",
    formula: "eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^Age",
    hints: [
      "Recommended by KDIGO & ASN for all adult renal estimations.",
      "eGFR < 15 mL/min/1.73m² indicates End-Stage Kidney Failure (CKD 5)."
    ],
    criteria: [
      { id: "ckd_3a", label: "eGFR 45–59 mL/min/1.73m² (Stage 3a CKD)", points: 1 },
      { id: "ckd_3b", label: "eGFR 30–44 mL/min/1.73m² (Stage 3b CKD)", points: 2 },
      { id: "ckd_4", label: "eGFR 15–29 mL/min/1.73m² (Stage 4 Severe CKD)", points: 3 },
      { id: "ckd_5", label: "eGFR < 15 mL/min/1.73m² (Stage 5 Kidney Failure)", points: 4 }
    ],
    calculateRisk: (score) => {
      if (score === 0) return { riskLevel: "Low", interpretation: "eGFR ≥ 60 mL/min/1.73m² (Normal or Mild Reduction)", recommendation: "Monitor annually. Adjust drug dosages if necessary.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score <= 2) return { riskLevel: "Moderate", interpretation: "eGFR 30–59 mL/min/1.73m² (Moderate CKD)", recommendation: "Nephrology co-management. Avoid NSAIDs and contrast.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "eGFR < 30 mL/min/1.73m² (Severe CKD / Failure)", recommendation: "Urgent nephrology referral & dialysis/transplant planning.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "anion_gap",
    name: "Serum Anion Gap & Delta Gap",
    subtitle: "Metabolic Acidosis Classification & Mixed Acid-Base Disturbances",
    category: "Nephrology",
    formula: "Anion Gap = Na⁺ - (Cl⁻ + HCO₃⁻) [Normal: 8 - 12 mEq/L]",
    hints: [
      "High Anion Gap Acidosis Mnemonic: MUDPILES or GOLDMARK.",
      "Correct Anion Gap for Hypoalbuminemia: Add 2.5 mEq/L for every 1.0 g/dL drop in Albumin < 4.0 g/dL."
    ],
    referenceLabValues: [
      { parameter: "Serum Sodium (Na)", conventional: "135 - 145 mEq/L", si: "135 - 145 mmol/L" },
      { parameter: "Serum Bicarbonate (HCO3)", conventional: "22 - 28 mEq/L", si: "22 - 28 mmol/L" },
      { parameter: "Serum Chloride (Cl)", conventional: "96 - 106 mEq/L", si: "96 - 106 mmol/L" }
    ],
    criteria: [
      { id: "ag_high", label: "Anion Gap > 14 mEq/L (High Anion Gap Acidosis)", points: 2 },
      { id: "hco3_low", label: "Serum Bicarbonate < 18 mEq/L", points: 1 },
      { id: "alb_low", label: "Serum Albumin < 3.0 g/dL (Requires Correction)", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score === 0) return { riskLevel: "Low", interpretation: "Normal Serum Anion Gap (8-12 mEq/L)", recommendation: "Normal electrolyte charge balance.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score === 1) return { riskLevel: "Moderate", interpretation: "Mild Bicarbonate Loss / Normal Gap Acidosis", recommendation: "Evaluate for GI diarrhea or Renal Tubular Acidosis (RTA).", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "High Anion Gap Metabolic Acidosis (HAGMA)", recommendation: "Check Serum Lactate, Ketones, Salicylates, Toxic Alcohols, and ABG immediately!", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },

  // ================= PULMONOLOGY =================
  {
    id: "curb65",
    name: "CURB-65 Pneumonia Severity Score",
    subtitle: "Pneumonia Mortality Risk & Treatment Location",
    category: "Pulmonology",
    formula: "Score = C(1) + U(1) + R(1) + B(1) + A(1)",
    hints: [
      "Confusion = new disorientation to person, place, or time.",
      "Urea > 7 mmol/L is equivalent to BUN > 19 mg/dL."
    ],
    criteria: [
      { id: "c", label: "Confusion (New Orientation Loss)", points: 1 },
      { id: "u", label: "Urea > 7 mmol/L (BUN > 19 mg/dL)", points: 1 },
      { id: "r", label: "Respiratory Rate ≥ 30 breaths/min", points: 1 },
      { id: "b", label: "Blood Pressure (SBP < 90 or DBP ≤ 60 mmHg)", points: 1 },
      { id: "a", label: "Age ≥ 65 years", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score <= 1) return { riskLevel: "Low", interpretation: "30-Day Mortality: 0.6% - 1.5%", recommendation: "Outpatient oral antibiotics suitable.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score === 2) return { riskLevel: "Moderate", interpretation: "30-Day Mortality: 9.2%", recommendation: "Inpatient hospital admission or close observation.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: `30-Day Mortality: ${score === 3 ? "14.5%" : "40%+"}`, recommendation: "Urgent inpatient admission. ICU evaluation if score ≥ 4.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "lights_criteria",
    name: "Light's Criteria for Pleural Effusion",
    subtitle: "Exudative vs Transudative Pleural Effusion Differentiation",
    category: "Pulmonology",
    formula: "Exudate if ≥ 1 of 3 criteria met: Pleural/Serum Protein > 0.5, Pleural/Serum LDH > 0.6, Pleural LDH > 2/3 ULN serum LDH",
    hints: [
      "Transudates = Heart failure, Cirrhosis, Nephrotic syndrome.",
      "Exudates = Infection (pneumonia/TB), Malignancy, Pulmonary embolism."
    ],
    criteria: [
      { id: "protein_ratio", label: "Pleural Fluid Protein / Serum Protein > 0.5", points: 1 },
      { id: "ldh_ratio", label: "Pleural Fluid LDH / Serum LDH > 0.6", points: 1 },
      { id: "ldh_uln", label: "Pleural Fluid LDH > 2/3 upper limit of normal serum LDH", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score === 0) return { riskLevel: "Low", interpretation: "Transudative Pleural Effusion", recommendation: "Treat underlying systematic pressure alteration (Heart Failure, Cirrhosis). Thoracentesis drainage not routine.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      return { riskLevel: "Severe", interpretation: "Exudative Pleural Effusion (≥1 criterion met)", recommendation: "Workup for local inflammation/infection/malignancy. Pleural cell count, cytology, culture & gram stain.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },

  // ================= PSYCHIATRY & NEUROLOGY =================
  {
    id: "phq9",
    name: "PHQ-9 Depression Severity Scale",
    subtitle: "Patient Health Questionnaire for Major Depressive Disorder",
    category: "Psychiatry & Neuro",
    formula: "Score = Sum of 9 DSM-5 depression symptom frequencies (0 - 3 each)",
    hints: [
      "Question 9 evaluates suicidal ideation - mandates immediate safety risk assessment.",
      "Score ≥ 10 has 88% sensitivity and specificity for Major Depression."
    ],
    criteria: [
      { id: "anhedonia", label: "Little interest or pleasure in doing things", points: 1 },
      { id: "depressed", label: "Feeling down, depressed, or hopeless", points: 1 },
      { id: "sleep", label: "Trouble sleeping or sleeping too much", points: 1 },
      { id: "fatigue", label: "Feeling tired or having little energy", points: 1 },
      { id: "appetite", label: "Poor appetite or overeating", points: 1 },
      { id: "failure", label: "Feeling bad about yourself or that you are a failure", points: 1 },
      { id: "concentration", label: "Trouble concentrating on reading or TV", points: 1 },
      { id: "psychomotor", label: "Moving/speaking slowly or restless/fidgety", points: 1 },
      { id: "suicide", label: "Thoughts that you would be better off dead / hurting yourself", points: 2 }
    ],
    calculateRisk: (score) => {
      if (score <= 4) return { riskLevel: "Low", interpretation: "Minimal / No Depression (Score 0-4)", recommendation: "No formal treatment needed. Re-evaluate if symptoms persist.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score <= 9) return { riskLevel: "Moderate", interpretation: "Mild to Moderate Depression (Score 5-9)", recommendation: "Watchful waiting, psychoeducation, consider psychotherapy (CBT).", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "Moderate-Severe / Major Depression (Score ≥ 10)", recommendation: "Initiate Antidepressant Pharmacotherapy (SSRI/SNRI) & Psychotherapy. Assess safety.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },
  {
    id: "abcd2",
    name: "ABCD2 Score for TIA Stroke Risk",
    subtitle: "2-Day and 7-Day Stroke Risk after Transient Ischemic Attack",
    category: "Psychiatry & Neuro",
    formula: "Score = Age ≥ 60(1) + BP ≥ 140/90(1) + Clinical Features(1-2) + Duration(1-2) + Diabetes(1)",
    hints: [
      "Unilateral weakness gets 2 points; Speech impairment without weakness gets 1 point.",
      "High score (≥4) indicates high short-term stroke risk. Admit to hospital."
    ],
    criteria: [
      { id: "age", label: "Age ≥ 60 years", points: 1 },
      { id: "bp", label: "Blood Pressure ≥ 140/90 mmHg at evaluation", points: 1 },
      { id: "weakness", label: "Unilateral muscle weakness", points: 2 },
      { id: "speech", label: "Speech disturbance without weakness", points: 1 },
      { id: "dur_60", label: "TIA Duration ≥ 60 minutes", points: 2 },
      { id: "dur_10", label: "TIA Duration 10-59 minutes", points: 1 },
      { id: "dm", label: "Diabetes Mellitus history", points: 1 }
    ],
    calculateRisk: (score) => {
      if (score <= 3) return { riskLevel: "Low", interpretation: "Low 2-Day Stroke Risk (1.0%)", recommendation: "Outpatient urgent neuro workup within 24 hours.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score <= 5) return { riskLevel: "Moderate", interpretation: "Moderate 2-Day Stroke Risk (4.1%)", recommendation: "Hospital admission or rapid TIA clinic observation.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "High 2-Day Stroke Risk (8.1%)", recommendation: "Urgent inpatient stroke unit admission! MRI brain & carotid imaging.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  },

  // ================= UNIT CONVERSIONS =================
  {
    id: "unit_conversions",
    name: "Lab Chemistry & Endocrine Unit Conversions",
    subtitle: "Conventional (US Gravimetric) ↔ SI International Unit Converter",
    category: "Conversions",
    formula: "SI Unit = Conventional Unit × Conversion Factor (e.g. Glucose mg/dL × 0.0555 = mmol/L)",
    hints: [
      "Glucose: mg/dL ÷ 18 = mmol/L",
      "Creatinine: mg/dL × 88.4 = µmol/L",
      "Bilirubin: mg/dL × 17.1 = µmol/L",
      "Calcium: mg/dL × 0.25 = mmol/L"
    ],
    referenceLabValues: [
      { parameter: "Glucose (Fasting)", conventional: "70 - 99 mg/dL", si: "3.9 - 5.5 mmol/L" },
      { parameter: "Serum Creatinine", conventional: "0.7 - 1.2 mg/dL", si: "62 - 106 µmol/L" },
      { parameter: "Total Bilirubin", conventional: "0.2 - 1.2 mg/dL", si: "3.4 - 20.5 µmol/L" },
      { parameter: "Blood Urea Nitrogen (BUN)", conventional: "7 - 20 mg/dL", si: "2.5 - 7.1 mmol/L (Urea)" }
    ],
    criteria: [
      { id: "conv_us", label: "US Conventional Units (mg/dL, g/dL, mEq/L)", points: 1 },
      { id: "conv_si", label: "International SI Units (mmol/L, µmol/L, g/L)", points: 1 }
    ],
    calculateRisk: (score) => {
      return { riskLevel: "Low", interpretation: "Unit Converter Ready", recommendation: "Use reference table above for instant medical lab unit conversions.", color: "bg-blue-50 border-blue-200 text-blue-900" }
    }
  },

  // ================= LAB MONOGRAPHS =================
  {
    id: "monograph_liver",
    name: "Monograph: High ALT & AST Liver Transaminases",
    subtitle: "Clinical Diagnostic Workup for Hepatocellular Injury",
    category: "Lab Monographs",
    formula: "AST/ALT Ratio: > 2.0 suggests Alcoholic Liver Disease; < 1.0 suggests NAFLD/Viral Hepatitis",
    hints: [
      "Transaminases > 1,000 U/L suggest 3 main etiologies: Ischemic Hepatitis ('Shock Liver'), Acetaminophen Toxicity, or Acute Viral Hepatitis.",
      "Isolated AST elevation may originate from cardiac muscle, skeletal muscle rhabdomyolysis, or hemolysis."
    ],
    referenceLabValues: [
      { parameter: "ALT (Alanine Aminotransferase)", conventional: "7 - 56 U/L", si: "0.12 - 0.95 µkat/L" },
      { parameter: "AST (Aspartate Aminotransferase)", conventional: "10 - 40 U/L", si: "0.17 - 0.68 µkat/L" },
      { parameter: "Alkaline Phosphatase (ALP)", conventional: "44 - 147 U/L", si: "0.73 - 2.45 µkat/L" }
    ],
    criteria: [
      { id: "alt_1000", label: "ALT/AST > 1,000 U/L (Marked Transaminitis)", points: 3 },
      { id: "ast_ratio", label: "AST / ALT Ratio > 2.0", points: 2 },
      { id: "bili_elev", label: "Concomitant Elevated Bilirubin / Jaundice", points: 2 }
    ],
    calculateRisk: (score) => {
      if (score === 0) return { riskLevel: "Low", interpretation: "Mild Transaminase Elevation (< 3x ULN)", recommendation: "Screen for Fatty Liver (NAFLD), medications, alcohol, and viral hepatitis B/C.", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      if (score <= 2) return { riskLevel: "Moderate", interpretation: "Moderate Transaminitis / Alcoholic Pattern", recommendation: "Abdominal Ultrasound, Iron studies (hemochromatosis), Autoimmune panel.", color: "bg-amber-50 border-amber-200 text-amber-900" }
      return { riskLevel: "Severe", interpretation: "Severe Acute Hepatocellular Injury (>1000 U/L)", recommendation: "Emergency workup: Acetaminophen level, Viral Panel (Hep A/B/C/E), Toxic screen, ICU monitor for acute liver failure.", color: "bg-red-50 border-red-200 text-red-900" }
    }
  }
]

export default function CalculatorsHubPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", label: "All Calculators", icon: Calculator },
    { id: "Cardiology", label: "Cardiology", icon: Heart },
    { id: "Critical Care", label: "Critical Care & ER", icon: ShieldAlert },
    { id: "Pediatrics & OB/GYN", label: "Pediatrics & OB/GYN", icon: Baby },
    { id: "Gastroenterology", label: "Gastroenterology", icon: Droplets },
    { id: "Nephrology", label: "Nephrology & Renal", icon: TestTube },
    { id: "Pulmonology", label: "Pulmonology", icon: Stethoscope },
    { id: "Psychiatry & Neuro", label: "Psychiatry & Neuro", icon: Brain },
    { id: "Conversions", label: "Unit Conversions", icon: Scale },
    { id: "Lab Monographs", label: "Lab Monographs", icon: FileText }
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
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Evidence-Based Clinical Decision Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">UpToDate Clinical Calculators & Lab Hub</h1>
          <p className="text-blue-100 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Comprehensive medical equations, risk stratification algorithms, unit converters, and diagnostic lab monographs arranged by specialty.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search 40+ calculators & monographs (e.g. GCS, CHA2DS2-VASc, eGFR, MELD)..."
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
                    No calculator matching "{searchTerm}" was found in this category. Try adjusting your search term or tab filter.
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
