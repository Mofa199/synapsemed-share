"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, Eye, FileText, BookOpen, Video, Pill } from "lucide-react"

interface ContentForm {
  title: string
  description: string
  content: string
  type: 'article' | 'book' | 'video' | 'drug' | 'study_guide'
  category: string
  tags: string
}

export default function CreateContentPage() {
  const { toast } = useToast()
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<ContentForm>({
    title: '',
    description: '',
    content: '',
    type: 'article',
    category: '',
    tags: ''
  })

  const handleInputChange = (field: keyof ContentForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Simulate API call - in real app would save to database
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Success",
        description: "Content saved successfully",
      })
      
      // Reset form
      setForm({
        title: '',
        description: '',
        content: '',
        type: 'article',
        category: '',
        tags: ''
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return FileText
      case 'book':
        return BookOpen
      case 'video':
        return Video
      case 'drug':
        return Pill
      default:
        return FileText
    }
  }

  const getWordCount = () => {
    return form.content.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Create Content</h1>
              <p className="text-gray-600">Create educational content for the medical platform</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                {getWordCount()} words
              </Badge>
              <Badge className={form.title && form.content ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                {form.title && form.content ? 'Ready to save' : 'Draft'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter content title..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of the content..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Content Type</Label>
                    <select
                      id="type"
                      value={form.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="article">Article</option>
                      <option value="book">Book Chapter</option>
                      <option value="video">Video Content</option>
                      <option value="drug">Drug Information</option>
                      <option value="study_guide">Study Guide</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={form.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="e.g., Cardiology, Anatomy..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={form.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="Enter tags separated by commas..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {isPreview ? (
                      <>
                        <Eye className="h-5 w-5" />
                        Preview
                      </>
                    ) : (
                      <>
                        <FileText className="h-5 w-5" />
                        Content *
                      </>
                    )}
                  </CardTitle>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-2"
                  >
                    {isPreview ? (
                      <>
                        <FileText className="h-4 w-4" />
                        Edit
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Preview
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isPreview ? (
                  <div className="prose prose-lg max-w-none min-h-96 p-4 border rounded-lg bg-white">
                    {form.content ? (
                      <div dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, '<br>') }} />
                    ) : (
                      <p className="text-gray-500 italic">No content to preview</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <Textarea
                      value={form.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Start writing your content here..."
                      className="min-h-96 font-mono text-sm"
                    />
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Writing Guidelines</h4>
                      <div className="text-xs text-blue-800 space-y-1">
                        <p>• Use clear, professional medical terminology</p>
                        <p>• Structure content with appropriate headings</p>
                        <p>• Include relevant examples and case studies</p>
                        <p>• Keep paragraphs concise and focused</p>
                        <p>• Add line breaks between sections for better readability</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !form.title || !form.content}
                  className="w-full bg-[#213874] hover:bg-[#1a6ac3] flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Content'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>

            {/* Content Type Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {(() => {
                    const Icon = getTypeIcon(form.type)
                    return <Icon className="h-5 w-5" />
                  })()}
                  {form.type.charAt(0).toUpperCase() + form.type.slice(1).replace('_', ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  {form.type === 'article' && (
                    <p>Articles are educational pieces that cover specific medical topics in detail.</p>
                  )}
                  {form.type === 'book' && (
                    <p>Book chapters provide comprehensive coverage of medical subjects.</p>
                  )}
                  {form.type === 'video' && (
                    <p>Video content includes transcripts and supplementary materials.</p>
                  )}
                  {form.type === 'drug' && (
                    <p>Drug information includes mechanism, dosage, and safety information.</p>
                  )}
                  {form.type === 'study_guide' && (
                    <p>Study guides help students review and prepare for examinations.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Words:</span>
                  <span className="text-sm font-medium">{getWordCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Characters:</span>
                  <span className="text-sm font-medium">{form.content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estimated reading:</span>
                  <span className="text-sm font-medium">{Math.ceil(getWordCount() / 200)} min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}