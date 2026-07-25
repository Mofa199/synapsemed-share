"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { SearchComponent } from "@/components/search-component"
import MedicalCalculators from "@/components/medical-calculators"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Pill, Calculator, Heart, Brain, Zap, Activity, Eye, Ear, Stethoscope, Baby, Shield, Radio, Droplets, Sun, Leaf, Syringe, BookOpen, FileText, Filter, Plus, Edit, Trash2, Database, Search, ArrowRight, Activity as PulseIcon } from "lucide-react"
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
      const [drugClassesResponse, drugsResponse] = await Promise.all([
        fetch('/api/drug-classes'),
        fetch('/api/drugs')
      ])
      
      const [drugClassesResult, drugsResult] = await Promise.all([
        drugClassesResponse.json(),
        drugsResponse.json()
      ])
      
      if (drugClassesResult.drugClasses) setDrugClasses(drugClassesResult.drugClasses)
      if (drugsResult.drugs) setDrugs(drugsResult.drugs)
    } catch (error) {
      console.error('Error fetching pharmacology data:', error)
      toast({ title: "Error", description: "Failed to fetch drug information", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = user && ['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role)

  const categories = ['all', ...Array.from(new Set(drugClasses.map(dc => dc.category)))]

  const getClassIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiovascular': return Heart
      case 'central nervous system': return Brain
      case 'respiratory': return PulseIcon
      case 'endocrine': return Droplets
      case 'anti-infectives': return Shield
      default: return Pill
    }
  }

  const therapeuticCategories = [
    { name: "Cardiovascular Drugs", icon: Heart, color: "text-red-400" },
    { name: "CNS Drugs", icon: Brain, color: "text-blue-400" },
    { name: "Endocrine Drugs", icon: Droplets, color: "text-amber-400" },
    { name: "Anti-infectives", icon: Shield, color: "text-purple-400" },
  ]

  if (loading) return (
    <div className="min-h-screen bg-mesh flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">Syncing Pharma Grid...</p>
       </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-mesh text-white selection:bg-primary/30">
      <Navigation />

      <div className="container mx-auto px-6 pt-40 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 animate-in fade-in slide-in-from-top-8 duration-1000">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1">
                 <Pill className="h-3 w-3 text-secondary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Pharmacology Hub v2.1</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                 Therapeutic <span className="text-glow-gold text-secondary">Intelligence.</span>
              </h1>
              <p className="text-gray-500 max-w-xl text-lg leading-relaxed font-semibold">
                 Explore the clinical pharmacology grid, mechanism-of-action nodes, and high-performance dosage calculators.
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              {isAdmin && (
                <Button size="lg" className="bg-primary text-white font-bold rounded-2xl px-8 shadow-2xl shadow-primary/20 hover:scale-105 transition-all border border-white/10" asChild>
                   <Link href="/admin/content/drugs/add"><Plus className="mr-2 h-5 w-5" /> Sync Drug</Link>
                </Button>
              )}
           </div>
        </div>

        <Tabs defaultValue="drugs" className="space-y-12">
          <TabsList className="bg-white/5 p-1.5 rounded-2xl w-full max-w-3xl border border-white/5">
            <TabsTrigger value="drugs" className="rounded-xl font-bold uppercase tracking-widest text-[10px] py-4 data-[state=active]:bg-primary transition-all flex-1">
              <Pill className="h-4 w-4 mr-2" /> Drug Grid
            </TabsTrigger>
            <TabsTrigger value="therapeutic" className="rounded-xl font-bold uppercase tracking-widest text-[10px] py-4 data-[state=active]:bg-primary transition-all flex-1">
              <Activity className="h-4 w-4 mr-2" /> Therapeutic Classes
            </TabsTrigger>
            <TabsTrigger value="calculators" className="rounded-xl font-bold uppercase tracking-widest text-[10px] py-4 data-[state=active]:bg-primary transition-all flex-1">
              <Calculator className="h-4 w-4 mr-2" /> Neural Calculators
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drugs" className="space-y-12 animate-in fade-in duration-700">
            {/* Search Matrix */}
            <div className="glass p-2 rounded-3xl flex flex-col md:flex-row gap-2">
               <div className="flex-1 relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors h-5 w-5" />
                  <Input
                     placeholder="Query drugs by name, indication, or mechanism..."
                     className="bg-transparent border-none h-16 pl-14 text-foreground placeholder:text-gray-400 focus:ring-0 text-lg font-medium"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-56 glass h-16 rounded-2xl border-none font-bold text-gray-500">
                     <SelectValue placeholder="Neural Layer" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-foreground">
                     <SelectItem value="all">All Categories</SelectItem>
                     {categories.filter(c => c !== 'all').map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                  </SelectContent>
               </Select>
            </div>

            {/* Drug Classes Matrix */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {drugClasses.slice(0, 6).map((drugClass) => {
                 const ClassIcon = getClassIcon(drugClass.category)
                 return (
                   <div key={drugClass.id} className="glass-card p-8 group hover:-translate-y-2 transition-all">
                      <div className="flex items-center justify-between mb-8">
                         <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all">
                            <ClassIcon className="w-7 h-7 text-primary group-hover:text-white transition-all shadow-[0_0_15px_currentColor]" />
                         </div>
                         <Badge variant="outline" className="border-primary/20 text-primary">0{drugClass._count?.drugs || 0} Entities</Badge>
                      </div>
                      <div className="space-y-4 mb-8 text-left">
                         <h3 className="text-2xl font-bold group-hover:text-primary transition-all text-[#213874]">{drugClass.name}</h3>
                         <p className="text-gray-500 text-sm line-clamp-2 font-medium">{drugClass.description}</p>
                      </div>
                      <Button className="w-full h-12 bg-white/5 hover:bg-primary hover:text-white rounded-xl border border-white/10 transition-all" asChild>
                         <Link href={`/drug-class/${drugClass.id}`}>Explore Layer</Link>
                      </Button>
                   </div>
                 )
               })}
            </div>

            {/* All Drugs Node */}
            <div className="relative overflow-hidden glass rounded-3xl p-12 group">
               <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-32 -mt-32 transition-all group-hover:scale-125" />
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                  <div className="space-y-4">
                     <h2 className="text-4xl font-bold tracking-tighter text-[#213874]">Complete Drug Database Grid</h2>
                     <p className="text-gray-500 max-w-xl text-lg font-medium">Browse our comprehensive clinical collection of dosage protocols, mechanism synthesis, and interaction matrices.</p>
                  </div>
                  <Button size="xl" className="bg-primary text-white font-bold rounded-2xl px-12 hover:scale-105 transition-all shadow-2xl shadow-primary/20" asChild>
                     <Link href="/drugs">Access Database <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="therapeutic" className="animate-in fade-in duration-700">
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {therapeuticCategories.map((cat, i) => (
                  <div key={i} className="glass-card p-10 space-y-6 group hover:-translate-y-2 transition-all">
                     <div className={`w-16 h-16 glass rounded-2xl flex items-center justify-center ${cat.color} group-hover:bg-primary group-hover:text-white transition-all`}>
                        <cat.icon className="w-8 h-8" />
                     </div>
                     <h3 className="text-2xl font-bold">{cat.name}</h3>
                     <Button variant="link" className="text-primary p-0 font-bold uppercase tracking-widest text-xs group">
                        Explore <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-all" />
                     </Button>
                  </div>
                ))}
             </div>
          </TabsContent>

          <TabsContent value="calculators" className="animate-in fade-in duration-700">
             <div className="glass-card p-1">
                <MedicalCalculators />
             </div>
          </TabsContent>
        </Tabs>
      </div>

      <AIHelper />
    </div>
  )
}