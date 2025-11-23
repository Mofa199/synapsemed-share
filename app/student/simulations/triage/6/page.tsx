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

export default function OrganophosphateSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Organophosphate Poisoning
  const caseData: PatientCase = {
    id: "6",
    title: "Organophosphate Poisoning",
    patientAge: 35,
    patientGender: "Male",
    chiefComplaint: "Excessive salivation, lacrimation, and muscle twitching after pesticide exposure",
    status: "active",
    timeElapsed: 640, // seconds
    specialty: "Toxicology",
    category: "Toxicology",
    difficulty: "Advanced",
    duration: "25 min",
    rating: 4.8,
    reviews: 76,
    description: "Manage a patient with cholinergic crisis after pesticide exposure.",
    tags: ["Toxicology", "Poisoning", "Emergency", "Antidotes"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Organophosphate Poisoning
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
      description: "Patient is visibly sweating profusely"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Muscle fasciculations",
      value: "Generalized twitching",
      normal: false,
      selected: false,
      description: "Visible muscle twitching throughout the body"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Restlessness",
      value: "Agitated appearance",
      normal: false,
      selected: false,
      description: "Patient appears agitated and restless"
    },
    
    // Skin
    {
      id: "f4",
      category: "skin",
      subcategory: "inspection",
      name: "Diaphoresis",
      value: "Excessive sweating",
      normal: false,
      selected: false,
      description: "Skin is wet with perspiration"
    },
    
    // HEENT
    {
      id: "f5",
      category: "heent",
      subcategory: "inspection",
      name: "Miosis",
      value: "Pinpoint pupils",
      normal: false,
      selected: false,
      description: "Constricted pupils, unresponsive to light"
    },
    {
      id: "f6",
      category: "heent",
      subcategory: "inspection",
      name: "Excessive salivation",
      value: "Drooling",
      normal: false,
      selected: false,
      description: "Profuse oral secretions"
    },
    {
      id: "f7",
      category: "heent",
      subcategory: "inspection",
      name: "Lacrimation",
      value: "Tearing",
      normal: false,
      selected: false,
      description: "Excessive tearing from eyes"
    },
    {
      id: "f8",
      category: "heent",
      subcategory: "inspection",
      name: "Rhinorrhea",
      value: "Runny nose",
      normal: false,
      selected: false,
      description: "Excessive nasal secretions"
    },
    
    // Cardiac
    {
      id: "f9",
      category: "cardiac",
      subcategory: "inspection",
      name: "Bradycardia",
      value: "HR 50 bpm",
      normal: false,
      selected: false,
      description: "Slow heart rate due to cholinergic stimulation"
    },
    
    // Respiratory
    {
      id: "f10",
      category: "respiratory",
      subcategory: "inspection",
      name: "Increased bronchial secretions",
      value: "Wet breath sounds",
      normal: false,
      selected: false,
      description: "Excessive respiratory secretions"
    },
    {
      id: "f11",
      category: "respiratory",
      subcategory: "inspection",
      name: "Bronchospasm",
      value: "Wheezing",
      normal: false,
      selected: false,
      description: "Narrowing of airways causing wheezing"
    },
    {
      id: "f12",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Crackles",
      value: "Fine crackles bilaterally",
      normal: false,
      selected: false,
      description: "Fine crackles due to secretions"
    },
    
    // GI
    {
      id: "f13",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal cramping",
      value: "Severe pain",
      normal: false,
      selected: false,
      description: "Severe abdominal pain and cramping"
    },
    {
      id: "f14",
      category: "gi",
      subcategory: "inspection",
      name: "Nausea and vomiting",
      value: "Active",
      normal: false,
      selected: false,
      description: "Patient has been vomiting repeatedly"
    },
    {
      id: "f15",
      category: "gi",
      subcategory: "inspection",
      name: "Diarrhea",
      value: "Watery stools",
      normal: false,
      selected: false,
      description: "Frequent watery bowel movements"
    },
    
    // GU
    {
      id: "f16",
      category: "gu",
      subcategory: "inspection",
      name: "Urinary incontinence",
      value: "Loss of bladder control",
      normal: false,
      selected: false,
      description: "Involuntary urination"
    },
    
    // Neuro
    {
      id: "f17",
      category: "neuro",
      subcategory: "inspection",
      name: "Altered mental status",
      value: "Confusion",
      normal: false,
      selected: false,
      description: "Patient is confused and disoriented"
    },
    {
      id: "f18",
      category: "neuro",
      subcategory: "inspection",
      name: "Seizures",
      value: "Generalized tonic-clonic",
      normal: false,
      selected: false,
      description: "Patient experienced seizures"
    },
    {
      id: "f19",
      category: "neuro",
      subcategory: "inspection",
      name: "Muscle weakness",
      value: "Generalized",
      normal: false,
      selected: false,
      description: "Progressive muscle weakness"
    },
    
    // Psych
    {
      id: "f20",
      category: "psych",
      subcategory: "inspection",
      name: "Anxiety",
      value: "Severe",
      normal: false,
      selected: false,
      description: "Patient is extremely anxious"
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
      diagnosis: "Organophosphate Poisoning (Cholinergic Crisis)",
      probability: 90,
      reasoning: "Classic presentation with SLUDGE symptoms (Salivation, Lacrimation, Urination, Defecation, Gastric upset, Emesis) and muscarinic, nicotinic, and CNS effects. Patient has pinpoint pupils, excessive secretions, bradycardia, muscle fasciculations, and altered mental status after pesticide exposure. The constellation of cholinergic symptoms makes organophosphate poisoning highly likely.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Carbamate Poisoning",
      probability: 45,
      reasoning: "Can present with similar cholinergic symptoms but typically has shorter duration of action and less severe nicotinic effects. Patient's persistent symptoms and muscle fasciculations make organophosphate more likely.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Nerve Agent Exposure",
      probability: 35,
      reasoning: "Military or terrorist exposure to nerve agents can cause identical symptoms but would typically have a more rapid onset and severe progression. Patient's history of pesticide exposure makes this less likely.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Cholinergic Overdose (Physostigmine)",
      probability: 20,
      reasoning: "Can cause similar symptoms but would require a history of medication use. Patient's history of pesticide exposure makes organophosphate poisoning more likely.",
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
                    <p className="font-medium">HR 50 bpm, BP 110/70 mmHg, RR 30/min, O2 Sat 88%, Temp 37.2°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Pupils</span>
                    <p className="font-medium">Pinpoint, non-reactive</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Young male farm worker presenting with cholinergic crisis after pesticide exposure. 
                    Patient is diaphoretic, salivating profusely, and experiencing muscle twitching. 
                    History of working with organophosphate pesticides without proper protective equipment. 
                    Classic SLUDGE symptoms with muscarinic, nicotinic, and CNS effects. 
                    Immediate antidotal therapy required.
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
                    "I can't stop drooling and I feel like I'm going to die. 
                    My muscles are twitching all over and I can't catch my breath."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> 2 hours after pesticide application</p>
                    <p><span className="font-medium">Character:</span> Rapid onset of SLUDGE symptoms</p>
                    <p><span className="font-medium">Radiation:</span> None</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Muscle twitching, difficulty breathing, confusion</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Continued exposure to pesticides</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Healthy young adult</li>
                    <li>No known drug allergies</li>
                    <li>Occupational exposure to pesticides</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Neurological</h4>
                      <p className="text-gray-700">Muscle twitching, confusion, seizures</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Respiratory</h4>
                      <p className="text-gray-700">Increased secretions, wheezing, dyspnea</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">GI</h4>
                      <p className="text-gray-700">Nausea, vomiting, diarrhea, abdominal cramping</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cardiovascular</h4>
                      <p className="text-gray-700">Bradycardia</p>
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
                      <h3 className="font-medium mb-2">Cholinesterase Levels</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Plasma cholinesterase</p>
                          <p className="font-medium text-red-600">2000 U/L (↓, normal 4000-12000)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RBC cholinesterase</p>
                          <p className="font-medium text-red-600">1500 U/L (↓, normal 6000-18000)</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Markedly depressed cholinesterase activity confirms organophosphate poisoning
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Arterial Blood Gas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">pH</p>
                          <p className="font-medium">7.32</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaO₂</p>
                          <p className="font-medium text-red-600">60 mmHg (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaCO₂</p>
                          <p className="font-medium text-red-600">50 mmHg (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HCO₃⁻</p>
                          <p className="font-medium">24 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">SaO₂</p>
                          <p className="font-medium text-red-600">88% (↓)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Electrolytes</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Sodium</p>
                          <p className="font-medium">138 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Potassium</p>
                          <p className="font-medium">4.2 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Chloride</p>
                          <p className="font-medium">102 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CO₂</p>
                          <p className="font-medium">24 mEq/L</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Chest X-ray</h3>
                      <p className="text-gray-700 mb-3">
                        Bilateral pulmonary edema due to excessive bronchial secretions. 
                        No evidence of aspiration or pneumonia.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">Chest X-ray Image Placeholder</span>
                      </div>
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
                          <p className="font-medium">110/70 mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium text-red-600">50 bpm (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium text-red-600">30/min (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium text-red-600">88% on room air (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">37.2°C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Neurological Assessment</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">GCS</p>
                          <p className="font-medium">13 (E3 V4 M6)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pupils</p>
                          <p className="font-medium text-red-600">Pinpoint, non-reactive</p>
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
                    value="35-year-old male farm worker presenting with cholinergic crisis 2 hours after pesticide exposure. Classic SLUDGE symptoms including salivation, lacrimation, urination, defecation, gastric upset, and emesis. Physical findings include pinpoint pupils, bradycardia, excessive secretions, muscle fasciculations, and altered mental status. Cholinesterase levels markedly depressed confirming organophosphate poisoning."
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
                      <span className="text-sm">SLUDGE symptoms (Salivation, Lacrimation, Urination, Defecation, Gastric upset, Emesis)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Pinpoint pupils and bradycardia (muscarinic effects)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Muscle fasciculations and weakness (nicotinic effects)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Altered mental status and seizures (CNS effects)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">History of organophosphate exposure</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Markedly depressed cholinesterase levels</span>
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
              <Tabs defaultValue="acute">
                <TabsList>
                  <TabsTrigger value="acute">Acute Management</TabsTrigger>
                  <TabsTrigger value="antidotes">Antidotes</TabsTrigger>
                  <TabsTrigger value="supportive">Supportive Care</TabsTrigger>
                </TabsList>
                <TabsContent value="acute" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Immediate Priorities</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Ensure airway patency and consider intubation</li>
                        <li>Administer oxygen and monitor oxygenation</li>
                        <li>Establish IV access</li>
                        <li>Remove contaminated clothing and decontaminate skin</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Decontamination</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Remove all contaminated clothing</li>
                        <li>Wash skin thoroughly with soap and water</li>
                        <li>Flush eyes with saline</li>
                        <li>Prevent further absorption</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous cardiac monitoring</li>
                        <li>Frequent neurological assessments</li>
                        <li>Serial cholinesterase levels</li>
                        <li>Respiratory status and oxygenation</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="antidotes" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Antidotal Therapy
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Atropine</span>
                          <span className="text-sm font-medium">2-5mg IV bolus, repeat every 5-10 min until secretions dry</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Pralidoxime (2-PAM)</span>
                          <span className="text-sm font-medium">1-2g IV over 15-30 min, then 0.5-1g/hr infusion</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Atropine Dosing Guidelines
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Mild poisoning</span>
                          <span className="text-sm font-medium">2-5mg IV bolus</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Moderate poisoning</span>
                          <span className="text-sm font-medium">5-10mg IV bolus</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Severe poisoning</span>
                          <span className="text-sm font-medium">10-50mg IV bolus</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Goal: Dry secretions and sinus tachycardia (&gt;80 bpm)
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Pralidoxime (2-PAM) Guidelines
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Indication</span>
                          <span className="text-sm font-medium">Nicotinic effects (muscle weakness, fasciculations)</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Timing</span>
                          <span className="text-sm font-medium">Most effective within 24-48 hours of exposure</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Contraindications</span>
                          <span className="text-sm font-medium">Carbamate poisoning (may worsen)</span>
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
                        Respiratory Support
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Mechanical ventilation</span>
                          <span className="text-sm font-medium">Consider early for respiratory failure</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Suctioning</span>
                          <span className="text-sm font-medium">Frequent suctioning of secretions</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Bronchodilators</span>
                          <span className="text-sm font-medium">May help with bronchospasm</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Complications to Monitor
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Intermediate syndrome</span>
                          <span className="text-sm font-medium">Muscle weakness 24-96 hours post-exposure</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Delayed neuropathy</span>
                          <span className="text-sm font-medium">May occur 1-3 weeks after exposure</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Recurrent symptoms</span>
                          <span className="text-sm font-medium">Due to redistribution of organophosphate</span>
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
                <Activity className="h-5 w-5 text-white" />
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