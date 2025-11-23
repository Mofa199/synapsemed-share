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

export default function PediatricPneumoniaSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Pediatric Pneumonia
  const caseData: PatientCase = {
    id: "9",
    title: "Severe Pneumonia (Child)",
    patientAge: 3,
    patientGender: "Female",
    chiefComplaint: "Fever, cough, and respiratory distress for 3 days",
    status: "active",
    timeElapsed: 780, // seconds
    specialty: "Pediatrics",
    category: "Pediatric",
    difficulty: "Intermediate",
    duration: "22 min",
    rating: 4.6,
    reviews: 58,
    description: "Manage a child with respiratory distress and fever.",
    tags: ["Pediatrics", "Respiratory", "Infection", "Pneumonia"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Pediatric Pneumonia
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Fever",
      value: "39.2°C (102.6°F)",
      normal: false,
      selected: false,
      description: "Child has high fever"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Irritability",
      value: "Fussy and difficult to console",
      normal: false,
      selected: false,
      description: "Child is irritable and difficult to calm"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Poor feeding",
      value: "Refusing to eat",
      normal: false,
      selected: false,
      description: "Child is refusing food and liquids"
    },
    {
      id: "f4",
      category: "general",
      subcategory: "inspection",
      name: "Lethargy",
      value: "Decreased activity",
      normal: false,
      selected: false,
      description: "Child is less active than usual"
    },
    
    // Skin
    {
      id: "f5",
      category: "skin",
      subcategory: "inspection",
      name: "Flushed face",
      value: "Erythematous",
      normal: false,
      selected: false,
      description: "Child has flushed appearance consistent with fever"
    },
    {
      id: "f6",
      category: "skin",
      subcategory: "inspection",
      name: "Diaphoresis",
      value: "Sweating",
      normal: false,
      selected: false,
      description: "Child is sweating profusely"
    },
    
    // HEENT
    {
      id: "f7",
      category: "heent",
      subcategory: "inspection",
      name: "Nasal flaring",
      value: "Present",
      normal: false,
      selected: false,
      description: "Visible flaring of nostrils with each breath"
    },
    {
      id: "f8",
      category: "heent",
      subcategory: "inspection",
      name: "Oropharyngeal erythema",
      value: "Red throat",
      normal: false,
      selected: false,
      description: "Redness of posterior pharynx"
    },
    
    // Cardiac
    {
      id: "f9",
      category: "cardiac",
      subcategory: "inspection",
      name: "Tachycardia",
      value: "HR 150 bpm",
      normal: false,
      selected: false,
      description: "Elevated heart rate due to fever and respiratory distress"
    },
    
    // Respiratory
    {
      id: "f10",
      category: "respiratory",
      subcategory: "inspection",
      name: "Increased work of breathing",
      value: "Retractions and grunting",
      normal: false,
      selected: false,
      description: "Child using accessory muscles with intercostal retractions"
    },
    {
      id: "f11",
      category: "respiratory",
      subcategory: "inspection",
      name: "Grunting",
      value: "Audible grunting",
      normal: false,
      selected: false,
      description: "Audible grunting with expiration"
    },
    {
      id: "f12",
      category: "respiratory",
      subcategory: "inspection",
      name: "Cyanosis",
      value: "Perioral cyanosis",
      normal: false,
      selected: false,
      description: "Bluish discoloration around mouth"
    },
    {
      id: "f13",
      category: "respiratory",
      subcategory: "palpation",
      name: "Decreased chest expansion",
      value: "Left lower lobe",
      normal: false,
      selected: false,
      description: "Decreased expansion on left side"
    },
    {
      id: "f14",
      category: "respiratory",
      subcategory: "percussion",
      name: "Dullness to percussion",
      value: "Left lower lobe",
      normal: false,
      selected: false,
      description: "Dull percussion note over left lower lobe"
    },
    {
      id: "f15",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Crackles",
      value: "Fine crackles left base",
      normal: false,
      selected: false,
      description: "Fine crackles heard at left lung base"
    },
    {
      id: "f16",
      category: "respiratory",
      subcategory: "auscultation",
      name: "Diminished breath sounds",
      value: "Left lower lobe",
      normal: false,
      selected: false,
      description: "Decreased breath sounds over affected area"
    },
    
    // GI
    {
      id: "f17",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal pain",
      value: "Guarding",
      normal: false,
      selected: false,
      description: "Child guarding abdomen due to cough-related pain"
    },
    {
      id: "f18",
      category: "gi",
      subcategory: "inspection",
      name: "Nausea and vomiting",
      value: "Intermittent",
      normal: false,
      selected: false,
      description: "Child has vomited several times"
    },
    
    // GU
    {
      id: "f19",
      category: "gu",
      subcategory: "inspection",
      name: "Decreased urine output",
      value: "Oliguria",
      normal: false,
      selected: false,
      description: "Reduced urine production due to dehydration"
    },
    
    // Neuro
    {
      id: "f20",
      category: "neuro",
      subcategory: "inspection",
      name: "Altered mental status",
      value: "Irritable to lethargic",
      normal: false,
      selected: false,
      description: "Child is irritable but becoming lethargic"
    },
    
    // Psych
    {
      id: "f21",
      category: "psych",
      subcategory: "inspection",
      name: "Anxiety",
      value: "Separation anxiety",
      normal: false,
      selected: false,
      description: "Child is anxious when separated from parent"
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
      reasoning: "Classic presentation in pediatric patient with fever, cough, and respiratory distress. Physical findings consistent with consolidation including nasal flaring, intercostal retractions, grunting, and crackles. Child has poor feeding, irritability, and signs of dehydration. Age-appropriate presentation of bacterial pneumonia with severe respiratory compromise requiring hospitalization.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Bronchiolitis",
      probability: 45,
      reasoning: "Can present with similar respiratory symptoms in young children but would typically have more wheezing and less focal findings. Patient's crackles and focal consolidation make pneumonia more likely.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Asthma Exacerbation",
      probability: 30,
      reasoning: "Can cause respiratory distress in children but would typically have more wheezing and a history of reactive airway disease. Patient's age and focal findings make this less likely.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Foreign Body Aspiration",
      probability: 20,
      reasoning: "Can cause similar findings but would typically have a more acute onset with clear history of choking. Patient's 3-day progression makes this less likely.",
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
                    <p className="font-medium">HR 150 bpm, RR 42/min, Temp 39.2°C, O2 Sat 90%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Weight</span>
                    <p className="font-medium">15 kg</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Toddler presenting with 3-day history of fever, cough, and progressive respiratory distress. 
                    Child is irritable, has poor feeding, and shows signs of increased work of breathing 
                    including nasal flaring, intercostal retractions, and grunting. 
                    Oxygen saturation is low despite supplemental oxygen. 
                    Signs of dehydration with decreased urine output. 
                    Age-appropriate presentation of severe pneumonia requiring hospitalization.
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
                    "My daughter has been running a fever for 3 days and now she's having trouble breathing. 
                    She won't eat anything and just wants to sleep all the time."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> 3 days ago with low-grade fever and mild cough</p>
                    <p><span className="font-medium">Character:</span> Progressive worsening of respiratory symptoms</p>
                    <p><span className="font-medium">Radiation:</span> None</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Poor feeding, irritability, decreased activity</p>
                    <p><span className="font-medium">Alleviating Factors:</span> Fever reducers provide temporary relief</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Activity increases respiratory distress</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Normal development and growth</li>
                    <li>No chronic medical conditions</li>
                    <li>Up to date on immunizations</li>
                    <li>No known drug allergies</li>
                    <li>Attends daycare 3 days per week</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Respiratory</h4>
                      <p className="text-gray-700">Cough, increased work of breathing, grunting</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Constitutional</h4>
                      <p className="text-gray-700">Fever, poor feeding, decreased activity</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">GI</h4>
                      <p className="text-gray-700">Nausea, vomiting, abdominal pain</p>
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
                        Left lower lobe consolidation with air bronchograms. 
                        No pleural effusion. 
                        Mild cardiomegaly.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">Chest X-ray Image Placeholder</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">CT Chest (if indicated)</h3>
                      <p className="text-gray-700">
                        Would show segmental consolidation in left lower lobe with surrounding ground-glass opacity. 
                        May reveal complications such as abscess or empyema.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="labs" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Complete Blood Count</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">WBC</p>
                          <p className="font-medium text-red-600">18,200/μL (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium">11.8 g/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium">35%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">420,000/μL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Inflammatory Markers</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">CRP</p>
                          <p className="font-medium text-red-600">150 mg/L (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ESR</p>
                          <p className="font-medium text-red-600">75 mm/hr (↑)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Blood Cultures</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Pending</p>
                          <p className="font-medium">Results in 24-48 hours</p>
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
                          <p className="font-medium">95/60 mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium text-red-600">150 bpm (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium text-red-600">42/min (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium text-red-600">90% on 2L nasal cannula (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium text-red-600">39.2°C (↑)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Pulse Oximetry</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Oxygen saturation</p>
                          <p className="font-medium text-red-600">90% on 2L nasal cannula (↓)</p>
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
                    value="3-year-old female with 3-day history of fever, cough, and progressive respiratory distress. Child is irritable, has poor feeding, and shows signs of increased work of breathing including nasal flaring, intercostal retractions, and grunting. Physical findings consistent with left lower lobe consolidation including crackles and decreased breath sounds. Chest X-ray shows left lower lobe consolidation. Elevated inflammatory markers and leukocytosis. Signs of dehydration with decreased urine output."
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
                      <span className="text-sm">Fever and productive cough in pediatric patient</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Increased work of breathing (retractions, grunting, nasal flaring)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Consolidation findings on physical exam</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Elevated inflammatory markers and leukocytosis</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Hypoxemia on pulse oximetry</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm">No wheezing or history of reactive airway disease</span>
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
                  <TabsTrigger value="antibiotics">Antibiotics</TabsTrigger>
                  <TabsTrigger value="supportive">Supportive Care</TabsTrigger>
                </TabsList>
                <TabsContent value="acute" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Respiratory Support</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Supplemental oxygen to maintain SpO₂ {'>'} 92%</li>
                        <li>Consider high-flow nasal cannula for severe respiratory distress</li>
                        <li>Monitor for need for mechanical ventilation</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous pulse oximetry</li>
                        <li>Serial vital signs every 2-4 hours</li>
                        <li>Repeat chest X-ray in 48 hours</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Severity Assessment</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Calculate pediatric risk scores</li>
                        <li>Consider ICU admission for severe respiratory distress</li>
                        <li>Monitor for complications (empyema, abscess)</li>
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
                        Based on age, severity, and local resistance patterns
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Amoxicillin-Clavulanate</span>
                          <span className="text-sm font-medium">90mg/kg/day divided BID PO/NG</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Ceftriaxone</span>
                          <span className="text-sm font-medium">75-100mg/kg/day IV once daily</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Azithromycin</span>
                          <span className="text-sm font-medium">10mg/kg/day PO (if atypical coverage needed)</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Duration: 7-10 days. Switch to oral therapy when clinically stable.
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
                          <span className="text-sm font-medium">10mg/kg/day IV/PO (for resistant organisms)</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Vancomycin + Piperacillin-Tazobactam</span>
                          <span className="text-sm font-medium">For MRSA + Pseudomonas coverage</span>
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
                          <span className="text-sm font-medium">Acetaminophen 15mg/kg PO/PR Q6H PRN</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Hydration</span>
                          <span className="text-sm font-medium">IV fluids for dehydration</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Nutrition</span>
                          <span className="text-sm font-medium">Small, frequent feeds or NG if needed</span>
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
                          <span className="text-sm font-medium">PCV13 series</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Influenza vaccination</span>
                          <span className="text-sm font-medium">Annual</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Hand hygiene education</span>
                          <span className="text-sm font-medium">For family members</span>
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
                <Baby className="h-5 w-5 text-white" />
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