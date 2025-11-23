"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2, ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"

interface Flashcard {
  id: string
  front: string
  back: string
  category: string
  hint: string | null
  flashcardSetId: string
  createdAt: string
  updatedAt: string
}

export default function EditFlashcardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null)
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    category: "General",
    hint: "",
    flashcardSetId: ""
  })

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN" && params.id) {
      fetchFlashcard()
    }
  }, [user, params.id])

  const fetchFlashcard = async () => {
    try {
      const response = await fetch(`/api/admin/flashcards/${params.id}`)
      const result = await response.json()
      
      if (result.success) {
        const flashcard = result.data
        setFlashcard(flashcard)
        setFormData({
          front: flashcard.front || "",
          back: flashcard.back || "",
          category: flashcard.category || "General",
          hint: flashcard.hint || "",
          flashcardSetId: flashcard.flashcardSetId || ""
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch flashcard details",
          variant: "destructive",
        })
        router.push("/admin/content/flashcards")
      }
    } catch (error) {
      console.error('Error fetching flashcard:', error)
      toast({
        title: "Error",
        description: "Failed to fetch flashcard details",
        variant: "destructive",
      })
      router.push("/admin/content/flashcards")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!formData.front.trim()) {
        throw new Error("Front content is required")
      }
      if (!formData.back.trim()) {
        throw new Error("Back content is required")
      }
      if (!formData.flashcardSetId.trim()) {
        throw new Error("Flashcard set ID is required")
      }

      const response = await fetch(`/api/admin/flashcards/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Flashcard updated successfully!"
        })
        router.push("/admin/content/flashcards")
      } else {
        throw new Error(result.error || "Failed to update flashcard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update flashcard",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#213874]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/content/flashcards" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Flashcards
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Edit Flashcard</h1>
          <p className="text-gray-600 mt-2">Update flashcard information and content</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Flashcard Content
                  </CardTitle>
                  <CardDescription>Update the front and back content for your flashcard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="front">Front (Question/Term) *</Label>
                    <Textarea
                      id="front"
                      value={formData.front}
                      onChange={(e) => handleInputChange('front', e.target.value)}
                      placeholder="Enter the question or term"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="back">Back (Answer/Definition) *</Label>
                    <Textarea
                      id="back"
                      value={formData.back}
                      onChange={(e) => handleInputChange('back', e.target.value)}
                      placeholder="Enter the answer or definition"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hint">Hint (Optional)</Label>
                    <Input
                      id="hint"
                      value={formData.hint}
                      onChange={(e) => handleInputChange('hint', e.target.value)}
                      placeholder="Enter a hint to help with recall"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure flashcard properties</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label htmlFor="flashcardSetId">Flashcard Set ID *</Label>
                    <Input
                      id="flashcardSetId"
                      value={formData.flashcardSetId}
                      onChange={(e) => handleInputChange('flashcardSetId', e.target.value)}
                      placeholder="Enter flashcard set ID"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How the flashcard will appear</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#213874]">{formData.front || "Front content"}</h4>
                      <p className="text-sm text-gray-600 mt-2">{formData.back || "Back content will appear here..."}</p>
                      {formData.hint && (
                        <p className="text-xs text-gray-500 mt-2">Hint: {formData.hint}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        {formData.category}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="bg-[#213874] hover:bg-[#1a6ac3]"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Flashcard
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push("/admin/content/flashcards")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}