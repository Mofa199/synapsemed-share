"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  HelpCircle, 
  BarChart3, 
  Clock, 
  Filter, 
  Search,
  Play,
  FileText,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Link from "next/link";

export default function QuestionBankPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [questionBanks, setQuestionBanks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([{ name: "All", count: 0 }]);

  useEffect(() => {
    fetchUserStats();
    fetchQuestionBanks();
  }, []);

  useEffect(() => {
    // Update categories when questionBanks change
    if (questionBanks.length > 0) {
      const categoryMap: Record<string, number> = {};
      questionBanks.forEach(bank => {
        const category = bank.category || "General";
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });
      
      const categoryList = Object.entries(categoryMap).map(([name, count]) => ({
        name,
        count
      }));
      
      setCategories([{ name: "All", count: questionBanks.length }, ...categoryList]);
    }
  }, [questionBanks]);

  const fetchQuestionBanks = async () => {
    try {
      const response = await fetch('/api/question-banks');
      if (response.ok) {
        const data = await response.json();
        // Transform the data to match our existing structure
        const transformedBanks = data.questionBanks.map((bank: any) => ({
          id: bank.id,
          title: bank.title,
          questions: bank._count?.questions || 0,
          difficulty: bank.difficulty || "Intermediate",
          category: bank.category || "General",
          description: bank.description || "No description available",
          completion: Math.floor(Math.random() * 100) // Mock completion for now
        }));
        setQuestionBanks(transformedBanks);
      }
    } catch (error) {
      console.error('Error fetching question banks:', error);
      // Fallback to mock data if API fails
      setQuestionBanks([
        { 
          id: 1, 
          title: "Cardiology Comprehensive", 
          questions: 120, 
          difficulty: "Advanced", 
          category: "Cardiology",
          description: "Comprehensive question bank covering all aspects of cardiology for USMLE Step 1 and 2",
          completion: 65
        },
        { 
          id: 2, 
          title: "Anatomy Fundamentals", 
          questions: 85, 
          difficulty: "Beginner", 
          category: "Anatomy",
          description: "Essential anatomy questions for medical students preparing for exams",
          completion: 30
        },
        { 
          id: 3, 
          title: "Pharmacology Mastery", 
          questions: 210, 
          difficulty: "Intermediate", 
          category: "Pharmacology",
          description: "Extensive pharmacology questions covering mechanisms, side effects, and clinical uses",
          completion: 80
        },
        { 
          id: 4, 
          title: "Biochemistry Review", 
          questions: 95, 
          difficulty: "Intermediate", 
          category: "Biochemistry",
          description: "Key biochemistry concepts tested in medical licensing exams",
          completion: 45
        },
        { 
          id: 5, 
          title: "Pathology Challenge", 
          questions: 150, 
          difficulty: "Advanced", 
          category: "Pathology",
          description: "Challenging pathology questions with detailed explanations",
          completion: 20
        },
      ]);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/question-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use mock stats
      setStats({
        totalQuestions: 1250,
        avgAccuracy: 78,
        hoursPracticed: 24,
        streakDays: 85,
        totalAttempts: 450,
        correctAnswers: 351
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewStats = (bank: any) => {
    setSelectedBank(bank);
    setShowStatsDialog(true);
  };

  const handleQuickPractice = (mode: string) => {
    toast({
      title: `Starting ${mode}`,
      description: "Loading questions...",
    });
    
    setTimeout(() => {
      if (mode === 'Random Questions') {
        router.push('/student/questions/practice/random');
      } else if (mode === 'Timed Quiz') {
        router.push('/student/questions/practice/timed');
      } else if (mode === 'Weak Areas') {
        router.push('/student/questions/practice/weak-areas');
      }
    }, 500);
  };

  const filteredBanks = questionBanks.filter(bank => {
    const matchesCategory = selectedCategory === "All" || bank.category === selectedCategory;
    const matchesDifficulty = difficultyFilter === "All" || bank.difficulty === difficultyFilter;
    return matchesCategory && matchesDifficulty;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
        <p className="text-gray-600">Practice with our extensive collection of medical questions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <HelpCircle className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats?.totalQuestions || 1250}</p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats?.avgAccuracy || 78}%</p>
                <p className="text-sm text-gray-600">Avg. Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats?.hoursPracticed || 24}</p>
                <p className="text-sm text-gray-600">Hours Practiced</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats?.streakDays || 85}</p>
                <p className="text-sm text-gray-600">Streak Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
          >
            All Categories
          </Button>
          {categories.slice(1).map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={difficultyFilter === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter("All")}
          >
            All Difficulties
          </Button>
          <Button
            variant={difficultyFilter === "Beginner" ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter("Beginner")}
          >
            Beginner
          </Button>
          <Button
            variant={difficultyFilter === "Intermediate" ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter("Intermediate")}
          >
            Intermediate
          </Button>
          <Button
            variant={difficultyFilter === "Advanced" ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficultyFilter("Advanced")}
          >
            Advanced
          </Button>
        </div>
      </div>

      {/* Question Banks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBanks.map((bank) => (
          <Card key={bank.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                    {bank.title}
                  </CardTitle>
                  <CardDescription>{bank.description}</CardDescription>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {bank.questions} questions
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {bank.category}
                </span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                  {bank.difficulty}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{bank.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${bank.completion}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button asChild>
                  <Link href={`/question-bank/${bank.id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Practice
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleReviewStats(bank)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Review Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBanks.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No question banks found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <HelpCircle className="h-10 w-10 text-blue-500 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Random Questions</h3>
              <p className="text-sm text-gray-600 mb-4">Practice with mixed questions from all categories</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleQuickPractice('Random Questions')}
              >
                Start Now
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Timed Quiz</h3>
              <p className="text-sm text-gray-600 mb-4">Simulate exam conditions with timed questions</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleQuickPractice('Timed Quiz')}
              >
                Begin Quiz
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Weak Areas</h3>
              <p className="text-sm text-gray-600 mb-4">Focus on topics you've struggled with</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleQuickPractice('Weak Areas')}
              >
                Review Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedBank?.title} - Statistics</DialogTitle>
            <DialogDescription>
              Your performance on this question bank
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Overall Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completion</p>
                      <p className="text-2xl font-bold">{selectedBank?.completion}%</p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Accuracy</p>
                      <p className="text-2xl font-bold">82%</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                        Correct
                      </span>
                      <span className="font-medium">78 questions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center">
                        <XCircle className="h-4 w-4 mr-1 text-red-500" />
                        Incorrect
                      </span>
                      <span className="font-medium">12 questions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center">
                        <HelpCircle className="h-4 w-4 mr-1 text-gray-500" />
                        Not Attempted
                      </span>
                      <span className="font-medium">30 questions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <p>Your accuracy has improved by 12% in the last week</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <p>You're in the top 25% of users for this question bank</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p>Average time per question: 1.5 minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => {
                  setShowStatsDialog(false);
                  router.push(`/question-bank/${selectedBank?.id}`);
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Continue Practice
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowStatsDialog(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}