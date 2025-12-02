"use client"

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
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Advanced AI assistant powered by DeepSeek to help with complex medical concepts and personalized study guidance.",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Library",
      description:
        "Extensive collection of medical textbooks, research papers, and educational resources for all healthcare fields.",
    },
    {
      icon: Users,
      title: "Collaborative Platform",
      description: "Connect with peers, share knowledge, and learn together in a supportive community environment.",
    },
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Adaptive learning paths tailored to your field of study and individual learning preferences.",
    },
    {
      icon: Award,
      title: "Gamified Experience",
      description: "Earn points, unlock badges, and track your progress with our engaging gamification system.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensuring your data and learning progress are always protected.",
    },
  ]

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      field: "Cardiology",
      image: "/placeholder.svg?height=100&width=100&text=SJ",
      bio: "15+ years in medical education and cardiology practice.",
    },
    {
      name: "Prof. Michael Chen",
      role: "Head of Pharmacy Education",
      field: "Clinical Pharmacy",
      image: "/placeholder.svg?height=100&width=100&text=MC",
      bio: "Leading expert in pharmacology and drug interaction research.",
    },
    {
      name: "Emily Davis, RN",
      role: "Nursing Education Director",
      field: "Critical Care Nursing",
      image: "/placeholder.svg?height=100&width=100&text=ED",
      bio: "20+ years in nursing practice and education leadership.",
    },
    {
      name: "Dr. James Wilson",
      role: "Technology Director",
      field: "Medical Informatics",
      image: "/placeholder.svg?height=100&width=100&text=JW",
      bio: "Expert in healthcare technology and digital learning platforms.",
    },
  ]

  const stats = [
    { number: "50,000+", label: "Active Students" },
    { number: "1,200+", label: "Medical Resources" },
    { number: "95%", label: "Student Satisfaction" },
    { number: "24/7", label: "AI Support" },
  ]

  const values = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Everything we do is focused on improving patient outcomes through better healthcare education.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously innovate to provide the most effective and engaging learning experiences.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of collaborative learning and knowledge sharing.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from content quality to user experience.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#213874] to-[#1a6ac3] text-white py-20 animate-in fade-in duration-1000">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 animate-in slide-in-from-bottom duration-1000 delay-200">
              Revolutionizing Medical Education
            </h1>
            <p className="text-xl mb-8 text-blue-100 animate-in slide-in-from-bottom duration-1000 delay-400">
              Synapse Med is the premier digital learning platform designed specifically for medical, nursing, and
              pharmacy students. We combine cutting-edge AI technology with comprehensive educational resources to
              create an unparalleled learning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom duration-1000 delay-600">
              <Button asChild size="lg" className="bg-[#f3ab1b] text-[#213874] hover:bg-[#f3ab1b]/90">
                <Link href="/auth">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[#213874] bg-transparent"
              >
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white animate-in slide-in-from-bottom duration-1000 delay-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#213874] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-[#213874] mb-4">Our Founder</h2>
            <p className="text-xl text-gray-600">
              Meet the visionary behind Synapse Med's revolutionary approach to medical education.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 flex items-center justify-center p-8 bg-gray-50">
                  {/* Founder image without frame/border */}
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=300&width=300&text=MF"
                      alt="Mohamed Faisal MD"
                      className="w-64 h-64 object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-3xl text-[#213874] mb-2">Mohamed Faisal, MD</CardTitle>
                    <CardDescription className="text-xl text-[#f3ab1b]">
                      Founder & CEO, Synapse Med
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 mb-4">
                        Dr. Mohamed Faisal is a renowned medical educator and technology innovator with over 20 years of experience in healthcare and digital learning. His passion for transforming medical education through technology led him to establish Synapse Med in 2018.
                      </p>
                      <p className="text-gray-700 mb-4">
                        Before founding Synapse Med, Dr. Faisal served as the Director of Digital Learning at a prestigious medical school, where he pioneered several AI-powered educational tools that significantly improved student outcomes. His research in medical informatics and educational technology has been published in numerous peer-reviewed journals.
                      </p>
                      <p className="text-gray-700 mb-4">
                        Dr. Faisal holds an MD from Harvard Medical School and completed his residency in Internal Medicine at Johns Hopkins Hospital. He is board-certified in Internal Medicine and has additional certifications in Medical Informatics and Educational Technology.
                      </p>
                      <p className="text-gray-700 mb-6">
                        Under his leadership, Synapse Med has grown to become one of the leading medical education platforms, serving over 50,000 students across medical, nursing, and pharmacy programs worldwide. His vision continues to drive innovation in healthcare education, making quality medical learning accessible to students globally.
                      </p>
                      <Button asChild className="bg-[#213874] hover:bg-[#1a6ac3]">
                        <Link href="/about/mohamed-faisal">
                          Read Full Biography
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 animate-in slide-in-from-bottom duration-1000 delay-1000">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#213874] mb-8">Our Mission</h2>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
              To empower the next generation of healthcare professionals with innovative digital learning tools,
              comprehensive educational resources, and AI-powered assistance that enhances understanding, retention, and
              practical application of medical knowledge.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="text-left hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-[#f3ab1b]" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    To become the global leader in medical education technology, transforming how healthcare
                    professionals learn, collaborate, and advance their careers through innovative digital solutions.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-[#f3ab1b]" />
                    Our Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    To improve patient outcomes worldwide by providing healthcare students and professionals with the
                    most effective, accessible, and engaging educational experiences possible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#213874] mb-4">Why Choose Synapse Med?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines the latest in educational technology with proven learning methodologies to deliver
              an exceptional learning experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-[#213874]/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#213874]" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#213874] mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide everything we do and shape our commitment to excellence in medical education.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-[#f3ab1b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[#213874]" />
                </div>
                <h3 className="text-xl font-semibold text-[#213874] mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#213874] mb-4">Meet Our Expert Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team consists of leading medical professionals, educators, and technology experts dedicated to
              advancing healthcare education.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="bg-[#213874] text-white text-xl">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-[#213874] mb-1">{member.name}</h3>
                  <p className="text-[#f3ab1b] font-medium mb-1">{member.role}</p>
                  <Badge variant="outline" className="mb-3">
                    {member.field}
                  </Badge>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gradient-to-br from-[#213874] to-[#1a6ac3] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">Cutting-Edge Technology</h2>
            <p className="text-xl mb-12 text-blue-100">
              We leverage the latest advancements in artificial intelligence, machine learning, and educational
              technology to create the most effective learning platform.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center animate-in slide-in-from-bottom duration-500 delay-200">
                <div className="w-16 h-16 bg-[#f3ab1b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-[#213874]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">DeepSeek AI</h3>
                <p className="text-blue-100">Advanced AI assistant for personalized learning support</p>
              </div>
              <div className="text-center animate-in slide-in-from-bottom duration-500 delay-400">
                <div className="w-16 h-16 bg-[#f3ab1b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#213874]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-blue-100">Track progress and optimize learning paths instantly</p>
              </div>
              <div className="text-center animate-in slide-in-from-bottom duration-500 delay-600">
                <div className="w-16 h-16 bg-[#f3ab1b] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-[#213874]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Access</h3>
                <p className="text-blue-100">Learn anywhere, anytime with our cloud-based platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#213874] mb-4">Get in Touch</h2>
              <p className="text-xl text-gray-600">Have questions about our platform? We'd love to hear from you.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#213874] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#213874] mb-2">Email Us</h3>
                    <p className="text-gray-600 mb-2">Get in touch with our support team</p>
                    <p className="text-[#213874] font-medium">contact@synapsemedical.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#213874] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#213874] mb-2">Call Us</h3>
                    <p className="text-gray-600 mb-2">Speak with our team directly</p>
                    <p className="text-[#213874] font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#213874] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#213874] mb-2">Visit Us</h3>
                    <p className="text-gray-600 mb-2">Our headquarters location</p>
                    <p className="text-[#213874] font-medium">
                      123 Medical Plaza
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
              <Card className="p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl text-[#213874]">Ready to Get Started?</CardTitle>
                  <CardDescription className="text-lg">
                    Join thousands of healthcare students already learning with Synapse Med.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Free 14-day trial</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Full access to all features</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>24/7 AI support</span>
                  </div>
                  <Button asChild className="w-full bg-[#213874] hover:bg-[#1a6ac3] mt-6" size="lg">
                    <Link href="/auth">
                      Start Your Free Trial
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}