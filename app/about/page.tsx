"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Users,
  Target,
  Award,
  Brain,
  Heart,
  Shield,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Rocket,
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    { icon: Brain, title: "AI-Powered Learning", description: "Advanced AI assistant powered by DeepSeek to help with complex medical concepts and personalized study guidance." },
    { icon: BookOpen, title: "Comprehensive Library", description: "Extensive collection of medical textbooks, research papers, and educational resources for all healthcare fields." },
    { icon: Users, title: "Collaborative Platform", description: "Connect with peers, share knowledge, and learn together in a supportive community environment." },
    { icon: Target, title: "Personalized Learning", description: "Adaptive learning paths tailored to your field of study and individual learning preferences." },
    { icon: Award, title: "Gamified Experience", description: "Earn points, unlock badges, and track your progress with our engaging gamification system." },
    { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security ensuring your data and learning progress are always protected." },
  ]

  const [team, setTeam] = useState<any[]>([])

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch('/api/admin/team')
        const data = await response.json()
        if (data.success && data.data) {
          setTeam(data.data.filter((m: any) => m.status === 'ACTIVE'))
        }
      } catch (error) {
        console.error('Error fetching team:', error)
      }
    }
    fetchTeam()
  }, [])

  const stats = [
    { number: "50,000+", label: "Active Students" },
    { number: "1,200+", label: "Medical Resources" },
    { number: "95%", label: "Student Satisfaction" },
    { number: "24/7", label: "AI Support" },
  ]

  return (
    <div className="min-h-screen bg-mesh text-[#213874] selection:bg-primary/20">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
            <Badge className="bg-[#213874]/5 text-[#213874] border-[#213874]/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
               Next-Generation Education
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-[#213874]">
              Revolutionizing <span className="text-[#1a6ac3]">Medical Learning.</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed font-semibold">
              SynapseMed is the premier digital learning platform designed specifically for medical, nursing, and pharmacy students. We combine cutting-edge AI technology with comprehensive educational resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="xl" className="bg-[#213874] text-white font-bold rounded-2xl px-10 hover:scale-105 hover:bg-[#1a6ac3] transition-all shadow-xl shadow-blue-900/10">
                <Link href="/auth">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-gray-200 text-gray-600 font-bold rounded-2xl px-10 glass hover:bg-white hover:border-[#1a6ac3]/20 shadow-sm">
                <Link href="/courses">Explore Library</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Matrix */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-20 duration-1000">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-8 text-center group">
                <div className="text-4xl font-bold text-[#213874] mb-2 group-hover:scale-110 transition-all">{stat.number}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Features Grid */}
      <section className="py-32 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-bold tracking-tighter text-[#213874]">Why Choose SynapseMed?</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">Our platform integrates the latest pedagogical science with advanced neural architectures.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="glass-card p-10 space-y-8 group hover:-translate-y-2 transition-all text-left">
                <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-[#213874] transition-all">
                  <feature.icon className="w-8 h-8 text-[#213874] group-hover:text-white transition-all" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#213874]">{feature.title}</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Bento */}
      <section className="py-32">
        <div className="container mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-8 text-left">
              <div className="glass-card p-12 space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#213874]/5 blur-[100px] rounded-full -mr-20 -mt-20" />
                 <div className="relative z-10 space-y-6">
                    <Rocket className="w-12 h-12 text-[#f3ab1b]" />
                    <h3 className="text-3xl font-bold tracking-tighter text-[#213874]">Our Vision</h3>
                    <p className="text-gray-500 font-medium leading-relaxed text-lg">To become the global leader in medical education technology, transforming how healthcare professionals learn, collaborate, and advance their careers through innovative digital solutions.</p>
                 </div>
              </div>
              <div className="glass-card p-12 space-y-8 relative overflow-hidden group bg-gray-50/50">
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1a6ac3]/5 blur-[100px] rounded-full -ml-20 -mb-20" />
                 <div className="relative z-10 space-y-6">
                    <Target className="w-12 h-12 text-[#213874]" />
                    <h3 className="text-3xl font-bold tracking-tighter text-[#213874]">Our Goal</h3>
                    <p className="text-gray-500 font-medium leading-relaxed text-lg">To improve patient outcomes worldwide by providing healthcare students and professionals with the most effective, accessible, and engaging educational experiences possible.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Team Stream */}
      <section className="py-32 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold tracking-tighter text-[#213874]">Expert Intelligence Team</h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">Leading medical professionals and engineers dedicated to advancing clinical knowledge.</p>
        </div>
        <div className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="glass-card p-8 text-center group hover:scale-105 transition-all bg-white">
               <Avatar className="w-24 h-24 mx-auto mb-6 border-2 border-gray-50 group-hover:border-[#213874] transition-all p-1">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} className="rounded-full" />
                  <AvatarFallback className="bg-[#213874] text-white font-black text-xl">
                    {member.name?.split(" ").map((n:any) => n[0]).join("")}
                  </AvatarFallback>
               </Avatar>
               <h3 className="text-xl font-bold text-[#213874] group-hover:text-[#1a6ac3] transition-colors">{member.name}</h3>
               <p className="text-[#f3ab1b] text-[10px] font-bold uppercase tracking-widest mt-2">{member.position}</p>
               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-tighter mt-4 line-clamp-2">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Synthesis */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#213874]/5 blur-[200px] rounded-full" />
        <div className="container mx-auto px-6 text-center relative z-10">
           <h2 className="text-4xl font-bold tracking-tighter mb-20 text-[#213874]">Cutting-Edge Technology Grid</h2>
           <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                { icon: Brain, title: "DeepSeek AI", desc: "Advanced neural assistant for clinical support." },
                { icon: Zap, title: "Real-time Sync", desc: "Instant analytics and adaptive pathways." },
                { icon: Globe, title: "Global Grid", desc: "Access archives from anywhere on the planet." },
              ].map((tech, i) => (
                <div key={i} className="space-y-6 group">
                   <div className="w-20 h-20 bg-white border border-gray-100 shadow-sm rounded-3xl flex items-center justify-center mx-auto group-hover:bg-[#213874] transition-all">
                      <tech.icon className="w-10 h-10 text-[#213874] group-hover:text-white transition-all" />
                   </div>
                   <h3 className="text-xl font-bold text-[#213874]">{tech.title}</h3>
                   <p className="text-gray-500 font-medium text-sm leading-relaxed">{tech.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Contact Node */}
      <section className="py-32 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-20 items-center text-left">
              <div className="space-y-12">
                 <div className="space-y-4">
                    <h2 className="text-4xl font-bold tracking-tighter text-[#213874]">Initialize Contact.</h2>
                    <p className="text-gray-500 font-semibold text-lg">Have inquiries regarding the grid? Our support nodes are ready to synchronize.</p>
                 </div>
                 <div className="space-y-8">
                    {[
                      { icon: Mail, title: "Email Interface", val: "contact@synapsemedical.com" },
                      { icon: Phone, title: "Voice Line", val: "+255 768 924 035" },
                      { icon: MapPin, title: "Geo Location", val: "SJUCHAS, Dar es Salaam, Tanzania" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 group">
                         <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-[#213874] group-hover:bg-[#213874] group-hover:text-white transition-all shadow-sm">
                            <item.icon className="h-6 w-6" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.title}</p>
                            <p className="text-xl font-bold text-[#213874] group-hover:text-[#1a6ac3] transition-colors">{item.val}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="glass-card p-12 space-y-8 bg-gray-50 border-gray-100">
                 <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-[#213874]">Initiate Trial</h3>
                    <p className="text-gray-500 font-medium">Join thousands of clinical pioneers already learning with the SynapseMed grid.</p>
                 </div>
                 <div className="space-y-4">
                    {[
                      "Verified 14-day discovery session",
                      "No credit synchronization required",
                      "Full archive layer access",
                      "24/7 Neural support nodes",
                    ].map((tick, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                         <CheckCircle className="h-5 w-5 text-green-500" />
                         {tick}
                      </div>
                    ))}
                 </div>
                 <Button asChild className="w-full h-16 bg-[#213874] text-white font-bold rounded-2xl hover:bg-[#1a6ac3] transition-all shadow-lg shadow-blue-900/10" size="lg">
                    <Link href="/auth">Start Trial Session <ArrowRight className="ml-2 h-5 w-5" /></Link>
                 </Button>
              </div>
           </div>
        </div>
      </section>
    </div>
  )
}