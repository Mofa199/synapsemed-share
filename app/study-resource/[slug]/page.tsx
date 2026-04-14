"use client"
import React from "react";

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  FileText, 
  Video, 
  Filter, 
  Star,
  Download,
  Clock,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data for study resources
const studyResources = [
  {
    slug: "pharmacology-textbooks",
    name: "Pharmacology Textbooks",
    description: "Comprehensive textbooks covering all major drug classes and therapeutic areas",
    icon: BookOpen,
    color: "text-blue-500",
    resources: [
      {
        title: "Goodman & Gilman's The Pharmacological Basis of Therapeutics",
        author: "Laurence Brunton",
        type: "Textbook",
        rating: 4.8,
        pages: 1892,
        difficulty: "Advanced",
        description: "The gold standard reference for pharmacology with detailed mechanisms and clinical applications."
      },
      {
        title: "Basic & Clinical Pharmacology",
        author: "Bertram Katzung",
        type: "Textbook",
        rating: 4.6,
        pages: 1184,
        difficulty: "Intermediate",
        description: "Balances basic science and clinical pharmacology with clear explanations."
      },
      {
        title: "Rang & Dale's Pharmacology",
        author: "James Rang",
        type: "Textbook",
        rating: 4.5,
        pages: 768,
        difficulty: "Beginner",
        description: "Concise yet comprehensive coverage of pharmacology principles."
      }
    ]
  },
  {
    slug: "video-lectures",
    name: "Video Lectures",
    description: "Educational video content for visual learning",
    icon: Video,
    color: "text-red-500",
    resources: [
      {
        title: "Pharmacology Made Easy",
        author: "Dr. Sarah Johnson",
        type: "Video Series",
        rating: 4.7,
        duration: "12 hours",
        difficulty: "Beginner",
        description: "Step-by-step video explanations of major drug classes with clinical correlations."
      },
      {
        title: "Advanced Pharmacology Review",
        author: "Dr. Michael Chen",
        type: "Video Series",
        rating: 4.9,
        duration: "8 hours",
        difficulty: "Advanced",
        description: "In-depth review of complex pharmacological concepts for board preparation."
      }
    ]
  },
  {
    slug: "question-banks",
    name: "Question Banks",
    description: "Practice questions to test your knowledge",
    icon: Filter,
    color: "text-green-500",
    resources: [
      {
        title: "Pharmacology MCQs for Medical Students",
        author: "Dr. Emily Rodriguez",
        type: "Question Bank",
        rating: 4.6,
        questions: 500,
        difficulty: "Intermediate",
        description: "500 multiple-choice questions covering all major therapeutic areas."
      },
      {
        title: "Pharmacology Clinical Cases",
        author: "Dr. Robert Wilson",
        type: "Question Bank",
        rating: 4.8,
        questions: 150,
        difficulty: "Advanced",
        description: "Clinical case scenarios with detailed explanations and pharmacological reasoning."
      }
    ]
  },
  {
    slug: "flashcards",
    name: "Flashcards",
    description: "Quick review tools for memorization",
    icon: FileText,
    color: "text-purple-500",
    resources: [
      {
        title: "Pharmacology Flashcards - Drug Classes",
        author: "Medical Education Team",
        type: "Flashcard Set",
        rating: 4.5,
        cards: 200,
        difficulty: "All Levels",
        description: "Comprehensive flashcards covering mechanisms, uses, and side effects of major drug classes."
      },
      {
        title: "Pharmacology Mnemonics",
        author: "Medical Education Team",
        type: "Flashcard Set",
        rating: 4.7,
        cards: 75,
        difficulty: "All Levels",
        description: "Memory aids and mnemonics for difficult pharmacological concepts."
      }
    ]
  }
]

export default function StudyResourcePage() {
  const params = useParams()
  const [resource, setResource] = useState<any>(null)

  useEffect(() => {
    if (params.slug) {
      const foundResource = studyResources.find(res => res.slug === (React.use(params) as any).slug)
      setResource(foundResource)
    }
  }, [params.slug])

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Resource Not Found</h1>
            <p className="text-gray-600 mb-6">The requested study resource could not be found.</p>
            <Button asChild>
              <Link href="/pharmacology">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pharmacology
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const Icon = resource.icon

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/pharmacology">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pharmacology
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center`}>
              <Icon className={`w-8 h-8 ${resource.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#213874]">{resource.name}</h1>
              <p className="text-gray-600">{resource.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Available Resources</CardTitle>
                <CardDescription>Browse all {resource.name.toLowerCase()} resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {resource.resources.map((item: any, index: number) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <CardDescription>by {item.author}</CardDescription>
                        </div>
                        <Badge className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {item.rating}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{item.type}</Badge>
                          <Badge variant="outline">{item.difficulty}</Badge>
                          {item.pages && <Badge variant="outline">{item.pages} pages</Badge>}
                          {item.duration && <Badge variant="outline">{item.duration}</Badge>}
                          {item.questions && <Badge variant="outline">{item.questions} questions</Badge>}
                          {item.cards && <Badge variant="outline">{item.cards} cards</Badge>}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline">
                            <Clock className="h-4 w-4 mr-2" />
                            Add to Study Plan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Resources</span>
                    <span className="font-semibold">{resource.resources.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold">
                      {(resource.resources.reduce((sum: number, res: any) => sum + res.rating, 0) / resource.resources.length).toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Related Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studyResources
                    .filter(res => res.slug !== resource.slug)
                    .slice(0, 3)
                    .map((res, index) => {
                      const ResIcon = res.icon
                      return (
                        <Button key={index} variant="ghost" className="w-full justify-start" asChild>
                          <Link href={`/study-resource/${res.slug}`}>
                            <ResIcon className={`h-4 w-4 mr-2 ${res.color}`} />
                            {res.name}
                          </Link>
                        </Button>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Study Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Study Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p>• Use spaced repetition for better retention</p>
                  <p>• Combine multiple resource types for comprehensive learning</p>
                  <p>• Test yourself regularly with practice questions</p>
                  <p>• Create your own summaries and mnemonics</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}