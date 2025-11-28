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

export default function AppendicitisSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("gi");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Appendicitis
  const caseData: PatientCase = {
    id: "10",
    title: "Acute Appendicitis (Adult)",
    patientAge: 24,
    patientGender: "Male",
    chiefComplaint: "Abdominal pain for 12 hours with nausea and fever",
    status: "active",
    timeElapsed: 820, // seconds
    specialty: "General Surgery",
    category: "Surgery",
    difficulty: "Intermediate",
    duration: "18 min",
    rating: 4.7,
    reviews: 87,
    description: "Diagnose and manage a patient with right lower quadrant abdominal pain.",
    tags: ["Abdominal", "Surgery", "Diagnosis", "Appendicitis"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Appendicitis
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Fever",
      value: "38.4°C (101.1°F)",
      normal: false,
      selected: false,
      description: "Low-grade fever consistent with infection"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Guarding",
      value: "Right lower quadrant",
      normal: false,
      selected: false,
      description: "Involuntary muscle contraction to protect inflamed area"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Rigid abdomen",
      value: "Board-like rigidity",
      normal: false,
      selected: false,
      description: "Muscle stiffness due to peritoneal irritation"
    },
    
    // Skin
    {
      id: "f4",
      category: "skin",
      subcategory: "inspection",
      name: "Flushed face",
      value: "Erythematous",
      normal: false,
      selected: false,
      description: "Facial flushing consistent with fever"
    },
    
    // HEENT
    {
      id: "f5",
      category: "heent",
      subcategory: "inspection",
      name: "Dry mucous membranes",
      value: "Dehydration",
      normal: false,
      selected: false,
      description: "Signs of mild dehydration from poor intake"
    },
    
    // Cardiac
    {
      id: "f6",
      category: "cardiac",
      subcategory: "inspection",
      name: "Tachycardia",
      value: "HR 105 bpm",
      normal: false,
      selected: false,
      description: "Elevated heart rate due to pain and fever"
    },
    
    // Respiratory
    {
      id: "f7",
      category: "respiratory",
      subcategory: "inspection",
      name: "Shallow breathing",
      value: "Due to abdominal pain",
      normal: false,
      selected: false,
      description: "Patient taking shallow breaths to minimize abdominal movement"
    },
    
    // GI
    {
      id: "f8",
      category: "gi",
      subcategory: "inspection",
      name: "Right lower quadrant tenderness",
      value: "Marked tenderness",
      normal: false,
      selected: false,
      description: "Severe tenderness in right lower quadrant"
    },
    {
      id: "f9",
      category: "gi",
      subcategory: "inspection",
      name: "Rebound tenderness",
      value: "Positive",
      normal: false,
      selected: false,
      description: "Pain increases when pressure is released"
    },
    {
      id: "f10",
      category: "gi",
      subcategory: "inspection",
      name: "Rovsing's sign",
      value: "Positive",
      normal: false,
      selected: false,
      description: "RLQ pain with left lower quadrant palpation"
    },
    {
      id: "f11",
      category: "gi",
      subcategory: "inspection",
      name: "Psoas sign",
      value: "Positive",
      normal: false,
      selected: false,
      description: "RLQ pain with right hip extension"
    },
    {
      id: "f12",
      category: "gi",
      subcategory: "inspection",
      name: "Obturator sign",
      value: "Positive",
      normal: false,
      selected: false,
      description: "RLQ pain with internal right hip rotation"
    },
    {
      id: "f13",
      category: "gi",
      subcategory: "inspection",
      name: "McBurney's point tenderness",
      value: "Marked tenderness",
      normal: false,
      selected: false,
      description: "Tenderness at one-third distance from ASIS to umbilicus"
    },
    {
      id: "f14",
      category: "gi",
      subcategory: "inspection",
      name: "Nausea and vomiting",
      value: "Intermittent",
      normal: false,
      selected: false,
      description: "Patient has vomited several times"
    },
    {
      id: "f15",
      category: "gi",
      subcategory: "inspection",
      name: "Anorexia",
      value: "Complete loss of appetite",
      normal: false,
      selected: false,
      description: "Patient has not eaten in 24 hours"
    },
    {
      id: "f16",
      category: "gi",
      subcategory: "inspection",
      name: "Low-grade fever",
      value: "38.4°C",
      normal: false,
      selected: false,
      description: "Consistent with inflammatory process"
    },
    
    // GU
    {
      id: "f17",
      category: "gu",
      subcategory: "inspection",
      name: "Dysuria",
      value: "Mild",
      normal: false,
      selected: false,
      description: "Mild burning with urination"
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
      name: "Right lower quadrant guarding",
      value: "Involuntary muscle contraction",
      normal: false,
      selected: false,
      description: "Protective muscle contraction in RLQ"
    },
    
    // Psych
    {
      id: "f20",
      category: "psych",
      subcategory: "inspection",
      name: "Anxiety",
      value: "Moderate",
      normal: false,
      selected: false,
      description: "Patient anxious about pain and symptoms"
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
      diagnosis: "Acute Appendicitis",
      probability: 85,
      reasoning: "Classic presentation with periumbilical pain migrating to right lower quadrant, nausea, vomiting, low-grade fever, and positive Rovsing's, psoas, and obturator signs. McBurney's point tenderness and rebound tenderness confirm peritoneal irritation. Guarding and rigidity indicate advanced inflammation. Patient's age and gender are consistent with peak incidence.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Gastroenteritis",
      probability: 40,
      reasoning: "Can present with abdominal pain, nausea, and vomiting but typically involves diarrhea and more generalized abdominal pain rather than focal right lower quadrant tenderness. Patient's localized findings and peritoneal signs make this less likely.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Mesenteric Lymphadenitis",
      probability: 30,
      reasoning: "More common in younger patients and can mimic appendicitis but typically has more generalized symptoms and less focal tenderness. Often associated with recent viral illness. Patient's classic migratory pain pattern and peritoneal signs favor appendicitis.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Ovarian Torsion",
      probability: 25,
      reasoning: "In women of reproductive age can cause severe RLQ pain but would typically have adnexal mass on examination and more acute onset. Patient is male, making this diagnosis impossible.",
      position: 4
    },
    {
      id: "d5",
      diagnosis: "Urinary Tract Infection",
      probability: 20,
      reasoning: "Can cause lower abdominal pain and dysuria but would typically have more urinary symptoms and costovertebral angle tenderness if pyelonephritis. Patient's focal RLQ findings and peritoneal signs make appendicitis more likely.",
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
                    <p className="font-medium">HR 105 bpm, BP 130/85 mmHg, RR 20/min, O2 Sat 98%, Temp 38.4°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Pain Scale</span>
                    <p className="font-medium">8/10 in RLQ</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Young male presenting with 12-hour history of abdominal pain that migrated from periumbilical 
                    to right lower quadrant. Associated with nausea, vomiting, and low-grade fever. 
                    Patient appears uncomfortable and is guarding his abdomen. 
                    Classic presentation suggestive of acute appendicitis requiring surgical evaluation. 
                    ABC assessment stable but patient in significant pain.
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
                    "I've had belly pain for the past 12 hours. It started around my navel but now 
                    it's in my right lower side. I've been throwing up and I feel hot."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> 12 hours ago, periumbilical pain</p>
                    <p><span className="font-medium">Character:</span> Migratory pain from periumbilical to RLQ</p>
                    <p><span className="font-medium">Radiation:</span> Localized to right lower quadrant</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Nausea, vomiting (3 times), low-grade fever, anorexia</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Movement, coughing, deep breathing</p>
                    <p><span className="font-medium">Timing:</span> Pain progressively worsening over 12 hours</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>No significant past medical history</li>
                    <li>No previous surgeries</li>
                    <li>No known drug allergies</li>
                    <li>No family history of gastrointestinal disorders</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Gastrointestinal</h4>
                      <p className="text-gray-700">Abdominal pain, nausea, vomiting, anorexia</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Genitourinary</h4>
                      <p className="text-gray-700">Mild dysuria</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Constitutional</h4>
                      <p className="text-gray-700">Fever, chills</p>
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
                          <p className="font-medium text-red-600">14,500/μL (↑, normal 4,000-11,000)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium">14.2 g/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium">42%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">320,000/μL</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Leukocytosis with left shift supports inflammatory process. 
                        Normal hemoglobin and platelets.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Comprehensive Metabolic Panel</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Na⁺</p>
                          <p className="font-medium">138 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">K⁺</p>
                          <p className="font-medium">4.1 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cl⁻</p>
                          <p className="font-medium">102 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CO₂</p>
                          <p className="font-medium">24 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">BUN</p>
                          <p className="font-medium">18 mg/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cr</p>
                          <p className="font-medium">1.0 mg/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Glu</p>
                          <p className="font-medium">98 mg/dL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Urinalysis</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Color</p>
                          <p className="font-medium">Yellow</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Clarity</p>
                          <p className="font-medium">Clear</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Leukocytes</p>
                          <p className="font-medium">Negative</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Nitrites</p>
                          <p className="font-medium">Negative</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Protein</p>
                          <p className="font-medium">Trace</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        No evidence of urinary tract infection. 
                        Mild proteinuria may be due to dehydration.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">CT Abdomen/Pelvis with Contrast</h3>
                      <p className="text-gray-700 mb-3">
                        Gold standard for appendicitis diagnosis. Shows dilated appendix (&gt;6mm diameter) 
                        with wall thickening, periappendiceal fat stranding, and possible appendicolith.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">CT Abdomen/Pelvis Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: Dilated appendix (9mm), wall thickening, periappendiceal inflammation, 
                        no abscess or perforation identified.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Ultrasound Abdomen</h3>
                      <p className="text-gray-700 mb-3">
                        Non-contrast imaging modality, especially useful in children and pregnant women. 
                        May show non-compressible appendix (&gt;6mm diameter) with surrounding fluid.
                      </p>
                      <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                        <span className="text-gray-500">Ultrasound Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: Non-compressible tubular structure in right lower quadrant 
                        with surrounding echogenic fat, consistent with inflamed appendix.
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
                          <p className="font-medium">20/min</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium">98% on room air</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium text-red-600">38.4°C (101.1°F) (↑)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Abdominal Exam Findings</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">McBurney's Point Tenderness</p>
                          <p className="font-medium text-red-600">Marked tenderness</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Rovsing's Sign</p>
                          <p className="font-medium text-red-600">Positive</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Psoas Sign</p>
                          <p className="font-medium text-red-600">Positive</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Obturator Sign</p>
                          <p className="font-medium text-red-600">Positive</p>
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
                    value="24-year-old male with 12-hour history of migratory abdominal pain from periumbilical to right lower quadrant. Associated with nausea, vomiting, and low-grade fever. Physical exam reveals marked tenderness at McBurney's point, positive Rovsing's, psoas, and obturator signs. Guarding and rigidity present. Labs show leukocytosis. CT imaging confirms appendicitis. Classic presentation of acute appendicitis."
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
                      <span className="text-sm">Migratory pain pattern (periumbilical to RLQ)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Nausea and vomiting</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Low-grade fever</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">McBurney's point tenderness</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Rebound tenderness and guarding</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Positive Rovsing's, psoas, and obturator signs</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Leukocytosis with left shift</span>
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
                        <li>Establish IV access and begin fluid resuscitation</li>
                        <li>Administer IV antibiotics (typically in surgical suite)</li>
                        <li>Obtain surgical consultation for appendectomy</li>
                        <li>Keep patient NPO (nothing by mouth)</li>
                        <li>Provide pain control while awaiting surgery</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Preoperative Preparation</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Verify surgical consent</li>
                        <li>Ensure NPO status</li>
                        <li>Complete preoperative labs and imaging</li>
                        <li>Administer preoperative antibiotics</li>
                        <li>Ensure appropriate surgical team availability</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous vital sign monitoring</li>
                        <li>Serial abdominal examinations</li>
                        <li>Watch for signs of perforation or abscess formation</li>
                        <li>Monitor for improvement or deterioration</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Preoperative Antibiotics
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Antibiotics</span>
                          <span className="text-sm font-medium">Cefazolin 1g IV or equivalent</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Timing</span>
                          <span className="text-sm font-medium">Within 60 minutes of incision</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Pain Management
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>IV Analgesics</span>
                          <span className="text-sm font-medium">Morphine 2-4mg IV PRN or equivalent</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>NSAIDs</span>
                          <span className="text-sm font-medium">Ketorolac 15mg IV PRN (if no contraindications)</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Adjunctive</span>
                          <span className="text-sm font-medium">Acetaminophen 1g IV PRN</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        IV Fluids
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Resuscitation</span>
                          <span className="text-sm font-medium">Normal saline 1-2L bolus</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Maintenance</span>
                          <span className="text-sm font-medium">D5 1/2NS at maintenance rate</span>
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
                          <span>Open Appendectomy</span>
                          <span className="text-sm font-medium">Traditional approach via McBurney's incision</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Laparoscopic Appendectomy</span>
                          <span className="text-sm font-medium">Minimally invasive approach (preferred)</span>
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
                          <span>Discharge</span>
                          <span className="text-sm font-medium">Typically 1-2 days postoperatively</span>
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
                          <span className="text-sm font-medium">Bleeding, injury to adjacent structures</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Postoperative</span>
                          <span className="text-sm font-medium">Wound infection, abscess, adhesive bowel obstruction</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Delayed</span>
                          <span className="text-sm font-medium">Incisional hernia, adhesive bowel obstruction</span>
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