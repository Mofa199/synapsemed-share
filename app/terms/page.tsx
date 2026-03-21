"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-[#213874]">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>Welcome to Synapse Med. By using our platform, you agree to these terms.</p>
            <h2>1. Acceptable Use</h2>
            <p>You agree to use this platform only for lawful educational purposes.</p>
            <h2>2. Content</h2>
            <p>All content provided on Synapse Med is for educational purposes only.</p>
            <p>More detailed terms will be added soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
