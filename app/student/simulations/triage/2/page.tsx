"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Play, 
  Clock, 
  Star, 
  BookOpen, 
  Heart, 
  Share2, 
  Filter,
  Search,
  Trophy,
  Award,
  Stethoscope,
  Brain,
  Activity,
  Eye,
  Ear,
  Baby,
  Shield,
  Target,
  FileText,
  Settings,
  Microscope,
  Pause,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Move3D,
  EyeOff,
  MoreVertical,
  Wrench,
  Syringe,
  Pill,
  HeartPulse,
  Zap,
  Bone,
  Wind,
  EyeIcon,
  User,
  Calendar,
  Check,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatientFinding {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  value: string;
  normal: boolean;
  selected: boolean;
  description?: string;
}

interface DiagnosticEntry {
  id: string;
  diagnosis: string;
  probability: number;
  reasoning: string;
  position: number;
}

interface PatientCase {
  id: string;
  title: string;
  patientAge: number;
  patientGender: string;
  chiefComplaint: string;
  status: "active" | "paused" | "completed";
  timeElapsed: number;
  specialty: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  reviews: number;
  description: string;
  tags: string[];
  completed: boolean;
  score?: number;
}

export default function PneumoniaSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Community-Acquired Pneumonia
  const caseData: PatientCase = {
    id: "2",
    title: "Community-Acquired Pneumonia (Adult)",
    patientAge: 65,
    patientGender: "Male",
    chiefComplaint: "Fever, cough, and shortness of breath for 3 days",
    status: "active",
    timeElapsed: 845, // seconds
    specialty: "Pulmonology",
    category: "Medical",
    difficulty: "Intermediate",
    duration: "20 min",
    rating: 4.6,
    reviews: 98,
    description: "Diagnose and treat a patient with fever, cough, and consolidation on chest X-ray.",
    tags: ["Infection", "Antibiotics", "Diagnosis", "Respiratory"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Pneumonia
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Fever",
      value: "38.5°C (101.3°F)",
      normal: false,
      selected: false,
      description: "Patient has low-grade fever"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Appears unwell",
      value: "Toxic appearance",
      normal: false,
      selected: false,
      description: "Patient appears systemically unwell"
    },
    
    // Skin
    {
      id: "f3",
      category: "skin",
      subcategory: "inspection",
      name: "Flushed face",
      value: "Erythematous",
      normal: false,
      selected: false,
      description: "Patient has flushed appearance consistent with fever"
    },
    
    // HEENT
    {
      id: "f4",
      category: "heent",
      subcategory: "inspection",
      name: "Nasal congestion",
      value: "Mucopurulent discharge",
      normal: false,
      selected: false,
      description: "Nasal passages congested with purulent discharge"
    },
    {
      id: "f5",
      category: "heent",
      subcategory: "inspection",
      name: "Pharyngeal erythema",
      value: "Mild redness",
      normal: false,
      selected: false,
      description: "Mild redness of posterior pharynx"
    },
    
    // Cardiac
    {
      id: "f6",
      category: "cardiac",
      subcategory: "inspection",
      name: "Normal JVP",
      value: "Not elevated",
      normal: true,
      selected: false,
      description: "Jugular venous pressure within normal limits"
    },
    {
      id: "f7",
      category: "cardiac",
      subcategory: "auscultation",
      name: "Tachycardia",
      value: "HR 105 bpm",
      normal: false,
      selected: false,
      description: "Heart rate elevated due to fever"
    },
    
    // Respiratory
    {
      id: "f8",
      category: "respiratory",
      subcategory: "inspection",
      name: "Increased work of breathing",
      value: "Use of accessory muscles",
      normal: false,
      selected: false,
      description: "Patient using accessory muscles for breathing"
    },
    {
      id: "f9",
      category: "respiratory",
      subcategory: "inspection",
      name: "Cyanosis",
      value: "Perioral cyanosis",
      normal: false,
      selected: false,
      description: "Bluish discoloration around mouth"
    },
    {
      id: "f10",
      category: "respiratory",
      subcategory: "palpation",
      name: "Decreased chest expansion",
      value: "Left lower lobe",
      normal: false,
      selected: false,
      description: "Decreased expansion on left side"
    },
    {
      id: "f11",
      category: "respiratory",
      subcategory: "palpation",
      name: "Increased tactile fremitus",
      value: "Left lower lobe",
      normal: false,
      selected: false,
      description: "Increased vibrations on left side due to consolidation"
    },
    {
      id: "f12",
      category: "respiratory",
      subcategory: "percussion",
      name: "Dullness to percussion",
      value: "Left lower lobe",
      normal: false,
      selected: false,
      description: "Dull percussion note over left lower lobe"
    },
    {
      id: "f13",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Bronchial breathing",
      value: "Left lower lobe",
      normal: false,
      selected: false,
      description: "Harsh, high-pitched breath sounds over consolidated area"
    },
    {
      id: "f14",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Crackles",
      value: "Fine crackles left base",
      normal: false,
      selected: false,
      description: "Fine crackles heard at left lung base"
    },
    {
      id: "f15",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Bronchophony",
      value: "Increased transmission",
      normal: false,
      selected: false,
      description: "Voice sounds transmitted more clearly over consolidated area"
    },
    
    // GI
    {
      id: "f16",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal discomfort",
      value: "Mild tenderness",
      normal: false,
      selected: false,
      description: "Patient reports mild abdominal discomfort"
    },
    
    // GU
    {
      id: "f17",
      category: "gu",
      subcategory: "inspection",
      name: "No GU abnormalities",
      value: "Normal",
      normal: true,
      selected: false,
      description: "No GU system abnormalities noted"
    },
    
    // Neuro
    {
      id: "f18",
      category: "neuro",
      subcategory: "inspection",
      name: "Alert and oriented",
      value: "A&O x3",
      normal: true,
      selected: false,
      description: "Patient alert and oriented to person, place, and time"
    },
    
    // Musculoskeletal
    {
      id: "f19",
      category: "musculoskeletal",
      subcategory: "inspection",
      name: "No deformities",
      value: "Normal",
      normal: true,
      selected: false,
      description: "No musculoskeletal deformities noted"
    },
    
    // Psych
    {
      id: "f20",
      category: "psych",
      subcategory: "inspection",
      name: "Cooperative but fatigued",
      value: "Fatigued",
      normal: false,
      selected: false,
      description: "Patient cooperative but appears fatigued"
    }
  ];

  // Categories for sidebar
  const categories = [
    { id: "general", label: "General Exam", icon: Activity, color: "text-gray-500" },
    { id: "skin", label: "Skin", icon: Eye, color: "text-orange-500" },
    { id: "heent", label: "HEENT", icon: Ear, color: "text-blue-500" },
    { id: "cardiac", label: "Cardiac", icon: Heart, color: "text-red-500" },
    { id: "respiratory", label: "Respiratory", icon: Wind, color: "text-green-500" },
    { id: "gi", label: "GI", icon: Activity, color: "text-yellow-500" },
    { id: "gu", label: "GU", icon: Zap, color: "text-purple-500" },
    { id: "neuro", label: "Neuro", icon: Brain, color: "text-indigo-500" },
    { id: "musculoskeletal", label: "Musculoskeletal", icon: Bone, color: "text-pink-500" },
    { id: "psych", label: "Psych", icon: Baby, color: "text-teal-500" }
  ];

  // Mock differential diagnoses
  const initialDifferentialDiagnoses: DiagnosticEntry[] = [
    {
      id: "d1",
      diagnosis: "Community-Acquired Pneumonia (Left Lower Lobe)",
      probability: 85,
      reasoning: "Classic presentation of fever, cough, and shortness of breath in elderly patient. Physical findings consistent with consolidation including increased tactile fremitus, dullness to percussion, bronchial breathing, and crackles. Patient appears systemically unwell.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Acute Bronchitis",
      probability: 45,
      reasoning: "Could explain cough and fever but would not typically cause focal findings like consolidation. Patient's physical findings are more consistent with pneumonia.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Pulmonary Embolism",
      probability: 35,
      reasoning: "Can present with dyspnea and cough but typically associated with risk factors like recent surgery, immobilization, or malignancy. Less likely in this patient without clear risk factors.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Heart Failure",
      probability: 30,
      reasoning: "Can cause dyspnea and crackles but typically associated with cardiac history and peripheral edema. Patient's findings are more consistent with pneumonia.",
      position: 4
    }
  ];

  useEffect(() => {
    setDifferentialDiagnoses(initialDifferentialDiagnoses);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFindingSelect = (finding: PatientFinding) => {
    const updatedFindings = findings.map(f => 
      f.id === finding.id ? { ...f, selected: !f.selected } : f
    );
    
    if (!finding.selected) {
      setSelectedFindings(prev => [...prev, { ...finding, selected: true }]);
      toast({
        title: "Finding Added",
        description: `${finding.name} added to diagnostic pad`,
      });
    } else {
      setSelectedFindings(prev => prev.filter(f => f.id !== finding.id));
    }
  };

  const handleRemoveFinding = (findingId: string) => {
    setSelectedFindings(prev => prev.filter(f => f.id !== findingId));
    // In a real app, you would also update the findings state
  };

  const handleDiagnosisReorder = (draggedId: string, targetPosition: number) => {
    setDifferentialDiagnoses(prev => {
      const updated = [...prev];
      const draggedIndex = updated.findIndex(d => d.id === draggedId);
      const draggedItem = updated[draggedIndex];
      
      updated.splice(draggedIndex, 1);
      updated.splice(targetPosition, 0, draggedItem);
      
      return updated.map((d, index) => ({ ...d, position: index + 1 }));
    });
  };

  const getCategoryFindings = () => {
    return findings.filter(f => 
      f.category === activeCategory && 
      (searchTerm === "" || f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const renderTabContent = () => {
    const categoryFindings = getCategoryFindings();
    
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
                  <p className="text-gray-700">{caseData.chiefComplaint}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Age</span>
                    <p className="font-medium">{caseData.patientAge} years</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Gender</span>
                    <p className="font-medium">{caseData.patientGender}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Vital Signs</span>
                    <p className="font-medium">HR 105 bpm, BP 130/85 mmHg, Temp 38.5°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Oxygen Saturation</span>
                    <p className="font-medium">92% on room air</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Elderly male presenting with 3-day history of fever, productive cough, and progressive shortness of breath. 
                    Patient appears systemically unwell with low-grade fever and mild respiratory distress. 
                    History of COPD and smoking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case "history":
        return (
          <Card className="h-full shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Patient History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Chief Complaint</h3>
                  <p className="text-gray-700">
                    "I've had a fever and cough for 3 days. I'm having trouble breathing, especially when I walk."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> 3 days ago with mild cough and low-grade fever</p>
                    <p><span className="font-medium">Character:</span> Productive cough with yellow sputum</p>
                    <p><span className="font-medium">Radiation:</span> None</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Shortness of breath, fatigue, decreased appetite</p>
                    <p><span className="font-medium">Alleviating Factors:</span> Rest</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Activity increases dyspnea</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Chronic Obstructive Pulmonary Disease (COPD) - 10 years</li>
                    <li>Hypertension</li>
                    <li>Smoker (1 pack/day for 40 years, quit 5 years ago)</li>
                    <li>No known drug allergies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Respiratory</h4>
                      <p className="text-gray-700">Cough with yellow sputum, dyspnea on exertion</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cardiovascular</h4>
                      <p className="text-gray-700">No chest pain, no palpitations</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Gastrointestinal</h4>
                      <p className="text-gray-700">Decreased appetite, no nausea or vomiting</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Neurological</h4>
                      <p className="text-gray-700">No weakness, no numbness</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
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
        );
        
      case "diagnostics":
        return (
          <Card className="h-full shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Microscope className="h-5 w-5" />
                Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="labs">
                <TabsList>
                  <TabsTrigger value="labs">Laboratory Tests</TabsTrigger>
                  <TabsTrigger value="imaging">Imaging</TabsTrigger>
                  <TabsTrigger value="bedside">Bedside Tests</TabsTrigger>
                </TabsList>
                <TabsContent value="labs" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Complete Blood Count</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">WBC</p>
                          <p className="font-medium text-red-600">14,200/μL (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium">13.8 g/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium">41%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">280,000/μL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Inflammatory Markers</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">CRP</p>
                          <p className="font-medium text-red-600">120 mg/L (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ESR</p>
                          <p className="font-medium text-red-600">65 mm/hr (↑)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Arterial Blood Gas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">pH</p>
                          <p className="font-medium">7.42</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaO₂</p>
                          <p className="font-medium text-red-600">65 mmHg (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaCO₂</p>
                          <p className="font-medium">38 mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HCO₃⁻</p>
                          <p className="font-medium">24 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">SaO₂</p>
                          <p className="font-medium text-red-600">92% (↓)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Chest X-ray (PA View)</h3>
                      <p className="text-gray-700 mb-3">
                        Left lower lobe consolidation with air bronchograms. No pleural effusion.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">Chest X-ray Image Placeholder</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">CT Chest (if indicated)</h3>
                      <p className="text-gray-700">
                        Would show segmental consolidation in left lower lobe with surrounding ground-glass opacity.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="bedside" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Vital Signs</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">BP</p>
                          <p className="font-medium">130/85 mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium text-red-600">105 bpm (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium text-red-600">24/min (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium text-red-600">92% on room air (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium text-red-600">38.5°C (↑)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
        
      case "dxpause":
        return (
          <Card className="h-full shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Pause className="h-5 w-5" />
                DxPause - Differential Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Patient Report (PR)
                  </h3>
                  <Textarea
                    placeholder="Summarize the patient's presentation..."
                    value="65-year-old male with 3-day history of fever, productive cough with yellow sputum, and progressive dyspnea. History of COPD and smoking. Appears systemically unwell with fever and mild respiratory distress. Physical findings consistent with left lower lobe consolidation including increased tactile fremitus, dullness to percussion, bronchial breathing, and fine crackles."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Differential Diagnosis (DDx)
                  </h3>
                  <div className="space-y-3">
                    {differentialDiagnoses
                      .sort((a, b) => a.position - b.position)
                      .map((dx, index) => (
                      <div
                        key={dx.id}
                        className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
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
                
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Key Findings Checklist
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Fever and productive cough</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Elderly patient with COPD history</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Consolidation findings on physical exam</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Elevated inflammatory markers</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Hypoxemia on ABG</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm">No pleuritic chest pain</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case "management":
        return (
          <Card className="h-full shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Management Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="immediate">
                <TabsList>
                  <TabsTrigger value="immediate">Immediate</TabsTrigger>
                  <TabsTrigger value="antibiotics">Antibiotics</TabsTrigger>
                  <TabsTrigger value="supportive">Supportive Care</TabsTrigger>
                </TabsList>
                <TabsContent value="immediate" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Respiratory Support</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Supplemental oxygen to maintain SpO₂ &gt; 92%</li>
                        <li>Position patient comfortably</li>
                        <li>Monitor respiratory status closely</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous pulse oximetry</li>
                        <li>Serial vital signs every 4 hours</li>
                        <li>Repeat chest X-ray in 48 hours</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Severity Assessment</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Calculate CURB-65 score: 2 points (Age &gt;65, Confusion)</li>
                        <li>Consider hospital admission</li>
                        <li>Consider ICU care if CURB-65 ≥ 3</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="antibiotics" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Empiric Antibiotic Therapy
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Based on CURB-65 score and patient risk factors
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Amoxicillin-Clavulanate</span>
                          <span className="text-sm font-medium">875/125 mg PO BID</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Azithromycin</span>
                          <span className="text-sm font-medium">500 mg PO daily</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Duration: 5-7 days. Switch to oral therapy when clinically stable.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Alternative Regimens
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Levofloxacin</span>
                          <span className="text-sm font-medium">750 mg PO daily</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Ceftriaxone + Azithromycin</span>
                          <span className="text-sm font-medium">IV/IM + PO</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="supportive" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" />
                        Supportive Care
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Antipyretics</span>
                          <span className="text-sm font-medium">Paracetamol 1g QID PRN</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Hydration</span>
                          <span className="text-sm font-medium">Adequate oral fluids</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Pulmonary toilet</span>
                          <span className="text-sm font-medium">Encourage coughing and deep breathing</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Prevention
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Pneumococcal vaccination</span>
                          <span className="text-sm font-medium">PCV13 then PPSV23</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Influenza vaccination</span>
                          <span className="text-sm font-medium">Annual</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card className="h-full shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const tabIcons = {
                    triage: Target,
                    history: FileText,
                    physical: Stethoscope,
                    diagnostics: Microscope,
                    dxpause: Pause,
                    management: Settings
                  };
                  const Icon = tabIcons[activeTab as keyof typeof tabIcons] || FileText;
                  return <Icon className="h-5 w-5" />;
                })()}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">Content for {activeTab} tab</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/student/simulations/triage')}
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#213874] rounded-full flex items-center justify-center">
                <Wind className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{caseData.title}</h1>
                <p className="text-sm text-gray-600">{caseData.specialty} • {caseData.category}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <Clock className="h-4 w-4 mr-2" />
              {formatTime(caseData.timeElapsed)}
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
              {[
                { id: "triage", label: "Triage", icon: Target },
                { id: "history", label: "History", icon: FileText },
                { id: "physical", label: "Physical Exam", icon: Stethoscope },
                { id: "diagnostics", label: "Diagnostics", icon: Microscope },
                { id: "dxpause", label: "DxPause", icon: Pause },
                { id: "management", label: "Management", icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
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
                );
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
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeCategory === category.id
                            ? 'bg-[#213874] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${activeCategory === category.id ? 'text-white' : category.color}`} />
                        <span className="font-medium">{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>

            {/* Diagnostic Pad */}
            {showDiagnosticPad && (
              <div className="w-96 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Diagnostic Pad
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDiagnosticPad(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Findings ({selectedFindings.length})</h4>
                    {selectedFindings.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No findings selected yet</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedFindings.map((finding) => (
                          <div 
                            key={finding.id} 
                            className="p-2 bg-blue-50 border border-blue-200 rounded flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium">{finding.name}</p>
                              <p className="text-xs text-gray-600">{finding.value}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveFinding(finding.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Problem Representation</h4>
                    <Textarea
                      placeholder="Summarize key findings..."
                      value={problemRepresentation}
                      onChange={(e) => setProblemRepresentation(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Differential Diagnoses</h4>
                    {differentialDiagnoses.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No diagnoses added yet</p>
                    ) : (
                      <div className="space-y-2">
                        {differentialDiagnoses
                          .sort((a, b) => a.position - b.position)
                          .map((dx) => (
                            <div key={dx.id} className="p-2 bg-purple-50 border border-purple-200 rounded">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{dx.diagnosis}</span>
                                <Badge variant="outline" className="text-xs">
                                  {dx.probability}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button className="w-full" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Submit Diagnosis
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}