"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TestStylingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[#213874]">Styling Test Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Card Component Test</CardTitle>
            <CardDescription>This card should have proper styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">This is a paragraph inside a card component.</p>
            
            <div className="flex gap-4">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
            </div>
            
            <div className="flex gap-2">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="outline">Outline Badge</Badge>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Column 1</h2>
            <p className="text-gray-600">This is the first column with proper styling.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Column 2</h2>
            <p className="text-gray-600">This is the second column with proper styling.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Column 3</h2>
            <p className="text-gray-600">This is the third column with proper styling.</p>
          </div>
        </div>
      </div>
    </div>
  )
}