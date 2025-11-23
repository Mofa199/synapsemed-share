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

export default function AddDrugPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    brandNames: [""],
    class: "",
    category: "",
    description: "",
    mechanism: "",
    indications: [""],
    dosageAdult: "",
    dosagePediatric: "",
    dosageElderly: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'brandNames' | 'indications', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: 'brandNames' | 'indications') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: 'brandNames' | 'indications', index: number) => {
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
        throw new Error("Drug name is required")
      }
      if (!formData.genericName.trim()) {
        throw new Error("Generic name is required")
      }
      if (!formData.class) {
        throw new Error("Drug class is required")
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
        name: formData.name,
        genericName: formData.genericName,
        brandNames: formData.brandNames.filter(item => item.trim() !== "").join(","),
        class: formData.class,
        category: formData.category,
        description: formData.description,
        mechanism: formData.mechanism,
        indications: formData.indications.filter(item => item.trim() !== "").join("\n"),
        dosageAdult: formData.dosageAdult,
        dosagePediatric: formData.dosagePediatric,
        dosageElderly: formData.dosageElderly,
        contraindications: "",
        warnings: "",
        sideEffectsCommon: "",
        sideEffectsSerious: "",
        sideEffectsRare: "",
        interactions: "",
        monitoring: "",
        storage: "",
        pregnancy: "",
        absorption: "",
        distribution: "",
        metabolism: "",
        elimination: "",
        halfLife: "",
        administrationRoute: "",
        administrationTiming: "",
        administrationInstructions: ""
      }

      const response = await fetch('/api/admin/drugs', {
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
          description: "Drug created successfully",
        })
        router.push('/admin/content/drugs')
      } else {
        throw new Error(data.error || 'Failed to create drug')
      }
    } catch (error) {
      console.error('Error creating drug:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create drug",
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
            <span>Drugs</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#213874] font-medium">Add New</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Pill className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#213874]">Add New Drug</h1>
              <p className="text-gray-600">Add detailed information about a medication</p>
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
                  <CardDescription>Essential drug identification details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Drug Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Lisinopril"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="genericName">Generic Name *</Label>
                      <Input
                        id="genericName"
                        placeholder="e.g., Lisinopril"
                        value={formData.genericName}
                        onChange={(e) => handleInputChange('genericName', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="class">Drug Class *</Label>
                      <Input
                        id="class"
                        placeholder="e.g., ACE Inhibitors"
                        value={formData.class}
                        onChange={(e) => handleInputChange('class', e.target.value)}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the drug..."
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
                      placeholder="How this drug works at the molecular level..."
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
                  <CardTitle>Brand Names</CardTitle>
                  <CardDescription>Commercial names for this drug</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.brandNames.map((brand, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder={`Brand name ${index + 1}`}
                        value={brand}
                        onChange={(e) => handleArrayChange('brandNames', index, e.target.value)}
                      />
                      {formData.brandNames.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('brandNames', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('brandNames')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Brand Name
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Indications</CardTitle>
                  <CardDescription>Medical conditions this drug treats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.indications.map((indication, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder={`Indication ${index + 1}`}
                        value={indication}
                        onChange={(e) => handleArrayChange('indications', index, e.target.value)}
                      />
                      {formData.indications.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('indications', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('indications')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Indication
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dosage Information</CardTitle>
                  <CardDescription>Recommended dosing by population</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosageAdult">Adult Dosage</Label>
                    <Input
                      id="dosageAdult"
                      placeholder="e.g., 10-40 mg daily"
                      value={formData.dosageAdult}
                      onChange={(e) => handleInputChange('dosageAdult', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosagePediatric">Pediatric Dosage</Label>
                    <Input
                      id="dosagePediatric"
                      placeholder="e.g., 0.1 mg/kg daily"
                      value={formData.dosagePediatric}
                      onChange={(e) => handleInputChange('dosagePediatric', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosageElderly">Elderly Dosage</Label>
                    <Input
                      id="dosageElderly"
                      placeholder="e.g., Start with 5 mg daily"
                      value={formData.dosageElderly}
                      onChange={(e) => handleInputChange('dosageElderly', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How the drug will appear</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[#213874]">{formData.name || "Drug Name"}</h4>
                      <p className="text-sm text-gray-600">{formData.genericName || "Generic Name"}</p>
                      <p className="text-sm text-gray-600 mt-1">{formData.description || "Description will appear here..."}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.category && (
                        <Badge variant="outline">{formData.category}</Badge>
                      )}
                      {formData.class && (
                        <Badge variant="secondary">{formData.class}</Badge>
                      )}
                    </div>
                    <div className="text-sm space-y-1">
                      <div>Brand Names: {formData.brandNames.filter(b => b.trim()).length}</div>
                      <div>Indications: {formData.indications.filter(i => i.trim()).length}</div>
                      <div>Adult Dosage: {formData.dosageAdult || "Not set"}</div>
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
                  {isSubmitting ? "Creating..." : "Add Drug"}
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