"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Star, 
  Award, 
  Target,
  RotateCcw,
  Pause,
  Square,
  Zap,
  Flame,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock exam data
const examQuestions = [
  {
    id: 1,
    question: "A 65-year-old man presents to the emergency department with sudden onset of severe chest pain that radiates to his back. His blood pressure is 180/110 mmHg in the right arm and 150/90 mmHg in the left arm. Which of the following is the most likely diagnosis?",
    options: [
      "A. Myocardial infarction",
      "B. Pulmonary embolism",
      "C. Aortic dissection",
      "D. Pericarditis",
      "E. Pneumothorax"
    ],
    correctAnswer: 2,
    explanation: "The combination of severe chest pain radiating to the back and unequal blood pressures (a sign of pulse deficit) is classic for aortic dissection. The sudden onset and severe nature of the pain also support this diagnosis.",
    category: "Cardiology"
  },
  {
    id: 2,
    question: "Which of the following enzymes is most specific for myocardial injury?",
    options: [
      "A. Creatine kinase (CK)",
      "B. Lactate dehydrogenase (LDH)",
      "C. Aspartate aminotransferase (AST)",
      "D. Troponin I",
      "E. Myoglobin"
    ],
    correctAnswer: 3,
    explanation: "Troponin I is the most specific marker for myocardial injury. While other markers like CK-MB and myoglobin may also be elevated in myocardial infarction, troponin I has both high sensitivity and specificity for myocardial damage.",
    category: "Cardiology"
  },
  {
    id: 3,
    question: "A 45-year-old woman with a history of Graves' disease presents with palpitations and heat intolerance. Which of the following medications is most appropriate for initial treatment of her condition?",
    options: [
      "A. Propranolol",
      "B. Methimazole",
      "C. Radioactive iodine",
      "D. Levothyroxine",
      "E. Propylthiouracil"
    ],
    correctAnswer: 0,
    explanation: "Propranolol, a beta-blocker, is the most appropriate initial treatment for symptomatic relief of palpitations, tremor, and heat intolerance in hyperthyroidism. It provides rapid symptom control while other definitive treatments like methimazole take effect.",
    category: "Endocrinology"
  },
  {
    id: 4,
    question: "Which of the following is the most common cause of secondary hypertension?",
    options: [
      "A. Renal artery stenosis",
      "B. Primary aldosteronism",
      "C. Pheochromocytoma",
      "D. Cushing's syndrome",
      "E. Coarctation of the aorta"
    ],
    correctAnswer: 1,
    explanation: "Primary aldosteronism (Conn's syndrome) is the most common cause of secondary hypertension, accounting for approximately 5-10% of all hypertension cases. It results from autonomous aldosterone production, leading to sodium retention and potassium wasting.",
    category: "Nephrology"
  },
  {
    id: 5,
    question: "A 30-year-old man presents with sudden onset of severe headache described as 'the worst headache of my life.' Physical examination reveals nuchal rigidity. Which of the following is the most appropriate initial diagnostic test?",
    options: [
      "A. CT scan of the head",
      "B. MRI of the brain",
      "C. Lumbar puncture",
      "D. Cerebral angiography",
      "E. EEG"
    ],
    correctAnswer: 0,
    explanation: "In a patient presenting with sudden severe headache (thunderclap headache) and signs of meningeal irritation, non-contrast CT scan of the head is the most appropriate initial test to evaluate for subarachnoid hemorrhage. It is highly sensitive when performed within 6 hours of symptom onset.",
    category: "Neurology"
  }
];

export default function ExamSimulationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [timeLeft, setTimeLeft] = useState(1800); // Will be set by selected exam
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXPDialog, setShowXPDialog] = useState(false);
  const [userXP, setUserXP] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch available exams and user XP on mount
  useEffect(() => {
    fetchAvailableExams();
    fetchUserXP();
  }, []);

  const fetchAvailableExams = async () => {
    try {
      const response = await fetch('/api/exam-simulations');
      if (response.ok) {
        const data = await response.json();
        setAvailableExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast({
        title: "Error",
        description: "Failed to load exam simulations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserXP = async () => {
    try {
      const response = await fetch('/api/user/xp');
      if (response.ok) {
        const data = await response.json();
        setUserXP(data.data);
      }
    } catch (error) {
      console.error('Error fetching user XP:', error);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!examStarted || isPaused || showResults) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, isPaused, showResults]);

  const startExam = async (exam: any) => {
    setSelectedExam(exam);
    
    // Fetch questions for this exam
    try {
      const response = await fetch(`/api/exam-simulations/${exam.id}`);
      if (response.ok) {
        const data = await response.json();
        setExamQuestions(data.questions);
        setTimeLeft(exam.duration);
        setExamStarted(true);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setAnswers({});
        setShowResults(false);
        setScore(0);
        setAchievements([]);
        setXpEarned(0);
        
        toast({
          title: "Exam started!",
          description: `Good luck with ${exam.title}`
        });
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      toast({
        title: "Error",
        description: "Failed to start exam",
        variant: "destructive"
      });
    }
  };

  const pauseExam = () => {
    setIsPaused(true);
  };

  const resumeExam = () => {
    setIsPaused(false);
  };

  const finishExam = async () => {
    setShowResults(true);
    await submitExamAttempt();
  };

  const submitExamAttempt = async () => {
    try {
      const timeUsed = (selectedExam?.duration || 1800) - timeLeft;
      
      const response = await fetch(`/api/exam-simulations/${selectedExam?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user', // Would come from auth
          answers,
          timeUsed
        })
      });

      if (response.ok) {
        const data = await response.json();
        setScore(data.result.score);
        setXpEarned(data.result.xpEarned);
        setAchievements(data.result.achievementsEarned);
        
        // Show XP dialog after a short delay
        setTimeout(() => {
          setShowXPDialog(true);
        }, 1000);

        // Refresh user XP
        fetchUserXP();
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      calculateScore(); // Fallback to local calculation
    }
  };

  const calculateScore = () => {
    let correct = 0;
    examQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    setScore(Math.round((correct / examQuestions.length) * 100));
  };

  const checkAchievements = () => {
    const newAchievements = [];
    
    if (score >= 90) {
      newAchievements.push("Expert Level");
    } else if (score >= 80) {
      newAchievements.push("Advanced Learner");
    } else if (score >= 70) {
      newAchievements.push("Solid Performance");
    }
    
    if (Object.keys(answers).length === examQuestions.length) {
      newAchievements.push("Completion Master");
    }
    
    setAchievements(newAchievements);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (showResults) return;
    
    setSelectedOption(optionIndex);
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] ?? null);
    } else {
      finishExam();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] ?? null);
    }
  };

  const handleBackToExams = () => {
    setExamStarted(false);
    setShowResults(false);
    setSelectedExam(null);
    setExamQuestions([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = examQuestions[currentQuestionIndex];
  const isAnswered = currentQuestion && answers[currentQuestionIndex] !== undefined;
  const isCorrect = isAnswered && answers[currentQuestionIndex] === currentQuestion.correctAnswer;

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam simulations...</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam simulations...</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Exam Simulation Mode</h1>
          <p className="text-xl text-gray-600 mb-2">Ready to practice under real exam conditions?</p>
          <p className="text-gray-700 mb-8">
            Our Exam Simulation Mode mirrors the actual test environment with timed questions and adaptive difficulty, 
            helping you build confidence and track your readiness.
          </p>
          
          {/* User XP and Level Display */}
          {userXP && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                    {userXP.level}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Level {userXP.level}</h3>
                    <p className="text-gray-600">{userXP.totalXP} Total XP</p>
                  </div>
                </div>
                <div className="flex-1 max-w-md">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress to Level {userXP.level + 1}</span>
                    <span className="text-gray-900 font-medium">
                      {userXP.currentLevelXP}/{userXP.nextLevelXP} XP
                    </span>
                  </div>
                  <Progress 
                    value={(userXP.currentLevelXP / userXP.nextLevelXP) * 100} 
                    className="h-3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Available Exams Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Available Exam Simulations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableExams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <Badge variant={exam.isPublic ? "default" : "secondary"}>
                      {exam.isPublic ? "Public" : "Assigned"}
                    </Badge>
                  </div>
                  <CardDescription>{exam.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {Math.floor(exam.duration / 60)} minutes
                      </span>
                      <span className="text-gray-600 flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {exam.totalQuestions} questions
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{exam.difficulty}</Badge>
                      <span className="text-gray-600">{exam.category}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => startExam(exam)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Exam
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Performance Tracking</h3>
              <p className="text-gray-600">Monitor your progress with detailed analytics</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Earn XP & Achievements</h3>
              <p className="text-gray-600">Level up and unlock rewards for your performance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Confidence Building</h3>
              <p className="text-gray-600">Prepare for the real exam with realistic practice</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Results</h1>
          <p className="text-gray-600">Here's how you performed in your simulation</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative w-48 h-48 mx-auto mb-6"
                >
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={score >= 80 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="3"
                      strokeDasharray={`${score}, 100`}
                    />
                    <text x="18" y="20.5" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="bold">
                      {score}%
                    </text>
                  </svg>
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-2">
                  {score >= 90 ? "Excellent Work!" : 
                   score >= 80 ? "Great Job!" : 
                   score >= 70 ? "Good Effort!" : "Keep Practicing!"}
                </h2>
                <p className="text-gray-600 mb-6">
                  You answered {Object.keys(answers).length} out of {examQuestions.length} questions
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Correct Answers</span>
                      <span>{Object.keys(answers).filter(key => 
                        answers[parseInt(key)] === examQuestions[parseInt(key)].correctAnswer
                      ).length}/{examQuestions.length}</span>
                    </div>
                    <Progress 
                      value={(Object.keys(answers).filter(key => 
                        answers[parseInt(key)] === examQuestions[parseInt(key)].correctAnswer
                      ).length / examQuestions.length) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Time Used</span>
                      <span>{formatTime(1800 - timeLeft)}</span>
                    </div>
                    <Progress 
                      value={((1800 - timeLeft) / 1800) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200"
                      >
                        <Award className="h-8 w-8 text-yellow-500 mr-3" />
                        <div>
                          <h3 className="font-bold text-yellow-800">{achievement}</h3>
                          <p className="text-sm text-yellow-600">Achievement unlocked!</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Complete more exams to earn achievements!</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Question Review</CardTitle>
                <CardDescription>Detailed analysis of your answers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examQuestions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start mb-3">
                          <div className={`mr-3 mt-1 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Question {index + 1}: {question.question}</h3>
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Category:</span> {question.category}
                            </div>
                            
                            <div className="mb-3">
                              <p className="font-medium mb-1">Your Answer:</p>
                              <p className={`p-2 rounded ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                {question.options[userAnswer] || "No answer selected"}
                              </p>
                            </div>
                            
                            {!isCorrect && (
                              <div className="mb-3">
                                <p className="font-medium mb-1">Correct Answer:</p>
                                <p className="p-2 rounded bg-green-50 text-green-800">
                                  {question.options[question.correctAnswer]}
                                </p>
                              </div>
                            )}
                            
                            <div>
                              <p className="font-medium mb-1">Explanation:</p>
                              <p className="text-gray-700">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button onClick={() => startExam(selectedExam!)} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Exam
          </Button>
          <Button onClick={handleBackToExams}>
            <Play className="h-4 w-4 mr-2" />
            Try Another Exam
          </Button>
        </div>

        {/* XP Earned Dialog */}
        <Dialog open={showXPDialog} onOpenChange={setShowXPDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Congratulations!</DialogTitle>
              <DialogDescription className="text-center">
                You've earned experience points!
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-32 h-32 flex items-center justify-center mb-4"
              >
                <div className="text-center text-white">
                  <Zap className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-3xl font-bold">+{xpEarned}</p>
                  <p className="text-sm">XP</p>
                </div>
              </motion.div>
              {userXP && (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Total XP: {userXP.totalXP + xpEarned}</p>
                  <p className="text-sm text-gray-500">Keep practicing to level up!</p>
                </div>
              )}
            </div>
            <Button onClick={() => setShowXPDialog(false)} className="w-full">
              Continue
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Exam Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Simulation</h1>
          <p className="text-gray-600">Question {currentQuestionIndex + 1} of {examQuestions.length}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Clock className="h-5 w-5 text-gray-600 mr-2" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={isPaused ? resumeExam : pauseExam}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowResults(true)}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentQuestionIndex + 1) / examQuestions.length) * 100)}%</span>
        </div>
        <Progress 
          value={((currentQuestionIndex + 1) / examQuestions.length) * 100} 
          className="h-2" 
        />
      </div>
      
      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-500" />
                {currentQuestion.category}
              </CardTitle>
              <CardDescription>{currentQuestion.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => {
                  const isSelected = selectedOption === index;
                  const isAnswered = answers[currentQuestionIndex] === index;
                  let optionStyle = "border-gray-200 hover:border-gray-300";
                  
                  if (showResults) {
                    if (index === currentQuestion.correctAnswer) {
                      optionStyle = "border-green-500 bg-green-50";
                    } else if (isAnswered && index !== currentQuestion.correctAnswer) {
                      optionStyle = "border-red-500 bg-red-50";
                    }
                  } else if (isSelected) {
                    optionStyle = "border-blue-500 bg-blue-50";
                  }
                  
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <button
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionStyle}`}
                        onClick={() => handleOptionSelect(index)}
                        disabled={showResults}
                      >
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center mr-3 ${
                            isSelected ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNextQuestion}
          disabled={selectedOption === null && !showResults}
        >
          {currentQuestionIndex === examQuestions.length - 1 ? "Finish Exam" : "Next Question"}
        </Button>
      </div>
    </div>
  );
}