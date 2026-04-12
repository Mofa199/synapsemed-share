"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: string
  category: string
  tags: string[]
  dateScheduled: string
  isActive: boolean
}

import React from "react"

export default function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    question: "",
    options: ["", ""],
    correctAnswer: 0,
    explanation: "",
    difficulty: "INTERMEDIATE",
    category: "",
    tags: "",
    dateScheduled: "",
    isActive: true
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role)) {
      router.push('/')
      return
    }

    if (id) {
      fetchQuestion(id as string)
    }
  }, [user, router, id])

  const fetchQuestion = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/question-of-the-day/${id}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const question = result.data
          setFormData({
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            difficulty: question.difficulty,
            category: question.category || "",
            tags: question.tags.join(', '),
            dateScheduled: question.dateScheduled.split('T')[0],
            isActive: question.isActive
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch question details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""]
    })
  }

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) return
    
    const newOptions = [...formData.options]
    newOptions.splice(index, 1)
    
    setFormData({
      ...formData,
      options: newOptions,
      correctAnswer: index <= formData.correctAnswer 
        ? Math.max(0, formData.correctAnswer - 1) 
        : formData.correctAnswer
    })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/admin/question-of-the-day/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Question Updated",
          description: "The question has been updated successfully"
        })
        router.push(`/admin/content/question-of-the-day/${id}`)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update question",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    router.push(`/admin/content/question-of-the-day/${id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Question
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Question</CardTitle>
          <CardDescription>Update the question details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the question..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateScheduled">Scheduled Date</Label>
                <Input
                  id="dateScheduled"
                  type="date"
                  value={formData.dateScheduled}
                  onChange={(e) => setFormData({ ...formData, dateScheduled: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-3">
                {(formData.options || []).map((option: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + index)}...`}
                        required
                      />
                      {formData.options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`correct-${index}`}
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData({ ...formData, correctAnswer: index })}
                        className="h-4 w-4 text-[#213874]"
                      />
                      <Label htmlFor={`correct-${index}`} className="ml-2 text-sm">
                        Correct
                      </Label>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddOption}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  id="explanation"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Enter detailed explanation..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Cardiology, Pharmacology..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., ECG, emergency, diagnosis..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select
                  value={formData.isActive ? "true" : "false"}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value === "true" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#213874] hover:bg-[#1a6ac3]">
                Update Question
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}