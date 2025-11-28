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

export default function DepressionSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Major Depressive Disorder
  const caseData: PatientCase = {
    id: "15",
    title: "Major Depressive Disorder",
    patientAge: 34,
    patientGender: "Female",
    chiefComplaint: "Persistent sadness and loss of interest for 3 months",
    status: "active",
    timeElapsed: 900, // seconds
    specialty: "Psychiatry",
    category: "Psychiatry",
    difficulty: "Intermediate",
    duration: "20 min",
    rating: 4.5,
    reviews: 76,
    description: "Evaluate and manage a patient with symptoms of major depression.",
    tags: ["Psychiatry", "Mental Health", "Diagnosis", "Treatment"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Depression
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Flat affect",
      value: "Diminished emotional expression",
      normal: false,
      selected: false,
      description: "Reduced display of emotions"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Poor eye contact",
      value: "Avoids eye contact",
      normal: false,
      selected: false,
      description: "Patient avoids making eye contact during interview"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Slumped posture",
      value: "Slouched sitting position",
      normal: false,
      selected: false,
      description: "Patient sits with shoulders drooped forward"
    },
    {
      id: "f4",
      category: "general",
      subcategory: "inspection",
      name: "Psychomotor retardation",
      value: "Slowed movements",
      normal: false,
      selected: false,
      description: "Noticeably slow speech and movements"
    },
    
    // Skin
    {
      id: "f5",
      category: "skin",
      subcategory: "inspection",
      name: "Poor grooming",
      value: "Disheveled appearance",
      normal: false,
      selected: false,
      description: "Patient appears unkempt with unwashed hair"
    },
    
    // HEENT
    {
      id: "f6",
      category: "heent",
      subcategory: "inspection",
      name: "Tired appearance",
      value: "Dark circles under eyes",
      normal: false,
      selected: false,
      description: "Patient looks fatigued with dark circles"
    },
    
    // Cardiac
    {
      id: "f7",
      category: "cardiac",
      subcategory: "inspection",
      name: "Bradycardia",
      value: "HR 58 bpm",
      normal: false,
      selected: false,
      description: "Slower than normal heart rate"
    },
    
    // Respiratory
    {
      id: "f8",
      category: "respiratory",
      subcategory: "inspection",
      name: "Shallow breathing",
      value: "Reduced respiratory effort",
      normal: false,
      selected: false,
      description: "Patient takes shallow breaths"
    },
    
    // GI
    {
      id: "f9",
      category: "gi",
      subcategory: "inspection",
      name: "Appetite changes",
      value: "Significant weight loss",
      normal: false,
      selected: false,
      description: "Patient reports 15-pound weight loss in 2 months"
    },
    
    // GU
    {
      id: "f10",
      category: "gu",
      subcategory: "inspection",
      name: "Altered sleep pattern",
      value: "Early morning awakening",
      normal: false,
      selected: false,
      description: "Patient wakes at 4 AM and cannot return to sleep"
    },
    
    // Neuro
    {
      id: "f11",
      category: "neuro",
      subcategory: "inspection",
      name: "Cognitive slowing",
      value: "Delayed responses",
      normal: false,
      selected: false,
      description: "Patient takes longer to respond to questions"
    },
    {
      id: "f12",
      category: "neuro",
      subcategory: "inspection",
      name: "Memory complaints",
      value: "Difficulty concentrating",
      normal: false,
      selected: false,
      description: "Patient reports trouble focusing and remembering"
    },
    
    // Psych
    {
      id: "f13",
      category: "psych",
      subcategory: "inspection",
      name: "Depressed mood",
      value: "Tearful, sad",
      normal: false,
      selected: false,
      description: "Patient appears visibly sad and tearful"
    },
    {
      id: "f14",
      category: "psych",
      subcategory: "inspection",
      name: "Anhedonia",
      value: "Loss of interest",
      normal: false,
      selected: false,
      description: "Patient reports no longer enjoying previously pleasurable activities"
    },
    {
      id: "f15",
      category: "psych",
      subcategory: "inspection",
      name: "Hopelessness",
      value: "Pessimistic outlook",
      normal: false,
      selected: false,
      description: "Patient expresses feelings of despair about the future"
    },
    {
      id: "f16",
      category: "psych",
      subcategory: "inspection",
      name: "Helplessness",
      value: "Feeling powerless",
      normal: false,
      selected: false,
      description: "Patient feels unable to change their situation"
    },
    {
      id: "f17",
      category: "psych",
      subcategory: "inspection",
      name: "Guilt",
      value: "Excessive self-blame",
      normal: false,
      selected: false,
      description: "Patient expresses unwarranted guilt about past events"
    },
    {
      id: "f18",
      category: "psych",
      subcategory: "inspection",
      name: "Suicidal ideation",
      value: "Passive thoughts",
      normal: false,
      selected: false,
      description: "Patient reports wishing they could go to sleep and not wake up"
    },
    {
      id: "f19",
      category: "psych",
      subcategory: "inspection",
      name: "Anxiety",
      value: "Restless worry",
      normal: false,
      selected: false,
      description: "Patient reports constant worrying and nervousness"
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
    { id: "psych", label: "Psych", icon: Baby, color: "text-teal-500" }
  ];

  // Mock differential diagnoses
  const initialDifferentialDiagnoses: DiagnosticEntry[] = [
    {
      id: "d1",
      diagnosis: "Major Depressive Disorder",
      probability: 85,
      reasoning: "Patient meets DSM-5 criteria with depressed mood, anhedonia, weight loss, insomnia, psychomotor changes, fatigue, feelings of worthlessness, decreased concentration, and suicidal ideation for more than 2 weeks. Symptoms cause significant distress and impairment in functioning. No evidence of manic or hypomanic episodes. Classic presentation of unipolar depression requiring treatment.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Bipolar Disorder",
      probability: 30,
      reasoning: "Can present with depressive episodes but patient denies any history of manic or hypomanic episodes. Important to assess for past episodes of elevated mood, increased energy, decreased need for sleep, or impulsive behavior. Family history of bipolar disorder would increase likelihood. Patient's presentation is more consistent with unipolar depression at this time.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Persistent Depressive Disorder (Dysthymia)",
      probability: 25,
      reasoning: "Chronic form of depression lasting more than 2 years. Patient's symptoms have been present for 3 months, which is insufficient for this diagnosis. However, if symptoms persist beyond 2 years, this would be reconsidered. Patient's current presentation is more consistent with major depression.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Adjustment Disorder with Depressed Mood",
      probability: 20,
      reasoning: "Can occur in response to an identifiable stressor. Patient reports recent job loss and marital difficulties, which could trigger depressive symptoms. However, symptoms are severe and have persisted beyond 6 months, making this less likely. Major depression is more appropriate given symptom severity and duration.",
      position: 4
    },
    {
      id: "d5",
      diagnosis: "Generalized Anxiety Disorder",
      probability: 15,
      reasoning: "Can present with worry, restlessness, and concentration problems. However, patient's primary symptoms are depressed mood and anhedonia rather than anxiety. Anxiety appears to be secondary to depression. The constellation of symptoms is more consistent with major depression with anxious distress.",
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
                    <p className="font-medium">HR 58 bpm, BP 110/70 mmHg, RR 14/min, O2 Sat 98%, Temp 36.8°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Mood</span>
                    <p className="font-medium">Depressed, tearful</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Middle-aged female presenting with 3-month history of persistent sadness, 
                    loss of interest in activities, and multiple associated symptoms. 
                    Patient appears tearful with flat affect, poor eye contact, and slumped posture. 
                    Reports significant weight loss, insomnia, fatigue, and feelings of worthlessness. 
                    Endorses passive suicidal ideation without specific plans. 
                    ABC assessment stable but patient at risk for self-harm. 
                    Requires thorough psychiatric evaluation and safety assessment.
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
                    "I just feel so sad all the time. I don't enjoy anything anymore, 
                    and I can't seem to get out of this hole I'm in."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> 3 months ago, gradual onset with no specific trigger</p>
                    <p><span className="font-medium">Character:</span> Persistent low mood with anhedonia</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Sleep disturbance, appetite changes, fatigue, feelings of worthlessness, difficulty concentrating</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Morning hours, social situations</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Psychiatric History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>No prior psychiatric hospitalizations</li>
                    <li>No previous treatment for depression</li>
                    <li>No history of mania or hypomania</li>
                    <li>No substance use disorders</li>
                    <li>Family history: Mother with depression, paternal grandfather with suicide</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Social History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Married with two children (ages 8 and 12)</li>
                    <li>Recently lost job as office manager due to poor performance</li>
                    <li>Reports increasing conflict with spouse</li>
                    <li>Minimal social support network</li>
                    <li>Denies alcohol or drug use</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Psychiatric</h4>
                      <p className="text-gray-700">Depressed mood, anhedonia, anxiety</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Neurological</h4>
                      <p className="text-gray-700">Headaches, dizziness</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Sleep</h4>
                      <p className="text-gray-700">Early morning awakening, non-restorative sleep</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Appetite</h4>
                      <p className="text-gray-700">Decreased appetite, weight loss</p>
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
                          <p className="font-medium">6,800/μL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium">12.4 g/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium">37%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">240,000/μL</p>
                        </div>
                      </div>
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
                          <p className="font-medium">4.2 mEq/L</p>
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
                          <p className="font-medium">15 mg/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cr</p>
                          <p className="font-medium">0.9 mg/dL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Glu</p>
                          <p className="font-medium">92 mg/dL</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Thyroid Function Tests</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">TSH</p>
                          <p className="font-medium">2.1 mIU/L</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Free T4</p>
                          <p className="font-medium">1.1 ng/dL</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Normal thyroid function excludes hypothyroidism as cause of depression.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Brain MRI</h3>
                      <p className="text-gray-700 mb-3">
                        Not routinely indicated for depression but may be considered 
                        if neurological symptoms are present or to rule out structural causes.
                      </p>
                      <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                        <span className="text-gray-500">Brain MRI Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: No structural abnormalities identified. 
                        Normal brain parenchyma and ventricular system.
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
                          <p className="font-medium">110/70 mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium text-red-600">58 bpm (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium">14/min</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium">98% on room air</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">36.8°C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Mental Status Examination</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Appearance</p>
                          <p className="font-medium text-red-600">Disheveled, poor grooming</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Behavior</p>
                          <p className="font-medium text-red-600">Psychomotor retardation</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Speech</p>
                          <p className="font-medium text-red-600">Slow, soft</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Mood</p>
                          <p className="font-medium text-red-600">"Sad, hopeless"</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Affect</p>
                          <p className="font-medium text-red-600">Restricted, tearful</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Thought Process</p>
                          <p className="font-medium">Logical, goal-directed</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Thought Content</p>
                          <p className="font-medium text-red-600">Depressive ideation, passive SI</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cognition</p>
                          <p className="font-medium text-red-600">Impaired concentration, memory intact</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Insight</p>
                          <p className="font-medium">Fair</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Judgment</p>
                          <p className="font-medium">Intact</p>
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
                    value="34-year-old female presenting with 3-month history of persistent sadness, anhedonia, weight loss, insomnia, fatigue, feelings of worthlessness, and difficulty concentrating. Mental status exam reveals flat affect, psychomotor retardation, and passive suicidal ideation. Physical exam and labs are unremarkable. Family history significant for depression and suicide. Meets DSM-5 criteria for Major Depressive Disorder, single episode, moderate severity. Requires immediate treatment and safety assessment."
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
                      <span className="text-sm">Depressed mood for &gt;2 weeks</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Anhedonia or loss of interest</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Significant weight change or appetite disturbance</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Sleep disturbance</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Psychomotor agitation or retardation</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Fatigue or loss of energy</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Feelings of worthlessness or excessive guilt</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Diminished ability to think or concentrate</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Recurrent thoughts of death or suicidal ideation</span>
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
                  <TabsTrigger value="therapies">Therapies</TabsTrigger>
                </TabsList>
                <TabsContent value="acute" className="mt-4">
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-1">
                      <h3 className="font-medium">Immediate Priorities</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Complete thorough safety assessment including suicide risk evaluation</li>
                        <li>Develop safety plan with patient and family involvement</li>
                        <li>Ensure immediate support system is in place</li>
                        <li>Initiate psychiatric treatment plan</li>
                        <li>Arrange follow-up within 1 week</li>
                        <li>Provide patient and family education about depression</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Safety Assessment</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Evaluate for active suicidal ideation with intent and plan</li>
                        <li>Assess for homicidal ideation</li>
                        <li>Determine level of support and supervision available</li>
                        <li>Identify means of self-harm in the environment</li>
                        <li>Develop crisis plan with emergency contacts</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Weekly psychiatric follow-up initially</li>
                        <li>Monitor for medication side effects</li>
                        <li>Assess response to treatment</li>
                        <li>Watch for worsening depression or emergence of mania</li>
                        <li>Evaluate adherence to treatment plan</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        First-Line Antidepressants
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>SSRIs</span>
                          <span className="text-sm font-medium">Sertraline 50mg daily, increase as tolerated</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>SNRIs</span>
                          <span className="text-sm font-medium">Venlafaxine 37.5mg twice daily</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Adjunctive Medications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Anxiolytics</span>
                          <span className="text-sm font-medium">Lorazepam 0.5mg TID PRN for severe anxiety</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Sleep Aids</span>
                          <span className="text-sm font-medium">Trazodone 50mg QHS PRN for insomnia</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Monitoring Parameters
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Therapeutic Response</span>
                          <span className="text-sm font-medium">4-6 weeks for full effect</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Side Effects</span>
                          <span className="text-sm font-medium">Monitor for sexual dysfunction, weight changes</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Suicide Risk</span>
                          <span className="text-sm font-medium">May increase early in treatment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="therapies" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <HeartPulse className="h-4 w-4" />
                        Psychotherapy Options
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Cognitive Behavioral Therapy</span>
                          <span className="text-sm font-medium">First-line psychological treatment</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Interpersonal Therapy</span>
                          <span className="text-sm font-medium">Focus on relationship issues</span>
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
                          <span>Exercise</span>
                          <span className="text-sm font-medium">30 minutes moderate activity 3-5 times per week</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Sleep Hygiene</span>
                          <span className="text-sm font-medium">Regular sleep schedule, bedtime routine</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Nutrition</span>
                          <span className="text-sm font-medium">Balanced diet, regular meals</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Social Support</span>
                          <span className="text-sm font-medium">Encourage social connections and activities</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Important Considerations
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Black Box Warning</span>
                          <span className="text-sm font-medium">Monitor for increased suicidality in young adults</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Pregnancy Considerations</span>
                          <span className="text-sm font-medium">Discuss risks and benefits if childbearing potential</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Drug Interactions</span>
                          <span className="text-sm font-medium">Avoid with MAOIs, monitor with other serotonergics</span>
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