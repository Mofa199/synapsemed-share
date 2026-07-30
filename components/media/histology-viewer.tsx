"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Microscope, Eye, ZoomIn, Info, CheckCircle2 } from "lucide-react"

export interface HistologySlide {
  id: string
  title: string
  organ: string
  stain: string
  description: string
  normalFeatures: string
  abnormalFeatures: string
  hotspots: {
    x: number // percentage position
    y: number
    title: string
    detail: string
  }[]
}

const histologySlides: HistologySlide[] = [
  {
    id: "tb_granuloma",
    title: "Caseating Granuloma (Tuberculosis)",
    organ: "Lung Tissue",
    stain: "H&E Stain",
    description: "Central caseous necrosis surrounded by Langhans giant cells, epithelioid histiocytes, and a peripheral lymphocyte rim.",
    normalFeatures: "Thin-walled alveoli lined by Type I & II pneumocytes with clear alveolar spaces.",
    abnormalFeatures: "Loss of alveolar architecture with eosinophilic acellular necrotic core.",
    hotspots: [
      { x: 50, y: 50, title: "Caseous Necrosis", detail: "Acellular, pink, structureless necrotic debris in center." },
      { x: 30, y: 40, title: "Langhans Giant Cell", detail: "Horseshoe arrangement of nuclei in multinucleated giant cell." },
      { x: 70, y: 65, title: "Lymphocytic Rim", detail: "Dense dark blue mononuclear infiltrate providing immune wall-off." }
    ]
  },
  {
    id: "appendicitis",
    title: "Acute Appendicitis",
    organ: "Appendix",
    stain: "H&E Stain",
    description: "Dense neutrophilic infiltration traversing the muscularis propria with mucosal ulceration.",
    normalFeatures: "Intact columnar epithelium with abundant goblet cells and lymphoid follicles in submucosa.",
    abnormalFeatures: "Transmural neutrophilic infiltration with focal luminal suppuration.",
    hotspots: [
      { x: 40, y: 35, title: "Neutrophilic Infiltrate", detail: "Multilobated polymorphonuclear cells invading the muscularis layer." },
      { x: 60, y: 70, title: "Mucosal Ulceration", detail: "Disruption of epithelial lining with fibrinopurulent exudate." }
    ]
  }
]

export function HistologyViewer() {
  const [selectedSlideId, setSelectedSlideId] = useState("tb_granuloma")
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"pathological" | "normal">("pathological")

  const slide = histologySlides.find((s) => s.id === selectedSlideId) || histologySlides[0]

  return (
    <Card className="border-gray-200 shadow-lg bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600" />
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mb-1">
              Digital Microscopy Simulator
            </Badge>
            <CardTitle className="text-2xl text-[#213874] flex items-center gap-2">
              <Microscope className="w-6 h-6 text-purple-600" />
              Interactive Histology Viewer
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Inspect virtual pathology slides, compare normal vs. diseased tissue, and explore cellular hotspots.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("pathological")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "pathological" ? "bg-white text-purple-900 shadow-sm" : "text-gray-600"
              }`}
            >
              Pathology
            </button>
            <button
              onClick={() => setViewMode("normal")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "normal" ? "bg-white text-blue-900 shadow-sm" : "text-gray-600"
              }`}
            >
              Normal Control
            </button>
          </div>
        </div>

        {/* Slide Selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {histologySlides.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedSlideId(item.id)
                setSelectedHotspot(null)
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSlideId === item.id
                  ? "bg-[#213874] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Virtual Microscope Slide Stage */}
        <div className="relative w-full h-72 rounded-2xl border-2 border-purple-200 overflow-hidden shadow-inner bg-purple-950/20 flex items-center justify-center">
          {/* Simulated Slide Canvas */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
              viewMode === "pathological"
                ? "bg-gradient-to-br from-pink-900/40 via-purple-900/40 to-indigo-900/50"
                : "bg-gradient-to-br from-blue-900/30 via-teal-900/30 to-slate-900/40"
            }`}
          />

          {/* Microscopic Cell Texture Overlay */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #a855f7 2px, transparent 2px)`,
              backgroundSize: "24px 24px"
            }}
          />

          {/* Hotspot Indicators */}
          {viewMode === "pathological" &&
            slide.hotspots.map((hs, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedHotspot(idx)}
                style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-300 ${
                  selectedHotspot === idx
                    ? "bg-purple-600 text-white ring-4 ring-purple-300 scale-125 z-30"
                    : "bg-white text-purple-900 hover:scale-110 z-20"
                }`}
              >
                {idx + 1}
              </button>
            ))}

          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 z-20">
            {slide.organ} ({slide.stain}) | Mode: {viewMode.toUpperCase()}
          </div>
        </div>

        {/* Selected Hotspot Detail Box */}
        {selectedHotspot !== null && viewMode === "pathological" && (
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 space-y-1 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-purple-900 flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-purple-600" />
                Hotspot #{selectedHotspot + 1}: {slide.hotspots[selectedHotspot].title}
              </span>
              <button onClick={() => setSelectedHotspot(null)} className="text-xs text-purple-600 font-bold hover:underline">
                Close
              </button>
            </div>
            <p className="text-xs text-purple-800 font-medium leading-relaxed">
              {slide.hotspots[selectedHotspot].detail}
            </p>
          </div>
        )}

        {/* Slide Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-gray-200/80 space-y-2">
          <h4 className="font-bold text-[#213874] text-base">{slide.title}</h4>
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            {viewMode === "pathological" ? slide.abnormalFeatures : slide.normalFeatures}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
