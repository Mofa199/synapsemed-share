"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { WordOfTheDay } from "@/components/word-of-the-day"
import { 
  BookOpen, Users, Calculator, Award, Brain, Microscope, Heart, Pill, 
  Target, ArrowRight, Zap, Globe, Shield, Stethoscope, Activity, Eye, Syringe,
  Dna, Search, Layers, Briefcase
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

const curriculumGroups = [
  {
    title: "Basic Sciences",
    icon: Dna,
    color: "text-blue-500",
    bg: "bg-blue-50",
    subjects: [
      "Foundations of Medicine", "Human Anatomy", "Physiology", 
      "Pathology", "Pharmacology", "Microbiology", "Immunology"
    ]
  },
  {
    title: "Clinical Medicine",
    icon: Stethoscope,
    color: "text-red-500",
    bg: "bg-red-50",
    subjects: [
      "Internal Medicine", "Pediatrics", "Psychiatry", 
      "Emergency Medicine", "Intensive Care", "Family Medicine"
    ]
  },
  {
    title: "Surgery & Procedures",
    icon: Syringe,
    color: "text-orange-500",
    bg: "bg-orange-50",
    subjects: [
      "General Surgery", "Surgical Specialties", "Anaesthesia", 
      "Obstetrics", "Gynecology", "Point-of-Care Ultrasound", "Medical Procedures"
    ]
  },
  {
    title: "Diagnostics & Research",
    icon: Search,
    color: "text-purple-500",
    bg: "bg-purple-50",
    subjects: [
      "Radiology", "Laboratory Medicine", "Evidence-Based Medicine", "Research"
    ]
  },
  {
    title: "Professional Skills",
    icon: Briefcase,
    color: "text-teal-500",
    bg: "bg-teal-50",
    subjects: [
      "Clinical Skills", "Community Medicine / Public Health", 
      "Medical Ethics", "Clinical Cases", "OSCE Academy"
    ]
  },
  {
    title: "Advanced & Digital",
    icon: Layers,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    subjects: [
      "Exam Preparation", "AI & Digital Medicine", "Specialty Libraries (Advanced)"
    ]
  }
]

export function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-mesh text-[#213874] selection:bg-primary/20">
      <Navigation />

      {/* Discovery Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center space-y-12">
            <div className="space-y-6 max-w-4xl animate-in fade-in zoom-in duration-1000">
              <div className="inline-flex items-center gap-2 bg-[#213874]/5 border border-[#213874]/20 rounded-full px-4 py-1">
                <div className="w-2 h-2 rounded-full bg-[#213874] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#213874]">SynapseMed Master Curriculum</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none text-[#213874]">
                Connect. Learn. <br />
                <span className="text-[#1a6ac3]">Master Medicine.</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-semibold">
                Explore our comprehensive curriculum of 32+ medical disciplines designed for the next generation of healthcare professionals.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Button size="lg" asChild className="bg-[#213874] text-white font-bold rounded-2xl px-10 hover:scale-105 hover:bg-[#1a6ac3] transition-all shadow-xl shadow-blue-900/10">
                <Link href="/library">Explore Curriculum</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-gray-200 text-gray-600 font-bold rounded-2xl px-10 glass hover:bg-white hover:border-[#1a6ac3]/20 shadow-sm">
                <Link href="/student/dashboard">Student Dashboard</Link>
              </Button>
            </div>
            
            {/* Visual Bento Preview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl mt-20 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500 text-left">
               <div className="md:col-span-2 glass-card p-8 flex flex-col justify-between min-h-[300px] group">
                  <div className="flex items-center justify-between">
                     <Microscope className="w-12 h-12 text-[#213874] group-hover:scale-110 transition-all" />
                     <Badge variant="outline" className="border-[#213874]/30 text-[#213874] bg-[#213874]/5 font-bold">50,000+ Topics</Badge>
                  </div>
                  <div>
                     <h3 className="text-3xl font-bold mb-2 text-[#213874]">Evidence-Based Knowledge</h3>
                     <p className="text-gray-500 font-semibold leading-relaxed">Structured learning modules detailing Pathophysiology, Diagnostics, Management, and Guidelines.</p>
                  </div>
               </div>
               
               <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 group">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                    <Heart className="w-10 h-10 text-red-500 group-hover:animate-pulse" />
                  </div>
                  <div className="text-4xl font-bold text-[#213874]">32</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Core Subjects</div>
               </div>

               <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 group bg-orange-50/50 border-orange-100">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <Zap className="w-10 h-10 text-[#f3ab1b] group-hover:scale-110 transition-all" />
                  </div>
                  <div className="text-4xl font-bold text-[#213874]">AI</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600/60">Clinical Simulation</div>
               </div>

               <div className="glass-card p-8 flex flex-col justify-between min-h-[300px] md:col-span-1 group">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-[#213874]">100%</div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">OSCE Readiness</p>
                  </div>
               </div>

               <div className="md:col-span-3 glass-card p-8 flex items-center gap-8 group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#213874]/5 blur-[80px] rounded-full -mr-20 -mt-20" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full">
                     <div className="w-full md:w-1/3">
                        <Card className="border border-gray-100 shadow-xl bg-white p-6 rotate-2 group-hover:rotate-0 transition-all duration-500">
                          <WordOfTheDay />
                        </Card>
                     </div>
                     <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-[#213874]">Daily Intelligence Stream</h3>
                        <p className="text-gray-500 font-semibold leading-relaxed">Expand your clinical vocabulary with our AI-curated terminology updates and spaced repetition nodes designed for mastery.</p>
                        <Button variant="link" className="text-[#1a6ac3] p-0 font-bold uppercase tracking-widest text-xs group">
                           Access Stream <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-all" />
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Curriculum Grid */}
      <section className="py-20 relative bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-4xl font-bold tracking-tighter text-[#213874]">The Master Curriculum</h2>
             <p className="text-gray-500 font-bold max-w-2xl mx-auto">Explore all 32 major medical disciplines structured systematically from foundational sciences to advanced clinical practice.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {curriculumGroups.map((group, idx) => (
              <Card key={idx} className="border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className={`h-2 w-full ${group.bg}`} />
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${group.bg}`}>
                      <group.icon className={`w-6 h-6 ${group.color}`} />
                    </div>
                    <CardTitle className="text-xl text-[#213874]">{group.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {group.subjects.map((subject, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-3 group/item">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/item:bg-[#1a6ac3] transition-colors" />
                        <span className="text-sm font-medium text-gray-600 group-hover/item:text-[#213874] transition-colors">{subject}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Disease Structure Template Section */}
      <section className="py-24 relative bg-[#213874] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">Standardized Learning</Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Unified Disease Templates</h2>
              <p className="text-blue-100 text-lg leading-relaxed max-w-xl">
                Every disease on SynapseMed follows a strict, comprehensive template to ensure you never miss a detail. From epidemiology and pathophysiology to OSCE checklists and Viva questions.
              </p>
              <Button size="lg" className="bg-white text-[#213874] hover:bg-gray-100 rounded-full font-bold px-8 mt-4">
                View an Example Topic
              </Button>
            </div>
            <div className="flex-1 w-full max-w-md">
              <Card className="bg-[#1a2d5e] border-[#314a8f] text-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <CardHeader className="border-b border-[#314a8f]/50 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#4da3ff]" />
                    Atrial Fibrillation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">1. Definition & Epidemiology</span>
                    <Badge variant="outline" className="border-blue-400/30 text-blue-300">Read</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">2. Pathophysiology & Etiology</span>
                    <Badge variant="outline" className="border-blue-400/30 text-blue-300">Read</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">3. Diagnostic Criteria</span>
                    <Badge variant="outline" className="border-blue-400/30 text-blue-300">Read</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">4. Medical & Surgical Management</span>
                    <Badge variant="outline" className="border-blue-400/30 text-blue-300">Read</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 mt-2 border-t border-[#314a8f]/50">
                    <span className="text-blue-200 font-bold">5. OSCE Checklist & Viva</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <AIHelper />
    </div>
  )
}