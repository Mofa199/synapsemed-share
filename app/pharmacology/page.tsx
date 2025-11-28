"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { SearchComponent } from "@/components/search-component"
import MedicalCalculators from "@/components/medical-calculators"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Pill, Calculator, Heart, Brain, Zap, Activity, Eye, Ear, Stethoscope, Baby, Shield, Radio, Droplets, Sun, Leaf, Syringe, BookOpen, FileText, Filter, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

interface DrugClass {
  id: string
  name: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
  _count?: {
    drugs: number
  }
}

interface Drug {
  id: string
  name: string
  genericName: string
  brandNames: string[]
  drugClassId: string
  drugClass?: {
    name: string
  }
  category: string
  description: string
  mechanism: string
  indications: string[]
  dosage: {
    adult: string
    pediatric: string
    elderly: string
  }
  sideEffects?: string[]
  contraindications?: string[]
  interactions?: string[]
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'LECTURER' | 'EDITOR' | 'STUDENT'
  field: 'MEDICAL' | 'NURSING' | 'PHARMACY'
}

export default function PharmacologyPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [drugClasses, setDrugClasses] = useState<DrugClass[]>([])
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch drug classes from API
      const drugClassesResponse = await fetch('/api/drug-classes')
      const drugClassesResult = await drugClassesResponse.json()
      
      if (drugClassesResult.drugClasses) {
        setDrugClasses(drugClassesResult.drugClasses)
      }
      
      // Fetch drugs from API
      const drugsResponse = await fetch('/api/drugs')
      const drugsResult = await drugsResponse.json()
      
      if (drugsResult.drugs) {
        setDrugs(drugsResult.drugs)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch drug information",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = () => {
    return user && ['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role)
  }

  // Filter functions
  const filteredDrugClasses = drugClasses.filter(drugClass => {
    const matchesSearch = drugClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drugClass.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || drugClass.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (drug.drugClass?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || drug.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(drugClasses.map(dc => dc.category)))]

  // Get icon for drug class based on category
  const getClassIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiovascular':
      case 'autonomic nervous system':
        return Heart
      case 'central nervous system':
      case 'neurology':
        return Brain
      case 'respiratory':
        return Activity
      case 'gastrointestinal':
        return Eye
      case 'endocrine':
        return Droplets
      case 'anti-infectives':
        return Shield
      case 'oncology':
        return Radio
      case 'dermatology':
        return Sun
      case 'immunology':
        return Shield
      default:
        return Pill
    }
  }

  // Get color for drug class based on category
  const getClassColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiovascular':
      case 'autonomic nervous system':
        return 'text-red-600'
      case 'central nervous system':
      case 'neurology':
        return 'text-purple-600'
      case 'respiratory':
        return 'text-blue-600'
      case 'gastrointestinal':
        return 'text-green-600'
      case 'endocrine':
        return 'text-yellow-600'
      case 'anti-infectives':
        return 'text-indigo-600'
      case 'oncology':
        return 'text-pink-600'
      case 'dermatology':
        return 'text-orange-600'
      case 'immunology':
        return 'text-teal-600'
      default:
        return 'text-gray-600'
    }
  }

  // Therapeutic categories
  const therapeuticCategories = [
    { name: "Cardiovascular Drugs", icon: Heart, color: "text-red-500" },
    { name: "CNS Drugs", icon: Brain, color: "text-purple-500" },
    { name: "Endocrine Drugs", icon: Droplets, color: "text-yellow-500" },
    { name: "Anti-infectives", icon: Shield, color: "text-indigo-500" },
    { name: "Gastrointestinal Drugs", icon: Eye, color: "text-green-500" },
    { name: "Respiratory Drugs", icon: Activity, color: "text-blue-500" },
    { name: "Oncology Drugs", icon: Radio, color: "text-pink-500" },
    { name: "Immunomodulators", icon: Shield, color: "text-teal-500" },
  ]

  // Study resources
  const studyResources = [
    { name: "Pharmacology Textbooks", icon: BookOpen },
    { name: "Video Lectures", icon: Stethoscope },
    { name: "Question Banks", icon: Filter },
    { name: "Flashcards", icon: FileText },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({length: 6}).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header with Enhanced Search */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Pharmacology Hub</h1>
              <p className="text-gray-600">Explore drug classes, mechanisms, and use our clinical calculators</p>
            </div>
            {isAdmin() && (
              <div className="flex gap-2">
                <Badge className="bg-[#213874] text-white px-3 py-1">
                  Admin Mode
                </Badge>
              </div>
            )}
          </div>
          
          {/* Enhanced Search Component */}
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <SearchComponent placeholder="Search drugs by name, class, indication, or mechanism..." />
            
            {/* Category Filter */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 mr-2">Filter by category:</span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#213874] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
            
            {/* Search Results Summary */}
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-600">
                Found {filteredDrugClasses.length} drug classes and {filteredDrugs.length} drugs matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="drugs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="drugs" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Drug Database
            </TabsTrigger>
            <TabsTrigger value="therapeutic" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Therapeutic Classes
            </TabsTrigger>
            <TabsTrigger value="calculators" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Medical Calculators
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drugs" className="space-y-8">
            {/* Search */}
            <SearchComponent placeholder="Search drugs by name, class, or indication..." />

            {/* Drug Classes with Admin Controls */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#213874]">Drug Classes</h2>
                {isAdmin() && (
                  <div className="flex gap-2">
                    <Button className="bg-[#213874] hover:bg-[#1a6ac3] text-white" asChild>
                      <Link href="/admin/content/drug-classes/add">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Drug Class
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrugClasses.map((drugClass) => {
                  const ClassIcon = getClassIcon(drugClass.category)
                  const classColor = getClassColor(drugClass.category)
                  const drugCount = drugClass._count?.drugs || 0
      
                  return (
                    <div key={drugClass.id} className="group">
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer relative">
                        {isAdmin() && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
                                <Link href={`/admin/content/drug-classes/${drugClass.id}/edit`}>
                                  <Edit className="h-3 w-3" />
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <Link href={`/drug-class/${drugClass.id}`}>
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center`}>
                                <ClassIcon className={`w-6 h-6 ${classColor}`} />
                              </div>
                              <div>
                                <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3]">
                                  {drugClass.name}
                                </CardTitle>
                                <Badge variant="outline">{drugCount} drugs</Badge>
                              </div>
                            </div>
                            <CardDescription>{drugClass.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Category:</p>
                                <p className="text-sm text-gray-600">{drugClass.category}</p>
                              </div>
                              <Button className="w-full bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                                <span>Explore Class</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Browse All Drugs */}
            <div className="bg-gradient-to-r from-[#213874] to-[#1a6ac3] rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Complete Drug Database</h2>
                  <p className="text-blue-100">Browse our comprehensive collection of drug information, dosages, and interactions</p>
                </div>
                <Button className="bg-white text-[#213874] hover:bg-gray-100" asChild>
                  <Link href="/drugs">
                    <Pill className="w-4 h-4 mr-2" />
                    Browse All Drugs
                  </Link>
                </Button>
              </div>
            </div>
            {/* Featured Drugs with Enhanced Display */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#213874]">Featured Drugs</h2>
                {isAdmin() && (
                  <Button className="bg-[#f3ab1b] text-[#213874] hover:bg-[#e69b0a]" asChild>
                    <Link href="/admin/content/drugs/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Drug
                    </Link>
                  </Button>
                )}
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {filteredDrugs.slice(0, 6).map((drug) => {
                    const has3D = Math.random() > 0.5
                    
                    return (
                      <div key={drug.id} className="group">
                        <Card className="hover:shadow-md transition-all duration-300 relative">
                          {isAdmin() && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
                                  <Link href={`/admin/content/drugs/${drug.id}/edit`}>
                                    <Edit className="h-3 w-3" />
                                  </Link>
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          <Link href={`/drug/${drug.id}`}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-xl text-[#213874] group-hover:text-[#1a6ac3]">
                                    {drug.name}
                                  </CardTitle>
                                  <Badge className="mt-2 bg-[#f3ab1b] text-[#213874]">{drug.drugClass?.name || drug.category}</Badge>
                                </div>
                                {has3D && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Pill className="h-3 w-3" />
                                    3D Model
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-sm text-gray-700 mb-1">Mechanism:</h4>
                                  <p className="text-sm text-gray-600">{drug.mechanism}</p>
                                </div>

                                <div>
                                  <h4 className="font-medium text-sm text-gray-700 mb-2">Uses:</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {drug.indications.slice(0, 3).map((use, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {use}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium text-sm text-gray-700 mb-2">Dosage (Adult):</h4>
                                  <p className="text-xs text-gray-600">{drug.dosage.adult}</p>
                                </div>

                                <Button className="w-full bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                                  <Link href={`/drug/${drug.id}`}>View Details</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Link>
                        </Card>
                      </div>
                    )
                  })}
                </div>

                {/* 3D Molecular Model Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-[#213874]" />
                      3D Molecular Structure
                    </CardTitle>
                    <CardDescription>Interactive 3D model of Aspirin (C₉H₈O₄)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-[#213874]/10 to-[#1a6ac3]/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-[#f3ab1b] rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                          <Pill className="w-12 h-12 text-[#213874]" />
                        </div>
                        <p className="text-sm text-gray-600">3D Molecular Model</p>
                        <p className="text-xs text-gray-500">Interactive visualization</p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">Rotate and zoom to explore the molecular structure</p>
                      <Button variant="outline" className="w-full bg-transparent">
                        View Full Screen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="therapeutic" className="space-y-8">
            {/* Therapeutic Categories */}
            <div>
              <h2 className="text-2xl font-bold text-[#213874] mb-6">Therapeutic Classes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {therapeuticCategories.map((category, index) => {
                  const Icon = category.icon
                  // Create a slug for the category
                  const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
                  
                  return (
                    <Link key={index} href={`/therapeutic-category/${categorySlug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${category.color}`} />
                            </div>
                            <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3]">
                              {category.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                            <span>Explore Category</span>
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Study Resources */}
            <div>
              <h2 className="text-2xl font-bold text-[#213874] mb-6">Study Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {studyResources.map((resource, index) => {
                  const Icon = resource.icon
                  // Create a slug for the resource
                  const resourceSlug = resource.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
                  
                  return (
                    <Link key={index} href={`/study-resource/${resourceSlug}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#213874] flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3]">
                              {resource.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full bg-[#213874] hover:bg-[#1a6ac3]" asChild>
                            <span>Access Resources</span>
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calculators">
            <MedicalCalculators />
          </TabsContent>
        </Tabs>
      </div>

      <AIHelper />
    </div>
  )
}