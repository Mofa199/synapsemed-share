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
import { ArrowLeft, Save, Loader2, Award } from "lucide-react"
import Link from "next/link"

interface Badge {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  category?: string
  criteria?: string
  points?: number
  rarity?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function EditBadgePage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [badge, setBadge] = useState<Badge | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    criteria: "",
    points: "",
    category: "",
    rarity: "COMMON",
    color: "#213874",
    icon: "star",
    isActive: true
  })

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN" && params.id) {
      fetchBadge()
    }
  }, [user, params.id])

  const fetchBadge = async () => {
    try {
      const response = await fetch(`/api/admin/badges/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const badge = data.data
        setBadge(badge)
        setFormData({
          name: badge.name || "",
          description: badge.description || "",
          criteria: badge.criteria || "",
          points: badge.points?.toString() || "",
          category: badge.category || "",
          rarity: badge.rarity || "COMMON",
          color: badge.color || "#213874",
          icon: badge.icon || "star",
          isActive: badge.isActive || false,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch badge details",
          variant: "destructive",
        })
        router.push("/admin/content/badges")
      }
    } catch (error) {
      console.error('Error fetching badge:', error)
      toast({
        title: "Error",
        description: "Failed to fetch badge details",
        variant: "destructive",
      })
      router.push("/admin/content/badges")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/badges/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          points: formData.points ? parseInt(formData.points) : undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Badge updated successfully!",
        })
        router.push("/admin/content/badges")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update badge",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update badge. Please try again.",
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

  const rarityOptions = [
    { value: "COMMON", label: "Common" },
    { value: "RARE", label: "Rare" },
    { value: "EPIC", label: "Epic" },
    { value: "LEGENDARY", label: "Legendary" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/content/badges" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Badges
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Edit Badge</h1>
          <p className="text-gray-600 mt-2">Update badge information and design</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Badge Information
                  </CardTitle>
                  <CardDescription>Update the basic details for this badge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Badge Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter badge name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter badge description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="criteria">Criteria to Earn</Label>
                    <Textarea
                      id="criteria"
                      value={formData.criteria}
                      onChange={(e) => setFormData((prev) => ({ ...prev, criteria: e.target.value }))}
                      placeholder="Describe what students need to do to earn this badge..."
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
                        onChange={(e) => setFormData((prev) => ({ ...prev, points: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Learning, Achievement"
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rarity">Rarity</Label>
                      <Select
                        value={formData.rarity}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, rarity: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                        <SelectContent>
                          {rarityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
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
                    <Select value={formData.icon} onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}>
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
                          onClick={() => setFormData((prev) => ({ ...prev, color: color }))}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                      className="w-24 h-10"
                    />
                  </div>
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
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-[#213874] focus:ring-[#213874]"
                    />
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
                      Update Badge
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push("/admin/content/badges")}
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