"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
// Removed 3D characters import
import { WordOfTheDay } from "@/components/word-of-the-day"
import { Flashcard } from "@/components/flashcard"
import { BookOpen, Users, Calculator, Award, Brain, Microscope, Heart, Pill } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

// Simple animated background component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#f3ab1b] rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-white rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-[#f3ab1b] rounded-full opacity-25 animate-ping"></div>
    </div>
  )
}

export function HomePage() {
  const [wordFlipped, setWordFlipped] = useState(false)
  const [partners, setPartners] = useState([
    {
      id: "1",
      name: "Johns Hopkins Medicine",
      logo: "/johns-hopkins-medicine-logo.png",
      description: "Leading medical institution",
    },
    {
      id: "2",
      name: "Mayo Clinic",
      logo: "/mayo-clinic-logo.png",
      description: "World-renowned healthcare",
    },
    {
      id: "3",
      name: "Harvard Medical School",
      logo: "/harvard-medical-school-logo.png",
      description: "Premier medical education",
    },
    {
      id: "4",
      name: "Cleveland Clinic",
      logo: "/cleveland-clinic-logo.png",
      description: "Innovation in healthcare",
    },
    {
      id: "5",
      name: "Stanford Medicine",
      logo: "/stanford-medicine-logo.png",
      description: "Cutting-edge research",
    },
    {
      id: "6",
      name: "WHO",
      logo: "/who-logo.png",
      description: "Global health leadership",
    },
  ])

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPartners(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
      // Keep using mock data if fetch fails
    }
  }

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Courses",
      description: "Structured curriculum with 3D models and animations",
    },
    {
      icon: Brain,
      title: "AI Assistant",
      description: "Get instant help with AI-powered assistance",
    },
    {
      icon: Microscope,
      title: "3D Anatomy",
      description: "Explore interactive 3D anatomical models",
    },
    {
      icon: Calculator,
      title: "Medical Calculators",
      description: "Essential tools for dosage and clinical calculations",
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Earn points, levels, and badges as you learn",
    },
    {
      icon: Users,
      title: "Multi-Disciplinary",
      description: "Content for medical, nursing, and pharmacy students",
    },
  ]

  const studentTypes = [
    {
      title: "Medical Students",
      description: "Comprehensive medical curriculum with clinical focus",
      icon: Heart,
      color: "bg-red-100 text-red-700",
      href: "/courses",
    },
    {
      title: "Nursing Students",
      description: "Patient care and clinical nursing education",
      icon: Users,
      color: "bg-blue-100 text-blue-700",
      href: "/courses",
    },
    {
      title: "Pharmacy Students",
      description: "Drug therapy and pharmaceutical sciences",
      icon: Pill,
      color: "bg-green-100 text-green-700",
      href: "/courses",
    },
  ]

  return (
    <div className="min-h-screen bg-white relative">
      <Navigation />
      {/* Removed 3D characters component */}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#213874] to-[#1a6ac3] text-white">
        <AnimatedBackground />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-left duration-1000">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Connect. Learn. <span className="text-[#f3ab1b]">Master Medicine.</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-lg">
                  Your comprehensive digital library for medical education with AI assistance, interactive 3D models,
                  and gamified learning.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#f3ab1b] text-[#213874] hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/courses">Start Learning</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#213874] bg-transparent transform hover:scale-105 transition-all duration-300"
                  asChild
                >
                  <Link href="/library">Explore Library</Link>
                </Button>
              </div>
            </div>

            <div className="h-96 lg:h-[500px] flex items-center justify-center animate-in slide-in-from-right duration-1000">
              <div className="relative w-64 h-64 bg-gradient-to-r from-[#f3ab1b] to-yellow-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-48 h-48 bg-white rounded-full opacity-20 animate-ping"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-24 h-24 text-white animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Word of the Day Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <WordOfTheDay />
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-4xl font-bold text-[#213874] mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge tools and resources designed to enhance your medical education experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-in fade-in-up duration-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-[#213874] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#f3ab1b] transition-colors">
                    <feature.icon className="w-6 h-6 text-white group-hover:text-[#213874]" />
                  </div>
                  <CardTitle className="text-[#213874]">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-4xl font-bold text-[#213874] mb-4">Who We Serve</h2>
            <p className="text-xl text-gray-600">Specialized content for different healthcare disciplines</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {studentTypes.map((type, index) => (
              <Link key={index} href={type.href}>
                <Card
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full animate-in fade-in-up duration-1000"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${type.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <type.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-[#213874] group-hover:text-[#1a6ac3]">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription>{type.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-4xl font-bold text-[#213874] mb-4">Our Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Collaborating with leading healthcare institutions and organizations worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <Card
                key={partner.id || index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 animate-in fade-in-up duration-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 h-20 flex items-center justify-center">
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      className="max-h-16 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-[#213874] mb-2">{partner.name}</h3>
                  <p className="text-sm text-gray-600">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Quick Quiz */}
      <section className="py-20 bg-[#213874] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-in fade-in duration-1000">
            <h2 className="text-3xl font-bold mb-8">Today's Quick Quiz</h2>

            <div className="perspective-1000">
              <Card
                className={`cursor-pointer transition-transform duration-500 hover:scale-105 ${wordFlipped ? "rotate-y-180" : ""}`}
                onClick={() => setWordFlipped(!wordFlipped)}
              >
                <CardContent className="p-8 min-h-[200px] flex items-center justify-center">
                  {!wordFlipped ? (
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-[#213874] mb-4">What is tachycardia?</h3>
                      <p className="text-gray-600">Click to reveal answer</p>
                    </div>
                  ) : (
                    <div className="text-center rotate-y-180">
                      <h3 className="text-2xl font-bold text-[#213874] mb-4">Answer</h3>
                      <p className="text-gray-700 leading-relaxed">
                        A rapid heart rate, typically defined as a resting heart rate greater than 100 beats per minute
                        in adults.
                      </p>
                      <Badge className="mt-4 bg-[#f3ab1b] text-[#213874]">Cardiology</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Flashcard */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Flashcard />
          </div>
        </div>
      </section>

      <AIHelper />
    </div>
  )
}