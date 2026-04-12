"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { Heart, Users, Pill, BookOpen, Award, Edit, Plus, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import React from "react"

export default function AdminCurriculumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: curriculumId } = React.use(params)
  const { user } = useAuth()
  const [curriculum, setCurriculum] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== "SUPER_ADMIN") return
    fetchCurriculum()
  }, [user, curriculumId])

  const fetchCurriculum = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/curriculums/${curriculumId}`)
      const data = await response.json()
      
      if (data.success) {
        setCurriculum(data.data)
      } else {
        setError("Curriculum not found")
      }
    } catch (err) {
      console.error("Error fetching curriculum:", err)
      setError("Failed to load curriculum")
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#213874]" />
      </div>
    )
  }

  if (error || !curriculum) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Curriculum Not Found</h1>
          <p className="text-gray-600">{error || "The requested curriculum does not exist."}</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/curriculum">Back to Curriculums</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Map field to icon and color
  const getFieldConfig = (field: string) => {
    switch (field.toLowerCase()) {
      case 'medical':
        return { icon: Heart, color: "text-red-600" }
      case 'nursing':
        return { icon: Users, color: "text-blue-600" }
      case 'pharmacy':
        return { icon: Pill, color: "text-green-600" }
      default:
        return { icon: BookOpen, color: "text-gray-600" }
    }
  }

  const { icon: CurriculumIcon, color } = getFieldConfig(curriculum.field)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center`}>
              <CurriculumIcon className={`w-6 h-6 ${color}`} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#213874]">{curriculum.name}</h1>
              <p className="text-gray-600">{curriculum.description}</p>
            </div>
            <Button className="bg-[#213874] hover:bg-[#1a6ac3]" asChild>
              <Link href={`/admin/curriculum/${curriculumId}/modules/add`}>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{curriculum.modules?.length || 0} Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{curriculum._count?.modules || 0} Total Enrollments</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Admin Management</span>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculum.modules?.map((module: any) => (
            <Card key={module.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                      {module.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {module._count?.topics || 0} topics • {module.duration || "N/A"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/module/${curriculumId}/${module.id}`}>
                        <Eye className="w-3 h-3" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/curriculum/${curriculumId}/modules/${module.id}/edit`}>
                        <Edit className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-[#213874]">{module._count?.topics || 0}</div>
                      <div className="text-xs text-gray-600">Topics</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-[#213874]">N/A</div>
                      <div className="text-xs text-gray-600">Avg. Progress</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Module Progress</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                      <Link href={`/admin/curriculum/${curriculumId}/modules/${module.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!curriculum.modules || curriculum.modules.length === 0) && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No modules found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first module</p>
            <Button className="bg-[#213874] hover:bg-[#1a6ac3]" asChild>
              <Link href={`/admin/curriculum/${curriculumId}/modules/add`}>
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Link>
            </Button>
          </div>
        )}
      </div>

      <AIHelper />
    </div>
  )
}