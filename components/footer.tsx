"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Mail, Github, Twitter, Linkedin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const { toast } = useToast()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubscribing(true)
    
    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })
      if (!response.ok) {
        toast({ title: "Subscription Error", description: "Failed to subscribe at this time.", variant: "destructive" })
        return
      }
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        toast({ title: "Subscription Error", description: "Failed to subscribe at this time.", variant: "destructive" })
        return
      }
      const result = await response.json()
      if (result.success) {
        toast({ title: "Success", description: result.message })
        setEmail("")
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to subscribe.", variant: "destructive" })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="mt-20 border-t border-gray-200 relative overflow-hidden bg-white/80 backdrop-blur-md">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-all">
                <Logo size="md" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-[#213874]">SynapseMed</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
              A modern, interactive online library for medical, nursing, and pharmacy students. Connect. Learn. Master Medicine.
            </p>
            <div className="flex items-center space-x-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white hover:border-primary/20 transition-all shadow-sm">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-[#213874] font-bold uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Courses", href: "/courses" },
                { name: "Library", href: "/library" },
                { name: "Pharmacology", href: "/pharmacology" },
                { name: "About Us", href: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-500 hover:text-primary transition-all flex items-center group text-sm font-semibold">
                    <span className="w-0 group-hover:w-4 h-[2px] bg-primary transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h4 className="text-[#213874] font-bold uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-3">
              {[
                { name: "Drug Database", href: "/drugs" },
                { name: "Question Banks", href: "/questions" },
                { name: "Study Guides", href: "/guides" },
                { name: "Flashcards", href: "/flashcards" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-500 hover:text-primary transition-all flex items-center group text-sm font-semibold">
                    <span className="w-0 group-hover:w-4 h-[2px] bg-primary transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-[#213874] font-bold uppercase tracking-widest text-xs">Stay Informed</h4>
              <p className="text-gray-500 text-sm font-medium">Join the pulse of medical education.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="relative group">
              <div className="relative flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="doctor@medical.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border-gray-200 rounded-2xl h-14 text-foreground focus:ring-primary/20 placeholder:text-gray-400"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl bg-[#213874] text-white font-bold hover:bg-primary hover:scale-[1.02] transition-all shadow-lg shadow-blue-900/10"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? "..." : "Subscribe"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <Separator className="my-16 bg-gray-100" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} SynapseMed. Designed for Excellence.
          </div>
          <div className="flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms</Link>
            <Link href="/cookies" className="text-gray-400 hover:text-primary transition-colors">Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}