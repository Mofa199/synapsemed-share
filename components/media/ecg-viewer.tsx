"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Activity, Eye, Info, CheckCircle, Zap } from "lucide-react"

export interface ECGPreset {
  id: string
  name: string
  lead: string
  hr: number
  description: string
  pathologyHighlights: {
    label: string
    color: string
    box: string // Tailored Tailwind class for overlay positioning
    notes: string
  }[]
}

const ecgPresets: ECGPreset[] = [
  {
    id: "stemi",
    name: "Acute Anterior STEMI",
    lead: "Lead V2 – V4",
    hr: 95,
    description: "Tombstone ST-segment elevation > 2mm in precordial leads indicating acute LAD occlusion.",
    pathologyHighlights: [
      {
        label: "J-Point Elevation",
        color: "bg-red-500/20 border-red-500 text-red-700",
        box: "left-[35%] top-[25%] w-[18%] h-[40%]",
        notes: "Convex ST-segment elevation > 2mm at the J-point."
      },
      {
        label: "Reciprocal ST Depression",
        color: "bg-blue-500/20 border-blue-500 text-blue-700",
        box: "left-[70%] top-[45%] w-[15%] h-[35%]",
        notes: "Reciprocal ST depression in inferior leads (II, III, aVF)."
      }
    ]
  },
  {
    id: "afib",
    name: "Atrial Fibrillation with RVR",
    lead: "Lead II",
    hr: 130,
    description: "Irregularly irregular R-R intervals with total absence of discrete P waves.",
    pathologyHighlights: [
      {
        label: "Absent P Waves",
        color: "bg-amber-500/20 border-amber-500 text-amber-700",
        box: "left-[15%] top-[50%] w-[25%] h-[30%]",
        notes: "Fibrillatory (f) waves replace normal P waves."
      },
      {
        label: "Irregular R-R Interval",
        color: "bg-purple-500/20 border-purple-500 text-purple-700",
        box: "left-[45%] top-[15%] w-[40%] h-[35%]",
        notes: "Variable conduction through AV node creates unpredictable R-R spacing."
      }
    ]
  },
  {
    id: "hyperkalemia",
    name: "Severe Hyperkalemia (K⁺ = 7.2 mEq/L)",
    lead: "Lead V3",
    hr: 70,
    description: "Tall, narrow, symmetrical 'peaked' T waves with QRS widening.",
    pathologyHighlights: [
      {
        label: "Peaked T Waves",
        color: "bg-emerald-500/20 border-emerald-500 text-emerald-700",
        box: "left-[50%] top-[10%] w-[15%] h-[60%]",
        notes: "Symmetrical, narrow-based 'Eiffel Tower' T waves."
      }
    ]
  }
]

export function ECGViewer() {
  const [selectedPresetId, setSelectedPresetId] = useState("stemi")
  const [showAnnotations, setShowAnnotations] = useState(true)

  const activePreset = ecgPresets.find((p) => p.id === selectedPresetId) || ecgPresets[0]

  return (
    <Card className="border-gray-200 shadow-lg bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mb-1">
              Diagnostic Waveform Simulator
            </Badge>
            <CardTitle className="text-2xl text-[#213874] flex items-center gap-2">
              <Activity className="w-6 h-6 text-red-600" />
              Interactive Annotated ECG Viewer
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              High-yield electrocardiology strips with toggleable diagnostic annotations & clinical pearls.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <Switch
              id="annotations-toggle"
              checked={showAnnotations}
              onCheckedChange={setShowAnnotations}
            />
            <Label htmlFor="annotations-toggle" className="text-xs font-bold text-gray-700 cursor-pointer">
              Show Pathological Callouts
            </Label>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {ecgPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPresetId === preset.id
                  ? "bg-[#213874] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* ECG Grid Canvas Container */}
        <div className="relative w-full h-56 bg-red-950/5 rounded-xl border-2 border-red-200 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Simulated ECG Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #ef4444 1px, transparent 1px),
                linear-gradient(to bottom, #ef4444 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px"
            }}
          />

          {/* SVG Waveform Simulation */}
          <svg className="w-full h-full text-red-600 relative z-10" viewBox="0 0 500 150">
            <path
              d={
                activePreset.id === "stemi"
                  ? "M 0,75 L 50,75 L 60,65 L 70,75 L 80,75 L 90,120 L 105,10 L 120,40 L 160,40 L 180,95 L 200,75 L 250,75 L 260,65 L 270,75 L 280,75 L 290,120 L 305,10 L 320,40 L 360,40 L 380,95 L 400,75 L 500,75"
                  : activePreset.id === "afib"
                  ? "M 0,75 Q 10,72 20,78 T 40,73 L 45,120 L 52,15 L 60,85 L 65,75 Q 85,73 105,77 T 130,73 L 135,120 L 142,15 L 150,85 L 155,75 Q 185,73 215,77 L 220,120 L 227,15 L 235,85 L 240,75 L 500,75"
                  : "M 0,75 L 40,75 L 45,70 L 50,75 L 60,75 L 70,130 L 85,5 L 100,90 L 115,75 L 130,5 L 150,85 L 165,75 L 240,75 L 245,70 L 250,75 L 260,75 L 270,130 L 285,5 L 300,90 L 315,75 L 330,5 L 350,85 L 500,75"
              }
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Overlay Annotations */}
          {showAnnotations &&
            activePreset.pathologyHighlights.map((hl, idx) => (
              <div
                key={idx}
                className={`absolute rounded-lg border-2 border-dashed flex items-center justify-center ${hl.color} ${hl.box} transition-all animate-pulse`}
              >
                <span className="text-[10px] font-extrabold uppercase px-1 text-center bg-white/90 rounded shadow">
                  {hl.label}
                </span>
              </div>
            ))}

          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 z-20">
            {activePreset.lead} | HR: {activePreset.hr} bpm
          </div>
        </div>

        {/* Clinical Info & Notes */}
        <div className="bg-slate-50 p-4 rounded-xl border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[#213874] text-base">{activePreset.name}</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">{activePreset.description}</p>

          {showAnnotations && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pathology Breakdowns</span>
              {activePreset.pathologyHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900">{hl.label}: </span>
                    <span className="text-gray-600">{hl.notes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
