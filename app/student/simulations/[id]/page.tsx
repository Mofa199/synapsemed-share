"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Play,
  Clock,
  Star,
  Heart,
  Share2,
  Trophy,
  CheckCircle,
  AlertCircle,
  BookOpen,
  MessageSquare,
  Award,
  Target,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function SimulationCasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock case data - would come from API in production
  const caseData = {
    id: params.id,
    title: "Acute Myocardial Infarction",
    specialty: "Cardiology",
    difficulty: "Advanced",
    duration: "25 min",
    rating: 4.8,
    reviewCount: 124,
    description: "Manage a patient presenting with chest pain and ECG changes consistent with STEMI.",
    fullDescription: "In this comprehensive simulation, you'll evaluate and manage a 58-year-old male patient who presents to the emergency department with severe chest pain. You'll need to perform a thorough assessment, interpret diagnostic tests including ECG and cardiac biomarkers, and make critical decisions about immediate management including thrombolytic therapy or PCI.",
    tags: ["STEMI", "ACS", "Intervention"],
    completed: true,
    score: 85,
    objectives: [
      "Recognize the classic presentation of acute STEMI",
      "Interpret ECG changes consistent with myocardial infarction",
      "Understand the appropriate use of cardiac biomarkers",
      "Make time-sensitive decisions regarding reperfusion therapy",
      "Manage acute complications of MI"
    ],
    topics: [
      { name: "Pathophysiology of Acute Coronary Syndrome", covered: true },
      { name: "ECG Interpretation in STEMI", covered: true },
      { name: "Thrombolytic Therapy Indications", covered: true },
      { name: "PCI vs Medical Management", covered: true },
      { name: "Post-MI Complications", covered: false }
    ],
    performance: {
      accuracy: 85,
      timeEfficiency: 92,
      clinicalReasoning: 78,
      communication: 88
    },
    strengths: [
      "Excellent recognition of STEMI on ECG",
      "Appropriate ordering of cardiac biomarkers",
      "Good time management in critical decision-making"
    ],
    improvements: [
      "Consider earlier antiplatelet therapy administration",
      "Review indications for immediate catheterization",
      "Improve communication with patient about treatment options"
    ],
    reviews: [
      {
        author: "Dr. Michael Chen",
        role: "Cardiologist",
        rating: 5,
        comment: "Excellent simulation with realistic patient presentation. The ECG changes are accurate and the decision-making points are clinically relevant.",
        date: "2 weeks ago"
      },
      {
        author: "Sarah Johnson",
        role: "Medical Student",
        rating: 5,
        comment: "This case really helped me understand the urgency of STEMI management. The feedback was detailed and constructive.",
        date: "1 month ago"
      },
      {
        author: "Dr. Amanda Lee",
        role: "Emergency Medicine Physician",
        rating: 4,
        comment: "Great case overall. Would love to see more emphasis on door-to-balloon time and team coordination.",
        date: "2 months ago"
      }
    ]
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Case removed from your favorites" : "Case added to your favorites"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: caseData.title,
        text: caseData.description,
        url: window.location.href
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Case link copied to clipboard"
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Case link copied to clipboard"
      });
    }
  };

  const handleStartCase = () => {
    router.push('/student/simulations/triage');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Simulations
        </Button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{caseData.specialty}</Badge>
                <Badge variant="outline" className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {caseData.duration}
                </Badge>
                <Badge className={
                  caseData.difficulty === "Beginner" ? "bg-green-500" :
                  caseData.difficulty === "Intermediate" ? "bg-yellow-500" :
                  "bg-red-500"
                }>
                  {caseData.difficulty}
                </Badge>
                {caseData.completed && (
                  <Badge className="bg-green-500">
                    <Trophy className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseData.title}</h1>
              <p className="text-gray-600 mb-3">{caseData.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{caseData.rating}</span>
                  <span className="ml-1">({caseData.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleFavorite}>
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="lg" onClick={handleStartCase}>
                <Play className="h-4 w-4 mr-2" />
                {caseData.completed ? "Review Case" : "Start Simulation"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Case Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{caseData.fullDescription}</p>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-500" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {caseData.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Topics Covered */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                  Topics Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {caseData.topics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                      <span className="text-gray-700">{topic.name}</span>
                      {topic.covered ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary (if completed) */}
            {caseData.completed && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Your Performance
                  </CardTitle>
                  <CardDescription>Overall Score: {caseData.score}%</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clinical Accuracy</span>
                        <span className="font-medium">{caseData.performance.accuracy}%</span>
                      </div>
                      <Progress value={caseData.performance.accuracy} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Time Efficiency</span>
                        <span className="font-medium">{caseData.performance.timeEfficiency}%</span>
                      </div>
                      <Progress value={caseData.performance.timeEfficiency} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Clinical Reasoning</span>
                        <span className="font-medium">{caseData.performance.clinicalReasoning}%</span>
                      </div>
                      <Progress value={caseData.performance.clinicalReasoning} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Communication</span>
                        <span className="font-medium">{caseData.performance.communication}%</span>
                      </div>
                      <Progress value={caseData.performance.communication} className="h-2" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {caseData.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-600">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {caseData.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-gray-600">• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                  User Reviews ({caseData.reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseData.reviews.map((review, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.author}</p>
                          <p className="text-sm text-gray-600">{review.role}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-1">{review.comment}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={handleStartCase}>
                  <Play className="h-4 w-4 mr-2" />
                  {caseData.completed ? "Review Case" : "Start Simulation"}
                </Button>
                <Button className="w-full" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study Materials
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Discussion Forum
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {caseData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Cases */}
            <Card>
              <CardHeader>
                <CardTitle>Related Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/student/simulations/2" className="block p-3 rounded hover:bg-gray-50 border">
                    <p className="font-medium text-sm">Unstable Angina</p>
                    <p className="text-xs text-gray-600">Cardiology • 20 min</p>
                  </Link>
                  <Link href="/student/simulations/3" className="block p-3 rounded hover:bg-gray-50 border">
                    <p className="font-medium text-sm">Cardiogenic Shock</p>
                    <p className="text-xs text-gray-600">Cardiology • 30 min</p>
                  </Link>
                  <Link href="/student/simulations/4" className="block p-3 rounded hover:bg-gray-50 border">
                    <p className="font-medium text-sm">Arrhythmia Management</p>
                    <p className="text-xs text-gray-600">Cardiology • 18 min</p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
