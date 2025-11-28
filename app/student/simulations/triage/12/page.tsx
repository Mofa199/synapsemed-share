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

export default function ChestTraumaSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Chest Trauma
  const caseData: PatientCase = {
    id: "12",
    title: "Road Traffic Injury – Chest Trauma with Pneumothorax",
    patientAge: 29,
    patientGender: "Male",
    chiefComplaint: "Chest pain and difficulty breathing after motor vehicle collision",
    status: "active",
    timeElapsed: 680, // seconds
    specialty: "Trauma",
    category: "Surgery-Emergency",
    difficulty: "Advanced",
    duration: "22 min",
    rating: 4.8,
    reviews: 91,
    description: "Assess and manage a trauma patient with chest injury and pneumothorax.",
    tags: ["Trauma", "Chest", "Emergency", "Surgery"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Chest Trauma
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Respiratory distress",
      value: "Severe",
      normal: false,
      selected: false,
      description: "Patient is struggling to breathe with visible effort"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Cyanosis",
      value: "Perioral",
      normal: false,
      selected: false,
      description: "Bluish discoloration around mouth and lips"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Diaphoresis",
      value: "Profuse sweating",
      normal: false,
      selected: false,
      description: "Patient is visibly sweating profusely"
    },
    {
      id: "f4",
      category: "general",
      subcategory: "inspection",
      name: "Anxious appearance",
      value: "Distressed",
      normal: false,
      selected: false,
      description: "Patient appears visibly anxious and in distress"
    },
    
    // Skin
    {
      id: "f5",
      category: "skin",
      subcategory: "inspection",
      name: "Bruising",
      value: "Left chest wall",
      normal: false,
      selected: false,
      description: "Ecchymosis over left anterior chest wall"
    },
    {
      id: "f6",
      category: "skin",
      subcategory: "inspection",
      name: "Laceration",
      value: "Left chest",
      normal: false,
      selected: false,
      description: "2cm laceration on left anterior chest"
    },
    
    // HEENT
    {
      id: "f7",
      category: "heent",
      subcategory: "inspection",
      name: "Facial lacerations",
      value: "Multiple",
      normal: false,
      selected: false,
      description: "Superficial lacerations on face from airbag"
    },
    
    // Cardiac
    {
      id: "f8",
      category: "cardiac",
      subcategory: "inspection",
      name: "Tachycardia",
      value: "HR 125 bpm",
      normal: false,
      selected: false,
      description: "Compensatory tachycardia for hypovolemia"
    },
    {
      id: "f9",
      category: "cardiac",
      subcategory: "inspection",
      name: "Hypotension",
      value: "BP 90/60 mmHg",
      normal: false,
      selected: false,
      description: "Low blood pressure from hemorrhage"
    },
    {
      id: "f10",
      category: "cardiac",
      subcategory: "auscultation",
      name: "Muffled heart sounds",
      value: "Distant",
      normal: false,
      selected: false,
      description: "May indicate pericardial effusion or tamponade"
    },
    
    // Respiratory
    {
      id: "f11",
      category: "respiratory",
      subcategory: "inspection",
      name: "Asymmetric chest rise",
      value: "Left side decreased",
      normal: false,
      selected: false,
      description: "Left side of chest not expanding normally"
    },
    {
      id: "f12",
      category: "respiratory",
      subcategory: "inspection",
      name: "Accessory muscle use",
      value: "Visible",
      normal: false,
      selected: false,
      description: "Patient using neck and intercostal muscles to breathe"
    },
    {
      id: "f13",
      category: "respiratory",
      subcategory: "inspection",
      name: "Retractions",
      value: "Intercostal",
      normal: false,
      selected: false,
      description: "Visible pulling in of intercostal spaces during inspiration"
    },
    {
      id: "f14",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Decreased breath sounds",
      value: "Left lung field",
      normal: false,
      selected: false,
      description: "Markedly diminished breath sounds on left side"
    },
    {
      id: "f15",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Absent breath sounds",
      value: "Left base",
      normal: false,
      selected: false,
      description: "No breath sounds audible at left lung base"
    },
    {
      id: "f16",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Wheezing",
      value: "Scattered",
      normal: false,
      selected: false,
      description: "Scattered wheezes throughout lung fields"
    },
    {
      id: "f17",
      category: "respiratory",
      subcategory: "percussion",
      name: "Hyperresonance",
      value: "Left hemithorax",
      normal: false,
      selected: false,
      description: "Drum-like sound on percussion of left chest"
    },
    
    // GI
    {
      id: "f18",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal tenderness",
      value: "Left upper quadrant",
      normal: false,
      selected: false,
      description: "Tenderness in left upper abdominal quadrant"
    },
    
    // Neuro
    {
      id: "f19",
      category: "neuro",
      subcategory: "inspection",
      name: "Confusion",
      value: "Mild",
      normal: false,
      selected: false,
      description: "Patient appears slightly confused"
    },
    
    // Musculoskeletal
    {
      id: "f20",
      category: "musculoskeletal",
      subcategory: "inspection",
      name: "Chest wall tenderness",
      value: "Left ribs 4-7",
      normal: false,
      selected: false,
      description: "Tenderness to palpation over left anterior ribs"
    },
    {
      id: "f21",
      category: "musculoskeletal",
      subcategory: "inspection",
      name: "Deformity",
      value: "Left chest wall",
      normal: false,
      selected: false,
      description: "Visible deformity of left anterior chest wall"
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
    { id: "neuro", label: "Neuro", icon: Brain, color: "text-indigo-500" },
    { id: "musculoskeletal", label: "Musculoskeletal", icon: Bone, color: "text-pink-500" }
  ];

  // Mock differential diagnoses
  const initialDifferentialDiagnoses: DiagnosticEntry[] = [
    {
      id: "d1",
      diagnosis: "Traumatic Pneumothorax",
      probability: 90,
      reasoning: "Classic presentation after motor vehicle collision with chest trauma. Physical findings include respiratory distress, decreased breath sounds on left side, hyperresonance to percussion, and asymmetric chest rise. Patient's tachycardia and hypotension suggest tension physiology. History of left chest impact with steering wheel and physical findings strongly support pneumothorax as the primary injury.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Hemothorax",
      probability: 70,
      reasoning: "Can occur with chest trauma and may accompany pneumothorax. Patient's hypotension and tachycardia could indicate significant blood loss into pleural space. Decreased breath sounds and respiratory distress support this diagnosis. May require chest tube placement for both air and blood evacuation.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Pulmonary Contusion",
      probability: 65,
      reasoning: "Common after blunt chest trauma. Can cause respiratory distress, hypoxia, and decreased breath sounds. May not be immediately apparent on chest X-ray but can worsen over time. Patient's mechanism of injury and respiratory symptoms are consistent with pulmonary contusion.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Cardiac Tamponade",
      probability: 40,
      reasoning: "Can occur with penetrating or blunt chest trauma. Beck's triad (hypotension, jugular venous distension, muffled heart sounds) may be present. Patient has hypotension and muffled heart sounds but no JVD yet. High index of suspicion needed in trauma setting.",
      position: 4
    },
    {
      id: "d5",
      diagnosis: "Flail Chest",
      probability: 35,
      reasoning: "Multiple rib fractures causing paradoxical chest wall movement. Can cause severe respiratory compromise. Patient has chest wall tenderness and asymmetric chest rise but no clear description of flail segment. May be present but not the primary life-threatening injury.",
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
                    <p className="font-medium">HR 125 bpm, BP 90/60 mmHg, RR 30/min, O2 Sat 88%, Temp 37.2°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">GCS</span>
                    <p className="font-medium">14/15 (E4 V4 M6)</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Young male involved in high-speed motor vehicle collision as restrained driver. 
                    Primary survey reveals respiratory distress with decreased breath sounds on left, 
                    tachycardia, and hypotension. Patient is conscious but in distress with 
                    perioral cyanosis and use of accessory muscles. 
                    Clear life-threatening injury to chest requiring immediate intervention. 
                    ABC assessment reveals compromised airway and circulation.
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
                    "I can't breathe properly. My chest hurts really bad and I feel like I'm going to die."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Mechanism:</span> High-speed motor vehicle collision, restrained driver, left chest impact with steering wheel</p>
                    <p><span className="font-medium">Onset:</span> Immediately after impact</p>
                    <p><span className="font-medium">Character:</span> Sharp chest pain with progressive dyspnea</p>
                    <p><span className="font-medium">Radiation:</span> Left chest pain radiating to left shoulder</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Shortness of breath, dizziness, feeling of impending doom</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Deep breathing, movement</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>No significant past medical history</li>
                    <li>No previous surgeries</li>
                    <li>No known drug allergies</li>
                    <li>No family history of cardiac or pulmonary disorders</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Respiratory</h4>
                      <p className="text-gray-700">Dyspnea, chest pain, cough</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cardiovascular</h4>
                      <p className="text-gray-700">Chest pain, palpitations</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Neurological</h4>
                      <p className="text-gray-700">Headache, dizziness</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Musculoskeletal</h4>
                      <p className="text-gray-700">Chest wall pain, rib tenderness</p>
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
                          <p className="font-medium">11,800/μL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium text-red-600">10.2 g/dL (↓, normal 14-18 g/dL)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium text-red-600">31% (↓, normal 40-54%)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">280,000/μL</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Normocytic anemia suggests acute blood loss. 
                        Normal platelet count.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Arterial Blood Gas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">pH</p>
                          <p className="font-medium text-red-600">7.28 (↓, normal 7.35-7.45)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaO₂</p>
                          <p className="font-medium text-red-600">55 mmHg (↓, normal 80-100)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PaCO₂</p>
                          <p className="font-medium text-red-600">52 mmHg (↑, normal 35-45)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HCO₃⁻</p>
                          <p className="font-medium">24 mEq/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">SaO₂</p>
                          <p className="font-medium text-red-600">88% (↓, normal &gt;95%)</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Respiratory acidosis with hypoxemia. 
                        Consistent with impaired gas exchange from pneumothorax.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Coagulation Studies</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">PT</p>
                          <p className="font-medium">12.5 sec</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PTT</p>
                          <p className="font-medium">28 sec</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">INR</p>
                          <p className="font-medium">1.1</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fibrinogen</p>
                          <p className="font-medium">350 mg/dL</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Chest X-ray (Portable)</h3>
                      <p className="text-gray-700 mb-3">
                        First-line imaging for suspected pneumothorax. May show lung collapse, 
                        absent lung markings, and mediastinal shift.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">Chest X-ray Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: Left-sided pneumothorax with 50% lung collapse. 
                        No hemothorax identified. Mediastinum slightly shifted right. 
                        Left first rib fracture visible.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">CT Chest with Contrast</h3>
                      <p className="text-gray-700 mb-3">
                        More sensitive than chest X-ray for detecting pneumothorax and associated injuries. 
                        Essential for polytrauma patients to identify all injuries.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">CT Chest Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: Large left-sided pneumothorax with 70% collapse. 
                        Small hemothorax present. Left first and second rib fractures. 
                        No pulmonary contusion identified. No aortic injury.
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
                          <p className="font-medium text-red-600">30/min (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium text-red-600">88% on 15L O2 (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">37.2°C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Focused Assessment with Sonography for Trauma (FAST)</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Pericardial View</p>
                          <p className="font-medium">No pericardial effusion</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Left Chest</p>
                          <p className="font-medium text-red-600">Lung sliding absent</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Right Chest</p>
                          <p className="font-medium">Lung sliding present</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Abdominal Views</p>
                          <p className="font-medium">No free fluid</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Confirms left-sided pneumothorax with absent lung sliding. 
                        No evidence of pericardial tamponade or intra-abdominal hemorrhage.
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
                    value="29-year-old male restrained driver in high-speed MVC with left chest impact. Presents with respiratory distress, tachycardia, and hypotension. Physical exam reveals decreased breath sounds on left, hyperresonance to percussion, and asymmetric chest rise. ABG shows respiratory acidosis and hypoxemia. Chest X-ray and CT confirm large left-sided pneumothorax with rib fractures. FAST exam confirms pneumothorax with absent lung sliding on left. Classic presentation of traumatic pneumothorax requiring immediate chest tube placement."
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
                      <span className="text-sm">High-speed motor vehicle collision</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Left chest impact with steering wheel</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Respiratory distress with hypoxemia</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Decreased breath sounds on left side</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Hyperresonance to percussion</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Tachycardia and hypotension</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Chest X-ray confirming pneumothorax</span>
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
                  <TabsTrigger value="procedures">Procedures</TabsTrigger>
                </TabsList>
                <TabsContent value="acute" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Immediate Priorities (Primary Survey)</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Ensure patent airway with cervical spine precautions</li>
                        <li>Administer high-flow oxygen via non-rebreather mask</li>
                        <li>Establish large-bore IV access (at least 2 sites)</li>
                        <li>Prepare for immediate chest decompression</li>
                        <li>Continuous cardiac monitoring</li>
                        <li>Frequent neurologic assessments</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Secondary Survey</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Complete head-to-toe trauma examination</li>
                        <li>Identify associated injuries (head, abdomen, extremities)</li>
                        <li>Obtain detailed mechanism of injury</li>
                        <li>Document all findings thoroughly</li>
                        <li>Consider whole-body CT if polytrauma suspected</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous vital signs and oxygen saturation</li>
                        <li>Serial physical examinations</li>
                        <li>Chest X-ray post-intervention</li>
                        <li>Arterial blood gas monitoring</li>
                        <li>Watch for signs of tension physiology</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Analgesia
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Opioids</span>
                          <span className="text-sm font-medium">Fentanyl 50-100mcg IV PRN</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>NSAIDs</span>
                          <span className="text-sm font-medium">Ketorolac 15mg IV PRN (if no contraindications)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Resuscitation Fluids
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Crystalloids</span>
                          <span className="text-sm font-medium">Normal saline 1-2L bolus</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Blood Products</span>
                          <span className="text-sm font-medium">PRBCs if ongoing hemorrhage</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Adjunctive Therapies
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Antibiotics</span>
                          <span className="text-sm font-medium">Not routinely indicated for pneumothorax</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Anxiolytics</span>
                          <span className="text-sm font-medium">Lorazepam 1-2mg IV PRN for severe anxiety</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="procedures" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" />
                        Immediate Procedures
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Chest Tube Placement</span>
                          <span className="text-sm font-medium">Left 5th ICS, mid-axillary line</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Needle Decompression</span>
                          <span className="text-sm font-medium">If signs of tension physiology</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Post-Procedure Care
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Chest Tube Management</span>
                          <span className="text-sm font-medium">Connect to underwater seal drainage</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Drainage Monitoring</span>
                          <span className="text-sm font-medium">Measure output hourly</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>X-ray Confirmation</span>
                          <span className="text-sm font-medium">Post-procedure chest X-ray</span>
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
                          <span>Procedure-Related</span>
                          <span className="text-sm font-medium">Bleeding, infection, organ injury</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Persistent Air Leak</span>
                          <span className="text-sm font-medium">May require prolonged drainage</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Re-expansion Pulmonary Edema</span>
                          <span className="text-sm font-medium">Rare but serious complication</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Recurrence</span>
                          <span className="text-sm font-medium">May require surgical intervention</span>
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