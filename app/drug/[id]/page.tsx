"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Pill, 
  BookOpen, 
  FileText, 
  Video, 
  Heart, 
  Brain, 
  Zap, 
  Activity, 
  Eye, 
  Ear, 
  Stethoscope, 
  Baby, 
  Shield, 
  Radio, 
  Droplets, 
  Sun,
  ArrowLeft,
  Download,
  Star,
  Filter
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data for drugs
const drugsData = [
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    brandNames: ["Amoxil", "Moxatag", "Trimox"],
    drugClass: "Penicillin",
    category: "Anti-infectives",
    description: "A penicillin antibiotic used to treat a wide variety of bacterial infections.",
    mechanism: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins.",
    indications: [
      "Respiratory tract infections",
      "Skin and soft tissue infections",
      "Urinary tract infections",
      "Helicobacter pylori eradication (in combination therapy)"
    ],
    dosage: {
      adult: "250-500mg every 8 hours",
      pediatric: "20-40mg/kg/day divided every 8 hours",
      elderly: "Same as adult, with renal adjustment if needed"
    },
    administrationRoute: "Oral",
    administrationTiming: "With or without food",
    administrationInstructions: "Take at regular intervals. Complete the full course even if symptoms improve.",
    contraindications: [
      "Documented hypersensitivity to penicillins",
      "History of severe allergic reactions to beta-lactam antibiotics"
    ],
    warnings: [
      "May cause severe allergic reactions",
      "Prolonged use may result in overgrowth of non-susceptible organisms"
    ],
    sideEffectsCommon: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Rash"
    ],
    sideEffectsSerious: [
      "Severe allergic reactions (anaphylaxis)",
      "Stevens-Johnson syndrome",
      "Toxic epidermal necrolysis",
      "Pseudomembranous colitis"
    ],
    sideEffectsRare: [
      "Hepatotoxicity",
      "Renal dysfunction",
      "Blood dyscrasias"
    ],
    interactions: [
      "Probenecid: Increases amoxicillin levels",
      "Oral contraceptives: May reduce effectiveness",
      "Methotrexate: Increases methotrexate toxicity"
    ],
    monitoring: [
      "Signs of allergic reactions",
      "Complete blood count (prolonged therapy)",
      "Liver function tests (if hepatotoxicity suspected)"
    ],
    storage: "Store at room temperature away from moisture and heat",
    pregnancy: "Pregnancy Category B: Generally considered safe during pregnancy",
    absorption: "Well absorbed orally, approximately 74-92%",
    distribution: "Distributed throughout most body tissues and fluids",
    metabolism: "Minimal hepatic metabolism",
    elimination: "Primarily excreted unchanged in urine",
    halfLife: "1-1.3 hours (adults), longer in neonates and patients with renal impairment"
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    brandNames: ["Advil", "Motrin", "Nurofen"],
    drugClass: "NSAID",
    category: "Central Nervous System",
    description: "A nonsteroidal anti-inflammatory drug (NSAID) used for pain relief, reducing inflammation, and lowering fever.",
    mechanism: "Inhibits cyclooxygenase (COX) enzymes, reducing prostaglandin synthesis.",
    indications: [
      "Pain relief (headache, dental pain, menstrual cramps)",
      "Inflammation reduction",
      "Fever reduction",
      "Rheumatoid arthritis",
      "Osteoarthritis"
    ],
    dosage: {
      adult: "200-400mg every 4-6 hours as needed",
      pediatric: "5-10mg/kg every 6-8 hours",
      elderly: "Lower doses may be needed due to increased risk of adverse effects"
    },
    administrationRoute: "Oral",
    administrationTiming: "With food or milk to reduce GI irritation",
    administrationInstructions: "Take with food or milk. Do not exceed maximum daily dose.",
    contraindications: [
      "Documented hypersensitivity to NSAIDs",
      "History of asthma, rhinitis, or urticaria related to aspirin or other NSAIDs",
      "Active peptic ulcer disease or GI bleeding",
      "Severe heart failure",
      "Severe hepatic impairment",
      "Severe renal impairment",
      "Third trimester of pregnancy"
    ],
    warnings: [
      "Increased risk of serious cardiovascular thrombotic events",
      "Increased risk of serious GI adverse events",
      "Hepatotoxicity",
      "Renal toxicity"
    ],
    sideEffectsCommon: [
      "Heartburn",
      "Nausea",
      "Abdominal pain",
      "Diarrhea",
      "Headache"
    ],
    sideEffectsSerious: [
      "GI bleeding, ulceration, and perforation",
      "Cardiovascular thrombotic events (MI, stroke)",
      "Hepatotoxicity",
      "Renal injury",
      "Severe skin reactions"
    ],
    sideEffectsRare: [
      "Aseptic meningitis",
      "Hematologic toxicity",
      "Hypersensitivity reactions"
    ],
    interactions: [
      "Anticoagulants: Increased bleeding risk",
      "ACE inhibitors: Reduced antihypertensive effect",
      "Diuretics: Reduced diuretic effect",
      "Lithium: Increased lithium levels",
      "Methotrexate: Increased methotrexate toxicity"
    ],
    monitoring: [
      "Blood pressure",
      "Signs of GI bleeding",
      "Liver function tests",
      "Renal function",
      "Complete blood count"
    ],
    storage: "Store at controlled room temperature",
    pregnancy: "Pregnancy Category C (first and second trimesters), D (third trimester)",
    absorption: "Rapidly absorbed from GI tract",
    distribution: "Distributed into synovial fluid, crosses placenta",
    metabolism: "Extensively metabolized in liver",
    elimination: "Renal elimination of metabolites",
    halfLife: "1.8-2 hours"
  }
]

export default function DrugPage() {
  const params = useParams()
  const [drug, setDrug] = useState<any>(null)

  useEffect(() => {
    if (params.id) {
      const foundDrug = drugsData.find(d => d.id === params.id)
      setDrug(foundDrug)
    }
  }, [params.id])

  if (!drug) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Drug Not Found</h1>
            <p className="text-gray-600 mb-6">The requested drug information could not be found.</p>
            <Button asChild>
              <Link href="/pharmacology">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pharmacology
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Get icon for drug class based on category
  const getClassIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiovascular':
      case 'autonomic nervous system':
        return Heart
      case 'central nervous system':
      case 'neurology':
        return Brain
      case 'respiratory':
        return Activity
      case 'gastrointestinal':
        return Eye
      case 'endocrine':
        return Droplets
      case 'anti-infectives':
        return Shield
      case 'oncology':
        return Radio
      case 'dermatology':
        return Sun
      case 'immunology':
        return Shield
      default:
        return Pill
    }
  }

  // Get color for drug class based on category
  const getClassColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiovascular':
      case 'autonomic nervous system':
        return 'text-red-600'
      case 'central nervous system':
      case 'neurology':
        return 'text-purple-600'
      case 'respiratory':
        return 'text-blue-600'
      case 'gastrointestinal':
        return 'text-green-600'
      case 'endocrine':
        return 'text-yellow-600'
      case 'anti-infectives':
        return 'text-indigo-600'
      case 'oncology':
        return 'text-pink-600'
      case 'dermatology':
        return 'text-orange-600'
      case 'immunology':
        return 'text-teal-600'
      default:
        return 'text-gray-600'
    }
  }

  const ClassIcon = getClassIcon(drug.category)
  const classColor = getClassColor(drug.category)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/pharmacology">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pharmacology
            </Link>
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center`}>
              <ClassIcon className={`w-8 h-8 ${classColor}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#213874]">{drug.name}</h1>
              <p className="text-gray-600">{drug.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge>{drug.drugClass}</Badge>
                <Badge variant="outline">{drug.category}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Drug Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Generic Name</h3>
                  <p className="text-gray-700">{drug.genericName}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Brand Names</h3>
                  <div className="flex flex-wrap gap-2">
                    {drug.brandNames.map((brand: string, index: number) => (
                      <Badge key={index} variant="secondary">{brand}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Mechanism of Action</h3>
                  <p className="text-gray-700">{drug.mechanism}</p>
                </div>
              </CardContent>
            </Card>

            {/* Indications */}
            <Card>
              <CardHeader>
                <CardTitle>Indications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {drug.indications.map((indication: string, index: number) => (
                    <li key={index} className="text-gray-700">{indication}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Dosage */}
            <Card>
              <CardHeader>
                <CardTitle>Dosage Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Adult</h3>
                    <p className="text-gray-700">{drug.dosage.adult}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Pediatric</h3>
                    <p className="text-gray-700">{drug.dosage.pediatric}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Elderly</h3>
                    <p className="text-gray-700">{drug.dosage.elderly}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Administration */}
            <Card>
              <CardHeader>
                <CardTitle>Administration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Route</h3>
                  <p className="text-gray-700">{drug.administrationRoute}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Timing</h3>
                  <p className="text-gray-700">{drug.administrationTiming}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Instructions</h3>
                  <p className="text-gray-700">{drug.administrationInstructions}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contraindications */}
            <Card>
              <CardHeader>
                <CardTitle>Contraindications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {drug.contraindications.map((contraindication: string, index: number) => (
                    <li key={index} className="text-gray-700">{contraindication}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Warnings */}
            <Card>
              <CardHeader>
                <CardTitle>Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {drug.warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-gray-700">{warning}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Side Effects */}
            <Card>
              <CardHeader>
                <CardTitle>Side Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Common</h3>
                  <div className="flex flex-wrap gap-2">
                    {drug.sideEffectsCommon.map((effect: string, index: number) => (
                      <Badge key={index} variant="outline">{effect}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Serious</h3>
                  <div className="flex flex-wrap gap-2">
                    {drug.sideEffectsSerious.map((effect: string, index: number) => (
                      <Badge key={index} variant="destructive">{effect}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Rare</h3>
                  <div className="flex flex-wrap gap-2">
                    {drug.sideEffectsRare.map((effect: string, index: number) => (
                      <Badge key={index} variant="secondary">{effect}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Drug Interactions */}
            <Card>
              <CardHeader>
                <CardTitle>Drug Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {drug.interactions.map((interaction: string, index: number) => (
                    <li key={index} className="text-gray-700">{interaction}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {drug.monitoring.map((parameter: string, index: number) => (
                    <li key={index} className="text-gray-700">{parameter}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Storage</h3>
                  <p className="text-gray-700">{drug.storage}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Pregnancy</h3>
                  <p className="text-gray-700">{drug.pregnancy}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Absorption</h3>
                    <p className="text-gray-700">{drug.absorption}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Distribution</h3>
                    <p className="text-gray-700">{drug.distribution}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Metabolism</h3>
                    <p className="text-gray-700">{drug.metabolism}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Elimination</h3>
                    <p className="text-gray-700">{drug.elimination}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Half-Life</h3>
                  <p className="text-gray-700">{drug.halfLife}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Drug Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drug Class</span>
                    <span className="font-semibold">{drug.drugClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Therapeutic Area</span>
                    <span className="font-semibold">{drug.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Indications</span>
                    <span className="font-semibold">{drug.indications.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Common Side Effects</span>
                    <span className="font-semibold">{drug.sideEffectsCommon.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Drugs */}
            <Card>
              <CardHeader>
                <CardTitle>Related Drugs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    Amoxicillin/Clavulanate
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Ampicillin
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Penicillin V
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Study Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Study Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Textbook Reference
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <Video className="h-4 w-4 mr-2" />
                      Video Explanation
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="#">
                      <Filter className="h-4 w-4 mr-2" />
                      Practice Questions
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Download Options */}
            <Card>
              <CardHeader>
                <CardTitle>Download Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Drug Monograph (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Flashcards (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Summary Notes (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AIHelper />
    </div>
  )
}