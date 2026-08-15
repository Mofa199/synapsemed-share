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
import { RichTextEditor } from "@/components/rich-text-editor"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { BookOpen, Save, ArrowLeft, Eye, Edit3 } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PremiumDiseaseViewer } from "@/components/topic/premium-disease-viewer"
import { CurriculumModuleSelect } from "@/components/curriculum-module-select"

export default function AddTopicPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "article",
    difficulty: "beginner",
    duration: "",
    category: "",
    tags: "",
    curriculumId: "",
    moduleId: "",
    isPublished: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user?.role !== "SUPER_ADMIN" && user?.role !== "LECTURER" && user?.role !== "EDITOR") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
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

  const loadDiseaseTemplate = () => {
    const template = `
      <h3>Definition</h3><p></p>
      <h3>Epidemiology</h3><p></p>
      <h3>Anatomy & Physiology</h3><p></p>
      <h3>Pathophysiology</h3><p></p>
      <h3>Risk Factors</h3><p></p>
      <h3>Etiology</h3><p></p>
      <h3>Clinical Features</h3><p></p>
      <h3>Red Flags</h3><p></p>
      <h3>Differential Diagnosis</h3><p></p>
      <h3>Investigations</h3><p></p>
      <h3>Diagnostic Criteria</h3><p></p>
      <h3>Management (Emergency, Medical, Surgical)</h3><p></p>
      <h3>Drug Therapy</h3><p></p>
      <h3>Complications</h3><p></p>
      <h3>Prognosis</h3><p></p>
      <h3>Clinical Pearls</h3><p></p>
      <h3>OSCE Checklist</h3><p></p>
      <h3>Viva Questions</h3><p></p>
      <h3>SBA/MCQs</h3><p></p>
    `
    handleInputChange('content', template)
    toast({ title: "Clinical Template Loaded", description: "Standard disease structure template loaded." })
  }

  const loadAnatomyTemplate = () => {
    const template = `
      <h3>Gross Anatomy & Location</h3><p>Anatomical boundaries, orientation, and spatial relations.</p>
      <h3>Relations & Boundaries</h3><p>Anterior, posterior, superior, inferior, medial, and lateral relations.</p>
      <h3>Neurovascular Supply</h3><p>Arterial supply, venous drainage, lymphatic drainage, and somatic/autonomic innervation.</p>
      <h3>Histology & Microscopic Structure</h3><p>Epithelium, cellular layers, staining characteristics, and microscopic functional units.</p>
      <h3>Embryological Origin & Development</h3><p>Germ layer derivative, key developmental milestones, and congenital anomalies.</p>
      <h3>Clinical & Surgical Anatomy</h3><p>Surgical landmarks, planes of dissection, vulnerability during operations, and fascial compartments.</p>
      <h3>OSCE Spotters & Prosection Landmarks</h3><p>High-yield pin targets, anatomical variations, and cadaveric identifiers.</p>
      <h3>High-Yield Clinical Pearls</h3><p>Key board exam mnemonics and clinical correlations (e.g. nerve injury signs).</p>
      <h3>Viva Questions & Flashcards</h3><p></p>
    `
    handleInputChange('content', template)
    handleInputChange('category', 'Anatomy')
    toast({ title: "Anatomy Template Loaded", description: "High-yield anatomy & histology structure loaded." })
  }

  const loadPhysiologyTemplate = () => {
    const template = `
      <h3>Physiological Principle & Function</h3><p>Core physiological role in maintaining systemic homeostasis.</p>
      <h3>Cellular Mechanism & Transport</h3><p>Receptors, secondary messengers, ion channels, and transmembrane potential.</p>
      <h3>Regulation & Feedback Loops</h3><p>Negative/positive feedback pathways, hormonal axes, and autonomic reflexes.</p>
      <h3>Organ-System Integration</h3><p>Cardiorespiratory, renal, neuroendocrine, and metabolic interactions.</p>
      <h3>Pathophysiological Derangements</h3><p>What happens when regulatory mechanisms fail (disease states).</p>
      <h3>High-Yield Graphs, Equations & Lab Values</h3><p>Standard curves (e.g. dissociation curves, PV loops), normal reference ranges, and key formulas.</p>
      <h3>Pharmacology & Clinical Links</h3><p>Receptor agonists/antagonists, drug targets, and diagnostic functional tests.</p>
      <h3>Viva Questions & Flashcards</h3><p></p>
    `
    handleInputChange('content', template)
    handleInputChange('category', 'Physiology')
    toast({ title: "Physiology Template Loaded", description: "Comprehensive physiology & mechanisms structure loaded." })
  }

  const loadPharmacologyTemplate = () => {
    const template = `
      <h3>Drug Classification & Chemical Class</h3><p></p>
      <h3>Mechanism of Action (MOA)</h3><p>Specific molecular target, enzyme/receptor binding, downstream cellular cascades.</p>
      <h3>Pharmacokinetics (ADME)</h3><p>Absorption/bioavailability, Distribution/protein binding, Metabolism (CYP450), Excretion (Renal/Hepatic).</p>
      <h3>Clinical Indications & Guidelines</h3><p>First-line vs second-line therapies, labeled uses, and off-label evidence.</p>
      <h3>Dosage & Administration</h3><p>Standard adult, pediatric, elderly, and renal/hepatic dose adjustments.</p>
      <h3>Adverse Drug Reactions & Black Box Warnings</h3><p>Common side effects, dose-limiting toxicities, and warning signs.</p>
      <h3>Contraindications & Drug Interactions</h3><p>Absolute/relative contraindications, CYP interactions, and additive toxicity risks.</p>
      <h3>High-Yield Prescribing Pearls</h3><p>Monitoring parameters, reversal agents/antidotes, and board exam associations.</p>
    `
    handleInputChange('content', template)
    handleInputChange('category', 'Pharmacology')
    toast({ title: "Pharmacology Template Loaded", description: "Complete drug monograph template loaded." })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.title.trim()) {
        throw new Error("Topic title is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.content.trim()) {
        throw new Error("Content is required")
      }
      if (!formData.difficulty) {
        throw new Error("Difficulty level is required")
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        type: formData.type.toUpperCase(),
        difficulty: formData.difficulty.toUpperCase(),
        duration: formData.duration || '',
        category: formData.category || '',
        moduleId: formData.moduleId || null,
        curriculumId: formData.curriculumId || null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPublished: formData.isPublished
      }

      const response = await fetch('/api/admin/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Topic created successfully",
        })
        router.push("/admin/content/topics")
      } else {
        throw new Error(data.error || 'Failed to create topic')
      }
    } catch (error) {
      console.error('Error creating topic:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create topic",
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
            <span className="text-[#213874] font-medium">Add Topic</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#213874]">Add New Topic</h1>
                <p className="text-gray-600">Create a new learning topic</p>
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
                  <CardTitle>Topic Information</CardTitle>
                  <CardDescription>Basic details about the topic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Topic Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Introduction to Cardiology"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the topic..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <CurriculumModuleSelect
                    curriculumId={formData.curriculumId}
                    moduleId={formData.moduleId}
                    onCurriculumChange={(val) => handleInputChange('curriculumId', val)}
                    onModuleChange={(val) => handleInputChange('moduleId', val)}
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Content Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="interactive">Interactive</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                        </SelectContent>
                      </Select>
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
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 30 min"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                      />
                    </div>
                  </div>

                  <Tabs defaultValue="editor" className="w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <TabsList className="bg-gray-100 p-1 rounded-xl">
                        <TabsTrigger value="editor" className="rounded-lg gap-2 text-xs font-bold">
                          <Edit3 className="w-3.5 h-3.5" /> Content Editor
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="rounded-lg gap-2 text-xs font-bold text-primary">
                          <Eye className="w-3.5 h-3.5" /> Live Premium Student Preview
                        </TabsTrigger>
                      </TabsList>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Load Template:</span>
                        <Button type="button" variant="outline" size="sm" onClick={loadDiseaseTemplate} className="h-7 text-xs font-semibold px-2.5">
                          🩺 Clinical
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={loadAnatomyTemplate} className="h-7 text-xs font-semibold px-2.5 bg-blue-50/50 text-blue-700 border-blue-200">
                          🦴 Anatomy
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={loadPhysiologyTemplate} className="h-7 text-xs font-semibold px-2.5 bg-emerald-50/50 text-emerald-700 border-emerald-200">
                          ⚡ Physiology
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={loadPharmacologyTemplate} className="h-7 text-xs font-semibold px-2.5 bg-purple-50/50 text-purple-700 border-purple-200">
                          💊 Pharmacology
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="editor" className="mt-0">
                      <RichTextEditor
                        value={formData.content}
                        onChange={(value) => handleInputChange('content', value)}
                        placeholder="Main content of the topic..."
                        className="min-h-[350px]"
                      />
                    </TabsContent>

                    <TabsContent value="preview" className="mt-0 border rounded-2xl p-4 bg-gray-50/50">
                      <div className="mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Interactive Student View Preview
                      </div>
                      <PremiumDiseaseViewer
                        topic={{
                          id: "preview-id",
                          title: formData.title || "Untitled Medical Topic",
                          description: formData.description || "Topic description preview...",
                          content: formData.content || "<h3>Definition</h3><p>Enter topic content to preview here...</p>",
                          type: formData.type.toUpperCase(),
                          difficulty: formData.difficulty.toUpperCase() as any,
                          duration: formData.duration || "30 min",
                          isPublished: formData.isPublished,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          category: formData.category || "General Medicine"
                        }}
                      />
                    </TabsContent>
                  </Tabs>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Cardiology"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        placeholder="anatomy, heart (comma separated)"
                        value={formData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>Control topic availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="publish" className="cursor-pointer">
                      <span className="font-medium">Published</span>
                      <p className="text-sm text-gray-600">Make this topic available</p>
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
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Creating..." : "Create Topic"}
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
