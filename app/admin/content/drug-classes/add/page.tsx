"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { 
  Pill, 
  Save, 
  X,
  ChevronRight,
  Plus,
  Trash2
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddDrugClassPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    mechanism: "",
    therapeuticUses: [""],
    commonSideEffects: [""],
    contraindications: [""],
    drugs: [""]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'therapeuticUses' | 'commonSideEffects' | 'contraindications' | 'drugs', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: 'therapeuticUses' | 'commonSideEffects' | 'contraindications' | 'drugs') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: 'therapeuticUses' | 'commonSideEffects' | 'contraindications' | 'drugs', index: number) => {
    const array = formData[field]
    if (array.length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: array.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Name is required")
      }
      if (!formData.category) {
        throw new Error("Category is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.mechanism.trim()) {
        throw new Error("Mechanism is required")
      }

      const submitData = {
        ...formData,
        therapeuticUses: formData.therapeuticUses.filter(item => item.trim() !== ""),
        commonSideEffects: formData.commonSideEffects.filter(item => item.trim() !== ""),
        contraindications: formData.contraindications.filter(item => item.trim() !== ""),
        drugs: formData.drugs.filter(item => item.trim() !== "")
      }

      const response = await fetch('/api/admin/drug-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Drug class created successfully",
        })
        router.push('/admin/content/drug-classes')
      } else {
        throw new Error(data.error || 'Failed to create drug class')
      }
    } catch (error) {
      console.error('Error creating drug class:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create drug class",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span>Content Management</span>
            <ChevronRight className="w-4 h-4" />
            <span>Drug Classes</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Add New</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#213874]">Create Drug Class</h1>
              <p className="text-gray-600">Add a new therapeutic drug classification</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>General details about the drug class</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Drug Class Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., ACE Inhibitors"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Autonomic Nervous System">Autonomic Nervous System</SelectItem>
                        <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                        <SelectItem value="Hematologic">Hematologic</SelectItem>
                        <SelectItem value="Respiratory">Respiratory</SelectItem>
                        <SelectItem value="Gastrointestinal">Gastrointestinal</SelectItem>
                        <SelectItem value="Endocrine">Endocrine</SelectItem>
                        <SelectItem value="Central Nervous System">Central Nervous System</SelectItem>
                        <SelectItem value="Antimicrobial">Antimicrobial</SelectItem>
                        <SelectItem value="Cancer Chemotherapy">Cancer Chemotherapy</SelectItem>
                        <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the drug class..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mechanism">Mechanism of Action *</Label>
                    <Textarea
                      id="mechanism"
                      placeholder="How these drugs work at the molecular level..."
                      value={formData.mechanism}
                      onChange={(e) => handleInputChange('mechanism', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Therapeutic Uses</CardTitle>
                  <CardDescription>Medical conditions and indications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.therapeuticUses.map((use, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder={`Therapeutic use ${index + 1}`}
                        value={use}
                        onChange={(e) => handleArrayChange('therapeuticUses', index, e.target.value)}
                      />
                      {formData.therapeuticUses.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('therapeuticUses', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('therapeuticUses')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Therapeutic Use
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Side Effects</CardTitle>
                  <CardDescription>Frequently reported adverse effects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.commonSideEffects.map((effect, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder={`Side effect ${index + 1}`}
                        value={effect}
                        onChange={(e) => handleArrayChange('commonSideEffects', index, e.target.value)}
                      />
                      {formData.commonSideEffects.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('commonSideEffects', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('commonSideEffects')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Side Effect
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contraindications</CardTitle>
                  <CardDescription>Conditions when these drugs should not be used</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.contraindications.map((contraindication, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder={`Contraindication ${index + 1}`}
                        value={contraindication}
                        onChange={(e) => handleArrayChange('contraindications', index, e.target.value)}
                      />
                      {formData.contraindications.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('contraindications', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('contraindications')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contraindication
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Drugs in Class</CardTitle>
                  <CardDescription>Individual medications in this drug class</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.drugs.map((drug, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder={`Drug ${index + 1}`}
                        value={drug}
                        onChange={(e) => handleArrayChange('drugs', index, e.target.value)}
                      />
                      {formData.drugs.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('drugs', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('drugs')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Drug
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How the drug class will appear</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[#213874]">{formData.name || "Drug Class Name"}</h4>
                      <p className="text-sm text-gray-600 mt-1">{formData.description || "Description will appear here..."}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.category && (
                        <Badge variant="outline" className="capitalize">{formData.category}</Badge>
                      )}
                    </div>
                    <div className="text-sm space-y-1">
                      <div>Mechanism: {formData.mechanism ? formData.mechanism.substring(0, 50) + "..." : "Not set"}</div>
                      <div>Therapeutic Uses: {formData.therapeuticUses.filter(u => u.trim()).length}</div>
                      <div>Side Effects: {formData.commonSideEffects.filter(s => s.trim()).length}</div>
                      <div>Contraindications: {formData.contraindications.filter(c => c.trim()).length}</div>
                      <div>Drugs: {formData.drugs.filter(d => d.trim()).length}</div>
                    </div>
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
                  {isSubmitting ? "Creating..." : "Create Drug Class"}
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