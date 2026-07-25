"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"
import { 
  FileText, 
  Save, 
  X,
  ChevronRight,
  ArrowLeft,
  Upload,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CurriculumModuleSelect } from "@/components/curriculum-module-select"

export default function EditMagazinePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  
  const [formData, setFormData] = useState({
    title: "",
    issueNumber: "",
    description: "",
    category: "",
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    pages: "",
    language: "english",
    tags: "",
    isPublished: false,
    coverUrl: "",
    fileUrl: "",
    curriculumId: "",
    moduleId: ""
  })

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [magazineFile, setMagazineFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingMagazine, setUploadingMagazine] = useState(false)

  const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
  if (!user || !adminRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && adminRoles.includes(user.role) && params.id) {
      fetchMagazine()
    }
  }, [user, params.id])

  const fetchMagazine = async () => {
    try {
      const response = await fetch(`/api/admin/magazines/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const mag = data.data
        setFormData({
          title: mag.title || "",
          issueNumber: mag.issue || "",
          description: mag.description || "",
          category: mag.category || "",
          month: mag.publishedAt ? new Date(mag.publishedAt).toLocaleString('default', { month: 'long' }) : new Date().toLocaleString('default', { month: 'long' }),
          year: mag.publishedAt ? new Date(mag.publishedAt).getFullYear().toString() : new Date().getFullYear().toString(),
          pages: "", // Or maybe mag.pages if added
          language: "english",
          tags: mag.tags ? JSON.parse(mag.tags).join(', ') : "",
          isPublished: mag.isPublished || false,
          coverUrl: mag.coverUrl || "",
          fileUrl: "", // Assuming no fileUrl exists directly in the schema without it being added, if so, map it
          curriculumId: mag.curriculumId || "",
          moduleId: mag.moduleId || ""
        })
      } else {
        toast({ title: "Error", description: "Failed to fetch magazine details", variant: "destructive" })
        router.push("/admin/content/magazines")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch magazine details", variant: "destructive" })
      router.push("/admin/content/magazines")
    } finally {
      setLoading(false)
    }
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = async (file: File, folder: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (!data.success) throw new Error(data.error || 'Upload failed')
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.title.trim()) throw new Error("Magazine title is required")

      let currentCoverUrl = formData.coverUrl
      let currentFileUrl = formData.fileUrl

      if (coverFile) {
        setUploadingCover(true)
        try {
          currentCoverUrl = await handleFileUpload(coverFile, 'magazine-covers')
        } finally {
          setUploadingCover(false)
        }
      }

      if (magazineFile) {
        setUploadingMagazine(true)
        try {
          currentFileUrl = await handleFileUpload(magazineFile, 'magazines')
        } finally {
          setUploadingMagazine(false)
        }
      }

      const magazineData = {
        title: formData.title,
        issueNumber: formData.issueNumber || undefined,
        description: formData.description || undefined,
        category: formData.category || undefined,
        month: formData.month,
        year: parseInt(formData.year),
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        language: formData.language,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        isPublished: formData.isPublished,
        coverUrl: currentCoverUrl,
        fileUrl: currentFileUrl,
        curriculumId: formData.curriculumId || undefined,
        moduleId: formData.moduleId || undefined
      }

      const response = await fetch(`/api/admin/magazines/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(magazineData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Magazine updated successfully!",
        })
        router.push("/admin/content/magazines")
      } else {
        throw new Error(data.error || 'Failed to update magazine')
      }
    } catch (error) {
      console.error('Error adding magazine:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update magazine",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span>Content Management</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Edit Magazine</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Edit Magazine</h1>
                <p className="text-gray-600">Update a magazine issue</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/content/magazines">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Magazines
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Magazine Information</CardTitle>
                  <CardDescription>Basic details about the magazine issue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Magazine Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Medical Science Today"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issueNumber">Issue Number</Label>
                      <Input
                        id="issueNumber"
                        placeholder="e.g., Vol 12, Issue 4"
                        value={formData.issueNumber}
                        onChange={(e) => handleInputChange('issueNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) => handleInputChange('description', value)}
                      placeholder="Brief description of this issue..."
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="month">Month</Label>
                      <Select value={formData.month} onValueChange={(value) => handleInputChange('month', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2023"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pages">Pages</Label>
                      <Input
                        id="pages"
                        type="number"
                        placeholder="64"
                        value={formData.pages}
                        onChange={(e) => handleInputChange('pages', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., General, Clinical"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      />
                    </div>
                  </div>

                  <CurriculumModuleSelect
                    curriculumId={formData.curriculumId}
                    moduleId={formData.moduleId}
                    onCurriculumChange={(val) => handleInputChange('curriculumId', val)}
                    onModuleChange={(val) => handleInputChange('moduleId', val)}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="research, clinical, oncology (comma separated)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cover Image</CardTitle>
                      <CardDescription>Upload a cover image for the magazine</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {formData.coverUrl && (
                          <div className="relative w-32 h-48 rounded-lg overflow-hidden border">
                            <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => handleInputChange('coverUrl', '')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                            className="flex-1"
                            disabled={uploadingCover}
                          />
                          {uploadingCover && <Loader2 className="h-4 w-4 animate-spin" />}
                          {coverFile && !uploadingCover && <Badge variant="outline">{coverFile.name}</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Magazine File</CardTitle>
                      <CardDescription>Upload the magazine PDF</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {formData.fileUrl && (
                          <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded border border-blue-100">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">File uploaded</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 ml-auto"
                              onClick={() => handleInputChange('fileUrl', '')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setMagazineFile(e.target.files?.[0] || null)}
                            className="flex-1"
                            disabled={uploadingMagazine}
                          />
                          {uploadingMagazine && <Loader2 className="h-4 w-4 animate-spin" />}
                          {magazineFile && !uploadingMagazine && <Badge variant="outline">{magazineFile.name}</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>Control magazine availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="publish" className="cursor-pointer">
                      <span className="font-medium">Published</span>
                      <p className="text-sm text-gray-600">Make this issue available</p>
                    </Label>
                    <Switch
                      id="publish"
                      checked={formData.isPublished}
                      onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="bg-[#213874] hover:bg-[#1a6ac3]"
                  disabled={isSubmitting || uploadingCover || uploadingMagazine}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Updating..." : "Update Magazine"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <AIHelper />
    </div>
  )
}
