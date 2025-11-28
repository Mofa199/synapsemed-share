"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Pill, 
  Search, 
  Filter,
  Eye,
  ChevronRight,
  Beaker,
  Heart,
  Info,
  BookOpen
} from "lucide-react"
import Link from "next/link"

interface DrugClass {
  id: string
  name: string
  category: string
  description: string
  mechanism: string
  therapeuticUses: string[]
  commonSideEffects: string[]
  contraindications: string[]
  drugs: string[]
}

interface Drug {
  name: string
  genericName: string
  brandNames: string[]
  class: string
  category: string
  description: string
  mechanism: string
  indications: string[]
  dosage: {
    adult: string
    pediatric: string
    elderly: string
  }
}

export default function DrugsAndClassesPage() {
  const { toast } = useToast()
  const [drugClasses, setDrugClasses] = useState<DrugClass[]>([])
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("drug-classes")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch drug classes
      const classesResponse = await fetch('/api/admin/drug-classes')
      const classesData = await classesResponse.json()
      
      if (classesData.success) {
        setDrugClasses(classesData.data)
      }

      // Fetch drugs
      const drugsResponse = await fetch('/api/admin/drugs')
      const drugsData = await drugsResponse.json()
      
      if (drugsData.drugs) {
        setDrugs(drugsData.drugs)
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

  const filteredDrugClasses = drugClasses.filter(drugClass => {
    const matchesSearch = drugClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drugClass.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drugClass.mechanism.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || drugClass.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drug.mechanism.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || drug.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set([...drugClasses.map(dc => dc.category), ...drugs.map(d => d.category)])]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Learning Resources</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Drugs & Drug Classes</span>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-[#213874] mb-4">Drug Information Database</h1>
            <p className="text-xl text-gray-600 mb-6">
              Comprehensive resource for drug classes, mechanisms, indications, and clinical applications
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>{drugClasses.length} Drug Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-green-600" />
                <span>{drugs.length} Individual Drugs</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span>{categories.length} Medical Categories</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search drugs, drug classes, mechanisms, or indications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-lg"
              />
            </div>
            <div className="flex justify-center">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[300px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="drug-classes" className="flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Drug Classes
              </TabsTrigger>
              <TabsTrigger value="drugs" className="flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Individual Drugs
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="drug-classes" className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#213874] mb-2">Drug Classes</h2>
              <p className="text-gray-600 mb-6">
                Explore therapeutic categories and understand drug classification systems
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrugClasses.map((drugClass) => (
                <Link href={`/drug-class/${drugClass.id}`} key={drugClass.id}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Pill className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                            {drugClass.name}
                          </CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {drugClass.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm mt-3">
                      {drugClass.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Mechanism:</span>
                        <p className="text-sm text-gray-600 mt-1">{drugClass.mechanism}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Drugs ({drugClass.drugs.length}):</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {drugClass.drugs.slice(0, 3).map((drug, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {drug}
                            </Badge>
                          ))}
                          {drugClass.drugs.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{drugClass.drugs.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Key Uses:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {drugClass.therapeuticUses.slice(0, 2).map((use, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {use}
                            </Badge>
                          ))}
                          {drugClass.therapeuticUses.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{drugClass.therapeuticUses.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button size="sm" className="w-full bg-[#213874] hover:bg-[#1a6ac3]">
                        <Info className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>

            {/* No results for drug classes */}
            {filteredDrugClasses.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Pill className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No drug classes found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="drugs" className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#213874] mb-2">Individual Drugs</h2>
              <p className="text-gray-600 mb-6">
                Detailed information about specific medications, dosages, and clinical applications
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrugs.map((drug, index) => (
                <Link href={`/drug/${drug.name.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <Pill className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-[#213874] group-hover:text-[#1a6ac3] transition-colors">
                            {drug.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{drug.genericName}</p>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {drug.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {drug.class}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm mt-3">
                      {drug.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Mechanism:</span>
                        <p className="text-sm text-gray-600 mt-1">{drug.mechanism}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Brand Names:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {drug.brandNames.slice(0, 2).map((brand, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {brand}
                            </Badge>
                          ))}
                          {drug.brandNames.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{drug.brandNames.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Main Indications:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {drug.indications.slice(0, 2).map((indication, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {indication}
                            </Badge>
                          ))}
                          {drug.indications.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{drug.indications.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">Adult Dosage:</span>
                        <p className="text-sm text-gray-600 mt-1">{drug.dosage.adult}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button size="sm" className="w-full bg-[#213874] hover:bg-[#1a6ac3]">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Full Prescribing Info
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* No results for drugs */}
            {filteredDrugs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Pill className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No drugs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AIHelper />
    </div>
  )
}