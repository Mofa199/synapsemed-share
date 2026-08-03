"use client"

import React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Lock, Eye, Database, FileText, CheckCircle } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#213874] via-[#1a4a90] to-[#1a6ac3] text-white pt-28 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Data Protection & Compliance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-blue-100 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            SynapseMed is committed to protecting the privacy, security, and confidentiality of our medical students, educators, and clinicians.
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl flex-1">
        <Card className="border-gray-200 shadow-md bg-white p-8 space-y-8">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Effective Date: August 2026</span>
            <h2 className="text-2xl font-bold text-[#213874] mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              SynapseMed collects essential data necessary to deliver an interactive clinical learning experience:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li><strong>Account Credentials:</strong> Name, email address, medical school / institution, role, and level of study.</li>
              <li><strong>Learning Analytics:</strong> Flashcard ease factors, quiz accuracy rates, OSCE station performance, and topic completions.</li>
              <li><strong>Technical Identifiers:</strong> IP addresses, browser types, and device telemetry for security & rate limiting.</li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#213874] mb-3">2. How We Use Your Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Your data is exclusively utilized to personalize active recall algorithms and maintain platform integrity:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li>Powering the SuperMemo-2 (SM-2) spaced repetition engine for flashcards.</li>
              <li>Generating personalized AI clinical recommendations via NVIDIA NIM API.</li>
              <li>Maintaining leaderboard rankings and gamification progress.</li>
              <li>Protecting the platform against rate abuse and unauthorized access.</li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#213874] mb-3">3. Data Security & Encryption</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We employ AES-256 encryption at rest and TLS 1.3 transport security. All session tokens are stored in HTTP-Only, Secure cookies to prevent cross-site scripting (XSS) attacks. We do not sell or monetize personal user data to third parties.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#213874] mb-3">4. Contact & Data Subject Rights</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You have the right to request a copy of your stored clinical learning profile or request permanent account erasure. Contact our Data Protection Officer at <a href="mailto:privacy@synapsemed.com" className="text-blue-600 font-bold hover:underline">privacy@synapsemed.com</a>.
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
