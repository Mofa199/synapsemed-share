"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Building } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"

export default function AddPartnerPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    partnershipType: "",
    logo: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const partnerData = new FormData()
      partnerData.append("name", formData.name)
      partnerData.append("description", formData.description)
      partnerData.append("type", formData.type)
      partnerData.append("website", formData.website)
      partnerData.append("contactName", formData.contactName)
      partnerData.append("contactEmail", formData.contactEmail)
      partnerData.append("contactPhone", formData.contactPhone)
      partnerData.append("partnershipType", formData.partnershipType)

      if (formData.logo) {
        partnerData.append("logo", formData.logo)
      }

      const response = await fetch("/api/admin/partners", {
        method: "POST",
        body: partnerData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Partner added successfully!",
        })
        router.push("/admin/partners")
      } else {
        throw new Error("Failed to add partner")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add partner. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/admin/partners" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Partners
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Add New Partner</h1>
          <p className="text-gray-600 mt-2">Add a new institutional partner to the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Partner Information
              </CardTitle>
              <CardDescription>Enter the details for the new partner organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Organization Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNIVERSITY">University</SelectItem>
                      <SelectItem value="HOSPITAL">Hospital</SelectItem>
                      <SelectItem value="PHARMACEUTICAL">Pharmaceutical</SelectItem>
                      <SelectItem value="ORGANIZATION">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the organization and partnership..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnershipType">Partnership Type</Label>
                  <Input
                    id="partnershipType"
                    value={formData.partnershipType}
                    onChange={(e) => setFormData((prev) => ({ ...prev, partnershipType: e.target.value }))}
                    placeholder="e.g., Academic, Healthcare, Research"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="contact@partner.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Organization Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      logo: e.target.files?.[0] || null,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/partners")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#213874] hover:bg-[#1a6ac3]">
              <Save className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
