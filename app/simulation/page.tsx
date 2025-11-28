"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { 
  User, 
  Heart, 
  Brain, 
  Activity, 
  Stethoscope, 
  Thermometer,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Play,
  Pause,
  RotateCcw,
  FileText,
  ChevronRight
} from "lucide-react"

interface VitalSigns {
  heartRate: number
  bloodPressure: string
  temperature: number
  respiratoryRate: number
  oxygenSaturation: number
  consciousness: string
}

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  weight: number
  height: number
  condition: string
  chiefComplaint: string
  history: string
  vitals: VitalSigns
  symptoms: string[]
  allergies: string[]
}

interface SimulationStep {
  id: string
  title: string
  description: string
  action: string
  completed: boolean
  correct?: boolean
  feedback?: string
}

export default function PatientSimulationPage() {
  const { toast } = useToast()
  const [currentPatient, setCurrentPatient] = useState<Patient>({
    id: "sim-001",
    name: "Sarah Johnson",
    age: 28,
    gender: "Female",
    weight: 65,
    height: 165,
    condition: "Acute Chest Pain",
    chiefComplaint: "Sudden onset chest pain with shortness of breath",
    history: "No significant past medical history. Non-smoker. Takes oral contraceptives.",
    vitals: {
      heartRate: 110,
      bloodPressure: "140/90",
      temperature: 37.2,
      respiratoryRate: 22,
      oxygenSaturation: 96,
      consciousness: "Alert and oriented"
    },
    symptoms: ["Chest pain", "Shortness of breath", "Anxiety", "Palpitations"],
    allergies: ["No known allergies"]
  })

  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([
    {
      id: "step-1",
      title: "Initial Assessment",
      description: "Perform primary survey and obtain vital signs",
      action: "Check airway, breathing, circulation",
      completed: true,
      correct: true,
      feedback: "Good job! You correctly prioritized the ABC assessment."
    },
    {
      id: "step-2", 
      title: "History Taking",
      description: "Obtain focused history related to chest pain",
      action: "Ask about OPQRST characteristics",
      completed: true,
      correct: true,
      feedback: "Excellent history taking using the OPQRST framework."
    },
    {
      id: "step-3",
      title: "Physical Examination",
      description: "Perform targeted physical examination",
      action: "Examine cardiovascular and respiratory systems",
      completed: false
    },
    {
      id: "step-4",
      title: "Diagnostic Tests",
      description: "Order appropriate investigations",
      action: "Consider ECG, chest X-ray, lab tests",
      completed: false
    },
    {
      id: "step-5",
      title: "Differential Diagnosis",
      description: "Formulate differential diagnosis",
      action: "Consider cardiac, pulmonary, and other causes",
      completed: false
    },
    {
      id: "step-6",
      title: "Treatment Plan",
      description: "Develop management strategy",
      action: "Implement appropriate interventions",
      completed: false
    }
  ])

  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(2)
  const [showPatientDetails, setShowPatientDetails] = useState(true)
  const [simulationTime, setSimulationTime] = useState(0)

  const completedSteps = simulationSteps.filter(step => step.completed).length
  const totalSteps = simulationSteps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  const handleStepComplete = (stepId: string, correct: boolean = true) => {
    setSimulationSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            completed: true, 
            correct,
            feedback: correct 
              ? "Good decision! You're on the right track." 
              : "Consider reviewing this step. Think about alternative approaches."
          }
        : step
    ))

    if (correct) {
      toast({
        title: "Step Completed",
        description: "Great work! Moving to the next step.",
      })
      
      if (currentStepIndex < totalSteps - 1) {
        setCurrentStepIndex(prev => prev + 1)
      }
    } else {
      toast({
        title: "Review Needed",
        description: "Consider reviewing this step before proceeding.",
        variant: "destructive",
      })
    }
  }

  const resetSimulation = () => {
    setSimulationSteps(prev => prev.map(step => ({
      ...step,
      completed: step.id === "step-1" || step.id === "step-2",
      correct: step.id === "step-1" || step.id === "step-2",
      feedback: step.id === "step-1" || step.id === "step-2" ? step.feedback : undefined
    })))
    setCurrentStepIndex(2)
    setSimulationTime(0)
    setIsSimulationRunning(false)
  }

  const getVitalStatus = (vital: string, value: number | string) => {
    switch (vital) {
      case 'heartRate':
        const hr = value as number
        if (hr < 60) return 'text-blue-600'
        if (hr > 100) return 'text-red-600'
        return 'text-green-600'
      case 'temperature':
        const temp = value as number
        if (temp > 37.5) return 'text-red-600'
        if (temp < 36) return 'text-blue-600'
        return 'text-green-600'
      case 'oxygenSaturation':
        const sats = value as number
        if (sats < 95) return 'text-red-600'
        if (sats < 98) return 'text-yellow-600'
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Patient Simulation</h1>
              <p className="text-gray-600">Interactive clinical case scenario training</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-[#213874] text-white px-4 py-2">
                <Clock className="h-4 w-4 mr-2" />
                {Math.floor(simulationTime / 60)}:{(simulationTime % 60).toString().padStart(2, '0')}
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                Step {currentStepIndex + 1} of {totalSteps}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Simulation Progress</span>
              <span className="text-sm text-gray-600">{completedSteps}/{totalSteps} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Virtual Patient */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Virtual Patient
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPatientDetails(!showPatientDetails)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* CSS-generated patient figure */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    {/* Head */}
                    <div className="w-16 h-20 bg-gradient-to-b from-[#fdb4a6] to-[#f8a594] rounded-full mx-auto relative">
                      {/* Eyes */}
                      <div className="absolute top-6 left-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                      <div className="absolute top-6 right-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                      {/* Nose */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-[#e89884] rounded-full"></div>
                      {/* Mouth */}
                      <div className="absolute top-11 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-[#d48878] rounded-full"></div>
                      {/* Hair */}
                      <div className="absolute -top-2 left-1 w-14 h-8 bg-[#8B4513] rounded-t-full"></div>
                    </div>
                    
                    {/* Body */}
                    <div className="w-20 h-32 bg-gradient-to-b from-[#4A90E2] to-[#357ABD] rounded-lg mx-auto -mt-2">
                      {/* Arms */}
                      <div className="absolute top-20 -left-6 w-12 h-4 bg-[#fdb4a6] rounded-full transform rotate-45"></div>
                      <div className="absolute top-20 -right-6 w-12 h-4 bg-[#fdb4a6] rounded-full transform -rotate-45"></div>
                    </div>
                    
                    {/* Legs */}
                    <div className="flex gap-2 justify-center -mt-1">
                      <div className="w-4 h-20 bg-[#2c3e50] rounded-b-lg"></div>
                      <div className="w-4 h-20 bg-[#2c3e50] rounded-b-lg"></div>
                    </div>

                    {/* Condition indicators */}
                    {currentPatient.symptoms.includes("Chest pain") && (
                      <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                    
                    {currentPatient.symptoms.includes("Shortness of breath") && (
                      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
                        <div className="text-xs text-red-500 animate-bounce">💨</div>
                      </div>
                    )}
                  </div>
                </div>

                {showPatientDetails && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-[#213874]">{currentPatient.name}</h3>
                      <p className="text-sm text-gray-600">
                        {currentPatient.age} years old • {currentPatient.gender}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentPatient.height}cm • {currentPatient.weight}kg
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Chief Complaint:</h4>
                      <p className="text-sm text-gray-600">{currentPatient.chiefComplaint}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Present Symptoms:</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentPatient.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-red-600 border-red-200">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Allergies:</h4>
                      <p className="text-sm text-gray-600">{currentPatient.allergies.join(', ')}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Heart Rate</span>
                  </div>
                  <span className={`text-sm font-medium ${getVitalStatus('heartRate', currentPatient.vitals.heartRate)}`}>
                    {currentPatient.vitals.heartRate} bpm
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Blood Pressure</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {currentPatient.vitals.bloodPressure} mmHg
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <span className={`text-sm font-medium ${getVitalStatus('temperature', currentPatient.vitals.temperature)}`}>
                    {currentPatient.vitals.temperature}°C
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Respiratory Rate</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {currentPatient.vitals.respiratoryRate} /min
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">O₂ Saturation</span>
                  </div>
                  <span className={`text-sm font-medium ${getVitalStatus('oxygenSaturation', currentPatient.vitals.oxygenSaturation)}`}>
                    {currentPatient.vitals.oxygenSaturation}%
                  </span>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Consciousness</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{currentPatient.vitals.consciousness}</p>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simulation Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setIsSimulationRunning(!isSimulationRunning)}
                  className="w-full bg-[#213874] hover:bg-[#1a6ac3] flex items-center gap-2"
                >
                  {isSimulationRunning ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause Simulation
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Simulation
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetSimulation}
                  className="w-full flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Simulation
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Case Notes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Simulation Steps */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Clinical Decision Making
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {simulationSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        index === currentStepIndex
                          ? 'border-[#213874] bg-blue-50'
                          : step.completed
                          ? step.correct
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? step.correct
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : index === currentStepIndex
                            ? 'bg-[#213874] text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {step.completed ? (
                            step.correct ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <AlertTriangle className="h-4 w-4" />
                            )
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          <p className="text-sm font-medium text-[#213874] mb-3">{step.action}</p>
                          
                          {step.feedback && (
                            <div className={`p-3 rounded-md text-sm ${
                              step.correct
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {step.feedback}
                            </div>
                          )}
                          
                          {index === currentStepIndex && !step.completed && isSimulationRunning && (
                            <div className="mt-4 flex gap-2">
                              <Button
                                onClick={() => handleStepComplete(step.id, true)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                Complete Correctly
                              </Button>
                              <Button
                                onClick={() => handleStepComplete(step.id, false)}
                                variant="outline"
                                size="sm"
                              >
                                Need Review
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {index < currentStepIndex && (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {completedSteps === totalSteps && (
                  <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Simulation Complete!</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      Congratulations! You have successfully completed this patient simulation. 
                      Review your performance and consider areas for improvement.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        onClick={resetSimulation}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        Try Again
                      </Button>
                      <Button variant="outline" size="sm">
                        View Summary
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}