"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3, 
  CheckCircle, 
  XCircle,
  Clock
} from "lucide-react"
import { format } from "date-fns"

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
  totalAnswers: number
  correctAnswers: number
  accuracy: number
  createdAt: string
  updatedAt: string
}

export default function QuestionOfTheDayAdmin() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [formData, setFormData] = useState({
    question: "",
    options: ["", ""],
    correctAnswer: 0,
    explanation: "",
    difficulty: "INTERMEDIATE",
    category: "",
    tags: "",
    dateScheduled: ""
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

    fetchQuestions()
  }, [user, router])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/question-of-the-day')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setQuestions(result.data)
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch questions",
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
      const method = editingQuestion ? 'PUT' : 'POST'
      const url = editingQuestion 
        ? `/api/admin/question-of-the-day/${editingQuestion.id}`
        : '/api/admin/question-of-the-day'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: editingQuestion ? "Question Updated" : "Question Created",
          description: editingQuestion 
            ? "The question has been updated successfully" 
            : "The question has been created successfully"
        })
        
        // Reset form
        setFormData({
          question: "",
          options: ["", ""],
          correctAnswer: 0,
          explanation: "",
          difficulty: "INTERMEDIATE",
          category: "",
          tags: "",
          dateScheduled: ""
        })
        setShowAddForm(false)
        setEditingQuestion(null)
        fetchQuestions()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save question",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      difficulty: question.difficulty,
      category: question.category || "",
      tags: question.tags.join(', '),
      dateScheduled: question.dateScheduled.split('T')[0]
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return
    
    try {
      const response = await fetch(`/api/admin/question-of-the-day/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Question Deleted",
          description: "The question has been deleted successfully"
        })
        fetchQuestions()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete question",
        variant: "destructive",
      })
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/admin/content/question-of-the-day/${id}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4">
            {Array.from({length: 3}).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#213874]">Question of the Day</h1>
          <p className="text-gray-600 mt-2">Manage daily questions for students</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-[#213874] hover:bg-[#1a6ac3]">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </CardTitle>
            <CardDescription>
              {editingQuestion 
                ? "Update the question details below" 
                : "Create a new daily question for students"}
            </CardDescription>
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
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingQuestion(null)
                    setFormData({
                      question: "",
                      options: ["", ""],
                      correctAnswer: 0,
                      explanation: "",
                      difficulty: "INTERMEDIATE",
                      category: "",
                      tags: "",
                      dateScheduled: ""
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#213874] hover:bg-[#1a6ac3]">
                  {editingQuestion ? "Update Question" : "Create Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first question of the day.</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
                      {!question.isActive && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      {question.category && (
                        <Badge variant="outline">{question.category}</Badge>
                      )}
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(question.dateScheduled), 'MMM d, yyyy')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(question.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(question)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      {question.totalAnswers} answers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      {question.correctAnswers} correct
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">
                      {question.accuracy}% accuracy
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">
                      {format(new Date(question.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}