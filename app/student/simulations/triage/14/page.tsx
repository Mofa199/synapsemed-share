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

export default function EctopicPregnancySimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Ectopic Pregnancy
  const caseData: PatientCase = {
    id: "14",
    title: "Ruptured Ectopic Pregnancy",
    patientAge: 28,
    patientGender: "Female",
    chiefComplaint: "Severe abdominal pain and vaginal bleeding",
    status: "active",
    timeElapsed: 540, // seconds
    specialty: "Obstetrics",
    category: "Obstetrics-Gynecology",
    difficulty: "Advanced",
    duration: "18 min",
    rating: 4.8,
    reviews: 92,
    description: "Diagnose and manage a patient with ruptured ectopic pregnancy.",
    tags: ["Obstetrics", "Emergency", "Surgery", "Ectopic"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Ectopic Pregnancy
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Hypovolemic shock",
      value: "Signs present",
      normal: false,
      selected: false,
      description: "Patient showing signs of internal hemorrhage"
    },
    {
      id: "f2",
      category: "general",
      subcategory: "inspection",
      name: "Pallor",
      value: "Generalized",
      normal: false,
      selected: false,
      description: "Patient appears pale due to blood loss"
    },
    {
      id: "f3",
      category: "general",
      subcategory: "inspection",
      name: "Diaphoresis",
      value: "Profuse sweating",
      normal: false,
      selected: false,
      description: "Patient is visibly sweating"
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
      name: "Cool extremities",
      value: "Peripherally cool",
      normal: false,
      selected: false,
      description: "Poor peripheral perfusion"
    },
    
    // HEENT
    {
      id: "f6",
      category: "heent",
      subcategory: "inspection",
      name: "Dry mucous membranes",
      value: "Dehydration",
      normal: false,
      selected: false,
      description: "Signs of dehydration from blood loss"
    },
    
    // Cardiac
    {
      id: "f7",
      category: "cardiac",
      subcategory: "inspection",
      name: "Tachycardia",
      value: "HR 135 bpm",
      normal: false,
      selected: false,
      description: "Compensatory tachycardia for hypovolemia"
    },
    {
      id: "f8",
      category: "cardiac",
      subcategory: "inspection",
      name: "Hypotension",
      value: "BP 85/50 mmHg",
      normal: false,
      selected: false,
      description: "Low blood pressure from hemorrhage"
    },
    
    // Respiratory
    {
      id: "f9",
      category: "respiratory",
      subcategory: "inspection",
      name: "Tachypnea",
      value: "RR 26/min",
      normal: false,
      selected: false,
      description: "Increased respiratory rate due to hypovolemia"
    },
    
    // GI
    {
      id: "f10",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal distension",
      value: "Moderate",
      normal: false,
      selected: false,
      description: "Distension from blood in abdomen"
    },
    {
      id: "f11",
      category: "gi",
      subcategory: "inspection",
      name: "Abdominal tenderness",
      value: "Generalized",
      normal: false,
      selected: false,
      description: "Tenderness throughout abdomen"
    },
    {
      id: "f12",
      category: "gi",
      subcategory: "inspection",
      name: "Rebound tenderness",
      value: "Positive",
      normal: false,
      selected: false,
      description: "Pain increases when pressure is released"
    },
    {
      id: "f13",
      category: "gi",
      subcategory: "inspection",
      name: "Guarding",
      value: "Involuntary",
      normal: false,
      selected: false,
      description: "Involuntary muscle contraction to protect inflamed area"
    },
    
    // GU
    {
      id: "f14",
      category: "gu",
      subcategory: "inspection",
      name: "Vaginal bleeding",
      value: "Moderate",
      normal: false,
      selected: false,
      description: "Dark, irregular vaginal bleeding"
    },
    {
      id: "f15",
      category: "gu",
      subcategory: "inspection",
      name: "Cervical motion tenderness",
      value: "Marked",
      normal: false,
      selected: false,
      description: "Pain with cervical manipulation"
    },
    {
      id: "f16",
      category: "gu",
      subcategory: "inspection",
      name: "Adnexal mass",
      value: "Right side",
      normal: false,
      selected: false,
      description: "Palpable mass in right adnexa"
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
    { id: "neuro", label: "Neuro", icon: Brain, color: "text-indigo-500" }
  ];

  // Mock differential diagnoses
  const initialDifferentialDiagnoses: DiagnosticEntry[] = [
    {
      id: "d1",
      diagnosis: "Ruptured Ectopic Pregnancy",
      probability: 90,
      reasoning: "Classic presentation in woman of reproductive age with abdominal pain, vaginal bleeding, and signs of hypovolemic shock. Physical findings include cervical motion tenderness, adnexal mass, and peritoneal signs. Patient's last menstrual period was 7 weeks ago with positive home pregnancy test. Hemodynamic instability and ultrasound findings strongly support ruptured ectopic pregnancy as the primary diagnosis.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Ovarian Torsion",
      probability: 45,
      reasoning: "Can present with acute abdominal pain and adnexal mass. However, typically does not cause hemodynamic instability unless very large or necrotic. Patient's signs of shock and positive pregnancy test make this less likely. Ovarian torsion usually has more acute onset with severe pain but without bleeding.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Pelvic Inflammatory Disease",
      probability: 35,
      reasoning: "Can cause abdominal pain, cervical motion tenderness, and vaginal bleeding. However, typically has more gradual onset with fever and purulent discharge. Patient's acute presentation with hemodynamic instability and positive pregnancy test favor ectopic pregnancy. PID would not cause the degree of shock seen in this patient.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Miscarriage",
      probability: 30,
      reasoning: "Can cause abdominal pain and vaginal bleeding in early pregnancy. However, typically does not cause hemodynamic instability unless complicated by infection or large amount of bleeding. Patient's signs of shock and adnexal mass make ectopic pregnancy more likely. Miscarriage pain is typically crampy rather than sharp and localized.",
      position: 4
    },
    {
      id: "d5",
      diagnosis: "Appendicitis",
      probability: 20,
      reasoning: "Can cause right lower quadrant pain and peritoneal signs. However, would not typically cause vaginal bleeding or positive pregnancy test. Patient's adnexal mass and cervical motion tenderness are not consistent with appendicitis. The combination of pregnancy and right lower quadrant pain should always raise suspicion for ectopic pregnancy.",
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
                    <p className="font-medium">HR 135 bpm, BP 85/50 mmHg, RR 26/min, O2 Sat 94%, Temp 37.3°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Pain Scale</span>
                    <p className="font-medium">9/10 sharp right lower quadrant pain</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Woman of reproductive age presenting with acute onset severe right lower quadrant pain, 
                    vaginal bleeding, and signs of hypovolemic shock. Last menstrual period was 7 weeks ago 
                    with positive home pregnancy test. Physical exam reveals cervical motion tenderness, 
                    adnexal mass, and peritoneal signs. Patient is tachycardic, hypotensive, and diaphoretic. 
                    Classic presentation of ruptured ectopic pregnancy, a life-threatening gynecologic emergency 
                    requiring immediate surgical intervention. ABC assessment reveals compromised circulation.
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
                    "I have really bad pain in my belly and I'm bleeding. I feel dizzy and like I'm going to pass out."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> 3 hours ago, sudden onset severe right lower quadrant pain</p>
                    <p><span className="font-medium">Character:</span> Sharp, stabbing pain with radiation to right shoulder</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Vaginal bleeding, dizziness, weakness, feeling faint</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Movement, deep breathing</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Gynecologic History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Last menstrual period 7 weeks ago</li>
                    <li>Positive home pregnancy test 2 weeks ago</li>
                    <li>Irregular vaginal bleeding for past 3 days</li>
                    <li>No prenatal care yet</li>
                    <li>Gravida 2, Para 1, Abortus 1</li>
                    <li>Previous vaginal delivery</li>
                    <li>History of pelvic inflammatory disease</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Gynecological</h4>
                      <p className="text-gray-700">Vaginal bleeding, pelvic pain</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Gastrointestinal</h4>
                      <p className="text-gray-700">Nausea, vomiting</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cardiovascular</h4>
                      <p className="text-gray-700">Palpitations, chest pain</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Constitutional</h4>
                      <p className="text-gray-700">Dizziness, weakness, fatigue</p>
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
                      <h3 className="font-medium mb-2">Quantitative β-hCG</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">β-hCG Level</p>
                          <p className="font-medium text-red-600">3,200 mIU/mL (↑, non-pregnant &lt;5)</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Positive pregnancy test. Level consistent with 6-7 weeks gestation. 
                        In ectopic pregnancy, levels may be lower than expected for gestational age.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Complete Blood Count</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">WBC</p>
                          <p className="font-medium">11,200/μL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium text-red-600">9.2 g/dL (↓, normal 12-16 g/dL)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium text-red-600">28% (↓, normal 36-46%)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">220,000/μL</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Normocytic anemia consistent with acute blood loss. 
                        Normal platelet count.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Type and Crossmatch</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Blood Type</p>
                          <p className="font-medium">O positive</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Antibody Screen</p>
                          <p className="font-medium">Negative</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Units Crossmatched</p>
                          <p className="font-medium">4 units packed red blood cells</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Transvaginal Ultrasound</h3>
                      <p className="text-gray-700 mb-3">
                        First-line imaging for suspected ectopic pregnancy. 
                        Looks for gestational sac, yolk sac, and fetal pole.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">Transvaginal Ultrasound Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: No intrauterine gestational sac identified. 
                        Complex right adnexal mass measuring 4.5cm with no fetal pole. 
                        Free fluid in pelvis and abdomen consistent with hemoperitoneum. 
                        Findings consistent with ruptured ectopic pregnancy.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Abdominal Ultrasound</h3>
                      <p className="text-gray-700 mb-3">
                        May be used if transvaginal ultrasound is not possible or inconclusive.
                      </p>
                      <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                        <span className="text-gray-500">Abdominal Ultrasound Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: Large amount of free fluid in abdomen. 
                        Cannot clearly visualize pelvic structures due to bowel gas.
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
                          <p className="font-medium text-red-600">85/50 mmHg (↓)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">HR</p>
                          <p className="font-medium text-red-600">135 bpm (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium text-red-600">26/min (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium">94% on room air</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">37.3°C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Pelvic Examination</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Cervix</p>
                          <p className="font-medium">Closed, soft, bluish</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cervical Motion Tenderness</p>
                          <p className="font-medium text-red-600">Marked</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Uterus</p>
                          <p className="font-medium">Normal size, tender</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Adnexa</p>
                          <p className="font-medium text-red-600">Right adnexal mass, left adnexa normal</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Vaginal Bleeding</p>
                          <p className="font-medium text-red-600">Moderate, dark</p>
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
                    value="28-year-old female, 7 weeks pregnant by LMP, presenting with acute onset severe right lower quadrant pain, vaginal bleeding, and signs of hypovolemic shock. Physical exam reveals cervical motion tenderness, right adnexal mass, and peritoneal signs. Quantitative β-hCG is positive at 3,200 mIU/mL. Transvaginal ultrasound shows no intrauterine gestational sac but complex right adnexal mass with free fluid in pelvis. Classic presentation of ruptured ectopic pregnancy requiring immediate surgical intervention."
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
                      <span className="text-sm">Woman of reproductive age with positive pregnancy test</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Acute onset severe abdominal pain</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Vaginal bleeding</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Signs of hypovolemic shock</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Cervical motion tenderness</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Adnexal mass on examination</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Free fluid on ultrasound</span>
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
                        <li>Call for immediate assistance (OB/GYN, anesthesia, blood bank)</li>
                        <li>Ensure patent airway and adequate oxygenation</li>
                        <li>Establish large-bore IV access (at least 2 sites)</li>
                        <li>Initiate aggressive fluid resuscitation</li>
                        <li>Send for immediate type and crossmatch</li>
                        <li>Prepare for emergency surgery</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Secondary Management</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Confirm diagnosis with quantitative β-hCG and ultrasound</li>
                        <li>Monitor vital signs and urine output closely</li>
                        <li>Obtain surgical consent (if patient stable enough)</li>
                        <li>Prepare operating room for emergency laparoscopy/laparotomy</li>
                        <li>Consider Rh immune globulin if Rh negative</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous vital signs and oxygen saturation</li>
                        <li>Serial hemoglobin assessments</li>
                        <li>Hourly intake and output measurements</li>
                        <li>Watch for signs of ongoing hemorrhage</li>
                        <li>Monitor for complications of surgery</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        Preoperative Medications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Antibiotics</span>
                          <span className="text-sm font-medium">Cefazolin 1g IV pre-op</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Antiemetics</span>
                          <span className="text-sm font-medium">Ondansetron 4mg IV PRN</span>
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
                          <span className="text-sm font-medium">PRBCs as needed for ongoing hemorrhage</span>
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
                          <span>Rh Immune Globulin</span>
                          <span className="text-sm font-medium">300mcg IM if Rh negative</span>
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
                        Surgical Options
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Laparoscopy</span>
                          <span className="text-sm font-medium">First-line approach if hemodynamically stable</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Laparotomy</span>
                          <span className="text-sm font-medium">For hemodynamic instability or complex cases</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Surgical Procedures
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Salpingectomy</span>
                          <span className="text-sm font-medium">Removal of affected fallopian tube</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Salpingostomy</span>
                          <span className="text-sm font-medium">Removal of ectopic gestation with tube preservation</span>
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
                          <span>Maternal Mortality</span>
                          <span className="text-sm font-medium">Leading cause of first trimester pregnancy death</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Recurrent Ectopic Pregnancy</span>
                          <span className="text-sm font-medium">10-15% risk after one ectopic pregnancy</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Infertility</span>
                          <span className="text-sm font-medium">Risk with bilateral salpingectomy</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Ongoing Hemorrhage</span>
                          <span className="text-sm font-medium">May require blood transfusion or re-operation</span>
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