"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Sparkles, Brain, FileText, HelpCircle, Star } from 'lucide-react'
import Link from "next/link"

export function AIDashboardSection() {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-6 w-6 text-blue-600" />
          SYNAPSEMED AI Assistant
        </CardTitle>
        <CardDescription>
          Your AI-powered medical learning companion - Free & Local
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">
          Get instant help with medical questions, generate flashcards, create practice exams, and receive personalized study recommendations - all powered by AI running locally on our servers.
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-blue-100">
            <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Ask Questions</p>
              <p className="text-xs text-gray-600">Get detailed answers</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-green-100">
            <FileText className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Flashcards</p>
              <p className="text-xs text-gray-600">Generate study cards</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-purple-100">
            <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Exam Questions</p>
              <p className="text-xs text-gray-600">Practice tests</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-yellow-100">
            <Star className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Recommendations</p>
              <p className="text-xs text-gray-600">Study tips</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href="/ai">
              <Bot className="h-4 w-4 mr-2" />
              Open AI Assistant
            </Link>
          </Button>
        </div>

        <div className="bg-white p-3 rounded-lg border border-blue-100">
          <p className="text-xs text-gray-600">
            <strong>💡 Tip:</strong> Click the floating AI button (bottom-right) on any page for quick access!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}