"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2, Pill, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface DrugClass {
  id: string
  name: string
  category: string
  description: string
  mechanism: string
  therapeuticUses: string[]
  commonSideEffects: string[]
  contraindications: string[]
  drugs: string[]
}

export default function EditDrugClassPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [drugClass, setDrugClass] = useState<DrugClass | null>(null)
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

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN" && params.id) {
      fetchDrugClass()
    }
  }, [user, params.id])

  const fetchDrugClass = async () => {
    try {
      const response = await fetch(`/api/admin/drug-classes/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const drugClass = data.data
        setDrugClass(drugClass)
        setFormData({
          name: drugClass.name || "",
          category: drugClass.category || "",
          description: drugClass.description || "",
          mechanism: drugClass.mechanism || "",
          therapeuticUses: drugClass.therapeuticUses && drugClass.therapeuticUses.length > 0 
            ? drugClass.therapeuticUses 
            : [""],
          commonSideEffects: drugClass.commonSideEffects && drugClass.commonSideEffects.length > 0 
            ? drugClass.commonSideEffects 
            : [""],
          contraindications: drugClass.contraindications && drugClass.contraindications.length > 0 
            ? drugClass.contraindications 
            : [""],
          drugs: drugClass.drugs && drugClass.drugs.length > 0 
            ? drugClass.drugs 
            : [""]
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch drug class details",
          variant: "destructive",
        })
        router.push("/admin/content/drug-classes")
      }
    } catch (error) {
      console.error('Error fetching drug class:', error)
      toast({
        title: "Error",
        description: "Failed to fetch drug class details",
        variant: "destructive",
      })
      router.push("/admin/content/drug-classes")
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
    setSaving(true)

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

      const response = await fetch(`/api/admin/drug-classes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Drug class updated successfully!",
        })
        router.push("/admin/content/drug-classes")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update drug class",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update drug class. Please try again.",
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
          <Link href="/admin/content/drug-classes" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Drug Classes
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Edit Drug Class</h1>
          <p className="text-gray-600 mt-2">Update drug class information and details</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>General details about the drug class</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Drug Class Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter drug class name"
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
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter description"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mechanism">Mechanism of Action *</Label>
                    <Textarea
                      id="mechanism"
                      value={formData.mechanism}
                      onChange={(e) => handleInputChange('mechanism', e.target.value)}
                      placeholder="Enter mechanism of action"
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
                        <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {formData.category}
                        </div>
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
                      Update Drug Class
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push("/admin/content/drug-classes")}
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