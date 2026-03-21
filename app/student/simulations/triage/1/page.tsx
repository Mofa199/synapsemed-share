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

export default function AMISimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Acute Myocardial Infarction
  const caseData: PatientCase = {
    id: "1",
    title: "Acute Myocardial Infarction (STEMI)",
    patientAge: 58,
    patientGender: "Male",
    chiefComplaint: "Severe chest pain radiating to left arm",
    status: "active",
    timeElapsed: 1247, // seconds
    specialty: "Cardiology",
    category: "Medical",
    difficulty: "Advanced",
    duration: "25 min",
    rating: 4.8,
    reviews: 124,
    description: "Manage a patient presenting with chest pain and ECG changes consistent with STEMI.",
    tags: ["STEMI", "ACS", "Intervention", "Cardiology"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to STEMI
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Diaphoresis",
      value: "Profuse sweating",
      normal: false,
      selected: false,
      description: "Patient is visibly sweating and appears anxious"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Anxious appearance",
      value: "Appears distressed",
      normal: false,
      selected: false,
      description: "Patient is visibly anxious and clutching chest"
    },
    
    // Skin
    {
      id: "f3",
      category: "skin",
      subcategory: "inspection",
      name: "Pallor",
      value: "Pale skin",
      normal: false,
      selected: false,
      description: "Patient appears pale and diaphoretic"
    },
    
    // HEENT
    {
      id: "f4",
      category: "heent",
      subcategory: "inspection",
      name: "No head trauma",
      value: "Normal",
      normal: true,
      selected: false,
      description: "No signs of head injury or trauma"
    },
    
    // Cardiac
    {
      id: "f5",
      category: "cardiac",
      subcategory: "inspection",
      name: "Elevated JVP",
      value: "8cm above sternal angle",
      normal: false,
      selected: false,
      description: "Jugular venous pressure elevated"
    },
    {
      id: "f6",
      category: "cardiac",
      subcategory: "auscultation",
      name: "S3 Gallop",
      value: "Present at apex",
      normal: false,
      selected: false,
      description: "Third heart sound audible at apex"
    },
    {
      id: "f7",
      category: "cardiac",
      subcategory: "auscultation",
      name: "S4 Gallop",
      value: "Present",
      normal: false,
      selected: false,
      description: "Fourth heart sound present"
    },
    {
      id: "f8",
      category: "cardiac",
      subcategory: "palpation",
      name: "Displaced apex beat",
      value: "Laterally displaced",
      normal: false,
      selected: false,
      description: "Apex beat displaced laterally"
    },
    
    // Respiratory
    {
      id: "f9",
      category: "respiratory",
      subcategory: "inspection",
      name: "No respiratory distress",
      value: "Normal breathing",
      normal: true,
      selected: false,
      description: "Patient breathing comfortably, no accessory muscle use"
    },
    {
      id: "f10",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Clear lungs",
      value: "Bilateral clear",
      normal: true,
      selected: false,
      description: "Clear breath sounds bilaterally"
    },
    
    // GI
    {
      id: "f11",
      category: "gi",
      subcategory: "inspection",
      name: "Soft abdomen",
      value: "Non-tender",
      normal: true,
      selected: false,
      description: "Abdomen soft and non-tender"
    },
    
    // GU
    {
      id: "f12",
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
      id: "f13",
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
      id: "f14",
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
      id: "f15",
      category: "psych",
      subcategory: "inspection",
      name: "Anxious but cooperative",
      value: "Cooperative",
      normal: true,
      selected: false,
      description: "Patient anxious but cooperative with examination"
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

  // Mock differential diagnoses for STEMI
  const initialDifferentialDiagnoses: DiagnosticEntry[] = [
    {
      id: "d1",
      diagnosis: "Acute ST-Elevation Myocardial Infarction (Inferior Wall)",
      probability: 85,
      reasoning: "Classic presentation of crushing chest pain radiating to left arm with diaphoresis in a 58-year-old male with risk factors. ECG shows ST elevation in leads II, III, aVF.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Unstable Angina",
      probability: 45,
      reasoning: "Could explain chest pain and radiation, but would not typically cause ST elevation on ECG. Patient's presentation is more consistent with STEMI.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Gastroesophageal Reflux Disease (GERD)",
      probability: 30,
      reasoning: "Can cause chest pain, but typically burning in nature and not associated with diaphoresis or ST changes. Less likely given clinical presentation.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Aortic Dissection",
      probability: 25,
      reasoning: "Can present with severe chest pain, but typically described as tearing or ripping. Pulse deficits and blood pressure differences between arms would be expected.",
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
                Triage Assessment - STEMI
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
                    <p className="font-medium">HR 98 bpm, BP 150/90 mmHg</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Pain Scale</span>
                    <p className="font-medium">8/10 severe</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Patient presents with severe, crushing central chest pain that started 1 hour ago, 
                    radiating to the left arm and jaw. Associated with diaphoresis and nausea. 
                    Patient appears anxious and is clutching his chest.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">Triage Priority</h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500">RED - IMMEDIATE</Badge>
                    <span className="text-gray-700">STEMI Alert - Time is muscle!</span>
                  </div>
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
                Patient History - STEMI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Chief Complaint</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 italic">
                      "I was watching TV when suddenly I got this crushing pain in my chest 
                      that went down my left arm and up to my jaw. I'm sweating like crazy 
                      and feel like I'm going to die."
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Timeline</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                        <li><span className="font-medium">Onset:</span> 1 hour ago at home</li>
                        <li><span className="font-medium">Duration:</span> Continuous</li>
                        <li><span className="font-medium">Progression:</span> Remained severe</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Associated Symptoms</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                        <li>Diaphoresis (profuse sweating)</li>
                        <li>Nausea</li>
                        <li>Anxiety</li>
                        <li>Dyspnea (mild)</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Pain Characteristics</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                        <li><span className="font-medium">Quality:</span> Crushing, pressure-like</li>
                        <li><span className="font-medium">Radiation:</span> Left arm, jaw</li>
                        <li><span className="font-medium">Severity:</span> 8/10</li>
                        <li><span className="font-medium">Alleviating:</span> Nothing</li>
                        <li><span className="font-medium">Aggravating:</span> Movement</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Cardiac Risk Factors</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                        <li>Hypertension (10 years)</li>
                        <li>Smoking (1 pack/day x 30 years)</li>
                        <li>Hyperlipidemia</li>
                        <li>Family history of CAD</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-1">Medical Conditions</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>Hypertension</li>
                        <li>Hyperlipidemia</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-1">Medications</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>Lisinopril 10mg daily</li>
                        <li>Atorvastatin 20mg daily</li>
                        <li>Aspirin 81mg daily (irregular)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-1">Social History</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>Smoker: 1 pack/day x 30 years</li>
                        <li>Alcohol: Social</li>
                        <li>Exercise: Sedentary</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Positive Findings</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>Chest pain</li>
                        <li>Diaphoresis</li>
                        <li>Nausea</li>
                        <li>Anxiety</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Negative Findings</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        <li>No dyspnea at rest</li>
                        <li>No cough</li>
                        <li>No syncope</li>
                        <li>No palpitations</li>
                        <li>No abdominal pain</li>
                      </ul>
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
                Diagnostics - STEMI
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
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <HeartPulse className="h-4 w-4 text-red-500" />
                        Cardiac Biomarkers
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-gray-600">Troponin I</p>
                          <p className="font-medium text-red-600">Positive (↑ 15.2 ng/mL)</p>
                          <p className="text-xs text-gray-500">Normal: &lt; 0.04 ng/mL</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-gray-600">CK-MB</p>
                          <p className="font-medium text-red-600">Elevated (↑ 45 U/L)</p>
                          <p className="text-xs text-gray-500">Normal: &lt; 5 U/L</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">LDH</p>
                          <p className="font-medium">350 U/L</p>
                          <p className="text-xs text-gray-500">Normal: 100-250 U/L</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">AST</p>
                          <p className="font-medium">85 U/L</p>
                          <p className="text-xs text-gray-500">Normal: 10-40 U/L</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        Complete Blood Count
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">WBC</p>
                          <p className="font-medium">11,200/μL</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium">14.2 g/dL</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium">42%</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">250,000/μL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Basic Metabolic Panel
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">Na⁺</p>
                          <p className="font-medium">138 mEq/L</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">K⁺</p>
                          <p className="font-medium">4.2 mEq/L</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">Cl⁻</p>
                          <p className="font-medium">102 mEq/L</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">CO₂</p>
                          <p className="font-medium">24 mEq/L</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">BUN</p>
                          <p className="font-medium">18 mg/dL</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">Cr</p>
                          <p className="font-medium">1.1 mg/dL</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">Glu</p>
                          <p className="font-medium">112 mg/dL</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-red-500" />
                        12-Lead ECG
                      </h3>
                      <p className="text-gray-700 mb-3">
                        ST elevation in leads II, III, aVF with reciprocal ST depression in leads I, aVL
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center mb-3">
                        <div className="text-center">
                          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <span className="text-gray-500">ECG Image: STEMI Pattern</span>
                          <p className="text-xs text-gray-500 mt-1">ST elevation in inferior leads</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-gray-600">ST Elevation</p>
                          <p className="font-medium text-red-600">≥ 1mm in 2 contiguous leads</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600">Reciprocal Changes</p>
                          <p className="font-medium text-yellow-600">ST depression in I, aVL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-500" />
                        Chest X-ray
                      </h3>
                      <div className="bg-gray-100 h-32 rounded flex items-center justify-center mb-3">
                        <div className="text-center">
                          <Eye className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                          <span className="text-gray-500">CXR Image</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Findings</p>
                        <p className="font-medium">Normal cardiac silhouette, clear lung fields</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="bedside" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        Vital Signs
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">BP</p>
                          <p className="font-medium">150/90 mmHg</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium">98 bpm (regular)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium">20/min</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium">96% on room air</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">98.6°F (37°C)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Pain</p>
                          <p className="font-medium">8/10</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Bedside Cardiac Monitoring
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Rhythm</p>
                          <p className="font-medium">Sinus rhythm</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Arrhythmias</p>
                          <p className="font-medium">None detected</p>
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
                DxPause - STEMI Differential Diagnosis
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
                    value="58-year-old male with severe crushing chest pain radiating to left arm and jaw, associated with diaphoresis and nausea for 1 hour. History of hypertension, smoking, and hyperlipidemia. ECG shows ST elevation in inferior leads (II, III, aVF) with reciprocal ST depression in leads I, aVL. Cardiac biomarkers are positive."
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
                      <span className="text-sm">Crushing chest pain with radiation</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Diaphoresis and nausea</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">ST elevation on ECG (inferior leads)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Positive cardiac biomarkers</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Risk factors (HTN, smoking, hyperlipidemia)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm">No dyspnea or cough</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm">No syncope or palpitations</span>
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
                Management Plan - STEMI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="immediate">
                <TabsList>
                  <TabsTrigger value="immediate">Immediate</TabsTrigger>
                  <TabsTrigger value="procedures">Procedures</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                </TabsList>
                <TabsContent value="immediate" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Resuscitation
                      </h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Establish IV access (2 large bore IVs)</li>
                        <li>Continuous ECG monitoring</li>
                        <li>Oxygen if SpO₂ &lt; 94%</li>
                        <li>Position patient comfortably</li>
                        <li>Activate STEMI alert/cath lab team</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Immediate Medications
                      </h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Aspirin 300 mg PO (chewed) - <span className="text-green-600">✓ Given</span></li>
                        <li>Clopidogrel 300 mg PO - <span className="text-green-600">✓ Given</span></li>
                        <li>Nitroglycerin 0.4 mg SL (if BP &gt; 90/60) - <span className="text-yellow-600">Pending</span></li>
                        <li>Morphine 2-4 mg IV PRN pain - <span className="text-red-600">Not Given</span></li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Definitive Treatment
                      </h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Primary PCI (preferred if available within 90 min) - <span className="text-yellow-600">Pending</span></li>
                        <li>Thrombolytics (Alteplase) if PCI unavailable - <span className="text-red-600">Not Started</span></li>
                        <li>Anticoagulation (Unfractionated heparin) - <span className="text-red-600">Not Started</span></li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4 py-1">
                      <h3 className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time Targets
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">First Medical Contact to Balloon</p>
                          <p className="font-medium">78 min</p>
                          <p className="text-xs text-green-600">✓ Within 90 min target</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600">Door to ECG</p>
                          <p className="font-medium">5 min</p>
                          <p className="text-xs text-green-600">✓ Within 10 min target</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="procedures" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Primary Percutaneous Coronary Intervention (PCI)
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Emergency coronary angiography with percutaneous coronary intervention
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Indication</p>
                          <p className="font-medium">STEMI with ongoing chest pain</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Time Target</p>
                          <p className="font-medium">&lt; 90 minutes</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Door-to-Balloon</p>
                          <p className="font-medium">Goal &lt; 90 min</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-medium text-yellow-600">Pending Cath Lab Activation</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Expected Findings</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          <li>Right coronary artery occlusion (80-90% of inferior STEMIs)</li>
                          <li>Successful stent placement</li>
                          <li>Restoration of TIMI 3 flow</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Thrombolytic Therapy (Backup)
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Fibrinolytic therapy if PCI not available within 90 minutes
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Agent</p>
                          <p className="font-medium">Alteplase (tPA)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Time Window</p>
                          <p className="font-medium">&lt; 12 hours from symptom onset</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Contraindications</p>
                          <p className="font-medium text-green-600">None identified</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-medium text-red-600">Not Indicated (PCI available)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Antiplatelet Therapy
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Aspirin</span>
                            <p className="text-xs text-gray-600">Irreversible COX inhibitor</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">300 mg PO</span>
                            <p className="text-xs text-green-600">✓ Given</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Clopidogrel</span>
                            <p className="text-xs text-gray-600">P2Y12 receptor antagonist</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">300 mg PO</span>
                            <p className="text-xs text-green-600">✓ Given</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Ticagrelor</span>
                            <p className="text-xs text-gray-600">Alternative P2Y12 blocker</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">180 mg PO</span>
                            <p className="text-xs text-gray-500">Not used</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Anticoagulation
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Unfractionated Heparin</span>
                            <p className="text-xs text-gray-600">Immediate anticoagulation</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">60 U/kg bolus</span>
                            <p className="text-xs text-red-600">Pending</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Enoxaparin</span>
                            <p className="text-xs text-gray-600">Low molecular weight heparin</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">1 mg/kg SC</span>
                            <p className="text-xs text-gray-500">Alternative</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" />
                        Additional Medications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Nitroglycerin</span>
                            <p className="text-xs text-gray-600">Vasodilator for preload</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">0.4 mg SL</span>
                            <p className="text-xs text-yellow-600">Pending</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Morphine</span>
                            <p className="text-xs text-gray-600">Analgesic and anxiolytic</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">2-4 mg IV</span>
                            <p className="text-xs text-red-600">Not Given</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Metoprolol</span>
                            <p className="text-xs text-gray-600">Beta-blocker (if no contraindications)</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">5 mg IV</span>
                            <p className="text-xs text-gray-500">Pending</p>
                          </div>
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
                {(activeTab?.charAt(0).toUpperCase() || "") + (activeTab?.slice(1) || "")} - STEMI
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
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{caseData.title}</h1>
                <p className="text-sm text-gray-600">{caseData.specialty} • {caseData.category} • {caseData.difficulty}</p>
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
                    );
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
                  Example: "58-year-old male with acute chest pain, diaphoresis, and ST elevation..."
                </p>
              </div>
              
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
              
              {/* AI Tutor Integration */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-indigo-500" />
                  SYNAPSEMED AI Tutor
                </h3>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-sm text-indigo-800 mb-3">
                    "Based on your findings, the most likely diagnosis is Acute STEMI. 
                    Consider immediate reperfusion therapy and antiplatelet agents. 
                    Time is muscle - activate the cath lab immediately!"
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    Ask AI Tutor
                  </Button>
                </div>
              </div>
              
              {/* Final Diagnosis */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-500" />
                  Final Diagnosis & Management
                </h3>
                <Textarea
                  placeholder="Enter your final diagnosis and management plan..."
                  className="min-h-[100px] text-sm mb-3"
                  value="Acute ST-Elevation Myocardial Infarction (Inferior Wall). Immediate management includes continued antiplatelet therapy, activation of cath lab for primary PCI, and unfractionated heparin anticoagulation."
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}