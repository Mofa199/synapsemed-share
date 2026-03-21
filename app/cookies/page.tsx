"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-[#213874]">Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>Synapse Med uses cookies to enhance your experience.</p>
            <h2>What are cookies?</h2>
            <p>Cookies are small text files stored on your device that help us provide a better service.</p>
            <h2>How we use them</h2>
            <ul>
              <li>To keep you signed in</li>
              <li>To remember your preferences</li>
              <li>To analyze platform usage</li>
            </ul>
            <p>By using Synapse Med, you consent to our use of cookies.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
