"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Printer, Download, FileText, CheckCircle2, HeartHandshake } from "lucide-react"

export interface PatientHandoutData {
  title: Record<string, string>
  whatIsIt: Record<string, string>
  keySymptoms: Record<string, string>
  homeCare: Record<string, string>
  whenToReturn: Record<string, string>
}

const sampleHandout: PatientHandoutData = {
  title: {
    en: "Understanding High Blood Pressure (Hypertension)",
    sw: "Kuelewa Shinikizo la Juu la Damu (Hypertension)",
    fr: "Comprendre l'Hypertension Artérielle",
    ar: "فهم ارتفاع ضغط الدم"
  },
  whatIsIt: {
    en: "High blood pressure occurs when the force of blood against your artery walls is consistently too high. Over time, it can cause heart disease or stroke.",
    sw: "Shinikizo la juu la damu hutokea wakati nguvu ya damu dhidi ya kuta za mishipa inapokuwa juu mara kwa mara. Hii inaweza kusababisha ugonjwa wa moyo au kiharusi.",
    fr: "L'hypertension artérielle se produit lorsque la pression du sang contre les parois des artères est constamment trop élevée.",
    ar: "يحدث ارتفاع ضغط الدم عندما تكون قوة تدفق الدم ضد جدران الشرايين مرتفعة باستمرار."
  },
  keySymptoms: {
    en: "Often called 'the silent killer' because it has no symptoms. Some people may experience mild headaches, dizziness, or shortness of breath.",
    sw: "Mara nyingi huitwa 'muuaji wa kimya' kwa sababu haina dalili za wazi. Watu wengine wanaweza kupata maumivu ya kichwa au kizunguzungu.",
    fr: "Souvent appelée 'le tueur silencieux' car elle ne présente généralement aucun symptôme.",
    ar: "يُطلق عليه غالباً اسم 'القاتل الصامت' لأنه لا يسبب أعراضاً واضحة في البداية."
  },
  homeCare: {
    en: "1. Take your prescribed medication daily.\n2. Reduce salt intake in cooking.\n3. Exercise for 30 minutes daily.\n4. Avoid tobacco and excessive alcohol.",
    sw: "1. Meza dawa zako kila siku kama ulivyoagizwa.\n2. Punguza matumizi ya chumvi kwenye chakula.\n3. Fanya mazoezi kwa dakika 30 kila siku.\n4. Acha kuvuta sigara na vileo.",
    fr: "1. Prenez vos médicaments quotidiennement.\n2. Réduisez la consommation de sel.\n3. Faites 30 minutes d'exercice par jour.",
    ar: "1. تناول أدويتك الموصوفة يومياً.\n2. قلل من تناول الملح في الطعام.\n3. ممارسة الرياضة لمدة 30 دقيقة يومياً."
  },
  whenToReturn: {
    en: "Seek emergency medical care immediately if you experience severe chest pain, sudden numbness/weakness, difficulty speaking, or severe shortness of breath.",
    sw: "Tafuta huduma ya dharura mara moja ukipata maumivu makali ya kifua, kupooza kwa ghafla, au ugumu wa kupumua.",
    fr: "Consultez immédiatement en urgence en cas de douleur thoracique intense ou d'engourdissement soudain.",
    ar: "توجه إلى الطوارئ فوراً إذا شعرت بألم شديد في الصدر أو صعوبة مفاجئة في التنفس."
  }
}

export function PatientEducation() {
  const [lang, setLang] = useState<"en" | "sw" | "fr" | "ar">("en")

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <Card className="border-gray-200 shadow-lg bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600" />
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-1">
              Patient Communication & Counseling
            </Badge>
            <CardTitle className="text-2xl text-[#213874] flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
              Multilingual Patient Education Generator
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Generate 1-page printable patient discharge handouts translated into local languages.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="border-gray-300">
              <Printer className="w-4 h-4 mr-1.5" /> Print PDF
            </Button>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {[
            { code: "en", label: "English 🇬🇧" },
            { code: "sw", label: "Swahili (Kiswahili) 🇹🇿🇰🇪" },
            { code: "fr", label: "French (Français) 🇫🇷" },
            { code: "ar", label: "Arabic (العربية) 🇸🇦" },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => setLang(item.code as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                lang === item.code
                  ? "bg-[#213874] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Printable Handout Box */}
        <div className={`p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 space-y-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="border-b border-emerald-200/60 pb-4">
            <Badge className="bg-emerald-600 text-white mb-2">SynapseMed Patient Care Sheet</Badge>
            <h3 className="text-2xl font-extrabold text-[#213874]">{sampleHandout.title[lang]}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">What is this condition?</h4>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{sampleHandout.whatIsIt[lang]}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">What symptoms should I look for?</h4>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">{sampleHandout.keySymptoms[lang]}</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">Home Care Instructions</h4>
              <p className="text-sm text-gray-800 leading-relaxed font-semibold whitespace-pre-line">{sampleHandout.homeCare[lang]}</p>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-red-950">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-1">When to Return to the Hospital</h4>
              <p className="text-sm font-semibold text-red-900 leading-relaxed">{sampleHandout.whenToReturn[lang]}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
