"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, RotateCcw, AlertTriangle, ShieldCheck, Activity, Info } from "lucide-react"

export interface CalculatorCriterion {
  id: string
  label: string
  points: number
  description?: string
}

export interface CalculatorOption {
  value: number
  label: string
}

export interface CalculatorGroupSelect {
  id: string
  label: string
  options: CalculatorOption[]
}

export interface CalculatorConfig {
  id: string
  name: string
  subtitle: string
  category: string
  formula?: string
  hints?: string[]
  riskTable?: { score: string; risk: string; action: string }[]
  referenceLabValues?: { parameter: string; conventional: string; si: string }[]
  criteria?: CalculatorCriterion[]
  groupSelects?: CalculatorGroupSelect[]
  calculateRisk: (score: number, inputs?: Record<string, any>) => {
    riskLevel: "Low" | "Moderate" | "High" | "Severe"
    interpretation: string
    recommendation: string
    color: string
  }
}

export function CalculatorCard({ config }: { config: CalculatorConfig }) {
  const [selectedCriteria, setSelectedCriteria] = useState<Record<string, boolean>>({})
  const [selectValues, setSelectValues] = useState<Record<string, number>>({})

  const handleToggleCriterion = (id: string) => {
    setSelectedCriteria((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSelectChange = (id: string, val: number) => {
    setSelectValues((prev) => ({ ...prev, [id]: val }))
  }

  const handleReset = () => {
    setSelectedCriteria({})
    setSelectValues({})
  }

  // Calculate total score
  let totalScore = 0
  if (config.criteria) {
    config.criteria.forEach((c) => {
      if (selectedCriteria[c.id]) totalScore += c.points
    })
  }

  if (config.groupSelects) {
    config.groupSelects.forEach((g) => {
      totalScore += selectValues[g.id] || 0
    })
  }

  const riskInfo = config.calculateRisk(totalScore, { ...selectedCriteria, ...selectValues })

  return (
    <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500" />
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                {config.category}
              </Badge>
            </div>
            <CardTitle className="text-2xl text-[#213874] flex items-center gap-2">
              <Calculator className="w-6 h-6 text-[#1a6ac3]" />
              {config.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1 font-medium">
              {config.subtitle}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-400 hover:text-gray-700">
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Checkbox Criteria */}
        {config.criteria && config.criteria.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Clinical Criteria</h4>
            <div className="space-y-2">
              {config.criteria.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedCriteria[item.id]
                      ? "bg-blue-50/60 border-blue-300 shadow-sm"
                      : "bg-gray-50/50 border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={!!selectedCriteria[item.id]}
                      onCheckedChange={() => handleToggleCriterion(item.id)}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-bold text-[#213874]">
                    +{item.points} pt{item.points !== 1 ? "s" : ""}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Group Dropdown Selects */}
        {config.groupSelects && config.groupSelects.length > 0 && (
          <div className="space-y-4">
            {config.groupSelects.map((group) => (
              <div key={group.id} className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {group.label}
                </Label>
                <Select
                  value={selectValues[group.id] !== undefined ? String(selectValues[group.id]) : ""}
                  onValueChange={(val) => handleSelectChange(group.id, Number(val))}
                >
                  <SelectTrigger className="w-full bg-white border-gray-200">
                    <SelectValue placeholder="Select parameter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {group.options.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label} (+{opt.value} pts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        {/* Result & Interpretation Output Box */}
        <div className={`p-5 rounded-xl border ${riskInfo.color} shadow-sm space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <span className="font-bold text-lg">Total Score: {totalScore}</span>
            </div>
            <Badge className="font-bold text-sm px-3 py-0.5">
              {riskInfo.riskLevel} Risk
            </Badge>
          </div>

          <div className="space-y-1 text-sm">
            <p className="font-semibold text-gray-900">{riskInfo.interpretation}</p>
            <p className="text-gray-700 leading-relaxed font-medium">{riskInfo.recommendation}</p>
          </div>
        </div>

        {/* Clinical Explanations, Formula & Hints Section */}
        <div className="border-t border-gray-100 pt-4 space-y-4">
          {/* Formula */}
          {config.formula && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">🧮 Clinical Formula / Equation:</span>
              <code className="text-blue-900 font-mono font-semibold">{config.formula}</code>
            </div>
          )}

          {/* Clinical Risk Stratification Table */}
          {config.riskTable && config.riskTable.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">📊 Risk Stratification & Clinical Guidance</span>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs text-left text-gray-600">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Score</th>
                      <th className="px-3 py-2">Risk Category</th>
                      <th className="px-3 py-2">Clinical Action / Mortality</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {config.riskTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80">
                        <td className="px-3 py-2 font-bold text-[#213874]">{row.score}</td>
                        <td className="px-3 py-2 font-semibold">{row.risk}</td>
                        <td className="px-3 py-2">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hints & Clinical Pearls */}
          {config.hints && config.hints.length > 0 && (
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1.5">
              <span className="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600" /> Clinical Hints & High-Yield Exam Notes:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-amber-900 font-medium">
                {config.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reference Lab Values (Conventional vs SI) */}
          {config.referenceLabValues && config.referenceLabValues.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">🧪 Reference Lab Values & Unit Conversions</span>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2">Test / Parameter</th>
                      <th className="px-3 py-2">Conventional Unit (US)</th>
                      <th className="px-3 py-2">SI Unit (International)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    {config.referenceLabValues.map((lab, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-bold text-gray-800">{lab.parameter}</td>
                        <td className="px-3 py-2 font-mono text-blue-700">{lab.conventional}</td>
                        <td className="px-3 py-2 font-mono text-emerald-700">{lab.si}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
