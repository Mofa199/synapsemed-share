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

export default function TensionPneumothoraxSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Tension Pneumothorax
  const caseData: PatientCase = {
    id: "8",
    title: "Tension Pneumothorax (Post Trauma)",
    patientAge: 32,
    patientGender: "Male",
    chiefComplaint: "Severe respiratory distress and chest pain after motor vehicle collision",
    status: "active",
    timeElapsed: 540, // seconds
    specialty: "Trauma",
    category: "Surgery-Emergency",
    difficulty: "Advanced",
    duration: "20 min",
    rating: 4.7,
    reviews: 92,
    description: "Diagnose and manage a life-threatening chest trauma.",
    tags: ["Trauma", "Surgery", "Emergency", "Decompression"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Tension Pneumothorax
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Severe respiratory distress",
      value: "Labored breathing",
      normal: false,
      selected: false,
      description: "Patient is struggling to breathe with visible effort"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Cyanosis",
      value: "Central cyanosis",
      normal: false,
      selected: false,
      description: "Bluish discoloration of lips and tongue"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Altered mental status",
      value: "Confusion",
      normal: false,
      selected: false,
      description: "Patient is confused and disoriented"
    },
    
    // Skin
    {
      id: "f4",
      category: "skin",
      subcategory: "inspection",
      name: "Diaphoresis",
      value: "Profuse sweating",
      normal: false,
      selected: false,
      description: "Patient is visibly sweating profusely"
    },
    
    // HEENT
    {
      id: "f5",
      category: "heent",
      subcategory: "inspection",
      name: "Jugular venous distension",
      value: "Markedly elevated",
      normal: false,
      selected: false,
      description: "Elevated jugular venous pressure"
    },
    
    // Cardiac
    {
      id: "f6",
      category: "cardiac",
      subcategory: "inspection",
      name: "Hypotension",
      value: "BP 80/50 mmHg",
      normal: false,
      selected: false,
      description: "Low blood pressure due to obstructive shock"
    },
    {
      id: "f7",
      category: "cardiac",
      subcategory: "auscultation",
      name: "Tachycardia",
      value: "HR 130 bpm",
      normal: false,
      selected: false,
      description: "Compensatory tachycardia for hypotension"
    },
    {
      id: "f8",
      category: "cardiac",
      subcategory: "auscultation",
      name: "Muffled heart sounds",
      value: "Distant heart sounds",
      normal: false,
      selected: false,
      description: "Heart sounds are diminished due to compression"
    },
    
    // Respiratory
    {
      id: "f9",
      category: "respiratory",
      subcategory: "inspection",
      name: "Asymmetric chest expansion",
      value: "Left side decreased",
      normal: false,
      selected: false,
      description: "Left side of chest expands less than right"
    },
    {
      id: "f10",
      category: "respiratory",
      subcategory: "inspection",
      name: "Tracheal deviation",
      value: "Deviation to right",
      normal: false,
      selected: false,
      description: "Trachea deviated away from affected side"
    },
    {
      id: "f11",
      category: "respiratory",
      subcategory: "palpation",
      name: "Decreased tactile fremitus",
      value: "Left side",
      normal: false,
      selected: false,
      description: "Decreased vibrations on left side"
    },
    {
      id: "f12",
      category: "respiratory",
      subcategory: "percussion",
      name: "Hyperresonance",
      value: "Left hemithorax",
      normal: false,
      selected: false,
      description: "Drum-like sound on percussion of left chest"
    },
    {
      id: "f13",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Absent breath sounds",
      value: "Left hemithorax",
      normal: false,
      selected: false,
      description: "No breath sounds heard on left side"
    },
    
    // GI
    {
      id: "f14",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal distension",
      value: "Moderate",
      normal: false,
      selected: false,
      description: "Abdomen appears distended"
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
      description: "Reduced urine production due to hypoperfusion"
    },
    
    // Neuro
    {
      id: "f16",
      category: "neuro",
      subcategory: "inspection",
      name: "Altered mental status",
      value: "Confusion",
      normal: false,
      selected: false,
      description: "Patient is confused and disoriented"
    },
    
    // Musculoskeletal
    {
      id: "f17",
      category: "musculoskeletal",
      subcategory: "inspection",
      name: "Chest wall trauma",
      value: "Left chest bruising",
      normal: false,
      selected: false,
      description: "Bruising and tenderness over left chest wall"
    },
    
    // Psych
    {
      id: "f18",
      category: "psych",
      subcategory: "inspection",
      name: "Anxiety",
      value: "Severe",
      normal: false,
      selected: false,
      description: "Patient is extremely anxious about breathing difficulty"
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
      diagnosis: "Tension Pneumothorax",
      probability: 90,
      reasoning: "Classic presentation of obstructive shock with hypotension, jugular venous distension, and unilateral absent breath sounds after trauma. Patient has tracheal deviation away from affected side, hyperresonance on percussion, and asymmetric chest expansion. The combination of hypotension, JVD, and absent breath sounds on the left side is pathognomonic for tension pneumothorax. This is a surgical emergency requiring immediate decompression.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Hemopneumothorax",
      probability: 50,
      reasoning: "Can present with similar findings after trauma but would not typically cause tracheal deviation or the classic Beck's triad unless under tension. Patient's findings are more consistent with tension physiology.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Cardiac Tamponade",
      probability: 40,
      reasoning: "Can present with Beck's triad (hypotension, JVD, muffled heart sounds) but would not cause unilateral absent breath sounds or tracheal deviation. Patient's respiratory findings make this less likely.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Flail Chest with Pulmonary Contusion",
      probability: 35,
      reasoning: "Can cause respiratory distress and hypoxia after trauma but would not cause the cardiovascular findings of obstructive shock. Patient's combination of hypotension, JVD, and tracheal deviation make this less likely.",
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
                    <p className="font-medium">HR 130 bpm, BP 80/50 mmHg, RR 32/min, O2 Sat 85%, Temp 37.0°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">GCS</span>
                    <p className="font-medium">13 (E3 V4 M6)</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Young male involved in high-speed motor vehicle collision presenting with severe respiratory distress, 
                    hypotension, and jugular venous distension. Patient has absent breath sounds on left side with tracheal 
                    deviation to the right. Classic presentation of tension pneumothorax requiring immediate intervention. 
                    ABC assessment reveals life-threatening respiratory and circulatory compromise.
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
                    "I can't breathe! I feel like I'm going to die. 
                    My chest hurts so much and I feel like I'm suffocating."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> Immediately after motor vehicle collision</p>
                    <p><span className="font-medium">Character:</span> Rapid onset of severe respiratory distress</p>
                    <p><span className="font-medium">Radiation:</span> Left chest pain</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Dizziness, feeling of impending doom</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Time progression of symptoms</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Trauma History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>High-speed motor vehicle collision (45 mph)</li>
                    <li>Driver side impact to left chest</li>
                    <li>Airbag deployment</li>
                    <li>Seatbelt use confirmed</li>
                    <li>Extrication time approximately 20 minutes</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Respiratory</h4>
                      <p className="text-gray-700">Severe dyspnea, chest pain, absent breath sounds</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cardiovascular</h4>
                      <p className="text-gray-700">Hypotension, tachycardia, JVD</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Neurological</h4>
                      <p className="text-gray-700">Confusion, altered mental status</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Musculoskeletal</h4>
                      <p className="text-gray-700">Left chest wall tenderness</p>
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
                      <h3 className="font-medium mb-2">Chest X-ray (Portable)</h3>
                      <p className="text-gray-700 mb-3">
                        Left hemithorax completely opaque with mediastinal shift to the right. 
                        No visible lung markings on left side. 
                        Depressed left hemidiaphragm.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">Chest X-ray Image Placeholder</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">CT Chest (if indicated)</h3>
                      <p className="text-gray-700">
                        Would show left-sided pneumothorax with mass effect and mediastinal shift. 
                        May also reveal associated pulmonary contusions or rib fractures.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="labs" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Arterial Blood Gas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">pH</p>
                          <p className="font-medium text-red-600">7.25 (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaO₂</p>
                          <p className="font-medium text-red-600">55 mmHg (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaCO₂</p>
                          <p className="font-medium text-red-600">55 mmHg (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HCO₃⁻</p>
                          <p className="font-medium">22 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">SaO₂</p>
                          <p className="font-medium text-red-600">85% (↓)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Complete Blood Count</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">WBC</p>
                          <p className="font-medium">15,200/μL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium text-red-600">10.2 g/dL (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium text-red-600">31% (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">250,000/μL</p>
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
                          <p className="font-medium text-red-600">80/50 mmHg (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium text-red-600">130 bpm (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium text-red-600">32/min (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium text-red-600">85% on 15L O₂ (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">37.0°C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Focused Assessment with Sonography for Trauma (FAST)</h3>
                      <p className="text-gray-700">
                        May show absent lung sliding on left side consistent with pneumothorax. 
                        Cardiac views may show right heart strain.
                      </p>
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
                    value="32-year-old male presenting with tension pneumothorax after high-speed motor vehicle collision. Classic Beck's triad of hypotension, jugular venous distension, and muffled heart sounds. Unilateral absent breath sounds on left side with tracheal deviation to the right. Hyperresonance on percussion and asymmetric chest expansion. Severe hypoxia and hypercapnia on ABG. Life-threatening obstructive shock requiring immediate decompression."
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
                      <span className="text-sm">Beck's triad (hypotension, JVD, muffled heart sounds)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Unilateral absent breath sounds</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Tracheal deviation away from affected side</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Hyperresonance on percussion</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">History of trauma with chest impact</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Severe hypoxia and hypercapnia</span>
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
                  <TabsTrigger value="procedures">Procedures</TabsTrigger>
                  <TabsTrigger value="supportive">Supportive Care</TabsTrigger>
                </TabsList>
                <TabsContent value="acute" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Immediate Priorities (ABCs)</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Ensure airway patency and consider intubation</li>
                        <li>Administer high-flow oxygen</li>
                        <li>Establish large-bore IV access</li>
                        <li>Prepare for immediate chest decompression</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Chest Decompression</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Needle decompression as first-line treatment</li>
                        <li>Immediate chest tube placement after stabilization</li>
                        <li>Confirm decompression with clinical improvement</li>
                        <li>Document time of intervention</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous cardiac monitoring</li>
                        <li>Frequent vital signs (every 5 minutes initially)</li>
                        <li>Oxygen saturation monitoring</li>
                        <li>Assessment for reaccumulation</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="procedures" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Needle Thoracostomy (Immediate Decompression)
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Indication</span>
                          <span className="text-sm font-medium">Clinical diagnosis of tension pneumothorax</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Site</span>
                          <span className="text-sm font-medium">2nd intercostal space, midclavicular line</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Needle</span>
                          <span className="text-sm font-medium">14-gauge, 3.25-inch (8cm) angiocath</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Confirmation</span>
                          <span className="text-sm font-medium">Audible rush of air, clinical improvement</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Chest Tube Thoracostomy (Definitive Treatment)
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Timing</span>
                          <span className="text-sm font-medium">After initial stabilization</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Site</span>
                          <span className="text-sm font-medium">4th-5th intercostal space, anterior axillary line</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Tube size</span>
                          <span className="text-sm font-medium">36-40 Fr for trauma</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Connection</span>
                          <span className="text-sm font-medium">Underwater seal drainage system</span>
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
                        Fluid Resuscitation
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Crystalloid solutions</span>
                          <span className="text-sm font-medium">Normal saline 500-1000mL bolus</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Blood products</span>
                          <span className="text-sm font-medium">Consider if significant hemorrhage</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Monitoring</span>
                          <span className="text-sm font-medium">Avoid fluid overload after decompression</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Post-Decompression Care
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Chest X-ray</span>
                          <span className="text-sm font-medium">Confirm lung re-expansion</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Repeat imaging</span>
                          <span className="text-sm font-medium">If clinical deterioration occurs</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Surgical consultation</span>
                          <span className="text-sm font-medium">For definitive management</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Disposition</span>
                          <span className="text-sm font-medium">ICU monitoring required</span>
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