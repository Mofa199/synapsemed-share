"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, Heart, Brain, Activity, Droplets, Pill, Stethoscope, Baby, Utensils, Calendar, Zap, User, FileText } from "lucide-react"

interface CalculatorProps {
  title: string
  description: string
  category: string
  icon: React.ReactNode
  children: React.ReactNode
}

const CalculatorCard = ({ title, description, category, icon, children }: CalculatorProps) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        {icon}
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
      <Badge variant="outline" className="w-fit">{category}</Badge>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

export default function MedicalCalculators() {
  // BMI Calculator
  const [bmiHeight, setBmiHeight] = useState("")
  const [bmiWeight, setBmiWeight] = useState("")
  
  // BSA Calculator  
  const [bsaHeight, setBsaHeight] = useState("")
  const [bsaWeight, setBsaWeight] = useState("")
  
  // MAP Calculator
  const [sbp, setSbp] = useState("")
  const [dbp, setDbp] = useState("")
  
  // QTc Calculator
  const [qt, setQt] = useState("")
  const [rr, setRr] = useState("")
  
  // Creatinine Clearance
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [creatinine, setCreatinine] = useState("")
  const [gender, setGender] = useState("")
  
  // GCS Calculator
  const [eyeResponse, setEyeResponse] = useState("")
  const [verbalResponse, setVerbalResponse] = useState("")
  const [motorResponse, setMotorResponse] = useState("")
  
  // CURB-65
  const [confusion, setConfusion] = useState(false)
  const [urea, setUrea] = useState("")
  const [respRate, setRespRate] = useState("")
  const [bp, setBp] = useState(false)
  const [ageOver65, setAgeOver65] = useState(false)
  
  // CHA2DS2-VASc
  const [chf, setChf] = useState(false)
  const [hypertension, setHypertension] = useState(false)
  const [ageScore, setAgeScore] = useState("")
  const [diabetes, setDiabetes] = useState(false)
  const [stroke, setStroke] = useState(false)
  const [vascular, setVascular] = useState(false)
  const [sex, setSex] = useState("")

  // Additional Calculator State Variables
  const [timi, setTimi] = useState({
    age: "",
    cad: false,
    aspirin: false,
    angina: false,
    stElevation: false,
    markers: false,
    weight: ""
  })
  
  const [hasbled, setHasbled] = useState({
    hypertension: false,
    renalDisease: false,
    liverDisease: false,
    stroke: false,
    bleeding: false,
    labile: false,
    elderly: false,
    drugs: false,
    alcohol: false
  })
  
  const [aaGradient, setAaGradient] = useState({
    fio2: "",
    pao2: "",
    age: "",
    barometric: "760"
  })
  
  const [feNa, setFeNa] = useState({
    urineNa: "",
    plasmaNa: "",
    urineCr: "",
    plasmaCr: ""
  })
  
  const [anionGap, setAnionGap] = useState({
    sodium: "",
    chloride: "",
    bicarbonate: ""
  })
  
  const [correctedCa, setCorrectedCa] = useState({
    calcium: "",
    albumin: ""
  })
  
  const [osmolality, setOsmolality] = useState({
    sodium: "",
    glucose: "",
    bun: ""
  })
  
  const [apgar, setApgar] = useState({
    appearance: "",
    pulse: "",
    grimace: "",
    activity: "",
    respiration: ""
  })
  
  const [calorieNeeds, setCalorieNeeds] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    activity: ""
  })

  // Obstetrics Calculators
  const [lmp, setLmp] = useState("")
  const [usDate, setUsDate] = useState("")
  const [usEdd, setUsEdd] = useState("")
  const [lastPeriod, setLastPeriod] = useState("")
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState("")
  const [gestationalAgeDays, setGestationalAgeDays] = useState("")

  // Emergency Calculators
  const [parklandWeight, setParklandWeight] = useState("")
  const [parklandBurn, setParklandBurn] = useState("")
  const [ruleOfNines, setRuleOfNines] = useState({
    head: false,
    chest: false,
    abdomen: false,
    upperBack: false,
    lowerBack: false,
    rightArm: false,
    leftArm: false,
    rightLeg: false,
    leftLeg: false,
    genitalia: false
  })
  const [ivDripRate, setIvDripRate] = useState({
    volume: "",
    time: "",
    dropFactor: "15"
  })
  const [waterDeficitState, setWaterDeficitState] = useState({
    na: "",
    weight: "",
    targetNa: "140"
  })
  const [abcScore, setAbcScore] = useState({
    age: "",
    heartRate: "",
    systolicBP: "",
    trauma: false,
    procedure: false
  })

  // Mental Health Calculators
  const [depressionScore, setDepressionScore] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: ""
  })
  const [anxietyScore, setAnxietyScore] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: ""
  })
  const [gcsMental, setGcsMental] = useState("")
  const [mddScore, setMddScore] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: ""
  })
  const [ptsdScore, setPtsdScore] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: ""
  })
  const [gadScore, setGadScore] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: ""
  })
  const [bipolarScore, setBipolarScore] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    q10: "",
    q11: ""
  })
  const [ocdScore, setOcdScore] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: ""
  })
  const [psychosisScore, setPsychosisScore] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    q10: ""
  })
  const [sleepScore, setSleepScore] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    q10: "",
    q11: "",
    q12: ""
  })

  const calculateBMI = () => {
    if (!bmiHeight || !bmiWeight) return "Enter height and weight"
    const heightM = parseFloat(bmiHeight) / 100
    const bmi = (parseFloat(bmiWeight) / (heightM * heightM)).toFixed(1)
    let category = ""
    if (parseFloat(bmi) < 18.5) category = "Underweight"
    else if (parseFloat(bmi) < 25) category = "Normal"
    else if (parseFloat(bmi) < 30) category = "Overweight"
    else category = "Obese"
    return `${bmi} kg/m² (${category})`
  }

  const calculateBSA = () => {
    if (!bsaHeight || !bsaWeight) return "Enter height and weight"
    const bsa = Math.sqrt((parseFloat(bsaHeight) * parseFloat(bsaWeight)) / 3600).toFixed(2)
    return `${bsa} m²`
  }

  const calculateMAP = () => {
    if (!sbp || !dbp) return "Enter SBP and DBP"
    const map = ((parseFloat(sbp) + 2 * parseFloat(dbp)) / 3).toFixed(1)
    return `${map} mmHg`
  }

  const calculateQTc = () => {
    if (!qt || !rr) return "Enter QT and RR intervals"
    const qtc = (parseFloat(qt) / Math.sqrt(parseFloat(rr) / 1000)).toFixed(0)
    let interpretation = ""
    if (parseFloat(qtc) > 450) interpretation = " (Prolonged)"
    else if (parseFloat(qtc) < 350) interpretation = " (Short)"
    else interpretation = " (Normal)"
    return `${qtc} ms${interpretation}`
  }

  const calculateCreatinineClearance = () => {
    if (!age || !weight || !creatinine || !gender) return "Enter all values"
    const ccr = ((140 - parseFloat(age)) * parseFloat(weight)) / (72 * parseFloat(creatinine))
    const finalCcr = gender === "female" ? ccr * 0.85 : ccr
    return `${finalCcr.toFixed(1)} mL/min`
  }

  const calculateGCS = () => {
    if (!eyeResponse || !verbalResponse || !motorResponse) return "Select all responses"
    const total = parseInt(eyeResponse) + parseInt(verbalResponse) + parseInt(motorResponse)
    let severity = ""
    if (total <= 8) severity = " (Severe)"
    else if (total <= 12) severity = " (Moderate)"
    else severity = " (Mild)"
    return `${total}/15${severity}`
  }

  const calculateCURB65 = () => {
    let score = 0
    if (confusion) score += 1
    if (parseFloat(urea) > 19) score += 1
    if (parseFloat(respRate) >= 30) score += 1
    if (bp) score += 1
    if (ageOver65) score += 1
    
    let risk = ""
    if (score <= 1) risk = " (Low risk)"
    else if (score <= 2) risk = " (Moderate risk)"
    else risk = " (High risk)"
    
    return `${score}/5${risk}`
  }

  const calculateCHA2DS2VASc = () => {
    let score = 0
    if (chf) score += 1
    if (hypertension) score += 1
    if (ageScore === "65-74") score += 1
    else if (ageScore === "75+") score += 2
    if (diabetes) score += 1
    if (stroke) score += 2
    if (vascular) score += 1
    if (sex === "female") score += 1
    
    let risk = ""
    if (score === 0) risk = " (Very low risk)"
    else if (score === 1) risk = " (Low risk)"
    else if (score === 2) risk = " (Moderate risk)"
    else risk = " (High risk)"
    
    return `${score}/9${risk}`
  }

  // Additional Calculator Functions
  const calculateTIMI = () => {
    let score = 0
    if (parseInt(timi.age) >= 65) score += 1
    if (timi.cad) score += 1
    if (timi.aspirin) score += 1
    if (timi.angina) score += 1
    if (timi.stElevation) score += 1
    if (timi.markers) score += 1
    if (parseInt(timi.weight) < 67) score += 1
    
    let risk = ""
    if (score <= 2) risk = " (Low risk)"
    else if (score <= 4) risk = " (Intermediate risk)"
    else risk = " (High risk)"
    
    return `${score}/7${risk}`
  }

  const calculateHASBLED = () => {
    let score = 0
    if (hasbled.hypertension) score += 1
    if (hasbled.renalDisease) score += 1
    if (hasbled.liverDisease) score += 1
    if (hasbled.stroke) score += 1
    if (hasbled.bleeding) score += 1
    if (hasbled.labile) score += 1
    if (hasbled.elderly) score += 1
    if (hasbled.drugs) score += 1
    if (hasbled.alcohol) score += 1
    
    let risk = ""
    if (score <= 2) risk = " (Low bleeding risk)"
    else risk = " (High bleeding risk)"
    
    return `${score}/9${risk}`
  }

  const calculateAAGradient = () => {
    if (!aaGradient.fio2 || !aaGradient.pao2 || !aaGradient.age) return "Enter all values"
    const fio2 = parseFloat(aaGradient.fio2) / 100
    const pao2 = parseFloat(aaGradient.pao2)
    const age = parseFloat(aaGradient.age)
    const barometric = parseFloat(aaGradient.barometric)
    
    const pao2Alveolar = (fio2 * (barometric - 47)) - (pao2 / 0.8)
    const gradient = pao2Alveolar - pao2
    const normal = (age / 4) + 4
    
    let interpretation = ""
    if (gradient > normal) interpretation = " (Elevated)"
    else interpretation = " (Normal)"
    
    return `${gradient.toFixed(1)} mmHg${interpretation}`
  }

  const calculateFeNa = () => {
    if (!feNa.urineNa || !feNa.plasmaNa || !feNa.urineCr || !feNa.plasmaCr) return "Enter all values"
    const fena = ((parseFloat(feNa.urineNa) * parseFloat(feNa.plasmaCr)) / (parseFloat(feNa.plasmaNa) * parseFloat(feNa.urineCr))) * 100
    
    let interpretation = ""
    if (fena < 1) interpretation = " (Prerenal)"
    else if (fena > 2) interpretation = " (Intrinsic renal)"
    else interpretation = " (Indeterminate)"
    
    return `${fena.toFixed(2)}%${interpretation}`
  }

  const calculateAnionGap = () => {
    if (!anionGap.sodium || !anionGap.chloride || !anionGap.bicarbonate) return "Enter all values"
    const gap = parseFloat(anionGap.sodium) - (parseFloat(anionGap.chloride) + parseFloat(anionGap.bicarbonate))
    
    let interpretation = ""
    if (gap > 12) interpretation = " (Elevated - metabolic acidosis)"
    else if (gap < 8) interpretation = " (Low)"
    else interpretation = " (Normal)"
    
    return `${gap.toFixed(1)} mEq/L${interpretation}`
  }

  const calculateCorrectedCalcium = () => {
    if (!correctedCa.calcium || !correctedCa.albumin) return "Enter calcium and albumin"
    const corrected = parseFloat(correctedCa.calcium) + 0.8 * (4 - parseFloat(correctedCa.albumin))
    
    let interpretation = ""
    if (corrected > 10.2) interpretation = " (High)"
    else if (corrected < 8.5) interpretation = " (Low)"
    else interpretation = " (Normal)"
    
    return `${corrected.toFixed(2)} mg/dL${interpretation}`
  }

  const calculateOsmolality = () => {
    if (!osmolality.sodium || !osmolality.glucose || !osmolality.bun) return "Enter all values"
    const osm = (2 * parseFloat(osmolality.sodium)) + (parseFloat(osmolality.glucose) / 18) + (parseFloat(osmolality.bun) / 2.8)
    
    let interpretation = ""
    if (osm > 295) interpretation = " (High)"
    else if (osm < 280) interpretation = " (Low)"
    else interpretation = " (Normal)"
    
    return `${osm.toFixed(1)} mOsm/kg${interpretation}`
  }

  const calculateAPGAR = () => {
    if (!apgar.appearance || !apgar.pulse || !apgar.grimace || !apgar.activity || !apgar.respiration) return "Select all responses"
    const total = parseInt(apgar.appearance) + parseInt(apgar.pulse) + parseInt(apgar.grimace) + parseInt(apgar.activity) + parseInt(apgar.respiration)
    
    let interpretation = ""
    if (total >= 7) interpretation = " (Normal)"
    else if (total >= 4) interpretation = " (Moderately abnormal)"
    else interpretation = " (Severely abnormal)"
    
    return `${total}/10${interpretation}`
  }

  const calculateCalorieNeeds = () => {
    if (!calorieNeeds.age || !calorieNeeds.weight || !calorieNeeds.height || !calorieNeeds.gender || !calorieNeeds.activity) return "Enter all values"
    
    const age = parseFloat(calorieNeeds.age)
    const weight = parseFloat(calorieNeeds.weight)
    const height = parseFloat(calorieNeeds.height)
    
    // Harris-Benedict Equation
    let bmr
    if (calorieNeeds.gender === "male") {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
    
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725,
      extra: 1.9
    }
    
    const totalCalories = bmr * activityFactors[calorieNeeds.activity as keyof typeof activityFactors]
    
    return `${Math.round(totalCalories)} calories/day`
  }

  // Obstetrics Calculator Functions
  const calculateEDDByLMP = () => {
    if (!lmp) return "Enter LMP date"
    const lmpDate = new Date(lmp)
    const edd = new Date(lmpDate)
    edd.setDate(edd.getDate() + 280) // 40 weeks
    
    return edd.toLocaleDateString()
  }

  const calculateGestationalAge = () => {
    if (!lastPeriod) return "Enter LMP date"
    const lmpDate = new Date(lastPeriod)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - lmpDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diffDays / 7)
    const days = diffDays % 7
    
    return `${weeks} weeks ${days} days`
  }

  // Emergency Calculator Functions
  const calculateParkland = () => {
    if (!parklandWeight || !parklandBurn) return "Enter weight and burn percentage"
    const weight = parseFloat(parklandWeight)
    const burn = parseFloat(parklandBurn)
    const totalFluid = 4 * weight * burn // mL
    const first8Hours = totalFluid / 2
    const next16Hours = totalFluid / 2
    
    return `Total: ${totalFluid} mL\nFirst 8 hours: ${first8Hours} mL\nNext 16 hours: ${next16Hours} mL`
  }

  const calculateRuleOfNines = () => {
    let total = 0
    if (ruleOfNines.head) total += 9
    if (ruleOfNines.chest) total += 9
    if (ruleOfNines.abdomen) total += 9
    if (ruleOfNines.upperBack) total += 9
    if (ruleOfNines.lowerBack) total += 9
    if (ruleOfNines.rightArm) total += 9
    if (ruleOfNines.leftArm) total += 9
    if (ruleOfNines.rightLeg) total += 18
    if (ruleOfNines.leftLeg) total += 18
    if (ruleOfNines.genitalia) total += 1
    
    return `${total}%`
  }

  const calculateIvDripRate = () => {
    if (!ivDripRate.volume || !ivDripRate.time) return "Enter volume and time"
    const volume = parseFloat(ivDripRate.volume)
    const time = parseFloat(ivDripRate.time)
    const dropFactor = parseFloat(ivDripRate.dropFactor)
    
    const dripRate = (volume * dropFactor) / (time * 60)
    
    return `${Math.round(dripRate)} gtts/min`
  }

  const calculateWaterDeficit = () => {
    if (!waterDeficitState.na || !waterDeficitState.weight) return "Enter sodium and weight"
    const na = parseFloat(waterDeficitState.na)
    const weight = parseFloat(waterDeficitState.weight)
    const targetNa = parseFloat(waterDeficitState.targetNa)
    
    const waterDeficit = weight * 0.6 * ((na / targetNa) - 1)
    
    return `${waterDeficit.toFixed(1)} L`
  }

  const calculateABCScore = () => {
    if (!abcScore.age || !abcScore.heartRate || !abcScore.systolicBP) return "Enter all values"
    let score = 0
    
    const age = parseInt(abcScore.age)
    const heartRate = parseInt(abcScore.heartRate)
    const systolicBP = parseInt(abcScore.systolicBP)
    
    if (age > 55) score += 1
    if (heartRate > 100) score += 1
    if (systolicBP < 100) score += 1
    if (abcScore.trauma) score += 1
    if (abcScore.procedure) score += 1
    
    let risk = ""
    if (score >= 3) risk = " (High risk for massive transfusion)"
    else risk = " (Low risk for massive transfusion)"
    
    return `${score}/5${risk}`
  }

  // Mental Health Calculator Functions
  const calculateDepressionScore = () => {
    const scores = Object.values(depressionScore).map(val => parseInt(val) || 0)
    const total = scores.reduce((sum, val) => sum + val, 0)
    
    let interpretation = ""
    if (total <= 17) interpretation = " (Minimal depression)"
    else if (total <= 22) interpretation = " (Mild depression)"
    else if (total <= 28) interpretation = " (Moderate depression)"
    else interpretation = " (Severe depression)"
    
    return `${total}/27${interpretation}`
  }

  const calculateAnxietyScore = () => {
    const scores = Object.values(anxietyScore).map(val => parseInt(val) || 0)
    const total = scores.reduce((sum, val) => sum + val, 0)
    
    let interpretation = ""
    if (total <= 7) interpretation = " (Minimal anxiety)"
    else if (total <= 9) interpretation = " (Mild anxiety)"
    else if (total <= 14) interpretation = " (Moderate anxiety)"
    else interpretation = " (Severe anxiety)"
    
    return `${total}/21${interpretation}`
  }

  // Additional Mental Health Calculators
  const calculateMDDScore = () => {
    const scores = Object.values(mddScore).map(val => parseInt(val) || 0)
    const total = scores.reduce((sum, val) => sum + val, 0)
    
    let interpretation = ""
    if (total <= 17) interpretation = " (Minimal depression)"
    else if (total <= 22) interpretation = " (Mild depression)"
    else if (total <= 28) interpretation = " (Moderate depression)"
    else interpretation = " (Severe depression)"
    
    return `${total}/27${interpretation}`
  }

  const calculatePTSDScore = () => {
    const scores = Object.values(ptsdScore).map(val => parseInt(val) || 0)
    const total = scores.reduce((sum, val) => sum + val, 0)
    
    let interpretation = ""
    if (total <= 17) interpretation = " (Minimal PTSD)"
    else if (total <= 22) interpretation = " (Mild PTSD)"
    else if (total <= 28) interpretation = " (Moderate PTSD)"
    else interpretation = " (Severe PTSD)"
    
    return `${total}/28${interpretation}`
  }

  const calculateGAD7Score = () => {
    const scores = Object.values(gadScore).map(val => parseInt(val) || 0)
    const total = scores.reduce((sum, val) => sum + val, 0)
    
    let interpretation = ""
    if (total <= 4) interpretation = " (Minimal anxiety)"
    else if (total <= 9) interpretation = " (Mild anxiety)"
    else if (total <= 14) interpretation = " (Moderate anxiety)"
    else interpretation = " (Severe anxiety)"
    
    return `${total}/21${interpretation}`
  }

  const calculateBipolarScore = () => {
    const scores = Object.values(bipolarScore).map(val => parseInt(val) || 0)
    const total = scores.reduce((sum, val) => sum + val, 0)
    
    return `${total}/33`
  }

  const calculateOCDScore = () => {
    const scores = Object.values(ocdScore).map(val => parseInt(val) || 0)
    const total = scores.reduce((sum, val) => sum + val, 0)
    
    return `${total}/27`
  }

  const calculatePsychosisScore = () => {
    const scores = Object.values(psychosisScore).map(val => parseInt(val) || 0)
    const total = scores.reduce((sum, val) => sum + val, 0)
    
    return `${total}/30`
  }

  const calculateSleepScore = () => {
    const scores = Object.values(sleepScore).map(val => parseInt(val) || 0)
    const total = scores.reduce((sum, val) => sum + val, 0)
    
    return `${total}/36`
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#213874] mb-4">Medical Calculators</h2>
        <p className="text-gray-600">Clinical decision support tools for healthcare professionals</p>
      </div>

      {/* Cardiology Calculators */}
      <div>
        <h3 className="text-2xl font-semibold text-[#213874] mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Cardiology
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CalculatorCard
            title="BMI Calculator"
            description="Body Mass Index calculation"
            category="Cardiology"
            icon={<Calculator className="w-5 h-5 text-[#213874]" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  placeholder="170"
                  value={bmiHeight}
                  onChange={(e) => setBmiHeight(e.target.value)}
                />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="70"
                  value={bmiWeight}
                  onChange={(e) => setBmiWeight(e.target.value)}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">BMI: {calculateBMI()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="BSA Calculator"
            description="Body Surface Area (Mosteller formula)"
            category="Cardiology"
            icon={<Calculator className="w-5 h-5 text-[#213874]" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  placeholder="170"
                  value={bsaHeight}
                  onChange={(e) => setBsaHeight(e.target.value)}
                />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="70"
                  value={bsaWeight}
                  onChange={(e) => setBsaWeight(e.target.value)}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">BSA: {calculateBSA()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="MAP Calculator"
            description="Mean Arterial Pressure"
            category="Cardiology"
            icon={<Heart className="w-5 h-5 text-red-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Systolic BP (mmHg)</Label>
                <Input
                  type="number"
                  placeholder="120"
                  value={sbp}
                  onChange={(e) => setSbp(e.target.value)}
                />
              </div>
              <div>
                <Label>Diastolic BP (mmHg)</Label>
                <Input
                  type="number"
                  placeholder="80"
                  value={dbp}
                  onChange={(e) => setDbp(e.target.value)}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">MAP: {calculateMAP()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="QTc Calculator"
            description="Corrected QT interval (Bazett's)"
            category="Cardiology"
            icon={<Activity className="w-5 h-5 text-green-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>QT interval (ms)</Label>
                <Input
                  type="number"
                  placeholder="400"
                  value={qt}
                  onChange={(e) => setQt(e.target.value)}
                />
              </div>
              <div>
                <Label>RR interval (ms)</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={rr}
                  onChange={(e) => setRr(e.target.value)}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">QTc: {calculateQTc()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="CHA₂DS₂-VASc Score"
            description="Stroke risk in atrial fibrillation"
            category="Cardiology"
            icon={<Brain className="w-5 h-5 text-purple-500" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={chf}
                    onChange={(e) => setChf(e.target.checked)}
                  />
                  <span className="text-sm">CHF</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={hypertension}
                    onChange={(e) => setHypertension(e.target.checked)}
                  />
                  <span className="text-sm">Hypertension</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={diabetes}
                    onChange={(e) => setDiabetes(e.target.checked)}
                  />
                  <span className="text-sm">Diabetes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={stroke}
                    onChange={(e) => setStroke(e.target.checked)}
                  />
                  <span className="text-sm">Stroke/TIA</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={vascular}
                    onChange={(e) => setVascular(e.target.checked)}
                  />
                  <span className="text-sm">Vascular disease</span>
                </label>
              </div>
              <div>
                <Label>Age</Label>
                <Select value={ageScore} onValueChange={setAgeScore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<65">&lt; 65 years</SelectItem>
                    <SelectItem value="65-74">65-74 years</SelectItem>
                    <SelectItem value="75+">≥ 75 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sex</Label>
                <Select value={sex} onValueChange={setSex}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Score: {calculateCHA2DS2VASc()}</p>
              </div>
            </div>
          </CalculatorCard>
        </div>
      </div>

      {/* Neurology Calculators */}
      <div>
        <h3 className="text-2xl font-semibold text-[#213874] mb-6 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          Neurology
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CalculatorCard
            title="Glasgow Coma Scale"
            description="Neurological assessment"
            category="Neurology"
            icon={<Brain className="w-5 h-5 text-purple-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Eye Response</Label>
                <Select value={eyeResponse} onValueChange={setEyeResponse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select response" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">Spontaneous (4)</SelectItem>
                    <SelectItem value="3">To voice (3)</SelectItem>
                    <SelectItem value="2">To pain (2)</SelectItem>
                    <SelectItem value="1">None (1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Verbal Response</Label>
                <Select value={verbalResponse} onValueChange={setVerbalResponse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select response" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Oriented (5)</SelectItem>
                    <SelectItem value="4">Confused (4)</SelectItem>
                    <SelectItem value="3">Inappropriate (3)</SelectItem>
                    <SelectItem value="2">Incomprehensible (2)</SelectItem>
                    <SelectItem value="1">None (1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Motor Response</Label>
                <Select value={motorResponse} onValueChange={setMotorResponse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select response" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">Obeys commands (6)</SelectItem>
                    <SelectItem value="5">Localizes (5)</SelectItem>
                    <SelectItem value="4">Withdraws (4)</SelectItem>
                    <SelectItem value="3">Abnormal flexion (3)</SelectItem>
                    <SelectItem value="2">Extension (2)</SelectItem>
                    <SelectItem value="1">None (1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">GCS: {calculateGCS()}</p>
              </div>
            </div>
          </CalculatorCard>
        </div>
      </div>

      {/* Pulmonology & Critical Care */}
      <div>
        <h3 className="text-2xl font-semibold text-[#213874] mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-green-500" />
          Pulmonology & Critical Care
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CalculatorCard
            title="CURB-65 Score"
            description="Pneumonia severity assessment"
            category="Pulmonology"
            icon={<Activity className="w-5 h-5 text-green-500" />}
          >
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={confusion}
                  onChange={(e) => setConfusion(e.target.checked)}
                />
                <span className="text-sm">Confusion</span>
              </label>
              <div>
                <Label>Urea (mg/dL)</Label>
                <Input
                  type="number"
                  placeholder="15"
                  value={urea}
                  onChange={(e) => setUrea(e.target.value)}
                />
              </div>
              <div>
                <Label>Respiratory Rate</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={respRate}
                  onChange={(e) => setRespRate(e.target.value)}
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={bp}
                  onChange={(e) => setBp(e.target.checked)}
                />
                <span className="text-sm">BP &lt; 90/60</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={ageOver65}
                  onChange={(e) => setAgeOver65(e.target.checked)}
                />
                <span className="text-sm">Age ≥ 65</span>
              </label>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Score: {calculateCURB65()}</p>
              </div>
            </div>
          </CalculatorCard>
        </div>
      </div>

      {/* Renal & Fluids */}
      <div>
        <h3 className="text-2xl font-semibold text-[#213874] mb-6 flex items-center gap-2">
          <Droplets className="w-6 h-6 text-blue-500" />
          Renal & Fluids
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CalculatorCard
            title="Creatinine Clearance"
            description="Cockcroft-Gault equation"
            category="Renal"
            icon={<Droplets className="w-5 h-5 text-blue-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Age (years)</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div>
                <Label>Serum Creatinine (mg/dL)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="1.0"
                  value={creatinine}
                  onChange={(e) => setCreatinine(e.target.value)}
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">CrCl: {calculateCreatinineClearance()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="FeNa Calculator"
            description="Fractional Excretion of Sodium"
            category="Renal"
            icon={<Droplets className="w-5 h-5 text-blue-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Urine Na (mEq/L)</Label>
                <Input
                  type="number"
                  placeholder="40"
                  value={feNa.urineNa}
                  onChange={(e) => setFeNa({...feNa, urineNa: e.target.value})}
                />
              </div>
              <div>
                <Label>Plasma Na (mEq/L)</Label>
                <Input
                  type="number"
                  placeholder="140"
                  value={feNa.plasmaNa}
                  onChange={(e) => setFeNa({...feNa, plasmaNa: e.target.value})}
                />
              </div>
              <div>
                <Label>Urine Creatinine (mg/dL)</Label>
                <Input
                  type="number"
                  placeholder="60"
                  value={feNa.urineCr}
                  onChange={(e) => setFeNa({...feNa, urineCr: e.target.value})}
                />
              </div>
              <div>
                <Label>Plasma Creatinine (mg/dL)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="1.0"
                  value={feNa.plasmaCr}
                  onChange={(e) => setFeNa({...feNa, plasmaCr: e.target.value})}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">FeNa: {calculateFeNa()}</p>
              </div>
            </div>
          </CalculatorCard>
        </div>
      </div>

      {/* Nutrition & Metabolism */}
      <div>
        <h3 className="text-2xl font-semibold text-[#213874] mb-6 flex items-center gap-2">
          <Utensils className="w-6 h-6 text-orange-500" />
          Nutrition & Metabolism
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CalculatorCard
            title="Anion Gap"
            description="Na - (Cl + HCO₃)"
            category="Metabolism"
            icon={<Calculator className="w-5 h-5 text-[#213874]" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Sodium (mEq/L)</Label>
                <Input
                  type="number"
                  placeholder="140"
                  value={anionGap.sodium}
                  onChange={(e) => setAnionGap({...anionGap, sodium: e.target.value})}
                />
              </div>
              <div>
                <Label>Chloride (mEq/L)</Label>
                <Input
                  type="number"
                  placeholder="105"
                  value={anionGap.chloride}
                  onChange={(e) => setAnionGap({...anionGap, chloride: e.target.value})}
                />
              </div>
              <div>
                <Label>Bicarbonate (mEq/L)</Label>
                <Input
                  type="number"
                  placeholder="24"
                  value={anionGap.bicarbonate}
                  onChange={(e) => setAnionGap({...anionGap, bicarbonate: e.target.value})}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Anion Gap: {calculateAnionGap()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="Corrected Calcium"
            description="Albumin-corrected calcium"
            category="Metabolism"
            icon={<Calculator className="w-5 h-5 text-[#213874]" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Calcium (mg/dL)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="9.5"
                  value={correctedCa.calcium}
                  onChange={(e) => setCorrectedCa({...correctedCa, calcium: e.target.value})}
                />
              </div>
              <div>
                <Label>Albumin (g/dL)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="4.0"
                  value={correctedCa.albumin}
                  onChange={(e) => setCorrectedCa({...correctedCa, albumin: e.target.value})}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Corrected Ca: {calculateCorrectedCalcium()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="Serum Osmolality"
            description="2Na + glucose/18 + BUN/2.8"
            category="Metabolism"
            icon={<Calculator className="w-5 h-5 text-[#213874]" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Sodium (mEq/L)</Label>
                <Input
                  type="number"
                  placeholder="140"
                  value={osmolality.sodium}
                  onChange={(e) => setOsmolality({...osmolality, sodium: e.target.value})}
                />
              </div>
              <div>
                <Label>Glucose (mg/dL)</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={osmolality.glucose}
                  onChange={(e) => setOsmolality({...osmolality, glucose: e.target.value})}
                />
              </div>
              <div>
                <Label>BUN (mg/dL)</Label>
                <Input
                  type="number"
                  placeholder="15"
                  value={osmolality.bun}
                  onChange={(e) => setOsmolality({...osmolality, bun: e.target.value})}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Osmolality: {calculateOsmolality()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="Caloric Needs (Harris-Benedict)"
            description="BMR + activity factor"
            category="Nutrition"
            icon={<Utensils className="w-5 h-5 text-orange-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Age (years)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={calorieNeeds.age}
                  onChange={(e) => setCalorieNeeds({...calorieNeeds, age: e.target.value})}
                />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="70"
                  value={calorieNeeds.weight}
                  onChange={(e) => setCalorieNeeds({...calorieNeeds, weight: e.target.value})}
                />
              </div>
              <div>
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  placeholder="170"
                  value={calorieNeeds.height}
                  onChange={(e) => setCalorieNeeds({...calorieNeeds, height: e.target.value})}
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={calorieNeeds.gender} onValueChange={(value) => setCalorieNeeds({...calorieNeeds, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Activity Level</Label>
                <Select value={calorieNeeds.activity} onValueChange={(value) => setCalorieNeeds({...calorieNeeds, activity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light activity</SelectItem>
                    <SelectItem value="moderate">Moderate activity</SelectItem>
                    <SelectItem value="heavy">Heavy activity</SelectItem>
                    <SelectItem value="extra">Extra heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Daily Needs: {calculateCalorieNeeds()}</p>
              </div>
            </div>
          </CalculatorCard>
        </div>
      </div>

      {/* Obstetrics & Pediatrics */}
      <div>
        <h3 className="text-2xl font-semibold text-[#213874] mb-6 flex items-center gap-2">
          <Baby className="w-6 h-6 text-pink-500" />
          Obstetrics & Pediatrics
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CalculatorCard
            title="APGAR Score"
            description="Newborn assessment"
            category="Pediatrics"
            icon={<Baby className="w-5 h-5 text-pink-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Appearance</Label>
                <Select value={apgar.appearance} onValueChange={(value) => setApgar({...apgar, appearance: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Pink all over (2)</SelectItem>
                    <SelectItem value="1">Pink body, blue extremities (1)</SelectItem>
                    <SelectItem value="0">Blue/pale all over (0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pulse</Label>
                <Select value={apgar.pulse} onValueChange={(value) => setApgar({...apgar, pulse: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">≥ 100 bpm (2)</SelectItem>
                    <SelectItem value="1">&lt; 100 bpm (1)</SelectItem>
                    <SelectItem value="0">Absent (0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Grimace/Reflex</Label>
                <Select value={apgar.grimace} onValueChange={(value) => setApgar({...apgar, grimace: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Vigorous cry (2)</SelectItem>
                    <SelectItem value="1">Grimace (1)</SelectItem>
                    <SelectItem value="0">No response (0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Activity/Muscle Tone</Label>
                <Select value={apgar.activity} onValueChange={(value) => setApgar({...apgar, activity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Active movement (2)</SelectItem>
                    <SelectItem value="1">Some flexion (1)</SelectItem>
                    <SelectItem value="0">Limp (0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Respiration</Label>
                <Select value={apgar.respiration} onValueChange={(value) => setApgar({...apgar, respiration: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Strong cry (2)</SelectItem>
                    <SelectItem value="1">Weak cry (1)</SelectItem>
                    <SelectItem value="0">Absent (0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">APGAR: {calculateAPGAR()}</p>
              </div>
            </div>
          </CalculatorCard>

          {/* Obstetrics Calculators */}
          <CalculatorCard
            title="EDD by LMP"
            description="Estimated Due Date by Last Menstrual Period"
            category="Obstetrics"
            icon={<Calendar className="w-5 h-5 text-pink-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Last Menstrual Period</Label>
                <Input
                  type="date"
                  value={lmp}
                  onChange={(e) => setLmp(e.target.value)}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">EDD: {calculateEDDByLMP()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="Gestational Age"
            description="Calculate current gestational age"
            category="Obstetrics"
            icon={<Baby className="w-5 h-5 text-pink-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Last Menstrual Period</Label>
                <Input
                  type="date"
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Gestational Age: {calculateGestationalAge()}</p>
              </div>
            </div>
          </CalculatorCard>
        </div>
      </div>

      {/* Emergency Medicine */}
      <div>
        <h3 className="text-2xl font-semibold text-[#213874] mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Emergency Medicine
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CalculatorCard
            title="Parkland Formula"
            description="Fluid resuscitation for burn patients"
            category="Emergency"
            icon={<Zap className="w-5 h-5 text-yellow-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="70"
                  value={parklandWeight}
                  onChange={(e) => setParklandWeight(e.target.value)}
                />
              </div>
              <div>
                <Label>% Total Body Surface Area Burned</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={parklandBurn}
                  onChange={(e) => setParklandBurn(e.target.value)}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Fluid Requirements: {calculateParkland()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="Rule of Nines"
            description="Estimate burn surface area"
            category="Emergency"
            icon={<Zap className="w-5 h-5 text-yellow-500" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.head}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, head: e.target.checked})}
                  />
                  <span className="text-sm">Head (9%)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.chest}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, chest: e.target.checked})}
                  />
                  <span className="text-sm">Chest (9%)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.abdomen}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, abdomen: e.target.checked})}
                  />
                  <span className="text-sm">Abdomen (9%)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.upperBack}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, upperBack: e.target.checked})}
                  />
                  <span className="text-sm">Upper Back (9%)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.lowerBack}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, lowerBack: e.target.checked})}
                  />
                  <span className="text-sm">Lower Back (9%)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.rightArm}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, rightArm: e.target.checked})}
                  />
                  <span className="text-sm">Right Arm (9%)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.leftArm}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, leftArm: e.target.checked})}
                  />
                  <span className="text-sm">Left Arm (9%)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.rightLeg}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, rightLeg: e.target.checked})}
                  />
                  <span className="text-sm">Right Leg (18%)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.leftLeg}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, leftLeg: e.target.checked})}
                  />
                  <span className="text-sm">Left Leg (18%)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={ruleOfNines.genitalia}
                    onChange={(e) => setRuleOfNines({...ruleOfNines, genitalia: e.target.checked})}
                  />
                  <span className="text-sm">Genitalia (1%)</span>
                </label>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Total Burn Area: {calculateRuleOfNines()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="IV Drip Rate"
            description="Calculate IV infusion drip rate"
            category="Emergency"
            icon={<Droplets className="w-5 h-5 text-blue-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Volume (mL)</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={ivDripRate.volume}
                  onChange={(e) => setIvDripRate({...ivDripRate, volume: e.target.value})}
                />
              </div>
              <div>
                <Label>Time (hours)</Label>
                <Input
                  type="number"
                  placeholder="8"
                  value={ivDripRate.time}
                  onChange={(e) => setIvDripRate({...ivDripRate, time: e.target.value})}
                />
              </div>
              <div>
                <Label>Drop Factor (gtts/mL)</Label>
                <Select value={ivDripRate.dropFactor} onValueChange={(value) => setIvDripRate({...ivDripRate, dropFactor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drop factor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 gtts/mL (Blood set)</SelectItem>
                    <SelectItem value="15">15 gtts/mL (Standard set)</SelectItem>
                    <SelectItem value="20">20 gtts/mL (Microdrip set)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Drip Rate: {calculateIvDripRate()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="Water Deficit in Hypernatremia"
            description="Calculate free water deficit"
            category="Emergency"
            icon={<Droplets className="w-5 h-5 text-blue-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Serum Sodium (mEq/L)</Label>
                <Input
                  type="number"
                  placeholder="150"
                  value={waterDeficitState.na}
                  onChange={(e) => setWaterDeficitState({...waterDeficitState, na: e.target.value})}
                />
              </div>
              <div>
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  placeholder="70"
                  value={waterDeficitState.weight}
                  onChange={(e) => setWaterDeficitState({...waterDeficitState, weight: e.target.value})}
                />
              </div>
              <div>
                <Label>Target Sodium (mEq/L)</Label>
                <Input
                  type="number"
                  placeholder="140"
                  value={waterDeficitState.targetNa}
                  onChange={(e) => setWaterDeficitState({...waterDeficitState, targetNa: e.target.value})}
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Water Deficit: {calculateWaterDeficit()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="ABC Score"
            description="Massive transfusion prediction"
            category="Emergency"
            icon={<FileText className="w-5 h-5 text-gray-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>Age (years)</Label>
                <Input
                  type="number"
                  placeholder="45"
                  value={abcScore.age}
                  onChange={(e) => setAbcScore({...abcScore, age: e.target.value})}
                />
              </div>
              <div>
                <Label>Heart Rate (bpm)</Label>
                <Input
                  type="number"
                  placeholder="110"
                  value={abcScore.heartRate}
                  onChange={(e) => setAbcScore({...abcScore, heartRate: e.target.value})}
                />
              </div>
              <div>
                <Label>Systolic BP (mmHg)</Label>
                <Input
                  type="number"
                  placeholder="90"
                  value={abcScore.systolicBP}
                  onChange={(e) => setAbcScore({...abcScore, systolicBP: e.target.value})}
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={abcScore.trauma}
                  onChange={(e) => setAbcScore({...abcScore, trauma: e.target.checked})}
                />
                <span className="text-sm">Trauma</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={abcScore.procedure}
                  onChange={(e) => setAbcScore({...abcScore, procedure: e.target.checked})}
                />
                <span className="text-sm">Major procedure</span>
              </label>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Score: {calculateABCScore()}</p>
              </div>
            </div>
          </CalculatorCard>
        </div>
      </div>

      {/* Mental Health */}
      <div>
        <h3 className="text-2xl font-semibold text-[#213874] mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-500" />
          Mental Health
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CalculatorCard
            title="Depression (PHQ-9)"
            description="Patient Health Questionnaire-9"
            category="Mental Health"
            icon={<User className="w-5 h-5 text-purple-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>1. Little interest or pleasure in doing things (0-3)</Label>
                <Select value={depressionScore.q1} onValueChange={(value) => setDepressionScore({...depressionScore, q1: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not at all (0)</SelectItem>
                    <SelectItem value="1">Several days (1)</SelectItem>
                    <SelectItem value="2">More than half the days (2)</SelectItem>
                    <SelectItem value="3">Nearly every day (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>2. Feeling down, depressed, or hopeless (0-3)</Label>
                <Select value={depressionScore.q2} onValueChange={(value) => setDepressionScore({...depressionScore, q2: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not at all (0)</SelectItem>
                    <SelectItem value="1">Several days (1)</SelectItem>
                    <SelectItem value="2">More than half the days (2)</SelectItem>
                    <SelectItem value="3">Nearly every day (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>3. Trouble falling or staying asleep (0-3)</Label>
                <Select value={depressionScore.q3} onValueChange={(value) => setDepressionScore({...depressionScore, q3: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not at all (0)</SelectItem>
                    <SelectItem value="1">Several days (1)</SelectItem>
                    <SelectItem value="2">More than half the days (2)</SelectItem>
                    <SelectItem value="3">Nearly every day (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Score: {calculateDepressionScore()}</p>
              </div>
            </div>
          </CalculatorCard>

          <CalculatorCard
            title="Anxiety (GAD-7)"
            description="Generalized Anxiety Disorder 7-item scale"
            category="Mental Health"
            icon={<User className="w-5 h-5 text-purple-500" />}
          >
            <div className="space-y-4">
              <div>
                <Label>1. Feeling nervous, anxious, or on edge (0-3)</Label>
                <Select value={anxietyScore.q1} onValueChange={(value) => setAnxietyScore({...anxietyScore, q1: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not at all (0)</SelectItem>
                    <SelectItem value="1">Several days (1)</SelectItem>
                    <SelectItem value="2">More than half the days (2)</SelectItem>
                    <SelectItem value="3">Nearly every day (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>2. Not being able to stop or control worrying (0-3)</Label>
                <Select value={anxietyScore.q2} onValueChange={(value) => setAnxietyScore({...anxietyScore, q2: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not at all (0)</SelectItem>
                    <SelectItem value="1">Several days (1)</SelectItem>
                    <SelectItem value="2">More than half the days (2)</SelectItem>
                    <SelectItem value="3">Nearly every day (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>3. Worrying too much about different things (0-3)</Label>
                <Select value={anxietyScore.q3} onValueChange={(value) => setAnxietyScore({...anxietyScore, q3: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not at all (0)</SelectItem>
                    <SelectItem value="1">Several days (1)</SelectItem>
                    <SelectItem value="2">More than half the days (2)</SelectItem>
                    <SelectItem value="3">Nearly every day (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-[#213874]">Score: {calculateAnxietyScore()}</p>
              </div>
            </div>
          </CalculatorCard>
        </div>
      </div>
    </div>
  )
}
