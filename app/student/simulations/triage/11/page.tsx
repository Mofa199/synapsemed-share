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

export default function SmallBowelObstructionSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("gi");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Small Bowel Obstruction
  const caseData: PatientCase = {
    id: "11",
    title: "Small Bowel Obstruction due to Adhesions",
    patientAge: 45,
    patientGender: "Female",
    chiefComplaint: "Abdominal pain, distension, and vomiting for 2 days",
    status: "active",
    timeElapsed: 960, // seconds
    specialty: "General Surgery",
    category: "Surgery",
    difficulty: "Advanced",
    duration: "25 min",
    rating: 4.6,
    reviews: 73,
    description: "Diagnose and manage a patient with signs of small bowel obstruction.",
    tags: ["Abdominal", "Surgery", "Obstruction", "Adhesions"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Small Bowel Obstruction
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Abdominal distension",
      value: "Marked",
      normal: false,
      selected: false,
      description: "Visible abdominal distension with tympanic percussion"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Dehydration",
      value: "Signs present",
      normal: false,
      selected: false,
      description: "Dry mucous membranes, poor skin turgor"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Cachexia",
      value: "Mild weight loss",
      normal: false,
      selected: false,
      description: "Patient appears chronically ill"
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
      description: "Signs of dehydration"
    },
    
    // HEENT
    {
      id: "f5",
      category: "heent",
      subcategory: "inspection",
      name: "Dry mucous membranes",
      value: "Cracked lips",
      normal: false,
      selected: false,
      description: "Signs of dehydration"
    },
    
    // Cardiac
    {
      id: "f6",
      category: "cardiac",
      subcategory: "inspection",
      name: "Tachycardia",
      value: "HR 110 bpm",
      normal: false,
      selected: false,
      description: "Compensatory tachycardia for dehydration"
    },
    
    // Respiratory
    {
      id: "f7",
      category: "respiratory",
      subcategory: "inspection",
      name: "Shallow breathing",
      value: "Due to abdominal distension",
      normal: false,
      selected: false,
      description: "Patient taking shallow breaths due to abdominal pressure"
    },
    
    // GI
    {
      id: "f8",
      category: "gi",
      subcategory: "inspection",
      name: "Visible peristalsis",
      value: "Active waves",
      normal: false,
      selected: false,
      description: "Visible bowel movements under skin"
    },
    {
      id: "f9",
      category: "gi",
      subcategory: "inspection",
      name: "High-pitched bowel sounds",
      value: "Hyperactive",
      normal: false,
      selected: false,
      description: "Early obstruction with hyperactive bowel sounds"
    },
    {
      id: "f10",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal tenderness",
      value: "Generalized",
      normal: false,
      selected: false,
      description: "Tenderness throughout abdomen"
    },
    {
      id: "f11",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal rigidity",
      value: "Board-like",
      normal: false,
      selected: false,
      description: "Signs of peritoneal irritation"
    },
    {
      id: "f12",
      category: "gi",
      subcategory: "inspection",
      name: "Vomiting",
      value: "Bilious",
      normal: false,
      selected: false,
      description: "Green-tinged vomitus indicating small bowel obstruction"
    },
    {
      id: "f13",
      category: "gi",
      subcategory: "inspection",
      name: "Constipation",
      value: "No bowel movement for 3 days",
      normal: false,
      selected: false,
      description: "Complete obstruction with no passage of stool or gas"
    },
    {
      id: "f14",
      category: "gi",
      subcategory: "palpation",
      name: "Abdominal mass",
      value: "Not palpable",
      normal: true,
      selected: false,
      description: "No discrete mass palpable"
    },
    {
      id: "f15",
      category: "gi",
      subcategory: "percussion",
      name: "Tympany",
      value: "Diffuse",
      normal: false,
      selected: false,
      description: "Drum-like sound indicating gas-filled bowel loops"
    },
    
    // GU
    {
      id: "f16",
      category: "gu",
      subcategory: "inspection",
      name: "Oliguria",
      value: "Decreased urine output",
      normal: false,
      selected: false,
      description: "Signs of dehydration and prerenal failure"
    },
    
    // Neuro
    {
      id: "f17",
      category: "neuro",
      subcategory: "inspection",
      name: "Lethargy",
      value: "Mild",
      normal: false,
      selected: false,
      description: "Patient appears tired and weak"
    },
    
    // Musculoskeletal
    {
      id: "f18",
      category: "musculoskeletal",
      subcategory: "inspection",
      name: "Abdominal guarding",
      value: "Involuntary",
      normal: false,
      selected: false,
      description: "Protective muscle contraction"
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
    { id: "musculoskeletal", label: "Musculoskeletal", icon: Bone, color: "text-pink-500" }
  ];

  // Mock differential diagnoses
  const initialDifferentialDiagnoses: DiagnosticEntry[] = [
    {
      id: "d1",
      diagnosis: "Small Bowel Obstruction (Adhesive)",
      probability: 80,
      reasoning: "Classic presentation with abdominal pain, distension, vomiting, and constipation. History of prior abdominal surgery (cesarean section) with adhesion formation. Physical findings of abdominal distension, high-pitched bowel sounds, and tympany on percussion. Bilious vomiting indicates small bowel obstruction. Patient's age, gender, and surgical history are consistent with adhesive bowel obstruction being the most common cause in adults.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Large Bowel Obstruction",
      probability: 35,
      reasoning: "Can present with abdominal pain and distension but typically has less vomiting and more constipation. Abdominal distension is usually more prominent in the lower abdomen. Patient's bilious vomiting and high-pitched bowel sounds favor small bowel obstruction.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Gastroenteritis",
      probability: 30,
      reasoning: "Can cause vomiting and abdominal pain but would typically have diarrhea rather than constipation. Patient's absence of diarrhea and presence of abdominal distension make obstruction more likely.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Paralytic Ileus",
      probability: 25,
      reasoning: "Can present with similar symptoms but typically has absent bowel sounds rather than hyperactive ones. Patient's high-pitched bowel sounds and visible peristalsis indicate mechanical rather than paralytic obstruction.",
      position: 4
    },
    {
      id: "d5",
      diagnosis: "Volvulus",
      probability: 20,
      reasoning: "Can cause small bowel obstruction but typically has more acute onset and severe pain. Patient's more gradual onset and history of prior surgery make adhesive obstruction more likely.",
      position: 5
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
                    <p className="font-medium">HR 110 bpm, BP 100/70 mmHg, RR 22/min, O2 Sat 96%, Temp 37.8°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Pain Scale</span>
                    <p className="font-medium">7/10 cramping abdominal pain</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Middle-aged female presenting with 2-day history of abdominal pain, distension, 
                    and bilious vomiting. No passage of stool or gas. History of prior cesarean section. 
                    Patient appears dehydrated with abdominal distension and high-pitched bowel sounds. 
                    Classic presentation of small bowel obstruction, likely adhesive in nature. 
                    ABC assessment shows tachycardia and mild hypotension from dehydration.
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
                    "I've had bad belly pain for the past 2 days. My stomach is really swollen 
                    and I've been throwing up green stuff. I haven't had a bowel movement in days."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> 2 days ago, cramping abdominal pain</p>
                    <p><span className="font-medium">Character:</span> Intermittent cramping pain, increasing in severity</p>
                    <p><span className="font-medium">Radiation:</span> Generalized abdominal pain</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Abdominal distension, bilious vomiting, no passage of stool or gas</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Movement, eating</p>
                    <p><span className="font-medium">Timing:</span> Pain progressively worsening over 2 days</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Cesarean section 5 years ago</li>
                    <li>No other abdominal surgeries</li>
                    <li>No known drug allergies</li>
                    <li>No family history of gastrointestinal disorders</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Gastrointestinal</h4>
                      <p className="text-gray-700">Abdominal pain, distension, bilious vomiting, constipation</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Genitourinary</h4>
                      <p className="text-gray-700">Decreased urine output</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Constitutional</h4>
                      <p className="text-gray-700">Fever, chills, weight loss</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Other Systems</h4>
                      <p className="text-gray-700">No respiratory, cardiac, or neurological symptoms</p>
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
                          <p className="font-medium text-red-600">13,200/μL (↑, normal 4,000-11,000)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium text-red-600">11.8 g/dL (↓, normal 12-15 g/dL)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium text-red-600">35% (↓, normal 36-46%)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">310,000/μL</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Leukocytosis suggests inflammation or infection. 
                        Anemia may be due to chronic disease or dehydration.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Comprehensive Metabolic Panel</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Na⁺</p>
                          <p className="font-medium text-red-600">132 mEq/L (↓, normal 135-145)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">K⁺</p>
                          <p className="font-medium text-red-600">3.2 mEq/L (↓, normal 3.5-5.0)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cl⁻</p>
                          <p className="font-medium text-red-600">95 mEq/L (↓, normal 98-107)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CO₂</p>
                          <p className="font-medium">18 mEq/L (↓, normal 22-29)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">BUN</p>
                          <p className="font-medium text-red-600">32 mg/dL (↑, normal 7-20)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cr</p>
                          <p className="font-medium text-red-600">1.4 mg/dL (↑, normal 0.6-1.2)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Glu</p>
                          <p className="font-medium">112 mg/dL</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Electrolyte imbalances consistent with dehydration and vomiting. 
                        Prerenal failure indicated by elevated BUN/Cr ratio.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Arterial Blood Gas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">pH</p>
                          <p className="font-medium text-red-600">7.32 (↓, normal 7.35-7.45)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaO₂</p>
                          <p className="font-medium">85 mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaCO₂</p>
                          <p className="font-medium">42 mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HCO₃⁻</p>
                          <p className="font-medium text-red-600">18 mEq/L (↓, normal 22-26)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Base Excess</p>
                          <p className="font-medium text-red-600">-6 mEq/L (↓)</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Metabolic acidosis with compensatory respiratory response. 
                        Consistent with dehydration and possible bowel ischemia.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">CT Abdomen/Pelvis with Contrast</h3>
                      <p className="text-gray-700 mb-3">
                        Gold standard for diagnosing bowel obstruction. Shows dilated small bowel loops 
                        with transition point, air-fluid levels, and collapsed distal bowel.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">CT Abdomen/Pelvis Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: Multiple dilated small bowel loops (&gt;2.5cm diameter) in left upper quadrant 
                        with collapsed loops in pelvis. Transition point at mid-small bowel with adhesions. 
                        No evidence of bowel wall thickening or pneumatosis.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">KUB (Kidneys, Ureters, Bladder) X-ray</h3>
                      <p className="text-gray-700 mb-3">
                        May show air-fluid levels and dilated bowel loops but less sensitive than CT. 
                        Can help identify transition point and severity of obstruction.
                      </p>
                      <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                        <span className="text-gray-500">KUB X-ray Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: Multiple air-fluid levels throughout abdomen. 
                        Dilated small bowel loops with no gas in colon. 
                        No free air under diaphragm.
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
                          <p className="font-medium text-red-600">100/70 mmHg (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium text-red-600">110 bpm (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium text-red-600">22/min (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium">96% on room air</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium text-red-600">37.8°C (100.0°F) (↑)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Abdominal Exam Findings</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Inspection</p>
                          <p className="font-medium text-red-600">Marked abdominal distension</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Auscultation</p>
                          <p className="font-medium text-red-600">High-pitched bowel sounds</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Percussion</p>
                          <p className="font-medium text-red-600">Tympany throughout</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Palpation</p>
                          <p className="font-medium text-red-600">Tenderness and guarding</p>
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
                    value="45-year-old female with 2-day history of cramping abdominal pain, distension, bilious vomiting, and constipation. History of prior cesarean section. Physical exam reveals marked abdominal distension, high-pitched bowel sounds, and tympany on percussion. Labs show leukocytosis, electrolyte imbalances, and metabolic acidosis. CT imaging confirms small bowel obstruction with transition point consistent with adhesive etiology. Classic presentation of adhesive small bowel obstruction."
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
                      <span className="text-sm">Abdominal pain, distension, vomiting, constipation</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">History of prior abdominal surgery</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">High-pitched bowel sounds</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Bilious vomiting</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Abdominal distension with tympany</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Leukocytosis and electrolyte imbalances</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">CT showing dilated small bowel loops</span>
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
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="surgical">Surgical Plan</TabsTrigger>
                </TabsList>
                <TabsContent value="acute" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Immediate Priorities</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Establish large-bore IV access and begin fluid resuscitation</li>
                        <li>Insert nasogastric tube for decompression</li>
                        <li>Insert urinary catheter for monitoring</li>
                        <li>Correct electrolyte imbalances</li>
                        <li>Obtain surgical consultation</li>
                        <li>Keep patient NPO (nothing by mouth)</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Serial abdominal examinations</li>
                        <li>Frequent vital signs and urine output</li>
                        <li>Serial laboratory studies</li>
                        <li>Watch for signs of bowel ischemia or perforation</li>
                        <li>Assess response to conservative management</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Surgical Indications</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Signs of bowel ischemia or perforation</li>
                        <li>Failure to improve with conservative management</li>
                        <li>Complete mechanical obstruction</li>
                        <li>Suspected strangulation</li>
                        <li>Peritonitis</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        IV Fluids
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Resuscitation</span>
                          <span className="text-sm font-medium">Normal saline 1-2L bolus</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Maintenance</span>
                          <span className="text-sm font-medium">Lactated Ringer's at maintenance rate</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Electrolyte Replacement
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Potassium</span>
                          <span className="text-sm font-medium">20-40 mEq/L in IV fluids</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Sodium</span>
                          <span className="text-sm font-medium">Replace based on deficit</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Symptomatic Treatment
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Anti-emetics</span>
                          <span className="text-sm font-medium">Ondansetron 4mg IV PRN</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Pain Control</span>
                          <span className="text-sm font-medium">Avoid narcotics if possible to prevent ileus</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="surgical" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" />
                        Surgical Options
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Exploratory Laparotomy</span>
                          <span className="text-sm font-medium">Open approach for adhesiolysis</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Laparoscopic Approach</span>
                          <span className="text-sm font-medium">Minimally invasive adhesiolysis (if feasible)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Postoperative Care
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Recovery</span>
                          <span className="text-sm font-medium">PACU monitoring until stable</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Diet</span>
                          <span className="text-sm font-medium">Advance as tolerated postoperatively</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Activity</span>
                          <span className="text-sm font-medium">Early ambulation encouraged</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Prevention</span>
                          <span className="text-sm font-medium">Minimize future adhesion formation</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Complications to Monitor
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Intraoperative</span>
                          <span className="text-sm font-medium">Bowel injury, bleeding</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Postoperative</span>
                          <span className="text-sm font-medium">Wound infection, ileus, recurrent obstruction</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Delayed</span>
                          <span className="text-sm font-medium">Adhesion formation, short bowel syndrome</span>
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