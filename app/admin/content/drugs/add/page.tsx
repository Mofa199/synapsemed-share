"use client"

import { useState, useEffect } from "react"
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
  
  const [drugClasses, setDrugClasses] = useState<{id: string, name: string}[]>([])
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    brandNames: [""],
    drugClassId: "",
    category: "",
    description: "",
    mechanism: "",
    indications: [""],
    dosageAdult: "",
    dosagePediatric: "",
    dosageElderly: "",
    contraindications: [""],
    warnings: [""],
    sideEffectsCommon: [""],
    sideEffectsSerious: [""],
    sideEffectsRare: [""],
    interactions: [""],
    monitoring: [""]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchDrugClasses()
  }, [])

  const fetchDrugClasses = async () => {
    try {
      const res = await fetch('/api/admin/drug-classes')
      const data = await res.json()
      if (data.success) {
        setDrugClasses(data.data)
      }
    } catch (e) {
      console.error("Failed to fetch drug classes", e)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  type ArrayField = 'brandNames' | 'indications' | 'contraindications' | 'warnings' | 'sideEffectsCommon' | 'sideEffectsSerious' | 'sideEffectsRare' | 'interactions' | 'monitoring'

  const handleArrayChange = (field: ArrayField, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: ArrayField) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field: ArrayField, index: number) => {
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
      if (!formData.name.trim()) throw new Error("Drug name is required")
      if (!formData.drugClassId) throw new Error("Drug class is required")

      const submitData = {
        ...formData,
        brandNames: formData.brandNames.filter(i => i.trim() !== ""),
        indications: formData.indications.filter(i => i.trim() !== ""),
        contraindications: formData.contraindications.filter(i => i.trim() !== ""),
        warnings: formData.warnings.filter(i => i.trim() !== ""),
        sideEffectsCommon: formData.sideEffectsCommon.filter(i => i.trim() !== ""),
        sideEffectsSerious: formData.sideEffectsSerious.filter(i => i.trim() !== ""),
        sideEffectsRare: formData.sideEffectsRare.filter(i => i.trim() !== ""),
        interactions: formData.interactions.filter(i => i.trim() !== ""),
        monitoring: formData.monitoring.filter(i => i.trim() !== "")
      }

      const response = await fetch('/api/admin/drugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        toast({ title: "Success", description: "Drug created successfully" })
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

  if (user?.role !== "SUPER_ADMIN") return null

  const renderArrayField = (field: ArrayField, title: string, placeholder: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {formData[field].map((item, index) => (
          <div key={index} className="flex gap-3">
            <Input
              placeholder={`${placeholder} ${index + 1}`}
              value={item}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
            />
            {formData[field].length > 1 && (
              <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem(field, index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => addArrayItem(field)} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add {placeholder}
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
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
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Drug Name *</Label>
                      <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Generic Name *</Label>
                      <Input value={formData.genericName} onChange={(e) => handleInputChange('genericName', e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Drug Class *</Label>
                      <Select value={formData.drugClassId} onValueChange={(v) => handleInputChange('drugClassId', v)} required>
                        <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                        <SelectContent>
                          {drugClasses.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Autonomic Nervous System">Autonomic Nervous System</SelectItem>
                          <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                          <SelectItem value="Central Nervous System">Central Nervous System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={3} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Mechanism of Action *</Label>
                    <Textarea value={formData.mechanism} onChange={(e) => handleInputChange('mechanism', e.target.value)} rows={3} required />
                  </div>
                </CardContent>
              </Card>

              {renderArrayField('brandNames', 'Brand Names', 'Brand Name')}
              {renderArrayField('indications', 'Indications', 'Indication')}
              {renderArrayField('contraindications', 'Contraindications', 'Contraindication')}
              {renderArrayField('warnings', 'Warnings & Precautions', 'Warning')}
              {renderArrayField('sideEffectsCommon', 'Common Side Effects', 'Side Effect')}
              {renderArrayField('sideEffectsSerious', 'Serious Side Effects', 'Side Effect')}
              {renderArrayField('sideEffectsRare', 'Rare Side Effects', 'Side Effect')}
              {renderArrayField('interactions', 'Drug Interactions', 'Interaction')}
              {renderArrayField('monitoring', 'Monitoring Parameters', 'Parameter')}

              <Card>
                <CardHeader>
                  <CardTitle>Dosage Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Adult Dosage</Label>
                    <Input value={formData.dosageAdult} onChange={(e) => handleInputChange('dosageAdult', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Pediatric Dosage</Label>
                    <Input value={formData.dosagePediatric} onChange={(e) => handleInputChange('dosagePediatric', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Elderly Dosage</Label>
                    <Input value={formData.dosageElderly} onChange={(e) => handleInputChange('dosageElderly', e.target.value)} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[#213874]">{formData.name || "Drug Name"}</h4>
                      <p className="text-sm text-gray-600">{formData.genericName || "Generic Name"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="bg-[#213874]" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" /> {isSubmitting ? "Saving..." : "Add Drug"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  <X className="w-4 h-4 mr-2" /> Cancel
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