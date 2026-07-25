"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { WordOfTheDay } from "@/components/word-of-the-day"
import { BookOpen, Users, Calculator, Award, Brain, Microscope, Heart, Pill, Target, ArrowRight, Zap, Globe, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    { icon: Brain, title: "Neural Assistant", description: "AI-integrated tutor for complex clinical synthesis.", color: "text-[#213874]" },
    { icon: Globe, title: "Universal Library", description: "Global access to peer-reviewed medical archives.", color: "text-[#f3ab1b]" },
    { icon: Shield, title: "Verified Assets", description: "Evidence-based resources for all clinical fields.", color: "text-green-600" },
  ]

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
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#213874]">Intelligence Hub Active</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none text-[#213874]">
                Connect. Learn. <br />
                <span className="text-[#1a6ac3]">Master Medicine.</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-semibold">
                SynapseMed is a high-performance discovery hub designed for the next generation of medical, nursing, and pharmacy students.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Button size="xl" className="bg-[#213874] text-white font-bold rounded-2xl px-10 hover:scale-105 hover:bg-[#1a6ac3] transition-all shadow-xl shadow-blue-900/10">
                Get Started
              </Button>
              <Button size="xl" variant="outline" className="border-gray-200 text-gray-600 font-bold rounded-2xl px-10 glass hover:bg-white hover:border-[#1a6ac3]/20 shadow-sm">
                Explore Archives
              </Button>
            </div>
            
            {/* Visual Bento Preview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl mt-20 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500 text-left">
               <div className="md:col-span-2 glass-card p-8 flex flex-col justify-between min-h-[300px] group">
                  <div className="flex items-center justify-between">
                     <Microscope className="w-12 h-12 text-[#213874] group-hover:scale-110 transition-all" />
                     <Badge variant="outline" className="border-[#213874]/30 text-[#213874] bg-[#213874]/5 font-bold">Live Research</Badge>
                  </div>
                  <div>
                     <h3 className="text-3xl font-bold mb-2 text-[#213874]">Neural Nodes</h3>
                     <p className="text-gray-500 font-semibold leading-relaxed">Synchronized clinical databases updating in real-time for evidence-based practice.</p>
                  </div>
               </div>
               
               <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 group">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                    <Heart className="w-10 h-10 text-red-500 group-hover:animate-pulse" />
                  </div>
                  <div className="text-4xl font-bold text-[#213874]">95%</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Success Rate</div>
               </div>

               <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 group bg-orange-50/50 border-orange-100">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <Zap className="w-10 h-10 text-[#f3ab1b] group-hover:scale-110 transition-all" />
                  </div>
                  <div className="text-4xl font-bold text-[#213874]">24/7</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600/60">AI Availability</div>
               </div>

               <div className="glass-card p-8 flex flex-col justify-between min-h-[300px] md:col-span-1 group">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-[#213874]">50K+</div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Active Pioneers</p>
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

      {/* Discovery Matrix */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl font-bold tracking-tighter text-[#213874]">Engineered for Rapid Mastery.</h2>
             <p className="text-gray-500 font-bold max-w-2xl mx-auto">Our discovery nodes are structured using high-performance pedagogical architectures to ensure information retention.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="glass-card p-10 space-y-8 group hover:-translate-y-2 transition-all text-left">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-[#213874] group-hover:border-[#213874] transition-all">
                  <feature.icon className={`w-8 h-8 ${feature.color} group-hover:text-white transition-all`} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#213874]">{feature.title}</h3>
                  <p className="text-gray-500 font-semibold leading-relaxed text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AIHelper />
    </div>
  )
}