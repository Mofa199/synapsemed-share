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
  Video, 
  Save, 
  X,
  ChevronRight,
  ArrowLeft,
  Upload,
  Loader2,
  Play
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CurriculumModuleSelect } from "@/components/curriculum-module-select"

export default function EditVideoPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: "",
    category: "",
    instructor: "",
    curriculumId: "",
    moduleId: "",
    isPublished: false,
    thumbnailUrl: ""
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

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
      fetchVideo()
    }
  }, [user, params.id])

  const fetchVideo = async () => {
    try {
      const response = await fetch(`/api/admin/videos/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const video = data.data
        setFormData({
          title: video.title || "",
          description: video.description || "",
          videoUrl: video.videoUrl || "",
          duration: video.duration || "",
          category: video.category || "",
          instructor: video.instructor || "",
          curriculumId: video.curriculumId || "",
          moduleId: video.moduleId || "",
          isPublished: video.isPublished || false,
          thumbnailUrl: video.thumbnailUrl || ""
        })
      } else {
        toast({ title: "Error", description: "Failed to fetch video details", variant: "destructive" })
        router.push("/admin/content/videos")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch video details", variant: "destructive" })
      router.push("/admin/content/videos")
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
      if (!formData.title.trim()) throw new Error("Video title is required")
      if (!formData.videoUrl.trim()) throw new Error("Video URL (YouTube/Vimeo/Internal) is required")

      let currentThumbnailUrl = formData.thumbnailUrl

      if (thumbnailFile) {
        setUploadingThumbnail(true)
        try {
          currentThumbnailUrl = await handleFileUpload(thumbnailFile, 'thumbnails')
        } finally {
          setUploadingThumbnail(false)
        }
      }

      const videoData = {
        title: formData.title,
        description: formData.description || undefined,
        videoUrl: formData.videoUrl,
        thumbnailUrl: currentThumbnailUrl || undefined,
        duration: formData.duration || undefined,
        category: formData.category || undefined,
        instructor: formData.instructor || undefined,
        curriculumId: formData.curriculumId || undefined,
        moduleId: formData.moduleId || undefined,
        isPublished: formData.isPublished,
        tags: [] // Default for now
      }

      const response = await fetch(`/api/admin/videos/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Video updated successfully!",
        })
        router.push("/admin/content/videos")
      } else {
        throw new Error(data.error || 'Failed to update video')
      }
    } catch (error) {
      console.error('Error adding video:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update video",
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
            <span className="text-[#213874] font-medium">Edit Video</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Edit Video</h1>
                <p className="text-gray-600">Update video details</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/content/videos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Videos
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Information</CardTitle>
                  <CardDescription>Details about the video content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Video Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Introduction to Cardiovascular System"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="videoUrl"
                        placeholder="https://youtube.com/watch?v=... or internal path"
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">Supports YouTube, Vimeo, or direct video file links</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <RichTextEditor
                      value={formData.description}
                      onChange={(value) => handleInputChange('description', value)}
                      placeholder="Brief overview of what this video covers..."
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instructor">Instructor</Label>
                      <Input
                        id="instructor"
                        placeholder="e.g., Prof. Sarah Johnson"
                        value={formData.instructor}
                        onChange={(e) => handleInputChange('instructor', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (mins)</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 45:00"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
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
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Cardiology, Surgery"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Thumbnail Image</CardTitle>
                      <CardDescription>Upload a custom thumbnail or use the video default</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {formData.thumbnailUrl && (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                            <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => handleInputChange('thumbnailUrl', '')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                            className="flex-1"
                            disabled={uploadingThumbnail}
                          />
                          {uploadingThumbnail && <Loader2 className="h-4 w-4 animate-spin" />}
                          {thumbnailFile && !uploadingThumbnail && <Badge variant="outline">{thumbnailFile.name}</Badge>}
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
                  <CardDescription>Control video availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="publish" className="cursor-pointer">
                      <span className="font-medium">Published</span>
                      <p className="text-sm text-gray-600">Make this video available</p>
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
                  disabled={isSubmitting || uploadingThumbnail}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Updating..." : "Update Video"}
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
