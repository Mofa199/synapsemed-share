"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function LibraryRecentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#213874] mb-8 flex items-center gap-2">
          <Clock className="h-8 w-8 text-blue-500" />
          Recently Viewed
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <Clock className="h-12 w-12 mb-4 opacity-20" />
            <CardTitle className="text-xl mb-2">Nothing here yet</CardTitle>
            <p>Your recently viewed resources will appear here.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
