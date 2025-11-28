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

interface Drug {
  id: string
  name: string
  genericName: string
  brandNames: string[]
  drugClassId: string
  description: string
  mechanism: string
  indications: string[]
  dosageAdult: string
  dosagePediatric: string
  dosageElderly: string
  contraindications: string[]
  interactions: string[]
  drugClass: {
    id: string
    name: string
    category: string
  }
}

export default function EditDrugPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [drug, setDrug] = useState<Drug | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    brandNames: [""],
    drugClassId: "",
    description: "",
    mechanism: "",
    indications: [""],
    dosageAdult: "",
    dosagePediatric: "",
    dosageElderly: "",
    contraindications: [""],
    interactions: [""]
  })

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN" && params.id) {
      fetchDrug()
    }
  }, [user, params.id])

  const fetchDrug = async () => {
    try {
      const response = await fetch(`/api/admin/drugs/${params.id}`)
      const data = await response.json()
      
      if (data.success) {
        const drug = data.data
        setDrug(drug)
        setFormData({
          name: drug.name || "",
          genericName: drug.genericName || "",
          brandNames: drug.brandNames && drug.brandNames.length > 0 
            ? Array.isArray(drug.brandNames) ? drug.brandNames : JSON.parse(drug.brandNames)
            : [""],
          drugClassId: drug.drugClassId || drug.drugClass?.id || "",
          description: drug.description || "",
          mechanism: drug.mechanism || "",
          indications: drug.indications && drug.indications.length > 0 
            ? Array.isArray(drug.indications) ? drug.indications : JSON.parse(drug.indications)
            : [""],
          dosageAdult: drug.dosageAdult || "",
          dosagePediatric: drug.dosagePediatric || "",
          dosageElderly: drug.dosageElderly || "",
          contraindications: drug.contraindications && drug.contraindications.length > 0 
            ? Array.isArray(drug.contraindications) ? drug.contraindications : JSON.parse(drug.contraindications)
            : [""],
          interactions: drug.interactions && drug.interactions.length > 0 
            ? Array.isArray(drug.interactions) ? drug.interactions : JSON.parse(drug.interactions)
            : [""]
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch drug details",
          variant: "destructive",
        })
        router.push("/admin/content/drugs")
      }
    } catch (error) {
      console.error('Error fetching drug:', error)
      toast({
        title: "Error",
        description: "Failed to fetch drug details",
        variant: "destructive",
      })
      router.push("/admin/content/drugs")
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

  const handleArrayChange = (field: 'brandNames' | 'indications' | 'contraindications' | 'interactions', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: 'brandNames' | 'indications' | 'contraindications' | 'interactions') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: 'brandNames' | 'indications' | 'contraindications' | 'interactions', index: number) => {
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
        throw new Error("Drug name is required")
      }
      if (!formData.genericName.trim()) {
        throw new Error("Generic name is required")
      }
      if (!formData.drugClassId) {
        throw new Error("Drug class is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.mechanism.trim()) {
        throw new Error("Mechanism is required")
      }

      const submitData = {
        id: params.id,
        name: formData.name,
        genericName: formData.genericName,
        brandNames: formData.brandNames.filter(item => item.trim() !== ""),
        drugClassId: formData.drugClassId,
        description: formData.description,
        mechanism: formData.mechanism,
        indications: formData.indications.filter(item => item.trim() !== ""),
        dosageAdult: formData.dosageAdult,
        dosagePediatric: formData.dosagePediatric,
        dosageElderly: formData.dosageElderly,
        contraindications: formData.contraindications.filter(item => item.trim() !== ""),
        interactions: formData.interactions.filter(item => item.trim() !== "")
      }

      const response = await fetch(`/api/admin/drugs/${params.id}`, {
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
          description: "Drug updated successfully!",
        })
        router.push("/admin/content/drugs")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update drug",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update drug. Please try again.",
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
          <Link href="/admin/content/drugs" className="inline-flex items-center text-[#213874] hover:text-[#1a6ac3] mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Drugs
          </Link>
          <h1 className="text-3xl font-bold text-[#213874]">Edit Drug</h1>
          <p className="text-gray-600 mt-2">Update drug information and details</p>
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
                  <CardDescription>Essential drug identification details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Drug Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter drug name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="genericName">Generic Name *</Label>
                      <Input
                        id="genericName"
                        value={formData.genericName}
                        onChange={(e) => handleInputChange('genericName', e.target.value)}
                        placeholder="Enter generic name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drugClassId">Drug Class *</Label>
                    <Input
                      id="drugClassId"
                      value={formData.drugClassId}
                      onChange={(e) => handleInputChange('drugClassId', e.target.value)}
                      placeholder="Enter drug class ID"
                      required
                    />
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
                  <CardTitle>Contraindications</CardTitle>
                  <CardDescription>Conditions when this drug should not be used</CardDescription>
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
                  <CardTitle>Drug Interactions</CardTitle>
                  <CardDescription>Interactions with other medications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.interactions.map((interaction, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder={`Interaction ${index + 1}`}
                        value={interaction}
                        onChange={(e) => handleArrayChange('interactions', index, e.target.value)}
                      />
                      {formData.interactions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('interactions', index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('interactions')}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Interaction
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
                      value={formData.dosageAdult}
                      onChange={(e) => handleInputChange('dosageAdult', e.target.value)}
                      placeholder="e.g., 10-40 mg daily"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosagePediatric">Pediatric Dosage</Label>
                    <Input
                      id="dosagePediatric"
                      value={formData.dosagePediatric}
                      onChange={(e) => handleInputChange('dosagePediatric', e.target.value)}
                      placeholder="e.g., 0.1 mg/kg daily"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosageElderly">Elderly Dosage</Label>
                    <Input
                      id="dosageElderly"
                      value={formData.dosageElderly}
                      onChange={(e) => handleInputChange('dosageElderly', e.target.value)}
                      placeholder="e.g., Start with 5 mg daily"
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
                    <div className="text-sm space-y-1">
                      <div>Brand Names: {formData.brandNames.filter(b => b.trim()).length}</div>
                      <div>Indications: {formData.indications.filter(i => i.trim()).length}</div>
                      <div>Contraindications: {formData.contraindications.filter(c => c.trim()).length}</div>
                      <div>Interactions: {formData.interactions.filter(i => i.trim()).length}</div>
                      <div>Adult Dosage: {formData.dosageAdult || "Not set"}</div>
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
                      Update Drug
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push("/admin/content/drugs")}
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