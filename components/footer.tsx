"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ArrowUp, Mail, Phone, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { toast } = useToast()

  // Check if we're in browser environment
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    
    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'footer'
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setEmail("")
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  if (!isVisible) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        className="absolute -top-6 right-8 bg-[#f3ab1b] hover:bg-yellow-400 text-[#213874] rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo size="lg" className="mr-3" />
              <span className="text-2xl font-bold">Synapse Med</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering the next generation of healthcare professionals through innovative digital learning and
              AI-powered education.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#f3ab1b] transition-colors cursor-pointer">
                <span className="text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#f3ab1b] transition-colors cursor-pointer">
                <span className="text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#f3ab1b] transition-colors cursor-pointer">
                <span className="text-sm">in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/courses" className="hover:text-[#f3ab1b] transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-[#f3ab1b] transition-colors">
                  Library
                </Link>
              </li>
              <li>
                <Link href="/pharmacology" className="hover:text-[#f3ab1b] transition-colors">
                  Pharmacology
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#f3ab1b] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#f3ab1b] transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Resources</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/library" className="hover:text-[#f3ab1b] transition-colors">
                  Study Guides
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#f3ab1b] transition-colors">
                  Practice Tests
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#f3ab1b] transition-colors">
                  3D Models
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#f3ab1b] transition-colors">
                  Calculators
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-[#f3ab1b] transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Stay Connected</h4>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter for the latest updates and medical insights.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full bg-[#f3ab1b] hover:bg-yellow-400 text-[#213874] font-semibold"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>

              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@synapsemed.co.tz</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <a 
                    href="https://mail.synapsemed.co.tz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[#f3ab1b] transition-colors"
                  >
                    Staff Mail Login
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+255 768 924 035</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Medical Education Hub</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            <p>&copy; 2025 Synapse Med. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-[#f3ab1b] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#f3ab1b] transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-[#f3ab1b] transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}