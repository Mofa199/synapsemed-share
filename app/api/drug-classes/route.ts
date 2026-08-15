import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const defaultDrugClasses = [
  {
    id: "dc-1",
    name: "Beta-Adrenergic Blockers",
    category: "Cardiovascular",
    description: "Inhibit beta-1 and beta-2 adrenergic receptors, reducing myocardial oxygen demand and blood pressure.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { drugs: 5 }
  },
  {
    id: "dc-2",
    name: "ACE Inhibitors",
    category: "Cardiovascular",
    description: "Block conversion of Angiotensin I to Angiotensin II, preventing vasoconstriction and aldosterone release.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { drugs: 4 }
  },
  {
    id: "dc-3",
    name: "Direct Oral Anticoagulants (DOACs)",
    category: "Cardiovascular",
    description: "Selectively inhibit Factor Xa or direct thrombin for stroke prevention in nonvalvular AF and VTE treatment.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { drugs: 4 }
  },
  {
    id: "dc-4",
    name: "Selective Serotonin Reuptake Inhibitors (SSRIs)",
    category: "Central Nervous System",
    description: "Inhibit presynaptic serotonin transporter (SERT) increasing synaptic 5-HT availability.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { drugs: 6 }
  },
  {
    id: "dc-5",
    name: "Fluoroquinolones",
    category: "Anti-Infectives",
    description: "Inhibit bacterial DNA gyrase (topoisomerase II) and topoisomerase IV preventing bacterial DNA replication.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { drugs: 3 }
  },
  {
    id: "dc-6",
    name: "Inhaled Corticosteroids (ICS)",
    category: "Respiratory",
    description: "Potent anti-inflammatory agents reducing airway hyperresponsiveness and mucosal edema in asthma & COPD.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { drugs: 4 }
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let dbClasses = []
    try {
      dbClasses = await prisma.drugClass.findMany({
        where: category && category !== 'all' ? { category } : {},
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { drugs: true } }
        }
      })
    } catch (e) {
      console.warn("DB lookup for drug classes fallback to defaults:", e)
    }

    const drugClasses = dbClasses.length > 0 ? dbClasses : (
      category && category !== 'all' 
        ? defaultDrugClasses.filter(d => d.category.toLowerCase() === category.toLowerCase())
        : defaultDrugClasses
    )

    return NextResponse.json({
      success: true,
      drugClasses,
      data: drugClasses
    })
  } catch (error) {
    return NextResponse.json({
      success: true,
      drugClasses: defaultDrugClasses,
      data: defaultDrugClasses
    })
  }
}
