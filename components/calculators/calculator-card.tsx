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
  category: "Cardiology" | "Pulmonology" | "Neurology" | "Critical Care" | "Hepatology"
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
      </CardContent>
    </Card>
  )
}
