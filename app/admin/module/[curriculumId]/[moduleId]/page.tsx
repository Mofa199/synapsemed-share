"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Clock, Users, Edit, Plus, Eye, Star } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function AdminModulePage() {
  const { user } = useAuth()
  const params = useParams()
  const curriculumId = params.curriculumId as string
  const moduleId = params.moduleId as string

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  // Sample topics data
  const topics = [
    {
      id: 1,
      title: "Introduction to Human Anatomy",
      type: "Video",
      duration: "45 min",
      difficulty: "Beginner",
      completions: 234,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Cardiovascular System Overview",
      type: "Interactive",
      duration: "60 min",
      difficulty: "Intermediate",
      completions: 198,
      rating: 4.7,
    },
    {
      id: 3,
      title: "Heart Anatomy 3D Model",
      type: "3D Model",
      duration: "30 min",
      difficulty: "Intermediate",
      completions: 187,
      rating: 4.9,
    },
    {
      id: 4,
      title: "Blood Circulation Pathways",
      type: "Article",
      duration: "25 min",
      difficulty: "Beginner",
      completions: 156,
      rating: 4.6,
    },
    {
      id: 5,
      title: "Cardiac Cycle Mechanics",
      type: "Simulation",
      duration: "40 min",
      difficulty: "Advanced",
      completions: 134,
      rating: 4.8,
    },
    {
      id: 6,
      title: "ECG Interpretation Basics",
      type: "Quiz",
      duration: "20 min",
      difficulty: "Intermediate",
      completions: 123,
      rating: 4.5,
    },
  ]

  const moduleInfo = {
    name: "Anatomy & Physiology",
    description: "Comprehensive study of human anatomy and physiological processes",
    totalTopics: topics.length,
    totalStudents: 456,
    avgProgress: 75,
    avgRating: 4.7,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#213874]">{moduleInfo.name}</h1>
              <p className="text-gray-600">{moduleInfo.description}</p>
            </div>
            <Button className="bg-[#213874] hover:bg-[#1a6ac3]" asChild>
              <Link href={`/admin/curriculum/${curriculumId}/modules/${moduleId}/topics/add`}>
                <Plus className="w-4 h-4 mr-2" />
                Add Topic
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#213874]">{moduleInfo.totalTopics}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#213874]">{moduleInfo.totalStudents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#213874]">{moduleInfo.avgProgress}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-[#213874]">{moduleInfo.avgRating}</div>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Card key={topic.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                      {topic.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{topic.type}</Badge>
                      <Badge variant="outline">{topic.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/topic/${topic.id}`}>
                        <Eye className="w-3 h-3" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/curriculum/${curriculumId}/modules/${moduleId}/topics/${topic.id}/edit`}>
                        <Edit className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{topic.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{topic.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{topic.completions} completions</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {Math.round((topic.completions / moduleInfo.totalStudents) * 100)}%
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                    <Link href={`/topic/${topic.id}`}>View Topic</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AIHelper />
    </div>
  )
}
