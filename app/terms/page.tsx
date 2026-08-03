"use client"

import React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { FileText, AlertTriangle, ShieldCheck, Scale } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-br from-[#213874] via-[#1a4a90] to-[#1a6ac3] text-white pt-28 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-md">
            <Scale className="w-4 h-4 text-blue-300" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-blue-100 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Please read these terms carefully before utilizing the SynapseMed medical education platform.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl flex-1">
        <Card className="border-gray-200 shadow-md bg-white p-8 space-y-8">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Last Updated: August 2026</span>
            <h2 className="text-2xl font-bold text-[#213874] mb-3">1. Educational Disclaimer</h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-4">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Medical Disclaimer Notice
              </div>
              <p className="text-amber-800 text-xs leading-relaxed">
                SynapseMed is designed strictly for medical educational purposes, revision, and examination preparation for healthcare trainees. Content does not constitute clinical medical advice, direct patient diagnosis, or treatment protocols for real clinical emergencies.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#213874] mb-3">2. Acceptable Use Policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              By accessing SynapseMed, you agree not to:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              <li>Attempt to bypass rate limits or compromise server infrastructure.</li>
              <li>Scrape or reverse engineer curriculum content and clinical question banks.</li>
              <li>Share user credentials across unauthorized institutional networks.</li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#213874] mb-3">3. Intellectual Property Rights</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              All master curriculum modules, annotated ECG lead strips, digital microscopy slides, and proprietary algorithms are protected under international copyright law.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-2xl font-bold text-[#213874] mb-3">4. Limitation of Liability</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              SynapseMed shall not be held liable for examination outcomes or clinical decision errors. Trainees must always consult accredited national clinical guidelines and senior supervising physicians during ward rounds.
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
