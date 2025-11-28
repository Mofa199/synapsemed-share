"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Upload,
  BookOpen
} from "lucide-react"

interface Flashcard {
  id: string
  front: string
  back: string
  category: string
  hint: string | null
  createdAt: string
}

export default function FlashcardsAdmin() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    category: "General",
    hint: ""
  })

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!user) {
      router.push('/login')
      return
    }

    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    if (!adminRoles.includes(user.role)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      router.push('/')
      return
    }

    fetchFlashcards()
  }, [user, router])

  const fetchFlashcards = async () => {
    try {
      const response = await fetch('/api/admin/flashcards')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setFlashcards(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error)
      toast({
        title: "Error",
        description: "Failed to load flashcards",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId 
        ? `/api/admin/flashcards/${editingId}`
        : '/api/admin/flashcards'
        
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: editingId 
            ? "Flashcard updated successfully" 
            : "Flashcard created successfully"
        })
        
        // Reset form
        setFormData({ front: "", back: "", category: "General", hint: "" })
        setEditingId(null)
        setShowForm(false)
        fetchFlashcards() // Refresh list
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save flashcard",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (flashcard: Flashcard) => {
    setFormData({
      front: flashcard.front,
      back: flashcard.back,
      category: flashcard.category,
      hint: flashcard.hint || ""
    })
    setEditingId(flashcard.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flashcard?")) return
    
    try {
      const response = await fetch(`/api/admin/flashcards/${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Flashcard deleted successfully"
        })
        fetchFlashcards() // Refresh list
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete flashcard",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setFormData({ front: "", back: "", category: "General", hint: "" })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length: 6}).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Flashcard Management</h1>
              <p className="text-gray-600">Create and manage daily flashcards for the homepage</p>
            </div>
            
            <Button onClick={() => setShowForm(true)} className="bg-[#213874] hover:bg-[#1a6ac3]">
              <Plus className="h-4 w-4 mr-2" />
              Add Flashcard
            </Button>
          </div>
        </div>

        {/* Flashcard Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {editingId ? "Edit Flashcard" : "Add New Flashcard"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="front">Front (Question)</Label>
                    <Textarea
                      id="front"
                      value={formData.front}
                      onChange={(e) => setFormData({...formData, front: e.target.value})}
                      placeholder="Enter the question or term"
                      required
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="back">Back (Answer)</Label>
                    <Textarea
                      id="back"
                      value={formData.back}
                      onChange={(e) => setFormData({...formData, back: e.target.value})}
                      placeholder="Enter the answer or definition"
                      required
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Anatomy">Anatomy</SelectItem>
                        <SelectItem value="Physiology">Physiology</SelectItem>
                        <SelectItem value="Pathology">Pathology</SelectItem>
                        <SelectItem value="Pharmacology">Pharmacology</SelectItem>
                        <SelectItem value="Microbiology">Microbiology</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Respiratory">Respiratory</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hint">Hint (Optional)</Label>
                    <Input
                      id="hint"
                      value={formData.hint}
                      onChange={(e) => setFormData({...formData, hint: e.target.value})}
                      placeholder="Enter a hint to help with recall"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#213874] hover:bg-[#1a6ac3]">
                    {editingId ? "Update Flashcard" : "Create Flashcard"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Flashcards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No flashcards found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first flashcard</p>
              <Button onClick={() => setShowForm(true)} className="bg-[#213874] hover:bg-[#1a6ac3]">
                <Plus className="h-4 w-4 mr-2" />
                Add Flashcard
              </Button>
            </div>
          ) : (
            flashcards.map((flashcard) => (
              <Card key={flashcard.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{flashcard.front}</CardTitle>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {flashcard.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{flashcard.back}</p>
                  
                  {flashcard.hint && (
                    <div className="text-sm text-gray-500 mb-4">
                      <span className="font-medium">Hint:</span> {flashcard.hint}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(flashcard.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(flashcard)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(flashcard.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}