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
  X,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { AIPatient } from "@/components/ai-patient";

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

export default function DKASimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingResult, setGradingResult] = useState<any>(null);
  
  // Mock case data for Diabetic Ketoacidosis
  const caseData: PatientCase = {
    id: "3",
    title: "Diabetic Ketoacidosis",
    patientAge: 19,
    patientGender: "Female",
    chiefComplaint: "Altered mental status and abdominal pain for 2 days",
    status: "active",
    timeElapsed: 1120, // seconds
    specialty: "Endocrinology",
    category: "Medical",
    difficulty: "Advanced",
    duration: "30 min",
    rating: 4.9,
    reviews: 156,
    description: "Manage a patient with type 1 diabetes presenting with altered mental status.",
    tags: ["Diabetes", "Metabolic", "Emergency", "Endocrinology"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to DKA
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Altered mental status",
      value: "Confused and disoriented",
      normal: false,
      selected: false,
      description: "Patient is confused and not oriented to time"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Dehydration",
      value: "Severe",
      normal: false,
      selected: false,
      description: "Patient appears severely dehydrated"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Kussmaul respirations",
      value: "Deep and rapid breathing",
      normal: false,
      selected: false,
      description: "Deep, labored breathing pattern"
    },
    
    // Skin
    {
      id: "f4",
      category: "skin",
      subcategory: "inspection",
      name: "Poor skin turgor",
      value: "Delayed return",
      normal: false,
      selected: false,
      description: "Skin tenting present"
    },
    {
      id: "f5",
      category: "skin",
      subcategory: "inspection",
      name: "Dry mucous membranes",
      value: "Cracked lips",
      normal: false,
      selected: false,
      description: "Mucous membranes appear dry"
    },
    
    // HEENT
    {
      id: "f6",
      category: "heent",
      subcategory: "inspection",
      name: "Sunken eyes",
      value: "Orbital hollowing",
      normal: false,
      selected: false,
      description: "Eyes appear sunken due to dehydration"
    },
    
    // Cardiac
    {
      id: "f7",
      category: "cardiac",
      subcategory: "inspection",
      name: "Tachycardia",
      value: "HR 125 bpm",
      normal: false,
      selected: false,
      description: "Heart rate elevated due to dehydration"
    },
    {
      id: "f8",
      category: "cardiac",
      subcategory: "auscultation",
      name: "Normal heart sounds",
      value: "No murmurs",
      normal: true,
      selected: false,
      description: "Heart sounds normal"
    },
    
    // Respiratory
    {
      id: "f9",
      category: "respiratory",
      subcategory: "inspection",
      name: "Kussmaul respirations",
      value: "Deep and rapid",
      normal: false,
      selected: false,
      description: "Deep, labored breathing pattern characteristic of metabolic acidosis"
    },
    {
      id: "f10",
      category: "respiratory",
      subcategory: "inspection",
      name: "Fruity breath odor",
      value: "Acetone smell",
      normal: false,
      selected: false,
      description: "Characteristic fruity or acetone-like breath odor"
    },
    
    // GI
    {
      id: "f11",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal tenderness",
      value: "Generalized",
      normal: false,
      selected: false,
      description: "Patient reports abdominal pain and tenderness"
    },
    {
      id: "f12",
      category: "gi",
      subcategory: "inspection",
      name: "Nausea and vomiting",
      value: "Active",
      normal: false,
      selected: false,
      description: "Patient has been vomiting frequently"
    },
    
    // GU
    {
      id: "f13",
      category: "gu",
      subcategory: "inspection",
      name: "Polyuria",
      value: "Frequent urination",
      normal: false,
      selected: false,
      description: "Patient reports excessive urination"
    },
    
    // Neuro
    {
      id: "f14",
      category: "neuro",
      subcategory: "inspection",
      name: "Altered mental status",
      value: "Confused",
      normal: false,
      selected: false,
      description: "Patient is confused and disoriented"
    },
    {
      id: "f15",
      category: "neuro",
      subcategory: "inspection",
      name: "Lethargy",
      value: "Decreased responsiveness",
      normal: false,
      selected: false,
      description: "Patient appears lethargic"
    },
    
    // Musculoskeletal
    {
      id: "f16",
      category: "musculoskeletal",
      subcategory: "inspection",
      name: "Generalized weakness",
      value: "Muscle weakness",
      normal: false,
      selected: false,
      description: "Patient reports generalized muscle weakness"
    },
    
    // Psych
    {
      id: "f17",
      category: "psych",
      subcategory: "inspection",
      name: "Confusion",
      value: "Disoriented to time",
      normal: false,
      selected: false,
      description: "Patient is confused and disoriented"
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
      diagnosis: "Diabetic Ketoacidosis (DKA)",
      probability: 90,
      reasoning: "Classic presentation in young patient with type 1 diabetes including altered mental status, Kussmaul respirations, abdominal pain, and fruity breath odor. Laboratory findings show hyperglycemia, ketonemia, and metabolic acidosis. Severe dehydration is evident on physical examination.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Hyperosmolar Hyperglycemic State (HHS)",
      probability: 40,
      reasoning: "Can present with altered mental status and hyperglycemia but typically without significant ketosis or acidosis. Patient's Kussmaul respirations and fruity breath odor make this less likely.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Acute Gastroenteritis",
      probability: 35,
      reasoning: "Could explain nausea, vomiting, and abdominal pain but would not typically cause altered mental status, Kussmaul respirations, or fruity breath odor. Patient's findings are more consistent with DKA.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Meningitis",
      probability: 25,
      reasoning: "Can present with altered mental status and headache but typically associated with fever and meningeal signs. Patient's metabolic findings make this less likely.",
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

  const submitDiagnosis = async () => {
    if (selectedFindings.length === 0 || !problemRepresentation || differentialDiagnoses.length === 0) {
      toast({ title: "Incomplete", description: "Please complete the diagnostic pad.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/student/simulations/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseData,
          selectedFindings,
          problemRepresentation,
          differentialDiagnoses
        })
      });

      const data = await res.json();
      if (data.success) {
        setGradingResult(data);
        toast({ title: "Case Graded!", description: `You earned ${data.xpAwarded} XP!` });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to grade diagnosis.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
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
                    <p className="font-medium">HR 125 bpm, BP 90/60 mmHg, RR 32/min, Temp 37.2°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Level of Consciousness</span>
                    <p className="font-medium">Confused and disoriented</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Young female with known type 1 diabetes presenting with 2-day history of nausea, vomiting, 
                    abdominal pain, and altered mental status. Patient is confused, dehydrated, and breathing deeply. 
                    Family reports she has not taken insulin for several days due to illness.
                  </p>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-4 text-[#213874] flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Interview Patient
                  </h3>
                  <AIPatient caseData={caseData} />
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
                    "I don't feel well. I've been throwing up for two days and my stomach hurts. 
                    I feel confused and can't think straight."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> 2 days ago with nausea and vomiting</p>
                    <p><span className="font-medium">Character:</span> Progressive abdominal pain and confusion</p>
                    <p><span className="font-medium">Radiation:</span> None</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Polyuria, polydipsia, weight loss, fruity breath odor</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Not taking insulin due to illness</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Type 1 Diabetes Mellitus (diagnosed 5 years ago)</li>
                    <li>No known drug allergies</li>
                    <li>Previous episodes of diabetic ketoacidosis</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Endocrine</h4>
                      <p className="text-gray-700">Polyuria, polydipsia, weight loss</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Gastrointestinal</h4>
                      <p className="text-gray-700">Nausea, vomiting, abdominal pain</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Neurological</h4>
                      <p className="text-gray-700">Confusion, lethargy</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Constitutional</h4>
                      <p className="text-gray-700">Dehydration, weakness</p>
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
                      <h3 className="font-medium mb-2">Blood Glucose and Ketones</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Blood Glucose</p>
                          <p className="font-medium text-red-600">650 mg/dL (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Serum Ketones</p>
                          <p className="font-medium text-red-600">Positive (↑)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Arterial Blood Gas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">pH</p>
                          <p className="font-medium text-red-600">7.22 (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaO₂</p>
                          <p className="font-medium">95 mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaCO₂</p>
                          <p className="font-medium text-red-600">28 mmHg (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HCO₃⁻</p>
                          <p className="font-medium text-red-600">12 mEq/L (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Base Excess</p>
                          <p className="font-medium text-red-600">-14 mEq/L (↓)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Electrolytes</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Sodium</p>
                          <p className="font-medium text-red-600">130 mEq/L (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Potassium</p>
                          <p className="font-medium text-red-600">5.8 mEq/L (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Chloride</p>
                          <p className="font-medium text-red-600">95 mEq/L (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">BUN/Creatinine</p>
                          <p className="font-medium text-red-600">45/2.1 mg/dL (↑)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Chest X-ray (if indicated)</h3>
                      <p className="text-gray-700">
                        May show signs of pneumonia if underlying infection triggered DKA.
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
                          <p className="font-medium text-red-600">90/60 mmHg (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium text-red-600">125 bpm (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium text-red-600">32/min (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium">98% on room air</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">37.2°C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Bedside Glucose</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Fingerstick Glucose</p>
                          <p className="font-medium text-red-600">650 mg/dL (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Urine Ketones</p>
                          <p className="font-medium text-red-600">Large (↑)</p>
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
                    defaultValue="19-year-old female with type 1 diabetes presenting with 2-day history of nausea, vomiting, abdominal pain, and altered mental status. Patient is confused, dehydrated, and breathing deeply with fruity breath odor. Laboratory findings show severe hyperglycemia (650 mg/dL), ketonemia, and metabolic acidosis (pH 7.22). Physical findings consistent with severe dehydration."
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
                      <span className="text-sm">Known type 1 diabetes with insulin omission</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Altered mental status and Kussmaul respirations</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Severe hyperglycemia and ketonemia</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Metabolic acidosis with low bicarbonate</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Signs of severe dehydration</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm">No fever or focal neurological signs</span>
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
                  <TabsTrigger value="fluids">Fluid Management</TabsTrigger>
                  <TabsTrigger value="insulin">Insulin Therapy</TabsTrigger>
                </TabsList>
                <TabsContent value="immediate" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Airway and Breathing</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Assess airway patency and need for intubation</li>
                        <li>Administer oxygen if hypoxic</li>
                        <li>Monitor for respiratory fatigue</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous cardiac monitoring</li>
                        <li>Hourly vital signs and urine output</li>
                        <li>Serial electrolytes and glucose every 2-4 hours</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Laboratory Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Repeat ABG every 2 hours until stable</li>
                        <li>Check serum ketones every 4 hours</li>
                        <li>Monitor for cerebral edema (especially in children)</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="fluids" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Fluid Resuscitation Protocol
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Based on degree of dehydration and hemodynamic status
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>0-1 hour</span>
                          <span className="text-sm font-medium">1L Normal Saline IV bolus</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>1-2 hours</span>
                          <span className="text-sm font-medium">1L Normal Saline IV</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>2-24 hours</span>
                          <span className="text-sm font-medium">0.45% Saline + 5% Dextrose</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Electrolyte Replacement
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Potassium</span>
                          <span className="text-sm font-medium">20-30 mEq/L in IV fluids when K⁺ &gt;3.3 mEq/L</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Phosphate</span>
                          <span className="text-sm font-medium">15-30 mmol/L if &lt;2.5 mg/dL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="insulin" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Insulin Therapy
                      </h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Goal: Reduce glucose by 50-75 mg/dL per hour
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Initial Bolus</span>
                          <span className="text-sm font-medium">0.1 units/kg IV</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Continuous Infusion</span>
                          <span className="text-sm font-medium">0.1 units/kg/hr IV</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Transition to Subcutaneous</span>
                          <span className="text-sm font-medium">When glucose &lt;200 mg/dL</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Adjunctive Therapies
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Bicarbonate</span>
                          <span className="text-sm font-medium">Only if pH &lt;6.9</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Antiemetics</span>
                          <span className="text-sm font-medium">Ondansetron 4mg IV PRN</span>
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
      <Navigation />
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
                <Zap className="h-5 w-5 text-white" />
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
                
                {gradingResult ? (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="text-center p-6 bg-gradient-to-br from-[#213874] to-blue-600 rounded-xl text-white">
                      <h2 className="text-4xl font-black mb-2">{gradingResult.grade.score}%</h2>
                      <p className="text-sm opacity-90 font-medium">Final Score</p>
                      <Badge className="mt-4 bg-yellow-400 text-yellow-900 border-none font-bold">
                        +{gradingResult.xpAwarded} XP Earned!
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> Strengths
                        </h4>
                        <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                          {gradingResult.grade.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>

                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> Areas for Improvement
                        </h4>
                        <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                          {gradingResult.grade.areasForImprovement.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-1">Instructor Feedback</h4>
                        <p className="text-sm text-gray-600">{gradingResult.grade.feedback}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" onClick={() => router.push('/dashboard')}>
                      Return to Dashboard
                    </Button>
                  </div>
                ) : (
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
                    <Button 
                      className="w-full" 
                      onClick={submitDiagnosis} 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Share2 className="h-4 w-4 mr-2" />}
                      {isSubmitting ? "Grading..." : "Submit Diagnosis"}
                    </Button>
                  </div>
                </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}