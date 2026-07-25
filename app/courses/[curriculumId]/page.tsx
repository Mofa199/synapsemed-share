"use client"

import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Heart, Users, Pill, BookOpen, Clock, Award, Plus, Edit, ChevronRight, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

interface Module {
  id: string
  name: string
  description?: string
  curriculumId: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  topics?: Array<{
    id: string
    title: string
    description: string
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
    duration?: string
    views: number
  }>
}

interface Curriculum {
  id: string
  name: string
  description?: string
  field: 'MEDICAL' | 'NURSING' | 'PHARMACY'
  modules: Module[]
}

export default function CurriculumDetailsPage({ params }: { params: Promise<{ curriculumId: string }> }) {
  const { curriculumId } = (React.use(params) as any)
  const { user } = useAuth()
  const router = useRouter()
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      setIsAdmin(['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role))
    }
    fetchData()
  }, [user, curriculumId])

  const fetchData = async () => {
    try {
      setLoading(true)

      const res = await fetch(`/api/admin/curriculums/${curriculumId}`)
      if (!res.ok) {
        throw new Error("Failed to fetch curriculum")
      }
      
      const data = await res.json()
      if (data.success && data.data) {
        setCurriculum(data.data)
      } else {
        throw new Error("Curriculum not found")
      }
    } catch (err) {
      setError('Failed to load curriculum data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#213874]" />
        </div>
      </div>
    )
  }

  if (error || !curriculum) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>{error || "Curriculum not found."}</p>
            <Button onClick={() => router.push('/courses')} className="mt-4">
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'MEDICAL': return Heart
      case 'NURSING': return Users
      case 'PHARMACY': return Pill
      default: return BookOpen
    }
  }

  const getFieldColor = (field: string) => {
    switch (field) {
      case 'MEDICAL': return 'text-red-600'
      case 'NURSING': return 'text-blue-600'
      case 'PHARMACY': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const CourseIcon = getFieldIcon(curriculum.field)
  const iconColor = getFieldColor(curriculum.field)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-4 text-gray-500 hover:text-gray-900 -ml-2">
          <Link href="/courses">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Link>
        </Button>

        {/* Course Header */}
        <div className="mb-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                <CourseIcon className={`w-8 h-8 ${iconColor}`} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#213874]">
                  {curriculum.name}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                  {curriculum.description || 'Your comprehensive guide to mastering this curriculum.'}
                </p>
              </div>
            </div>
 
            {isAdmin && (
              <div className="flex gap-3">
                <Button asChild variant="outline" className="border-gray-200 hover:bg-gray-50">
                  <Link href={`/admin/curriculum/${curriculum.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Manage
                  </Link>
                </Button>
                <Button asChild className="bg-[#213874] hover:bg-[#1a6ac3] shadow-lg shadow-blue-900/10 transition-all">
                  <Link href={`/admin/curriculum/${curriculum.id}/modules/add`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{curriculum.modules?.length || 0} Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Self-paced learning</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Earn certificates</span>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <h2 className="text-2xl font-bold text-[#213874] mb-6">Modules</h2>
        
        {curriculum.modules?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {curriculum.modules.map((module: any, index: number) => (
              <div key={module.id} className="relative group">
                <Link href={isAdmin ? `/admin/curriculum/${curriculum.id}/modules/${module.id}` : `/courses/${curriculum.id}/modules/${module.id}`}>
                  <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#213874]/50 tracking-widest uppercase">Module {index + 1}</span>
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <ChevronRight className="w-4 h-4 text-[#213874]" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-[#213874]">{module.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-gray-500 mt-2">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>{module._count?.topics || module.topics?.length || 0} Topics</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          <span>Interactive</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full bg-white shadow-md border-none" asChild>
                      <Link href={`/admin/curriculum/${curriculum.id}/modules/${module.id}/edit`}>
                        <Edit className="w-4 h-4 text-[#213874]" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-inner">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Modules Found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {isAdmin
                ? "Your curriculum is ready! Start by adding your first educational module to guide your students."
                : "This curriculum is currently being prepared. Check back soon for new learning materials!"
              }
            </p>
            {isAdmin && (
              <Button asChild size="lg" className="bg-[#213874] hover:bg-[#1a6ac3] shadow-xl shadow-blue-900/20 px-8 rounded-full transition-all hover:scale-105 active:scale-95">
                <Link href={`/admin/curriculum/${curriculum.id}/modules/add`}>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Module
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>

      <AIHelper />
    </div>
  )
}
