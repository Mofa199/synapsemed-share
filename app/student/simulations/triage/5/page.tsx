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

export default function CHFSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("cardiac");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Congestive Heart Failure
  const caseData: PatientCase = {
    id: "5",
    title: "Congestive Heart Failure due to Hypertension",
    patientAge: 72,
    patientGender: "Female",
    chiefComplaint: "Progressive dyspnea and bilateral leg swelling for 1 week",
    status: "active",
    timeElapsed: 980, // seconds
    specialty: "Cardiology",
    category: "Medical",
    difficulty: "Intermediate",
    duration: "22 min",
    rating: 4.5,
    reviews: 87,
    description: "Manage a patient with progressive dyspnea and bilateral leg swelling.",
    tags: ["Cardiology", "Heart Failure", "Hypertension"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to CHF
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Dyspnea",
      value: "Moderate difficulty breathing",
      normal: false,
      selected: false,
      description: "Patient reports shortness of breath, especially with exertion"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Orthopnea",
      value: "Needs 3 pillows to sleep",
      normal: false,
      selected: false,
      description: "Patient requires multiple pillows to sleep comfortably"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Paroxysmal nocturnal dyspnea",
      value: "Wakes up breathless at night",
      normal: false,
      selected: false,
      description: "Patient wakes up gasping for air during the night"
    },
    
    // Skin
    {
      id: "f4",
      category: "skin",
      subcategory: "inspection",
      name: "Cool extremities",
      value: "Reduced peripheral perfusion",
      normal: false,
      selected: false,
      description: "Hands and feet feel cool to touch"
    },
    
    // HEENT
    {
      id: "f5",
      category: "heent",
      subcategory: "inspection",
      name: "Jugular venous distension",
      value: "Elevated to angle of jaw",
      normal: false,
      selected: false,
      description: "Elevated jugular venous pressure"
    },
    
    // Cardiac
    {
      id: "f6",
      category: "cardiac",
      subcategory: "inspection",
      name: "Displaced apex beat",
      value: "Laterally displaced PMI",
      normal: false,
      selected: false,
      description: "Apex beat displaced laterally due to cardiac enlargement"
    },
    {
      id: "f7",
      category: "cardiac",
      subcategory: "palpation",
      name: "Heave",
      value: "Left ventricular heave",
      normal: false,
      selected: false,
      description: "Palpable left ventricular impulse"
    },
    {
      id: "f8",
      category: "cardiac",
      subcategory: "auscultation",
      name: "S3 gallop",
      value: "Present at apex",
      normal: false,
      selected: false,
      description: "Third heart sound indicating volume overload"
    },
    {
      id: "f9",
      category: "cardiac",
      subcategory: "auscultation",
      name: "Mitral regurgitation murmur",
      value: "3/6 holosystolic",
      normal: false,
      selected: false,
      description: "Holosystolic murmur at apex radiating to axilla"
    },
    
    // Respiratory
    {
      id: "f10",
      category: "respiratory",
      subcategory: "inspection",
      name: "Increased work of breathing",
      value: "Accessory muscle use",
      normal: false,
      selected: false,
      description: "Patient using accessory muscles to breathe"
    },
    {
      id: "f11",
      category: "respiratory",
      subcategory: "inspection",
      name: "Bilateral crackles",
      value: "Fine crackles at lung bases",
      normal: false,
      selected: false,
      description: "Fine crackles heard at lung bases bilaterally"
    },
    {
      id: "f12",
      category: "respiratory",
      subcategory: "percussion",
      name: "Dullness to percussion",
      value: "Bases bilaterally",
      normal: false,
      selected: false,
      description: "Dull percussion notes at lung bases bilaterally"
    },
    {
      id: "f13",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Bilateral crackles",
      value: "Fine crackles",
      normal: false,
      selected: false,
      description: "Fine crackles bilaterally, more prominent at bases"
    },
    
    // GI
    {
      id: "f14",
      category: "gi",
      subcategory: "inspection",
      name: "Hepatomegaly",
      value: "3 cm below costal margin",
      normal: false,
      selected: false,
      description: "Enlarged liver palpable below costal margin"
    },
    
    // GU
    {
      id: "f15",
      category: "gu",
      subcategory: "inspection",
      name: "Oliguria",
      value: "Decreased urine output",
      normal: false,
      selected: false,
      description: "Patient reports decreased urine production"
    },
    
    // Neuro
    {
      id: "f16",
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
      id: "f17",
      category: "musculoskeletal",
      subcategory: "inspection",
      name: "Bilateral pitting edema",
      value: "3+ pitting edema",
      normal: false,
      selected: false,
      description: "Severe pitting edema bilaterally in lower extremities"
    },
    
    // Psych
    {
      id: "f18",
      category: "psych",
      subcategory: "inspection",
      name: "Anxious",
      value: "Worried about symptoms",
      normal: false,
      selected: false,
      description: "Patient appears anxious about breathing difficulty"
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
      diagnosis: "Congestive Heart Failure (Systolic Dysfunction)",
      probability: 85,
      reasoning: "Classic presentation in elderly patient with hypertension including progressive dyspnea, orthopnea, paroxysmal nocturnal dyspnea, bilateral crackles, elevated JVP, S3 gallop, and bilateral pitting edema. History of long-standing hypertension suggests hypertensive cardiomyopathy as underlying cause. Physical findings consistent with volume overload and decreased cardiac output.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Chronic Obstructive Pulmonary Disease (COPD) Exacerbation",
      probability: 40,
      reasoning: "Can present with dyspnea and crackles but would typically have history of smoking and chronic respiratory symptoms. Patient's cardiac findings (elevated JVP, S3, peripheral edema) make CHF more likely.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Pulmonary Embolism",
      probability: 30,
      reasoning: "Can cause acute dyspnea but typically presents with pleuritic chest pain, tachycardia, and hypoxemia. Patient's chronic progressive symptoms and cardiac findings make this less likely.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Pleural Effusion",
      probability: 25,
      reasoning: "Can cause dyspnea and crackles but would not typically cause elevated JVP, peripheral edema, or S3 gallop. Patient's constellation of findings is more consistent with CHF.",
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
                    <p className="font-medium">HR 110 bpm, BP 160/95 mmHg, RR 22/min, O2 Sat 92%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Functional Class</span>
                    <p className="font-medium">NYHA Class III</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Elderly female with 1-week history of progressive dyspnea and bilateral leg swelling. 
                    Patient reports increasing difficulty with activities of daily living and requires multiple 
                    pillows to sleep. History of long-standing hypertension with poor medication compliance. 
                    Physical findings consistent with volume overload and decreased cardiac output.
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
                    "I've been getting more and more short of breath over the past week. 
                    My legs are swollen and I can barely walk. I have to sleep sitting up 
                    because I can't breathe when I lie down."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> Gradual onset over 1 week</p>
                    <p><span className="font-medium">Character:</span> Progressive dyspnea and leg swelling</p>
                    <p><span className="font-medium">Radiation:</span> None</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Orthopnea, PND, fatigue, decreased exercise tolerance</p>
                    <p><span className="font-medium">Alleviating Factors:</span> Diuretics (when taken)</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Non-compliance with medications</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Hypertension (20 years)</li>
                    <li>Hyperlipidemia</li>
                    <li>Diabetes Mellitus Type 2</li>
                    <li>Previous MI 5 years ago</li>
                    <li>No known drug allergies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Cardiovascular</h4>
                      <p className="text-gray-700">Dyspnea, orthopnea, PND, leg swelling</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Respiratory</h4>
                      <p className="text-gray-700">Shortness of breath, no cough or wheezing</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">GI</h4>
                      <p className="text-gray-700">Early satiety, abdominal fullness</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">GU</h4>
                      <p className="text-gray-700">Decreased urine output</p>
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
              <Tabs defaultValue="imaging">
                <TabsList>
                  <TabsTrigger value="imaging">Imaging</TabsTrigger>
                  <TabsTrigger value="labs">Laboratory Tests</TabsTrigger>
                  <TabsTrigger value="bedside">Bedside Tests</TabsTrigger>
                </TabsList>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Chest X-ray (PA View)</h3>
                      <p className="text-gray-700 mb-3">
                        Cardiomegaly with cardiothoracic ratio &gt;0.5. 
                        Bilateral pulmonary edema with Kerley B lines. 
                        Small bilateral pleural effusions.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">Chest X-ray Image Placeholder</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Echocardiogram</h3>
                      <p className="text-gray-700 mb-3">
                        Left ventricular ejection fraction 35% (severely reduced). 
                        Left ventricular hypertrophy. 
                        Mild mitral regurgitation. 
                        Elevated left atrial pressure.
                      </p>
                      <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                        <span className="text-gray-500">Echo Image Placeholder</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="labs" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">BNP/NT-proBNP</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">BNP</p>
                          <p className="font-medium text-red-600">1200 pg/mL (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">NT-proBNP</p>
                          <p className="font-medium text-red-600">8500 pg/mL (↑)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Renal Function</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Creatinine</p>
                          <p className="font-medium text-red-600">2.1 mg/dL (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">BUN</p>
                          <p className="font-medium text-red-600">45 mg/dL (↑)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Electrolytes</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Sodium</p>
                          <p className="font-medium">135 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Potassium</p>
                          <p className="font-medium text-red-600">5.2 mEq/L (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Chloride</p>
                          <p className="font-medium">98 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CO₂</p>
                          <p className="font-medium">24 mEq/L</p>
                        </div>
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
                          <p className="font-medium text-red-600">160/95 mmHg (↑)</p>
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
                          <p className="font-medium text-red-600">92% on room air (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">37.0°C</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Weight</p>
                          <p className="font-medium text-red-600">82 kg (↑5 kg from baseline)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">ECG</h3>
                      <p className="text-gray-700">
                        Sinus tachycardia. Left ventricular hypertrophy pattern. 
                        Non-specific ST-T wave changes. No acute ischemic changes.
                      </p>
                      <div className="bg-gray-100 h-24 rounded flex items-center justify-center mt-2">
                        <span className="text-gray-500">ECG Image Placeholder</span>
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
                    value="72-year-old female with 1-week history of progressive dyspnea, orthopnea, and bilateral leg swelling. History of long-standing hypertension and previous MI. Physical findings consistent with volume overload including elevated JVP, S3 gallop, bilateral crackles, and 3+ pitting edema. Echocardiogram shows severely reduced EF (35%) with LVH. Elevated BNP levels confirm heart failure."
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
                      <span className="text-sm">Classic heart failure symptoms (dyspnea, orthopnea, PND)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Volume overload signs (JVD, S3, crackles, edema)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">History of hypertension and previous MI</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Elevated BNP and reduced EF on echo</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Recent weight gain</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm">No chest pain or acute ischemic ECG changes</span>
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
                  <TabsTrigger value="longterm">Long-term Care</TabsTrigger>
                </TabsList>
                <TabsContent value="acute" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Immediate Interventions</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Position patient upright to reduce preload</li>
                        <li>Administer oxygen to maintain SpO₂ &gt; 90%</li>
                        <li>Establish IV access</li>
                        <li>Continuous cardiac monitoring</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Hourly vital signs and urine output</li>
                        <li>Daily weights</li>
                        <li>Serial electrolytes and renal function</li>
                        <li>Response to diuretic therapy</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Goals of Therapy</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Relieve congestion symptoms</li>
                        <li>Improve exercise tolerance</li>
                        <li>Reduce hospitalizations</li>
                        <li>Improve survival</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Guideline-Directed Medical Therapy (GDMT)
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>ACE Inhibitor</span>
                          <span className="text-sm font-medium">Lisinopril 5mg daily</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Beta-blocker</span>
                          <span className="text-sm font-medium">Carvedilol 3.125mg BID</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Mineralocorticoid receptor antagonist</span>
                          <span className="text-sm font-medium">Spironolactone 12.5mg daily</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Diuretic</span>
                          <span className="text-sm font-medium">Furosemide 40mg IV BID</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Acute Diuretic Therapy
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Loop diuretic</span>
                          <span className="text-sm font-medium">Furosemide 40-80mg IV</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Dosing strategy</span>
                          <span className="text-sm font-medium">BID or continuous infusion</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Monitoring</span>
                          <span className="text-sm font-medium">Urine output, weight, electrolytes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="longterm" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" />
                        Device Therapy
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Implantable cardioverter-defibrillator (ICD)</span>
                          <span className="text-sm font-medium">Consider for EF &lt;35% despite GDMT</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Cardiac resynchronization therapy (CRT)</span>
                          <span className="text-sm font-medium">Consider for LBBB and QRS &gt;150ms</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Lifestyle Modifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Sodium restriction</span>
                          <span className="text-sm font-medium">&lt;2g daily</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Fluid restriction</span>
                          <span className="text-sm font-medium">1.5-2L daily if hyponatremic</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Weight monitoring</span>
                          <span className="text-sm font-medium">Daily weights, call if &gt;2kg in 3 days</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Exercise training</span>
                          <span className="text-sm font-medium">Supervised program when stable</span>
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
                <Heart className="h-5 w-5 text-white" />
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