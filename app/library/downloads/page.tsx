"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export default function LibraryDownloadsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#213874] mb-8 flex items-center gap-2">
          <Download className="h-8 w-8 text-green-500" />
          Downloads
        </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <Download className="h-12 w-12 mb-4 opacity-20" />
            <CardTitle className="text-xl mb-2">No downloads yet</CardTitle>
            <p>Download resources for offline access.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
