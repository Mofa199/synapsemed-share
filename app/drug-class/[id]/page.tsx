"use client"
import React from "react";

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Pill, 
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
  Leaf,
  BookOpen,
  FileText,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"



export default function DrugClassPage() {
  const params = useParams()
  const [drugClass, setDrugClass] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDrugClass = async () => {
      const resolvedParams = await params;
      if (resolvedParams.id) {
        try {
          const res = await fetch(`/api/drug-classes/${resolvedParams.id}`);
          if (res.ok) {
            const data = await res.json();
            setDrugClass(data.drugClass || data);
          }
        } catch (error) {
          console.error("Failed to fetch drug class:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchDrugClass();
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#213874]"></div>
      </div>
    );
  }

  if (!drugClass) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Drug Class Not Found</h1>
            <p className="text-gray-600 mb-6">The requested drug class could not be found.</p>
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

  const ClassIcon = getClassIcon(drugClass.category)
  const classColor = getClassColor(drugClass.category)

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
              <ClassIcon className={`w-8 h-8 ${classColor}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#213874]">{drugClass.name}</h1>
              <p className="text-gray-600">{drugClass.description}</p>
              <Badge variant="outline" className="mt-2">{drugClass.category}</Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Class Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{drugClass.description || "No description available."}</p>
                </div>
              </CardContent>
            </Card>

            {/* Individual Drugs */}
            <Card>
              <CardHeader>
                <CardTitle>Drugs in this Class</CardTitle>
                <CardDescription>Detailed information about individual drugs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {drugClass.drugs?.map((drug: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-[#213874]">{drug.name}</h3>
                      <Badge>{drugClass.name}</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Mechanism of Action</h4>
                        <p className="text-gray-700 text-sm">{drug.mechanism || "Not specified"}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Therapeutic Uses</h4>
                        <div className="flex flex-wrap gap-1">
                          {(typeof drug.indications === 'string' ? drug.indications.split(/[\\n,]+/) : (Array.isArray(drug.indications) ? drug.indications : [])).filter(Boolean).slice(0, 3).map((use: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {use.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-1">Typical Dosage (Adult)</h4>
                        <p className="text-gray-700 text-sm">{drug.dosageAdult || "Not specified"}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/drug/${drug.id}`}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Detailed Info
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Case Studies
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Class Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drugs in Class</span>
                    <span className="font-semibold">{drugClass.drugs?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Related Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    Antimicrobials
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Antifungals
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Antivirals
                  </Button>
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
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Pharmacology Textbook
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Flashcards
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Quiz
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