"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { Search, Plus, BookOpen, Clock, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import React from "react"

export default function CurriculumModulesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = (React.use(params) as any)
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [curriculum, setCurriculum] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== "SUPER_ADMIN") {
      router.push("/admin")
      return
    }
    fetchCurriculumAndModules()
  }, [user, id])

  const fetchCurriculumAndModules = async () => {
    try {
      setLoading(true)
      const [curriculumRes, modulesRes] = await Promise.all([
        fetch(`/api/admin/curriculums/${id}`),
        fetch(`/api/admin/curriculum/${id}/modules`),
      ])

      const curriculumData = await curriculumRes.json()
      const modulesData = await modulesRes.json()

      if (curriculumData.success) {
        setCurriculum(curriculumData.data)
      } else {
        setError("Curriculum not found")
      }

      if (Array.isArray(modulesData)) {
        setModules(modulesData)
      } else {
        setModules([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== "SUPER_ADMIN") {
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
          <Button className="mt-4" onClick={() => router.push("/admin/curriculum")}>
            Back to Curriculums
          </Button>
        </div>
      </div>
    )
  }

  const filteredModules = modules.filter(
    (module: any) =>
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/curriculum")}
          className="mb-6 text-[#213874] hover:bg-[#213874]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Curriculums
        </Button>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#213874] mb-2">{curriculum?.name || "Curriculum"} - Modules</h1>
            <p className="text-gray-600">Manage modules for this curriculum</p>
          </div>
          <Link href={`/admin/curriculum/${id}/modules/add`}>
            <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Modules Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module: any, index) => (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Module {index + 1}</Badge>
                        <Badge variant="outline">{module.type || "Lecture"}</Badge>
                      </div>
                      <CardTitle className="text-lg text-[#213874] mb-2">{module.title}</CardTitle>
                      <CardDescription className="text-sm">{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {module.duration || "30 min"}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {module._count?.topics || 0} lessons
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/admin/curriculum/${id}/modules/${module.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/admin/curriculum/${id}/modules/${module.id}/topics`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <BookOpen className="h-3 w-3 mr-1" />
                          View Topics
                        </Button>
                      </Link>
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

        {filteredModules.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No modules found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first module"}
            </p>
            <Link href={`/admin/curriculum/${id}/modules/add`}>
              <Button className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}