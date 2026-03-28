"use client";

import { useState, useEffect } from "react";
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
  Clock, 
  Target, 
  CheckCircle,
  ChevronRight,
  Loader2
} from "lucide-react";

export default function LearningPathsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [learningPaths, setLearningPaths] = useState<any[]>([]);
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurricula();
  }, []);

  const fetchCurricula = async () => {
    try {
      const response = await fetch('/api/student/curricula');
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        // Transform the DB objects into UI state
        const transformed = data.data.map((c: any) => {
          // Flatten all module contents into steps for the UI
          const steps: any[] = [];
          c.modules?.forEach((m: any) => {
            m.topics?.forEach((t: any) => steps.push({ id: t.id, title: t.title, type: 'Concept', completed: false }));
            m.videos?.forEach((v: any) => steps.push({ id: v.id, title: v.title, type: 'Video', completed: false }));
            m.questionBanks?.forEach((q: any) => steps.push({ id: q.id, title: q.title, type: 'Question Bank', completed: false }));
          });
          
          return {
            id: c.id,
            title: c.name,
            description: c.description || "A structured learning path",
            duration: "Self-paced",
            modules: c.modules?.length || 0,
            progress: 0,
            difficulty: "Intermediate",
            isEnrolled: true,
            steps: steps
          };
        });
        
        setLearningPaths(transformed);
        setSelectedPath(transformed[0]);
      }
    } catch (error) {
      console.error('Error fetching curricula:', error);
      toast({
        title: "Error",
        description: "Failed to load learning paths",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = () => {
    if (!selectedPath || selectedPath.steps.length === 0) return;
    const nextModule = selectedPath.steps.find((step: any) => !step.completed) || selectedPath.steps[0];
    handleModuleClick(nextModule);
  };

  const handleModuleClick = (step: any) => {
    toast({ title: "Opening module", description: step.title });
    setTimeout(() => {
      if (step.type === 'Video') {
        router.push(`/student/videos/${step.id}`);
      } else if (step.type === 'Concept') {
        router.push(`/student/concepts/${step.id}`);
      } else if (step.type === 'Question Bank') {
        router.push(`/student/questions/practice/${step.id}`);
      } else {
        router.push(`/student/content/${step.id}`);
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#213874]" />
      </div>
    );
  }

  if (learningPaths.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Learning Paths</h1>
        <p className="text-gray-600">No learning paths available right now.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
        <p className="text-gray-600">Structured learning journeys tailored to your goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Paths</CardTitle>
              <CardDescription>Structured courses from your institution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <div 
                    key={path.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPath?.id === path.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPath(path)}
                  >
                    <h3 className="font-medium mb-2">{path.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{path.description}</p>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>{path.modules} modules</span>
                      <span>{path.steps?.length || 0} items</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedPath && (
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
                  <Button onClick={handleContinueLearning}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
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
                        <p className="text-2xl font-bold">{selectedPath.steps?.length || 0}</p>
                        <p className="text-sm text-gray-600">Content Items</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Learning Modules</h3>
                  {selectedPath.steps?.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No content items added to this path yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedPath.steps.map((step: any, index: number) => (
                        <div 
                          key={step.id || index} 
                          className="flex items-center p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow bg-gray-50"
                          onClick={() => handleModuleClick(step)}
                        >
                          <div className="mr-3">
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                              <span className="text-xs text-gray-500">{index + 1}</span>
                            </div>
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
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}