"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Map, 
  Play, 
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  Users, 
  Clock, 
  Target, 
  CheckCircle,
  ChevronRight,
  Lock
} from "lucide-react";

const learningPaths = [
  { 
    id: 1, 
    title: "USMLE Step 1 Preparation", 
    description: "Comprehensive 6-month plan covering all basic sciences for USMLE Step 1",
    duration: "24 weeks",
    modules: 12,
    progress: 65,
    difficulty: "Advanced",
    isEnrolled: true,
    steps: [
      { id: 1, title: "Anatomy Foundation", type: "Video", completed: true },
      { id: 2, title: "Biochemistry Essentials", type: "Concept", completed: true },
      { id: 3, title: "Physiology Core", type: "Video", completed: false },
      { id: 4, title: "Pathology Basics", type: "Concept", completed: false },
      { id: 5, title: "Pharmacology Review", type: "Question Bank", completed: false },
    ]
  },
  { 
    id: 2, 
    title: "Internal Medicine Rotation Prep", 
    description: "Focused 8-week plan for medical students preparing for internal medicine rotation",
    duration: "8 weeks",
    modules: 8,
    progress: 30,
    difficulty: "Intermediate",
    isEnrolled: true,
    steps: [
      { id: 1, title: "Cardiology Overview", type: "Video", completed: true },
      { id: 2, title: "Pulmonology Essentials", type: "Concept", completed: false },
      { id: 3, title: "Gastroenterology Core", type: "Video", completed: false },
    ]
  },
  { 
    id: 3, 
    title: "Pediatrics Board Review", 
    description: "Specialized plan for pediatrics board examination preparation",
    duration: "16 weeks",
    modules: 10,
    progress: 0,
    difficulty: "Advanced",
    isEnrolled: false,
    steps: [
      { id: 1, title: "Neonatology", type: "Video", completed: false },
      { id: 2, title: "Developmental Pediatrics", type: "Concept", completed: false },
    ]
  },
  { 
    id: 4, 
    title: "Surgery Rotation Essentials", 
    description: "Essential topics for medical students preparing for surgery rotation",
    duration: "6 weeks",
    modules: 6,
    progress: 0,
    difficulty: "Intermediate",
    isEnrolled: false,
    steps: [
      { id: 1, title: "Preoperative Care", type: "Concept", completed: false },
      { id: 2, title: "Anesthesia Basics", type: "Video", completed: false },
    ]
  },
];

export default function LearningPathsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPath, setSelectedPath] = useState(learningPaths[0]);

  // Handle continue learning - navigate to next incomplete module
  const handleContinueLearning = () => {
    const nextModule = selectedPath.steps.find(step => !step.completed);
    
    if (nextModule) {
      toast({
        title: "Resuming learning",
        description: `Opening ${nextModule.title}...`,
      });
      
      // Navigate based on content type
      setTimeout(() => {
        if (nextModule.type === 'Video') {
          router.push(`/student/videos/${nextModule.id}`);
        } else if (nextModule.type === 'Concept') {
          router.push(`/student/concepts/${nextModule.id}`);
        } else if (nextModule.type === 'Question Bank') {
          router.push(`/student/questions/practice/${nextModule.id}`);
        } else {
          router.push(`/student/module/${nextModule.id}`);
        }
      }, 500);
    } else {
      toast({
        title: "Path completed!",
        description: "You've finished all modules in this learning path. Great job!",
      });
    }
  };

  // Handle continue to next module
  const handleContinueToNextModule = () => {
    handleContinueLearning();
  };

  // Handle view details for recommended paths
  const handleViewDetails = (path: typeof learningPaths[0]) => {
    setSelectedPath(path);
    toast({
      title: "Path selected",
      description: `Now viewing ${path.title}`,
    });
    // Scroll to top to see the selected path
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle enroll in a new path
  const handleEnroll = (path: typeof learningPaths[0]) => {
    if (!path.isEnrolled) {
      toast({
        title: "Enrollment successful!",
        description: `You've enrolled in ${path.title}`,
      });
      
      // In real app, this would update the database
      path.isEnrolled = true;
      
      // Switch to the enrolled path
      setTimeout(() => {
        setSelectedPath(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }
  };

  // Handle module click
  const handleModuleClick = (step: typeof selectedPath.steps[0]) => {
    if (!selectedPath.isEnrolled) {
      toast({
        title: "Enroll first",
        description: "Please enroll in this path to access modules",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Opening module",
      description: step.title,
    });

    setTimeout(() => {
      if (step.type === 'Video') {
        router.push(`/student/videos/${step.id}`);
      } else if (step.type === 'Concept') {
        router.push(`/student/concepts/${step.id}`);
      } else if (step.type === 'Question Bank') {
        router.push(`/student/questions/practice/${step.id}`);
      } else {
        router.push(`/student/module/${step.id}`);
      }
    }, 500);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video": return <Play className="h-4 w-4 text-red-500" />;
      case "Concept": return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case "Question Bank": return <HelpCircle className="h-4 w-4 text-blue-500" />;
      default: return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
        <p className="text-gray-600">Structured learning journeys tailored to your goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paths List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Paths</CardTitle>
              <CardDescription>Structured courses to achieve your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <div 
                    key={path.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPath.id === path.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPath(path)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{path.title}</h3>
                      {!path.isEnrolled && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>{path.modules} modules</span>
                      <span>{path.duration}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">{path.progress}% complete</span>
                      <span className={`px-2 py-1 rounded ${
                        path.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                        path.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {path.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Path Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Map className="h-5 w-5 mr-2 text-blue-500" />
                    {selectedPath.title}
                  </CardTitle>
                  <CardDescription>{selectedPath.description}</CardDescription>
                </div>
                {selectedPath.isEnrolled ? (
                  <Button onClick={handleContinueLearning}>
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                ) : (
                  <Button onClick={() => handleEnroll(selectedPath)}>
                    <Target className="h-4 w-4 mr-2" />
                    Enroll Now
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{selectedPath.duration}</p>
                      <p className="text-sm text-gray-600">Duration</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{selectedPath.modules}</p>
                      <p className="text-sm text-gray-600">Modules</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-yellow-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{selectedPath.progress}%</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Learning Modules</h3>
                <div className="space-y-3">
                  {selectedPath.steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className={`flex items-center p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                        step.completed ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                      onClick={() => handleModuleClick(step)}
                    >
                      <div className="mr-3">
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <span className="text-xs text-gray-500">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                      </div>
                      <div className="flex items-center mr-3">
                        {getTypeIcon(step.type)}
                        <span className="ml-1 text-sm text-gray-600">{step.type}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                {selectedPath.isEnrolled ? (
                  <Button onClick={handleContinueToNextModule}>
                    <Play className="h-4 w-4 mr-2" />
                    Continue to Next Module
                  </Button>
                ) : (
                  <Button onClick={() => handleEnroll(selectedPath)}>
                    <Target className="h-4 w-4 mr-2" />
                    Enroll in This Path - $99
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Paths */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Based on your learning history and goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningPaths.filter(path => !path.isEnrolled).slice(0, 2).map((path) => (
                  <div key={path.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <h3 className="font-medium mb-1">{path.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{path.duration}</span>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(path)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}