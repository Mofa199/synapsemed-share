import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const defaultDrugs = [
  {
    id: "drug-1",
    name: "Metoprolol Succinate",
    genericName: "Metoprolol (Extended Release)",
    brandNames: ["Toprol-XL", "Betaloc"],
    drugClassId: "dc-1",
    drugClass: { name: "Beta-Adrenergic Blockers" },
    category: "Cardiovascular",
    description: "Cardioselective beta-1 adrenergic antagonist indicated for hypertension, angina, and heart failure with reduced ejection fraction (HFrEF).",
    mechanism: "Competitive antagonism of cardiac beta-1 adrenergic receptors, decreasing heart rate, myocardial contractility, and cardiac output. Reduces renin secretion.",
    indications: ["Heart Failure with Reduced Ejection Fraction (NYHA II-IV)", "Hypertension", "Chronic Stable Angina Pectoris", "Secondary Post-MI Prophylaxis"],
    dosage: {
      adult: "Initial 25-50 mg once daily PO; target heart failure maintenance dose 200 mg daily.",
      pediatric: "Safety not established in pediatric heart failure; 1 mg/kg/day for hypertension.",
      elderly: "Initiate at lower dose range (25 mg daily) and titrate slowly with pulse monitoring."
    },
    sideEffects: ["Bradycardia", "Hypotension", "Fatigue", "Bronchospasm in asthmatics", "Erectile dysfunction"],
    contraindications: ["Severe sinus bradycardia (< 45 bpm)", "Second or third-degree AV block without pacemaker", "Cardiogenic shock", "Decompensated acute heart failure"],
    interactions: ["CYP2D6 inhibitors (Fluoxetine, Paroxetine) increase metoprolol plasma levels", "Non-dihydropyridine CCBs (Verapamil, Diltiazem) risk severe bradycardia"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "drug-2",
    name: "Apixaban",
    genericName: "Apixaban",
    brandNames: ["Eliquis"],
    drugClassId: "dc-3",
    drugClass: { name: "Direct Oral Anticoagulants (DOACs)" },
    category: "Cardiovascular",
    description: "Highly selective, reversible direct Factor Xa inhibitor providing oral anticoagulation without requirement for routine INR monitoring.",
    mechanism: "Selectively inhibits both free and clot-bound Factor Xa and prothrombinase activity, decreasing thrombin generation and thrombus development.",
    indications: ["Nonvalvular Atrial Fibrillation (Stroke Prevention)", "DVT and PE Treatment & Secondary Prophylaxis", "Post-operative VTE thromboprophylaxis"],
    dosage: {
      adult: "5 mg PO twice daily. Reduce to 2.5 mg BID if patient meets ≥2 of: Age ≥80, Weight ≤60 kg, Serum Creatinine ≥1.5 mg/dL.",
      pediatric: "Not recommended for routine pediatric use without specialist pediatric hematology protocol.",
      elderly: "See dose reduction criteria (Age ≥80 combined with weight or renal impairment)."
    },
    sideEffects: ["Major bleeding (GI / Intracranial)", "Epistaxis", "Hematuria", "Anemia"],
    contraindications: ["Active pathological bleeding", "Mechanical prosthetic heart valves", "Moderate-to-severe mitral stenosis", "Severe hepatic impairment (Child-Pugh C)"],
    interactions: ["Strong dual inhibitors of CYP3A4 and P-gp (Ketoconazole, Itraconazole, Ritonavir)", "Avoid concurrent Rifampin / St. John's Wort"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "drug-3",
    name: "Lisinopril",
    genericName: "Lisinopril",
    brandNames: ["Zestril", "Prinivil"],
    drugClassId: "dc-2",
    drugClass: { name: "ACE Inhibitors" },
    category: "Cardiovascular",
    description: "Long-acting ACE inhibitor providing blood pressure reduction and cardioprotective / nephroprotective effects.",
    mechanism: "Suppresses renin-angiotensin-aldosterone system by inhibiting ACE, preventing conversion of Angiotensin I to Angiotensin II and decreasing bradykinin degradation.",
    indications: ["Essential Hypertension", "Heart Failure (NYHA II-IV)", "Acute Myocardial Infarction", "Diabetic Nephropathy"],
    dosage: {
      adult: "10-20 mg PO once daily (Hypertension); initial 2.5-5 mg daily (Heart failure); max 40 mg daily.",
      pediatric: "Age ≥6 years: 0.07 mg/kg once daily (max 5 mg).",
      elderly: "Initial 2.5-5 mg daily with monitoring of serum creatinine and potassium."
    },
    sideEffects: ["Dry persistent cough (bradykinin accumulation)", "Hyperkalemia", "Angioedema", "First-dose hypotension"],
    contraindications: ["Pregnancy (Category D / Teratogenic)", "History of ACEi-induced angioedema", "Bilateral renal artery stenosis"],
    interactions: ["Potassium-sparing diuretics (Spironolactone) and potassium supplements increase hyperkalemia risk", "NSAIDs reduce antihypertensive efficacy"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const drugClassId = searchParams.get('drugClassId')

    let dbDrugs = []
    try {
      dbDrugs = await prisma.drug.findMany({
        where: {
          ...(category && category !== 'all' ? { category } : {}),
          ...(drugClassId ? { drugClassId } : {})
        },
        orderBy: { name: 'asc' },
        include: {
          drugClass: { select: { name: true } }
        }
      })
    } catch (e) {
      console.warn("DB lookup for drugs fallback to defaults:", e)
    }

    const drugs = dbDrugs.length > 0 ? dbDrugs : (
      category && category !== 'all'
        ? defaultDrugs.filter(d => d.category.toLowerCase() === category.toLowerCase())
        : defaultDrugs
    )

    return NextResponse.json({
      success: true,
      drugs,
      data: drugs
    })
  } catch (error) {
    return NextResponse.json({
      success: true,
      drugs: defaultDrugs,
      data: defaultDrugs
    })
  }
}
