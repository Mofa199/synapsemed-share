"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { BookOpen, Clock, Users, Award, Play, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

export default function TopicPage() {
  const { user } = useAuth()
  const params = useParams()
  const topicId = params.id as string
  const [topic, setTopic] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      window.location.href = "/auth"
      return
    }

    // Fetch topic data
    fetchTopic()
  }, [user, topicId])

  const fetchTopic = async () => {
    try {
      const response = await fetch(`/api/topics/${topicId}`)
      const data = await response.json()
      setTopic(data.topic)
    } catch (error) {
      console.error("Error fetching topic:", error)
      // Set mock data for now
      setTopic({
        id: topicId,
        title: getTopicTitle(topicId),
        description: getTopicDescription(topicId),
        category: "Medical",
        difficulty: "Intermediate",
        duration: "2 hours",
        progress: 0,
        modules: getTopicModules(topicId),
        prerequisites: ["Basic Anatomy", "Physiology Fundamentals"],
        learningObjectives: [
          "Understand the basic concepts",
          "Apply knowledge in clinical scenarios",
          "Analyze case studies",
          "Demonstrate practical skills",
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const getTopicTitle = (id: string) => {
    const titles: Record<string, string> = {
      cardiovascular: "Cardiovascular System",
      respiratory: "Respiratory System",
      nervous: "Nervous System",
      endocrine: "Endocrine System",
      musculoskeletal: "Musculoskeletal System",
      pharmacology: "Clinical Pharmacology",
    }
    return titles[id] || "Medical Topic"
  }

  const getTopicDescription = (id: string) => {
    const descriptions: Record<string, string> = {
      cardiovascular: "Comprehensive study of the heart and circulatory system",
      respiratory: "In-depth exploration of the respiratory system and breathing mechanisms",
      nervous: "Understanding the central and peripheral nervous systems",
      endocrine: "Study of hormones and endocrine glands",
      musculoskeletal: "Anatomy and physiology of bones, muscles, and joints",
      pharmacology: "Drug mechanisms, interactions, and therapeutic applications",
    }
    return descriptions[id] || "Comprehensive medical topic coverage"
  }

  const getTopicModules = (id: string) => {
    return [
      { id: 1, title: "Introduction and Overview", duration: "30 min", completed: false },
      { id: 2, title: "Anatomy and Physiology", duration: "45 min", completed: false },
      { id: 3, title: "Pathophysiology", duration: "40 min", completed: false },
      { id: 4, title: "Clinical Applications", duration: "35 min", completed: false },
      { id: 5, title: "Case Studies", duration: "30 min", completed: false },
    ]
  }

  if (!user) {
    return null // Will redirect to auth
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#213874] mb-2">{topic.title}</h1>
          <p className="text-gray-600 mb-4">{topic.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {topic.category}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {topic.duration}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {topic.difficulty}
            </Badge>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">{topic.progress}%</span>
            </div>
            <Progress value={topic.progress} className="h-2" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#213874]" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topic.learningObjectives.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Modules */}
            <Card>
              <CardHeader>
                <CardTitle>Course Modules</CardTitle>
                <CardDescription>Complete all modules to master this topic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topic.modules.map((module: any, index: number) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#213874] text-white flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-[#213874]">{module.title}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.duration}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#213874] hover:bg-[#1a6ac3]">
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topic.prerequisites.map((prereq: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#213874] hover:bg-[#1a6ac3]">Start Learning</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Download Materials
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Join Discussion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}
