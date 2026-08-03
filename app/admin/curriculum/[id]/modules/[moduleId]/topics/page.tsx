"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { Search, Plus, BookOpen, Clock, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

interface Topic {
  id: string
  title: string
  description: string
  type: string
  difficulty: string
  duration?: string
  category?: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function ModuleTopicsPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [module, setModule] = useState<any>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== "SUPER_ADMIN" && user?.role !== "LECTURER" && user?.role !== "EDITOR") {
      router.push("/admin")
      return
    }
    fetchModuleAndTopics()
  }, [user, params.moduleId])

  const fetchModuleAndTopics = async () => {
    try {
      setLoading(true)
      const [moduleRes, topicsRes] = await Promise.all([
        fetch(`/api/admin/modules/${params.moduleId}`),
        fetch(`/api/admin/modules/${params.moduleId}/topics`),
      ])

      const moduleData = await moduleRes.json()
      const topicsData = await topicsRes.json()

      if (moduleData.success) {
        setModule(moduleData.data)
      } else {
        setError("Module not found")
      }

      if (topicsData.success) {
        setTopics(topicsData.data)
      } else {
        setTopics([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== "SUPER_ADMIN" && user?.role !== "LECTURER" && user?.role !== "EDITOR") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#213874]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <Button className="mt-4" onClick={() => router.push(`/admin/curriculum/${params.id}/modules`)}>
            Back to Modules
          </Button>
        </div>
      </div>
    )
  }

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyColors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    }
    return difficultyColors[difficulty as keyof typeof difficultyColors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/curriculum/${params.id}/modules`)}
          className="mb-6 text-[#213874] hover:bg-[#213874]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Modules
        </Button>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#213874] mb-2">{module?.name || "Module"} - Topics</h1>
            <p className="text-gray-600">Manage topics for this module</p>
          </div>
          <Link href={`/admin/curriculum/${params.id}/modules/${params.moduleId}/topics/add`}>
            <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Topics Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{topic.type || "Article"}</Badge>
                        <Badge className={getDifficultyBadge(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-[#213874] mb-2">{topic.title}</CardTitle>
                      <CardDescription className="text-sm">{topic.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {topic.duration || "30 min"}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {topic.category || "General"}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent text-[#213874] border-blue-200" asChild>
                        <Link href={`/topic/${topic.id}`}>
                          <BookOpen className="h-3 w-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent text-gray-600 border-gray-200" asChild>
                        <Link href={`/admin/content/topics/add`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredTopics.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No topics found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first topic"}
            </p>
            <Link href={`/admin/curriculum/${params.id}/modules/${params.moduleId}/topics/add`}>
              <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}