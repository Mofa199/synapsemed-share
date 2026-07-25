"use client"
import React from "react";

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Brain, 
  Zap, 
  Activity, 
  Eye, 
  Ear, 
  Stethoscope, 
  Baby, 
  Shield, 
  Radio, 
  Droplets, 
  Sun,
  BookOpen,
  FileText,
  Video,
  Filter,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const therapeuticCategories = [
  {
    slug: "cardiovascular-drugs",
    name: "Cardiovascular Drugs",
    description: "Medications that affect the heart and circulatory system",
    icon: Heart,
    color: "text-red-500",
  },
  {
    slug: "cns-drugs",
    name: "CNS Drugs",
    description: "Medications affecting the central nervous system",
    icon: Brain,
    color: "text-purple-500",
  },
  {
    slug: "endocrine-drugs",
    name: "Endocrine Drugs",
    description: "Medications for hormonal and endocrine disorders",
    icon: Droplets,
    color: "text-yellow-500",
  },
  {
    slug: "anti-infectives",
    name: "Anti-infectives",
    description: "Medications to treat infections",
    icon: Shield,
    color: "text-indigo-500",
  }
]

export default function TherapeuticCategoryPage() {
  const [category, setCategory] = useState<any>(null)
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params;
      if (resolvedParams.slug) {
        const foundCategory = therapeuticCategories.find(cat => cat.slug === resolvedParams.slug)
        setCategory(foundCategory)
        
        if (foundCategory) {
          try {
            const res = await fetch('/api/drug-classes');
            if (res.ok) {
              const data = await res.json();
              const matchingClasses = data.drugClasses.filter((dc: any) => 
                dc.category.toLowerCase().includes(foundCategory.name.toLowerCase().split(' ')[0]) ||
                foundCategory.name.toLowerCase().includes(dc.category.toLowerCase())
              );
              setClasses(matchingClasses);
            }
          } catch(e) {
            console.error(e)
          }
        }
      }
      setLoading(false)
    }
    fetchData();
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#213874]"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
            <p className="text-gray-600 mb-6">The requested therapeutic category could not be found.</p>
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

  const Icon = category.icon

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
              <Icon className={`w-8 h-8 ${category.color}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#213874]">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Drug Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Drug Classes in {category.name}</CardTitle>
                <CardDescription>Browse by therapeutic drug classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {classes.length > 0 ? classes.map((drugClass: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[#213874]">{drugClass.name}</h3>
                      <Badge variant="secondary">{drugClass._count?.drugs || 0} drugs</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{drugClass.description || "No description available."}</p>
                    <Button asChild>
                      <Link href={`/drug-class/${drugClass.id}`}>
                        Explore Class
                      </Link>
                    </Button>
                  </div>
                )) : (
                  <p className="text-gray-500">No drug classes found for this category.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Category Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drug Classes</span>
                    <span className="font-semibold">{classes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Drugs</span>
                    <span className="font-semibold">
                      {classes.reduce((sum: number, cls: any) => sum + (cls._count?.drugs || 0), 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Related Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {therapeuticCategories
                    .filter(cat => cat.slug !== category.slug)
                    .slice(0, 3)
                    .map((cat, index) => {
                      const CatIcon = cat.icon
                      return (
                        <Button key={index} variant="ghost" className="w-full justify-start" asChild>
                          <Link href={`/therapeutic-category/${cat.slug}`}>
                            <CatIcon className={`h-4 w-4 mr-2 ${cat.color}`} />
                            {cat.name}
                          </Link>
                        </Button>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Study Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Study Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Textbook Chapters
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <Video className="h-4 w-4 mr-2" />
                      Video Lectures
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <Filter className="h-4 w-4 mr-2" />
                      Practice Questions
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <FileText className="h-4 w-4 mr-2" />
                      Clinical Cases
                    </Link>
                  </Button>
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