"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { 
  Award, 
  Save, 
  X,
  ChevronRight,
  ArrowLeft,
  Upload
} from "lucide-react"
import Link from "next/link"

export default function AddBadgePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    criteria: "",
    points: "",
    category: "",
    difficulty: "beginner",
    color: "#213874",
    icon: "star",
    isActive: true
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.name.trim()) {
        throw new Error("Badge name is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }

      // Prepare data for API call
      const badgeData = {
        name: formData.name,
        description: formData.description,
        criteria: formData.criteria || undefined,
        points: formData.points ? parseInt(formData.points) : undefined,
        category: formData.category || undefined,
        rarity: formData.difficulty.toUpperCase(), // Map difficulty to rarity
        color: formData.color,
        icon: formData.icon,
        isActive: formData.isActive,
      }

      // Call the real API
      const response = await fetch('/api/admin/badges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(badgeData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Badge created successfully",
        })
        router.push("/admin/content/badges")
      } else {
        throw new Error(data.error || 'Failed to create badge')
      }
    } catch (error) {
      console.error('Error creating badge:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create badge",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const badgeIcons = [
    { value: "star", label: "Star" },
    { value: "trophy", label: "Trophy" },
    { value: "medal", label: "Medal" },
    { value: "crown", label: "Crown" },
    { value: "shield", label: "Shield" },
    { value: "diamond", label: "Diamond" }
  ]

  const predefinedColors = [
    "#213874", "#1a6ac3", "#f3ab1b", "#e74c3c", 
    "#27ae60", "#9b59b6", "#f39c12", "#2c3e50"
  ]

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
            <span className="text-[#213874] font-medium">Add Badge</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Create New Badge</h1>
                <p className="text-gray-600">Design achievements and rewards for students</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badge Information</CardTitle>
                  <CardDescription>Basic details about the badge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Badge Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Anatomy Master, First Steps"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this badge represents..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="criteria">Criteria to Earn</Label>
                    <Textarea
                      id="criteria"
                      placeholder="Describe what students need to do to earn this badge..."
                      value={formData.criteria}
                      onChange={(e) => handleInputChange('criteria', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="points">Points Value</Label>
                      <Input
                        id="points"
                        type="number"
                        placeholder="100"
                        value={formData.points}
                        onChange={(e) => handleInputChange('points', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Learning, Achievement"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badge Design</CardTitle>
                  <CardDescription>Customize the appearance of your badge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={formData.icon} onValueChange={(value) => handleInputChange('icon', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {badgeIcons.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Badge Color</Label>
                    <div className="grid grid-cols-8 gap-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleInputChange('color', color)}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="w-24 h-10"
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Custom Icon Upload</CardTitle>
                      <CardDescription>Upload a custom badge icon</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#213874] transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Upload badge icon or <span className="text-[#213874] font-medium cursor-pointer">browse</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">SVG, PNG up to 2MB</p>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badge Preview</CardTitle>
                  <CardDescription>How the badge will appear</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div 
                    className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: formData.color }}
                  >
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#213874]">{formData.name || "Badge Name"}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.description || "Badge description will appear here..."}
                  </p>
                  {formData.points && (
                    <p className="text-xs text-gray-500 mt-2">{formData.points} points</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Badge availability settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="active" className="cursor-pointer">
                      <span className="font-medium">Active</span>
                      <p className="text-sm text-gray-600">Badge can be earned</p>
                    </Label>
                    <Switch
                      id="active"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="bg-[#213874] hover:bg-[#1a6ac3]"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Creating..." : "Create Badge"}
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