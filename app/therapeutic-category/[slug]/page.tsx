"use client"

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

// Mock data for therapeutic categories
const therapeuticCategories = [
  {
    slug: "cardiovascular-drugs",
    name: "Cardiovascular Drugs",
    description: "Medications that affect the heart and circulatory system",
    icon: Heart,
    color: "text-red-500",
    drugClasses: [
      { name: "Antihypertensives", drugs: 45, description: "Drugs used to treat high blood pressure" },
      { name: "Antiarrhythmics", drugs: 28, description: "Medications for irregular heartbeats" },
      { name: "Antianginals", drugs: 19, description: "Drugs for chest pain and angina" },
      { name: "Anticoagulants", drugs: 22, description: "Blood thinners to prevent clots" },
      { name: "Inotropes", drugs: 12, description: "Drugs that affect heart muscle contraction" },
    ]
  },
  {
    slug: "cns-drugs",
    name: "CNS Drugs",
    description: "Medications affecting the central nervous system",
    icon: Brain,
    color: "text-purple-500",
    drugClasses: [
      { name: "Antidepressants", drugs: 67, description: "Treat depression and mood disorders" },
      { name: "Antipsychotics", drugs: 42, description: "Manage psychotic disorders" },
      { name: "Anticonvulsants", drugs: 38, description: "Prevent and treat seizures" },
      { name: "Anxiolytics", drugs: 25, description: "Reduce anxiety and panic" },
      { name: "Sedatives", drugs: 18, description: "Promote sleep and relaxation" },
    ]
  },
  {
    slug: "endocrine-drugs",
    name: "Endocrine Drugs",
    description: "Medications for hormonal and endocrine disorders",
    icon: Droplets,
    color: "text-yellow-500",
    drugClasses: [
      { name: "Antidiabetics", drugs: 56, description: "Manage blood glucose levels" },
      { name: "Thyroid hormones", drugs: 15, description: "Treat thyroid disorders" },
      { name: "Corticosteroids", drugs: 23, description: "Anti-inflammatory and immune suppressants" },
      { name: "Sex hormones", drugs: 34, description: "Hormone replacement and contraception" },
      { name: "Bone metabolism", drugs: 19, description: "Treat osteoporosis and bone disorders" },
    ]
  },
  {
    slug: "anti-infectives",
    name: "Anti-infectives",
    description: "Medications to treat infections",
    icon: Shield,
    color: "text-indigo-500",
    drugClasses: [
      { name: "Antibiotics", drugs: 124, description: "Treat bacterial infections" },
      { name: "Antivirals", drugs: 45, description: "Treat viral infections" },
      { name: "Antifungals", drugs: 32, description: "Treat fungal infections" },
      { name: "Antiparasitics", drugs: 28, description: "Treat parasitic infections" },
      { name: "Antimycobacterials", drugs: 17, description: "Treat mycobacterial infections" },
    ]
  }
]

export default function TherapeuticCategoryPage() {
  const params = useParams()
  const [category, setCategory] = useState<any>(null)

  useEffect(() => {
    if (params.slug) {
      const foundCategory = therapeuticCategories.find(cat => cat.slug === params.slug)
      setCategory(foundCategory)
    }
  }, [params.slug])

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
                {category.drugClasses.map((drugClass: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[#213874]">{drugClass.name}</h3>
                      <Badge variant="secondary">{drugClass.drugs} drugs</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{drugClass.description}</p>
                    <Button asChild>
                      <Link href={`/drug-class/${drugClass.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        Explore Class
                      </Link>
                    </Button>
                  </div>
                ))}
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
                    <span className="font-semibold">{category.drugClasses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Drugs</span>
                    <span className="font-semibold">
                      {category.drugClasses.reduce((sum: number, cls: any) => sum + cls.drugs, 0)}
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