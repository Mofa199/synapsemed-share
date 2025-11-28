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

export default function StrokeSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("neuro");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Acute Ischemic Stroke
  const caseData: PatientCase = {
    id: "4",
    title: "Acute Ischemic Stroke (Left MCA Territory)",
    patientAge: 68,
    patientGender: "Male",
    chiefComplaint: "Sudden onset right-sided weakness and speech difficulty 90 minutes ago",
    status: "active",
    timeElapsed: 725, // seconds
    specialty: "Neurology",
    category: "Medical",
    difficulty: "Advanced",
    duration: "28 min",
    rating: 4.7,
    reviews: 142,
    description: "Evaluate and manage a patient with acute neurological deficit.",
    tags: ["Neurology", "Stroke", "Thrombolytics", "Emergency"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Stroke
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Alert but anxious",
      value: "Appears distressed",
      normal: false,
      selected: false,
      description: "Patient is alert but visibly anxious about symptoms"
    },
    
    // Skin
    {
      id: "f2",
      category: "skin",
      subcategory: "inspection",
      name: "Normal skin appearance",
      value: "No abnormalities",
      normal: true,
      selected: false,
      description: "Skin appears normal without pallor or cyanosis"
    },
    
    // HEENT
    {
      id: "f3",
      category: "heent",
      subcategory: "inspection",
      name: "Normal head exam",
      value: "No trauma",
      normal: true,
      selected: false,
      description: "No signs of head trauma or injury"
    },
    
    // Cardiac
    {
      id: "f4",
      category: "cardiac",
      subcategory: "inspection",
      name: "Normal JVP",
      value: "Not elevated",
      normal: true,
      selected: false,
      description: "Jugular venous pressure within normal limits"
    },
    {
      id: "f5",
      category: "cardiac",
      subcategory: "auscultation",
      name: "Regular rate and rhythm",
      value: "No murmurs",
      normal: true,
      selected: false,
      description: "Heart sounds normal without murmurs"
    },
    
    // Respiratory
    {
      id: "f6",
      category: "respiratory",
      subcategory: "inspection",
      name: "Normal breathing",
      value: "No distress",
      normal: true,
      selected: false,
      description: "Patient breathing comfortably without distress"
    },
    
    // GI
    {
      id: "f7",
      category: "gi",
      subcategory: "inspection",
      name: "Normal abdomen",
      value: "Soft, non-tender",
      normal: true,
      selected: false,
      description: "Abdomen soft and non-tender"
    },
    
    // GU
    {
      id: "f8",
      category: "gu",
      subcategory: "inspection",
      name: "Normal GU exam",
      value: "No abnormalities",
      normal: true,
      selected: false,
      description: "No GU system abnormalities noted"
    },
    
    // Neuro
    {
      id: "f9",
      category: "neuro",
      subcategory: "inspection",
      name: "Right facial droop",
      value: "Lower motor neuron",
      normal: false,
      selected: false,
      description: "Asymmetric facial weakness on right side"
    },
    {
      id: "f10",
      category: "neuro",
      subcategory: "inspection",
      name: "Right arm weakness",
      value: "Unable to raise arm",
      normal: false,
      selected: false,
      description: "Patient unable to raise right arm against gravity"
    },
    {
      id: "f11",
      category: "neuro",
      subcategory: "inspection",
      name: "Right leg weakness",
      value: "4/5 strength",
      normal: false,
      selected: false,
      description: "Right leg strength reduced to 4/5"
    },
    {
      id: "f12",
      category: "neuro",
      subcategory: "inspection",
      name: "Dysarthric speech",
      value: "Slurred and unclear",
      normal: false,
      selected: false,
      description: "Speech is slurred and difficult to understand"
    },
    {
      id: "f13",
      category: "neuro",
      subcategory: "inspection",
      name: "Left gaze preference",
      value: "Eyes deviate left",
      normal: false,
      selected: false,
      description: "Eyes show preference for leftward gaze"
    },
    {
      id: "f14",
      category: "neuro",
      subcategory: "coordination",
      name: "Right-sided ataxia",
      value: "Finger-nose test abnormal",
      normal: false,
      selected: false,
      description: "Right finger-nose test shows dysmetria"
    },
    {
      id: "f15",
      category: "neuro",
      subcategory: "sensation",
      name: "Right hemisensory loss",
      value: "Decreased sensation",
      normal: false,
      selected: false,
      description: "Decreased sensation on right side of body"
    },
    {
      id: "f16",
      category: "neuro",
      subcategory: "reflexes",
      name: "Right-sided hyperreflexia",
      value: "3+ reflexes",
      normal: false,
      selected: false,
      description: "Hyperreflexia on right side with positive Babinski"
    },
    {
      id: "f17",
      category: "neuro",
      subcategory: "cognitive",
      name: "Aphasia",
      value: "Expressive and receptive",
      normal: false,
      selected: false,
      description: "Difficulty with both understanding and producing speech"
    },
    {
      id: "f18",
      category: "neuro",
      subcategory: "cranial nerves",
      name: "CN VII palsy",
      value: "Right-sided",
      normal: false,
      selected: false,
      description: "Right facial nerve palsy with forehead sparing"
    },
    
    // Musculoskeletal
    {
      id: "f19",
      category: "musculoskeletal",
      subcategory: "inspection",
      name: "Right-sided hemiparesis",
      value: "Motor deficit",
      normal: false,
      selected: false,
      description: "Weakness affecting right side of body"
    },
    
    // Psych
    {
      id: "f20",
      category: "psych",
      subcategory: "inspection",
      name: "Anosognosia",
      value: "Unaware of deficit",
      normal: false,
      selected: false,
      description: "Patient unaware of neurological deficit"
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
      diagnosis: "Acute Ischemic Stroke (Left Middle Cerebral Artery Territory)",
      probability: 85,
      reasoning: "Classic presentation of sudden onset right-sided hemiparesis, facial droop, and aphasia in elderly patient with vascular risk factors. Symptoms consistent with left MCA territory infarction affecting motor cortex, Broca's area, and corticospinal tract. Time of onset within thrombolytic window.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Intracranial Hemorrhage",
      probability: 40,
      reasoning: "Can present with similar acute neurological deficits but typically associated with headache, altered consciousness, and hypertension. Patient's presentation is more consistent with ischemic stroke, but CT brain needed to differentiate.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Brain Tumor with Hemorrhage",
      probability: 25,
      reasoning: "Could present with focal neurological deficits but would typically have more gradual onset or associated symptoms like headache and seizures. Patient's acute presentation makes this less likely.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Seizure with Todd's Paralysis",
      probability: 20,
      reasoning: "Postictal paralysis can mimic stroke but typically resolves within hours. Patient's persistent deficits and classic stroke pattern make this less likely, but history of seizure would be important.",
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
                    <p className="font-medium">HR 88 bpm, BP 165/95 mmHg, RR 16/min</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">NIHSS Score</span>
                    <p className="font-medium">14 (Moderate stroke)</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Elderly male presenting with acute onset right-sided weakness and speech difficulty. 
                    Patient is alert but anxious. Symptoms began 90 minutes ago while watching television. 
                    Family reports patient has history of hypertension and atrial fibrillation. 
                    Time of onset is clearly documented, placing patient within thrombolytic window.
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
                    "I can't move my right arm and I'm having trouble speaking. This started suddenly about an hour and a half ago."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> Sudden onset while watching television</p>
                    <p><span className="font-medium">Character:</span> Right-sided weakness and speech difficulty</p>
                    <p><span className="font-medium">Radiation:</span> None</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Right facial droop, difficulty understanding speech</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Attempting to use right arm worsens awareness of deficit</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Past Medical History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Hypertension (15 years)</li>
                    <li>Atrial Fibrillation (5 years)</li>
                    <li>Hyperlipidemia</li>
                    <li>Diabetes Mellitus Type 2</li>
                    <li>Previous TIA 2 years ago</li>
                    <li>No known drug allergies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Neurological</h4>
                      <p className="text-gray-700">Right-sided weakness, speech difficulty, facial droop</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cardiovascular</h4>
                      <p className="text-gray-700">History of atrial fibrillation, hypertension</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Constitutional</h4>
                      <p className="text-gray-700">No headache, no loss of consciousness</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Psychiatric</h4>
                      <p className="text-gray-700">Anxious about symptoms</p>
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
                      <h3 className="font-medium mb-2">Non-Contrast CT Head</h3>
                      <p className="text-gray-700 mb-3">
                        No evidence of hemorrhage. Mild loss of gray-white differentiation in left MCA territory. 
                        No mass effect or midline shift.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">CT Head Image Placeholder</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">CT Angiography (if indicated)</h3>
                      <p className="text-gray-700">
                        Would show occlusion of left middle cerebral artery with good collateral flow.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">MRI Brain (if available)</h3>
                      <p className="text-gray-700">
                        DWI sequence would show hyperintensity in left MCA territory consistent with acute infarction.
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
                          <p className="font-medium">8,200/μL</p>
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
                          <p className="font-medium">250,000/μL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Coagulation Studies</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">PT/INR</p>
                          <p className="font-medium">1.1/1.0</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PTT</p>
                          <p className="font-medium">28 sec</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Chemistry Panel</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Glucose</p>
                          <p className="font-medium">110 mg/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Creatinine</p>
                          <p className="font-medium">1.1 mg/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Electrolytes</p>
                          <p className="font-medium">Normal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="bedside" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">NIH Stroke Scale</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Score</p>
                          <p className="font-medium">14 (Moderate stroke)</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Components: Level of consciousness (1), Gaze (2), Visual fields (0), Facial palsy (2), 
                        Motor arm (4), Motor leg (4), Ataxia (1), Sensory (0), Language (2), Dysarthria (1), Extinction (0)
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Vital Signs</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">BP</p>
                          <p className="font-medium text-red-600">165/95 mmHg (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium">88 bpm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium">16/min</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium">98% on room air</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">37.0°C</p>
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
                    value="68-year-old male with sudden onset right-sided weakness and speech difficulty 90 minutes ago. History of hypertension, atrial fibrillation, and previous TIA. NIHSS score of 14 indicating moderate stroke. Physical findings consistent with left MCA territory infarction including right facial droop, hemiparesis, and aphasia. Non-contrast CT head shows no hemorrhage."
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
                      <span className="text-sm">Sudden onset neurological deficit</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Classic left MCA syndrome pattern</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Time of onset within thrombolytic window</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Vascular risk factors (AFib, HTN, DM)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">No evidence of hemorrhage on CT</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-sm">No headache or loss of consciousness</span>
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
                  <TabsTrigger value="thrombolytics">Thrombolytics</TabsTrigger>
                  <TabsTrigger value="supportive">Supportive Care</TabsTrigger>
                </TabsList>
                <TabsContent value="acute" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Immediate Assessment</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Confirm time of onset and last known well</li>
                        <li>Perform NIH Stroke Scale</li>
                        <li>Check blood glucose level</li>
                        <li>Obtain non-contrast CT head</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Airway and Breathing</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Assess airway patency and need for protection</li>
                        <li>Monitor for aspiration risk</li>
                        <li>Administer oxygen if hypoxic</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous cardiac monitoring</li>
                        <li>Neurological checks every 15 minutes initially</li>
                        <li>Blood pressure management per protocol</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="thrombolytics" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Alteplase (tPA) Inclusion Criteria
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Age ≥18 years</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Diagnosis of ischemic stroke</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Time of onset clearly documented</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Significant disability (NIHSS ≥4)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">CT scan shows no hemorrhage</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Alteplase Contraindications
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Active bleeding or bleeding diathesis</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Recent surgery or trauma (≤14 days)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Severe hypertension (BP &gt;185/110 mmHg)</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Recent stroke (≤3 months)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Alteplase Dosing
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Weight-based dosing</span>
                          <span className="text-sm font-medium">0.9 mg/kg (maximum 90 mg)</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Administration</span>
                          <span className="text-sm font-medium">10% IV bolus, 90% over 60 min</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Time window</span>
                          <span className="text-sm font-medium">≤4.5 hours from symptom onset</span>
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
                        Blood Pressure Management
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Pre-tPA</span>
                          <span className="text-sm font-medium">Reduce if BP &gt;185/110 mmHg</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Post-tPA (first 24 hours)</span>
                          <span className="text-sm font-medium">Maintain BP &lt;180/105 mmHg</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Secondary Prevention
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Antiplatelet therapy</span>
                          <span className="text-sm font-medium">Aspirin 325 mg daily</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Anticoagulation</span>
                          <span className="text-sm font-medium">Consider for AFib after 24-48 hours</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Lipid management</span>
                          <span className="text-sm font-medium">Statin therapy</span>
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
                <Brain className="h-5 w-5 text-white" />
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