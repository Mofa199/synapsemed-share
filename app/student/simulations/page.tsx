"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SimulationCase {
  id: string;
  title: string;
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
  caseType: "medical" | "emergency" | "pediatric" | "surgical" | "obgyn" | "psych";
}

export default function TriageSimulationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [favorites, setFavorites] = useState<number[]>([]);

  // Mock simulation cases data - all 15 cases
  const simulationCases: SimulationCase[] = [
    // Medical Cases
    { 
      id: "1", 
      title: "Acute Myocardial Infarction (STEMI)", 
      specialty: "Cardiology", 
      category: "Medical",
      difficulty: "Advanced",
      duration: "25 min",
      rating: 4.8,
      reviews: 124,
      description: "Manage a patient presenting with chest pain and ECG changes consistent with STEMI.",
      tags: ["STEMI", "ACS", "Intervention", "Cardiology"],
      completed: true,
      score: 85,
      caseType: "medical"
    },
    { 
      id: "2", 
      title: "Community-Acquired Pneumonia (Adult)", 
      specialty: "Pulmonology", 
      category: "Medical",
      difficulty: "Intermediate",
      duration: "20 min",
      rating: 4.6,
      reviews: 98,
      description: "Diagnose and treat a patient with fever, cough, and consolidation on chest X-ray.",
      tags: ["Infection", "Antibiotics", "Diagnosis", "Respiratory"],
      completed: true,
      score: 92,
      caseType: "medical"
    },
    { 
      id: "3", 
      title: "Diabetic Ketoacidosis", 
      specialty: "Endocrinology", 
      category: "Medical",
      difficulty: "Advanced",
      duration: "30 min",
      rating: 4.9,
      reviews: 156,
      description: "Manage a patient with type 1 diabetes presenting with altered mental status.",
      tags: ["Diabetes", "Metabolic", "Emergency", "Endocrinology"],
      completed: false,
      caseType: "medical"
    },
    { 
      id: "4", 
      title: "Acute Ischemic Stroke (Left MCA Territory)", 
      specialty: "Neurology", 
      category: "Medical",
      difficulty: "Advanced",
      duration: "28 min",
      rating: 4.7,
      reviews: 142,
      description: "Evaluate and manage a patient with acute neurological deficit.",
      tags: ["Neurology", "Stroke", "Thrombolytics", "Emergency"],
      completed: false,
      caseType: "medical"
    },
    { 
      id: "5", 
      title: "Congestive Heart Failure due to Hypertension", 
      specialty: "Cardiology", 
      category: "Medical",
      difficulty: "Intermediate",
      duration: "22 min",
      rating: 4.5,
      reviews: 87,
      description: "Manage a patient with progressive dyspnea and bilateral leg swelling.",
      tags: ["Cardiology", "Heart Failure", "Hypertension"],
      completed: false,
      caseType: "medical"
    },

    // Emergency & Toxicology Cases
    { 
      id: "6", 
      title: "Organophosphate Poisoning", 
      specialty: "Toxicology", 
      category: "Toxicology",
      difficulty: "Advanced",
      duration: "25 min",
      rating: 4.8,
      reviews: 76,
      description: "Manage a patient with cholinergic crisis after pesticide exposure.",
      tags: ["Toxicology", "Poisoning", "Emergency", "Antidotes"],
      completed: false,
      caseType: "emergency"
    },
    { 
      id: "7", 
      title: "Anaphylaxis due to Peanut Allergy", 
      specialty: "Immunology", 
      category: "Emergency",
      difficulty: "Beginner",
      duration: "15 min",
      rating: 4.5,
      reviews: 67,
      description: "Recognize and treat a patient with severe allergic reaction.",
      tags: ["Allergy", "Emergency", "Treatment", "Immunology"],
      completed: false,
      caseType: "emergency"
    },
    { 
      id: "8", 
      title: "Tension Pneumothorax (Post Trauma)", 
      specialty: "Trauma", 
      category: "Surgery-Emergency",
      difficulty: "Advanced",
      duration: "20 min",
      rating: 4.7,
      reviews: 92,
      description: "Diagnose and manage a life-threatening chest trauma.",
      tags: ["Trauma", "Surgery", "Emergency", "Decompression"],
      completed: false,
      caseType: "emergency"
    },

    // Pediatric Cases
    { 
      id: "9", 
      title: "Severe Pneumonia (Child)", 
      specialty: "Pediatrics", 
      category: "Pediatric",
      difficulty: "Intermediate",
      duration: "22 min",
      rating: 4.6,
      reviews: 58,
      description: "Manage a child with respiratory distress and fever.",
      tags: ["Pediatrics", "Respiratory", "Infection", "Pneumonia"],
      completed: false,
      caseType: "pediatric"
    },

    // Surgical Cases
    { 
      id: "10", 
      title: "Acute Appendicitis (Adult)", 
      specialty: "General Surgery", 
      category: "Surgery",
      difficulty: "Intermediate",
      duration: "18 min",
      rating: 4.7,
      reviews: 87,
      description: "Diagnose and manage a patient with right lower quadrant abdominal pain.",
      tags: ["Abdominal", "Surgery", "Diagnosis", "Appendicitis"],
      completed: false,
      caseType: "surgical"
    },
    { 
      id: "11", 
      title: "Small Bowel Obstruction due to Adhesions", 
      specialty: "General Surgery", 
      category: "Surgery",
      difficulty: "Advanced",
      duration: "25 min",
      rating: 4.8,
      reviews: 73,
      description: "Manage a patient with vomiting and abdominal distension post-surgery.",
      tags: ["Abdominal", "Surgery", "Obstruction", "Adhesions"],
      completed: false,
      caseType: "surgical"
    },
    { 
      id: "12", 
      title: "Road Traffic Injury – Chest Trauma with Pneumothorax", 
      specialty: "Trauma Surgery", 
      category: "Surgery-Emergency",
      difficulty: "Advanced",
      duration: "24 min",
      rating: 4.9,
      reviews: 65,
      description: "Manage a trauma patient with chest injury and breathing difficulties.",
      tags: ["Trauma", "Surgery", "Emergency", "Chest Injury"],
      completed: false,
      caseType: "surgical"
    },

    // OB/GYN Cases
    { 
      id: "13", 
      title: "Postpartum Hemorrhage (Uterine Atony)", 
      specialty: "Obstetrics", 
      category: "OB/GYN",
      difficulty: "Advanced",
      duration: "26 min",
      rating: 4.8,
      reviews: 91,
      description: "Manage a patient with excessive bleeding after delivery.",
      tags: ["Obstetrics", "Hemorrhage", "Emergency", "Postpartum"],
      completed: false,
      caseType: "obgyn"
    },
    { 
      id: "14", 
      title: "Ruptured Ectopic Pregnancy", 
      specialty: "Gynecology", 
      category: "OB/GYN",
      difficulty: "Advanced",
      duration: "23 min",
      rating: 4.7,
      reviews: 84,
      description: "Diagnose and manage a pregnant patient with abdominal pain and shock.",
      tags: ["Gynecology", "Obstetrics", "Emergency", "Ectopic"],
      completed: false,
      caseType: "obgyn"
    },

    // Psychiatry Case
    { 
      id: "15", 
      title: "Major Depressive Disorder", 
      specialty: "Psychiatry", 
      category: "Psych",
      difficulty: "Intermediate",
      duration: "30 min",
      rating: 4.6,
      reviews: 72,
      description: "Assess and manage a patient with severe depression and suicidal ideation.",
      tags: ["Psychiatry", "Mental Health", "Depression", "Suicide"],
      completed: false,
      caseType: "psych"
    }
  ];

  const specialties = [
    { name: "All", count: 15 },
    { name: "Cardiology", count: 2 },
    { name: "Pulmonology", count: 1 },
    { name: "Endocrinology", count: 1 },
    { name: "Neurology", count: 1 },
    { name: "Toxicology", count: 1 },
    { name: "Immunology", count: 1 },
    { name: "Trauma", count: 2 },
    { name: "Pediatrics", count: 1 },
    { name: "General Surgery", count: 2 },
    { name: "Trauma Surgery", count: 1 },
    { name: "Obstetrics", count: 2 },
    { name: "Gynecology", count: 1 },
    { name: "Psychiatry", count: 1 }
  ];

  const categories = [
    { name: "All", count: 15 },
    { name: "Medical", count: 5 },
    { name: "Emergency", count: 2 },
    { name: "Toxicology", count: 1 },
    { name: "Surgery-Emergency", count: 2 },
    { name: "Pediatric", count: 1 },
    { name: "Surgery", count: 2 },
    { name: "OB/GYN", count: 2 },
    { name: "Psych", count: 1 }
  ];

  const difficultyLevels = [
    { name: "All", count: 15 },
    { name: "Beginner", count: 1 },
    { name: "Intermediate", count: 6 },
    { name: "Advanced", count: 8 }
  ];

  const filteredCases = simulationCases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          caseItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          caseItem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === "All" || caseItem.specialty === selectedSpecialty;
    const matchesCategory = selectedCategory === "All" || caseItem.category === selectedCategory;
    return matchesSearch && matchesSpecialty && matchesCategory;
  });

  // Sort cases based on selected option
  const sortedCases = [...filteredCases].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "duration") {
      const aMin = parseInt(a.duration);
      const bMin = parseInt(b.duration);
      return aMin - bMin;
    }
    if (sortBy === "difficulty") {
      const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
      return difficultyOrder[b.difficulty as keyof typeof difficultyOrder] - 
             difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
    }
    return 0;
  });

  const handleFavorite = (caseId: string) => {
    const caseNumericId = parseInt(caseId);
    if (favorites.includes(caseNumericId)) {
      setFavorites(favorites.filter(id => id !== caseNumericId));
      toast({
        title: "Removed from favorites",
        description: "Case removed from your favorites list"
      });
    } else {
      setFavorites([...favorites, caseNumericId]);
      toast({
        title: "Added to favorites",
        description: "Case added to your favorites list"
      });
    }
  };

  const handleShare = (caseItem: SimulationCase) => {
    if (typeof window === 'undefined') return;
    
    const url = window.location.href + `/${caseItem.id}`;
    if (navigator.share) {
      navigator.share({
        title: caseItem.title,
        text: caseItem.description,
        url: url
      }).catch(() => {
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Case link copied to clipboard"
        });
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Case link copied to clipboard"
      });
    }
  };

  const handleViewCase = (caseId: string) => {
    router.push(`/student/simulations/triage/${caseId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCaseTypeIcon = (caseType: string) => {
    switch(caseType) {
      case "medical": return <Stethoscope className="h-4 w-4" />;
      case "emergency": return <AlertTriangle className="h-4 w-4" />;
      case "pediatric": return <Baby className="h-4 w-4" />;
      case "surgical": return <Settings className="h-4 w-4" />;
      case "obgyn": return <Users className="h-4 w-4" />;
      case "psych": return <Brain className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCaseTypeColor = (caseType: string) => {
    switch(caseType) {
      case "medical": return "text-blue-600";
      case "emergency": return "text-red-600";
      case "pediatric": return "text-pink-600";
      case "surgical": return "text-purple-600";
      case "obgyn": return "text-indigo-600";
      case "psych": return "text-teal-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Simulations</h1>
              <p className="text-gray-600 mt-1">Interactive clinical scenarios for medical education</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-blue-700">
                  {simulationCases.length} Cases
                </span>
              </div>
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-green-700">
                  {simulationCases.filter(c => c.completed).length} Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search simulations..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select 
                className="border border-gray-300 rounded-md p-2"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map((spec) => (
                  <option key={spec.name} value={spec.name}>
                    {spec.name} ({spec.count})
                  </option>
                ))}
              </select>
              <select 
                className="border border-gray-300 rounded-md p-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
              <select 
                className="border border-gray-300 rounded-md p-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="duration">Sort by Duration</option>
                <option value="difficulty">Sort by Difficulty</option>
              </select>
            </div>
          </div>

          {/* Difficulty Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("All")}
            >
              All Cases
            </Button>
            {difficultyLevels.slice(1).map((level) => (
              <Button
                key={level.name}
                variant="outline"
                size="sm"
                onClick={() => {
                  // This would filter by difficulty in a real implementation
                }}
              >
                {level.name} ({level.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Simulation Cases Grid */}
        {sortedCases.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cases found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCases.map((caseItem) => (
              <Card key={caseItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getCaseTypeIcon(caseItem.caseType)}
                        <span className={getCaseTypeColor(caseItem.caseType)}>
                          {caseItem.title}
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {caseItem.specialty} • {caseItem.category}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFavorite(caseItem.id)}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(parseInt(caseItem.id)) ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {caseItem.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className={getDifficultyColor(caseItem.difficulty)}>
                      {caseItem.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {caseItem.duration}
                    </Badge>
                    <Badge variant="outline">
                      <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                      {caseItem.rating}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {caseItem.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs px-2 py-1 bg-gray-100 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {caseItem.reviews} reviews
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare(caseItem)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleViewCase(caseItem.id)}
                      >
                        {caseItem.completed ? (
                          <>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Review
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {caseItem.completed && caseItem.score && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Your Score</span>
                        <span className={`text-sm font-bold ${
                          caseItem.score >= 80 ? 'text-green-600' : 
                          caseItem.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {caseItem.score}%
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            caseItem.score >= 80 ? 'bg-green-600' : 
                            caseItem.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                          }`} 
                          style={{ width: `${caseItem.score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Simulation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Stethoscope className="h-8 w-8 text-[#213874] mb-2" />
                <CardTitle>Triage Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Initial patient evaluation with vital signs and chief complaint assessment.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-[#213874] mb-2" />
                <CardTitle>History Taking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive history including HPI, PMH, and review of systems.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Activity className="h-8 w-8 text-[#213874] mb-2" />
                <CardTitle>Physical Exam</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  System-by-system examination with realistic findings and abnormalities.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Microscope className="h-8 w-8 text-[#213874] mb-2" />
                <CardTitle>Diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Order and interpret labs, imaging, and bedside tests with real results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Workflow Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Clinical Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>DxPause</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Formulate differential diagnoses with our AI-powered diagnostic assistant.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Patient Report (PR)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Differential Diagnosis (DDx)
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Key Findings Checklist
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Develop treatment plans with evidence-based interventions.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Procedures & Interventions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Medications & Dosages
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Blood Products & Fluids
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Performance Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Detailed feedback with expert explanations and learning recommendations.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Final Diagnosis Confirmation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Correct Management Review
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    AI Tutor Guidance
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}