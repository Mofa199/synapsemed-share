"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Wind, 
  Activity, 
  User, 
  Calendar,
  Clock,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Edit,
  Move3D,
  Search,
  Filter,
  Eye,
  EyeOff,
  MoreVertical,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  FileText,
  Microscope,
  Settings,
  Target,
  AlertTriangle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Finding {
  id: string
  category: string
  subcategory: string
  name: string
  value: string
  normal: boolean
  selected: boolean
  description?: string
}

interface DiagnosticEntry {
  id: string
  diagnosis: string
  probability: number
  reasoning: string
  position: number
}

interface PatientCase {
  id: string
  title: string
  patientAge: number
  patientGender: string
  chiefComplaint: string
  status: "active" | "paused" | "completed"
  timeElapsed: number
}

export default function LearnerViewPage() {
  const { toast } = useToast()
  
  // Case state
  const [currentCase, setCurrentCase] = useState<PatientCase>({
    id: "case-hf-001",
    title: "Heart Failure Emergency",
    patientAge: 68,
    patientGender: "Male",
    chiefComplaint: "Shortness of breath and bilateral leg swelling",
    status: "active",
    timeElapsed: 1247 // seconds
  })
  
  // Tab state
  const [activeTab, setActiveTab] = useState("triage")
  const [activeCategory, setActiveCategory] = useState("cardiac")
  
  // Findings state
  const [findings, setFindings] = useState<Finding[]>([
    {
      id: "f1",
      category: "cardiac",
      subcategory: "inspection",
      name: "Elevated JVP",
      value: "Present",
      normal: false,
      selected: false,
      description: "Jugular venous pressure elevated to 8cm above sternal angle"
    },
    {
      id: "f2", 
      category: "cardiac",
      subcategory: "auscultation",
      name: "S3 Gallop",
      value: "Present",
      normal: false,
      selected: false,
      description: "Third heart sound audible at apex"
    },
    {
      id: "f3",
      category: "pulmonary",
      subcategory: "auscultation", 
      name: "Bilateral Crackles",
      value: "Present at bases",
      normal: false,
      selected: false,
      description: "Fine crackles heard bilaterally at lung bases"
    },
    {
      id: "f4",
      category: "extremities",
      subcategory: "inspection",
      name: "Pitting Edema",
      value: "2+ bilateral",
      normal: false,
      selected: false,
      description: "Bilateral pitting edema of lower extremities"
    }
  ])
  
  // Diagnostic pad state
  const [selectedFindings, setSelectedFindings] = useState<Finding[]>([])
  const [problemRepresentation, setProblemRepresentation] = useState("")
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([
    {
      id: "d1",
      diagnosis: "Acute Heart Failure",
      probability: 85,
      reasoning: "Classic triad of dyspnea, edema, and elevated JVP",
      position: 1
    },
    {
      id: "d2", 
      diagnosis: "Pneumonia",
      probability: 45,
      reasoning: "Could explain dyspnea and crackles",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "COPD Exacerbation", 
      probability: 30,
      reasoning: "Dyspnea could be respiratory cause",
      position: 3
    }
  ])
  
  // UI state
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const tabs = [
    { id: "triage", label: "Triage", icon: Target },
    { id: "history", label: "History", icon: FileText },
    { id: "physical", label: "Physical Exam", icon: Stethoscope },
    { id: "diagnostics", label: "Diagnostics", icon: Microscope },
    { id: "dxpause", label: "DxPause", icon: Pause },
    { id: "management", label: "Management", icon: Settings }
  ]
  
  const categories = [
    { id: "cardiac", label: "Cardiac", icon: Heart, color: "text-red-500" },
    { id: "pulmonary", label: "Pulmonary", icon: Wind, color: "text-blue-500" },
    { id: "neurologic", label: "Neurologic", icon: Brain, color: "text-purple-500" },
    { id: "gastrointestinal", label: "GI", icon: Activity, color: "text-green-500" },
    { id: "extremities", label: "Extremities", icon: User, color: "text-orange-500" },
    { id: "general", label: "General", icon: Eye, color: "text-gray-500" }
  ]
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const handleFindingSelect = (finding: Finding) => {
    const updatedFindings = findings.map(f => 
      f.id === finding.id ? { ...f, selected: !f.selected } : f
    )
    setFindings(updatedFindings)
    
    if (!finding.selected) {
      setSelectedFindings(prev => [...prev, { ...finding, selected: true }])
      toast({
        title: "Finding Added",
        description: `${finding.name} added to diagnostic pad`,
      })
    } else {
      setSelectedFindings(prev => prev.filter(f => f.id !== finding.id))
    }
  }
  
  const handleRemoveFinding = (findingId: string) => {
    setSelectedFindings(prev => prev.filter(f => f.id !== findingId))
    setFindings(prev => prev.map(f => 
      f.id === findingId ? { ...f, selected: false } : f
    ))
  }
  
  const handleDiagnosisReorder = (draggedId: string, targetPosition: number) => {
    setDifferentialDiagnoses(prev => {
      const updated = [...prev]
      const draggedIndex = updated.findIndex(d => d.id === draggedId)
      const draggedItem = updated[draggedIndex]
      
      updated.splice(draggedIndex, 1)
      updated.splice(targetPosition, 0, draggedItem)
      
      return updated.map((d, index) => ({ ...d, position: index + 1 }))
    })
  }
  
  const getCategoryFindings = () => {
    return findings.filter(f => 
      f.category === activeCategory && 
      (searchTerm === "" || f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }
  
  const renderTabContent = () => {
    const categoryFindings = getCategoryFindings()
    
    switch(activeTab) {
      case "triage":
        return (
          <Card className="h-full shadow-lg">
            <CardHeader className="border-b bg-red-50">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Target className="h-5 w-5" />
                Triage Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Chief Complaint</span>
                  </div>
                  <p className="text-gray-700">{currentCase.chiefComplaint}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Age</span>
                    <p className="font-medium">{currentCase.patientAge} years</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Gender</span>
                    <p className="font-medium">{currentCase.patientGender}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">
                  Patient presents with orthopnea, paroxysmal nocturnal dyspnea, and bilateral leg swelling
                  that has been worsening over the past 3 days.
                </p>
              </div>
            </CardContent>
          </Card>
        )
        
      case "physical":
        return (
          <Card className="h-full shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Physical Examination - {categories.find(c => c.id === activeCategory)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {categoryFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      finding.selected 
                        ? 'border-blue-500 bg-blue-50' 
                        : finding.normal 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-orange-200 bg-orange-50'
                    }`}
                    onClick={() => handleFindingSelect(finding)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{finding.name}</h4>
                        <p className="text-sm text-gray-600">{finding.value}</p>
                        {finding.description && (
                          <p className="text-xs text-gray-500 mt-1">{finding.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {finding.selected && <CheckCircle className="h-5 w-5 text-blue-500" />}
                        {!finding.normal && (
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            Abnormal
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
        
      default:
        return (
          <Card className="h-full shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const currentTab = tabs.find(t => t.id === activeTab)
                  const Icon = currentTab?.icon
                  return Icon ? <Icon className="h-5 w-5" /> : null
                })()}
                {tabs.find(t => t.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">Content for {tabs.find(t => t.id === activeTab)?.label} tab</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#213874] rounded-full flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentCase.title}</h1>
                <p className="text-sm text-gray-600">Case ID: {currentCase.id}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(currentCase.timeElapsed)}
            </Badge>
            <Button variant="outline" size="sm">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDiagnosticPad(!showDiagnosticPad)}
            >
              {showDiagnosticPad ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content Area */}
        <div className={`flex-1 ${showDiagnosticPad ? 'mr-96' : ''} transition-all duration-300`}>
          {/* Top Menu Tabs */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#213874] text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 inline mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex">
            {/* Side Menu */}
            {(activeTab === "physical" || activeTab === "history") && (
              <div className="w-64 bg-white border-r border-gray-200 p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search findings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          activeCategory === category.id
                            ? 'bg-[#213874] text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${
                          activeCategory === category.id ? 'text-white' : category.color
                        }`} />
                        <span className="font-medium">{category.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Diagnostic Pad - Fixed Right Panel */}
        {showDiagnosticPad && (
          <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
            <div className="p-4 border-b bg-yellow-50">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Diagnostic Pad
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDiagnosticPad(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-yellow-700">Your clinical reasoning workspace</p>
            </div>

            <div className="p-4 space-y-6">
              {/* Selected Findings */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Key Findings ({selectedFindings.length})
                </h3>
                <div className="space-y-2">
                  {selectedFindings.map((finding) => (
                    <div
                      key={finding.id}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-green-800">{finding.name}</span>
                        <p className="text-sm text-green-600">{finding.value}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFinding(finding.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {selectedFindings.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No findings selected yet</p>
                  )}
                </div>
              </div>
              
              <Separator />

              {/* Problem Representation */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Edit className="h-4 w-4 text-blue-500" />
                  Problem Representation
                </h3>
                <Textarea
                  placeholder="Summarize the patient's presentation in 1-2 sentences..."
                  value={problemRepresentation}
                  onChange={(e) => setProblemRepresentation(e.target.value)}
                  className="min-h-[100px] text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Example: "68-year-old male with acute dyspnea, orthopnea, and bilateral edema..."
                </p>
              </div>
              
              <Separator />

              {/* Differential Diagnosis */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  Differential Diagnosis
                </h3>
                <div className="space-y-3">
                  {differentialDiagnoses
                    .sort((a, b) => a.position - b.position)
                    .map((dx, index) => (
                    <div
                      key={dx.id}
                      className="p-3 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium">{dx.diagnosis}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {dx.probability}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 ml-8">{dx.reasoning}</p>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-3" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Diagnosis
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}