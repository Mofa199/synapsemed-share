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

export default function PostpartumHemorrhageSimulationCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("triage");
  const [activeCategory, setActiveCategory] = useState("general");
  const [showDiagnosticPad, setShowDiagnosticPad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [problemRepresentation, setProblemRepresentation] = useState("");
  const [selectedFindings, setSelectedFindings] = useState<PatientFinding[]>([]);
  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<DiagnosticEntry[]>([]);
  
  // Mock case data for Postpartum Hemorrhage
  const caseData: PatientCase = {
    id: "13",
    title: "Postpartum Hemorrhage (Uterine Atony)",
    patientAge: 26,
    patientGender: "Female",
    chiefComplaint: "Heavy vaginal bleeding after vaginal delivery",
    status: "active",
    timeElapsed: 420, // seconds
    specialty: "Obstetrics",
    category: "Obstetrics-Gynecology",
    difficulty: "Advanced",
    duration: "20 min",
    rating: 4.7,
    reviews: 84,
    description: "Recognize and manage a patient with postpartum hemorrhage due to uterine atony.",
    tags: ["Obstetrics", "Hemorrhage", "Emergency", "Uterine"],
    completed: false,
    score: undefined
  };

  // Mock findings data specific to Postpartum Hemorrhage
  const findings: PatientFinding[] = [
    // General
    {
      id: "f1",
      category: "general",
      subcategory: "inspection",
      name: "Hypovolemic shock",
      value: "Early signs",
      normal: false,
      selected: false,
      description: "Patient showing signs of blood loss"
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
      value: "HR 130 bpm",
      normal: false,
      selected: false,
      description: "Compensatory tachycardia for hypovolemia"
    },
    {
      id: "f8",
      category: "cardiac",
      subcategory: "inspection",
      name: "Hypotension",
      value: "BP 90/60 mmHg",
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
      value: "RR 24/min",
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
      value: "Uterine",
      normal: false,
      selected: false,
      description: "Enlarged uterus due to blood collection"
    },
    
    // GU
    {
      id: "f11",
      category: "gu",
      subcategory: "inspection",
      name: "Heavy vaginal bleeding",
      value: "Soaking pad every 15 min",
      normal: false,
      selected: false,
      description: "Active bleeding from uterus"
    },
    {
      id: "f12",
      category: "gu",
      subcategory: "inspection",
      name: "Blood clots",
      value: "Large clots &gt; golf ball size",
      normal: false,
      selected: false,
      description: "Large blood clots in vaginal bleeding"
    },
    {
      id: "f13",
      category: "gu",
      subcategory: "inspection",
      name: "Uterine atony",
      value: "Boggy, poorly contracted",
      normal: false,
      selected: false,
      description: "Uterus is soft and poorly contracted"
    },
    {
      id: "f14",
      category: "gu",
      subcategory: "inspection",
      name: "Retained placental tissue",
      value: "Suspected",
      normal: false,
      selected: false,
      description: "Possible retained placental fragments"
    },
    
    // Neuro
    {
      id: "f15",
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
      diagnosis: "Postpartum Hemorrhage (Uterine Atony)",
      probability: 85,
      reasoning: "Most common cause of PPH, accounting for 70-80% of cases. Patient has heavy vaginal bleeding, boggy uterus, and signs of hypovolemic shock. Delivered 30 minutes ago after uncomplicated vaginal delivery. No evidence of lacerations or retained products. Classic presentation of uterine atony with failure of myometrial contraction after delivery.",
      position: 1
    },
    {
      id: "d2",
      diagnosis: "Retained Placental Tissue",
      probability: 40,
      reasoning: "Second most common cause of PPH. Can present with continued bleeding and failure of uterine contraction. Patient has heavy bleeding and clots, which may indicate retained tissue. Manual exploration of uterus or ultrasound may be needed to confirm. Should be considered in any case of PPH.",
      position: 2
    },
    {
      id: "d3",
      diagnosis: "Genital Tract Lacerations",
      probability: 35,
      reasoning: "Can cause significant bleeding after delivery. Patient has heavy vaginal bleeding, but external inspection may not reveal all lacerations. May require speculum examination and repair. Often occurs with precipitous delivery or large fetal size. Less likely with boggy uterus as primary finding.",
      position: 3
    },
    {
      id: "d4",
      diagnosis: "Uterine Inversion",
      probability: 15,
      reasoning: "Rare but life-threatening condition where uterus turns inside out. Can cause massive hemorrhage and shock. Patient has signs of severe hemorrhage but no specific findings for inversion on initial exam. Usually diagnosed by visualization of inverted uterus during examination.",
      position: 4
    },
    {
      id: "d5",
      diagnosis: "Coagulopathy",
      probability: 10,
      reasoning: "Can cause bleeding after delivery, especially in cases of abruptio placentae, amniotic fluid embolism, or disseminated intravascular coagulation. Patient has no known risk factors for coagulopathy. Laboratory studies would help differentiate. Less likely as primary cause in this scenario.",
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
                    <p className="font-medium">HR 130 bpm, BP 90/60 mmHg, RR 24/min, O2 Sat 95%, Temp 37.1°C</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Time Postpartum</span>
                    <p className="font-medium">30 minutes</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Initial Assessment</h3>
                  <p className="text-gray-700">
                    Young female who delivered vaginally 30 minutes ago now presenting with heavy vaginal bleeding 
                    and signs of hypovolemic shock. Uterus is boggy and poorly contracted. 
                    Patient is tachycardic, hypotensive, and diaphoretic. 
                    Classic presentation of postpartum hemorrhage due to uterine atony. 
                    This is a life-threatening obstetric emergency requiring immediate intervention. 
                    ABC assessment reveals compromised circulation.
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
                    "I'm bleeding so much! I'm soaking through the pads and I feel so dizzy and weak."
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">History of Present Illness</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-medium">Onset:</span> Immediately after delivery of placenta</p>
                    <p><span className="font-medium">Character:</span> Heavy vaginal bleeding with large clots</p>
                    <p><span className="font-medium">Associated Symptoms:</span> Dizziness, weakness, feeling faint</p>
                    <p><span className="font-medium">Alleviating Factors:</span> None</p>
                    <p><span className="font-medium">Aggravating Factors:</span> Time progression of bleeding</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Obstetric History</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Gravida 2, Para 1, Abortus 0</li>
                    <li>39 weeks gestation, spontaneous onset of labor</li>
                    <li>Normal progression of labor, no augmentation</li>
                    <li>Vaginal delivery of 3.2kg male infant</li>
                    <li>Spontaneous delivery of placenta 30 minutes ago</li>
                    <li>Estimated blood loss 500mL at delivery</li>
                    <li>No shoulder dystocia or other complications</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Review of Systems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Gynecological</h4>
                      <p className="text-gray-700">Heavy vaginal bleeding, passage of clots</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cardiovascular</h4>
                      <p className="text-gray-700">Palpitations, chest pain</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Constitutional</h4>
                      <p className="text-gray-700">Dizziness, weakness, fatigue</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Other Systems</h4>
                      <p className="text-gray-700">No respiratory or neurological symptoms</p>
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
                          <p className="font-medium">12,500/μL</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hgb</p>
                          <p className="font-medium text-red-600">7.8 g/dL (↓, normal 12-16 g/dL)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hct</p>
                          <p className="font-medium text-red-600">23% (↓, normal 36-46%)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Plt</p>
                          <p className="font-medium">180,000/μL</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Severe anemia consistent with significant blood loss. 
                        Normal platelet count.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Coagulation Studies</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">PT</p>
                          <p className="font-medium">14.2 sec (↑, normal 11-13 sec)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PTT</p>
                          <p className="font-medium">32 sec (↑, normal 25-35 sec)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">INR</p>
                          <p className="font-medium">1.3 (↑, normal 0.8-1.2)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fibrinogen</p>
                          <p className="font-medium text-red-600">180 mg/dL (↓, normal 200-400 mg/dL)</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Coagulopathy developing from massive transfusion and consumption. 
                        Fibrinogen levels are particularly important in obstetric hemorrhage.
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
                          <p className="font-medium">6 units packed red blood cells</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="imaging" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Pelvic Ultrasound</h3>
                      <p className="text-gray-700 mb-3">
                        Used to assess for retained products, uterine atony, and pelvic hematomas.
                      </p>
                      <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">Pelvic Ultrasound Image Placeholder</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">
                        Findings: Enlarged uterus with heterogeneous echotexture. 
                        No discrete retained products identified. 
                        Small amount of free fluid in pelvis consistent with blood.
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
                          <p className="font-medium text-red-600">130 bpm (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">RR</p>
                          <p className="font-medium text-red-600">24/min (↑)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">O2 Sat</p>
                          <p className="font-medium">95% on room air</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Temp</p>
                          <p className="font-medium">37.1°C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Obstetric Examination</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Fundal Height</p>
                          <p className="font-medium text-red-600">2 fingerbreadths above umbilicus</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Uterine Consistency</p>
                          <p className="font-medium text-red-600">Boggy, poorly contracted</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Vaginal Bleeding</p>
                          <p className="font-medium text-red-600">Heavy, continuous, with clots</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cervix</p>
                          <p className="font-medium">Closed</p>
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
                    value="26-year-old female who delivered vaginally 30 minutes ago now presenting with heavy vaginal bleeding and signs of hypovolemic shock. Uterus is boggy and poorly contracted. Labs show severe anemia and developing coagulopathy. Pelvic ultrasound shows enlarged uterus with no retained products. Classic presentation of postpartum hemorrhage due to uterine atony, the most common cause of PPH. Immediate intervention required to prevent maternal mortality."
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
                      <span className="text-sm">Recent vaginal delivery (30 minutes ago)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Heavy vaginal bleeding with clots</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Boggy, poorly contracted uterus</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Signs of hypovolemic shock</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Tachycardia and hypotension</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Severe anemia on labs</span>
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
                        <li>Call for immediate assistance (OB, anesthesia, blood bank)</li>
                        <li>Ensure patent airway and adequate oxygenation</li>
                        <li>Establish large-bore IV access (at least 2 sites)</li>
                        <li>Initiate aggressive fluid resuscitation</li>
                        <li>Continuous cardiac monitoring</li>
                        <li>Frequent vital signs and urine output monitoring</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-1">
                      <h3 className="font-medium">Secondary Management</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Immediate uterine massage and bimanual compression</li>
                        <li>Assess for lacerations and retained products</li>
                        <li>Initiate medical management for uterine atony</li>
                        <li>Prepare for massive transfusion protocol if needed</li>
                        <li>Monitor for signs of disseminated intravascular coagulation</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4 py-1">
                      <h3 className="font-medium">Monitoring</h3>
                      <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li>Continuous vital signs and oxygen saturation</li>
                        <li>Serial hemoglobin and coagulation studies</li>
                        <li>Hourly intake and output measurements</li>
                        <li>Uterine consistency assessments</li>
                        <li>Watch for signs of ongoing hemorrhage</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="medications" className="mt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        First-Line Uterotonic Agents
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Oxytocin</span>
                          <span className="text-sm font-medium">10-40 units in 1L crystalloid IV</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Methylergonovine</span>
                          <span className="text-sm font-medium">0.2mg IM/IV every 2-4 hours</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Second-Line Agents
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Carboprost (Hemabate)</span>
                          <span className="text-sm font-medium">250mcg IM every 15 min × 4 doses</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Misoprostol</span>
                          <span className="text-sm font-medium">800-1000mcg rectally or sublingually</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Resuscitation Fluids
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Crystalloids</span>
                          <span className="text-sm font-medium">Normal saline or LR, 1-2L bolus</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Blood Products</span>
                          <span className="text-sm font-medium">PRBCs, FFP, platelets in 1:1:1 ratio</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Specific Factors</span>
                          <span className="text-sm font-medium">Cryoprecipitate for fibrinogen &lt;150 mg/dL</span>
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
                          <span>Uterine Massage</span>
                          <span className="text-sm font-medium">Continuous bimanual compression</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Uterine Balloon Tamponade</span>
                          <span className="text-sm font-medium">Sengstaken-Blakemore or Bakri balloon</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Surgical Interventions
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Uterine Artery Ligation</span>
                          <span className="text-sm font-medium">Bilateral uterine artery ligation</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Internal Iliac Artery Ligation</span>
                          <span className="text-sm font-medium">For refractory bleeding</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Hysterectomy</span>
                          <span className="text-sm font-medium">Last resort for life-threatening hemorrhage</span>
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
                          <span className="text-sm font-medium">Leading cause of maternal death worldwide</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Coagulopathy</span>
                          <span className="text-sm font-medium">DIC from massive transfusion and consumption</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Multi-organ Failure</span>
                          <span className="text-sm font-medium">From severe hypovolemia and shock</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>Sheehan's Syndrome</span>
                          <span className="text-sm font-medium">Pituitary necrosis from severe hypotension</span>
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