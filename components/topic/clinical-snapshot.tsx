"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Clock, Activity, Users, Baby, Thermometer, ShieldAlert } from "lucide-react"

interface ClinicalSnapshotProps {
  definition?: string
  epidemiology?: string
  topicType?: string
  difficulty?: string
}

export function ClinicalSnapshot({ definition, epidemiology, topicType, difficulty }: ClinicalSnapshotProps) {
  // Extract a one-sentence summary from definition (very crude approach for demonstration)
  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '')
  const cleanDef = definition ? stripHtml(definition).trim() : "No definition provided."
  const oneSentenceSummary = cleanDef.split('.')[0] + (cleanDef.includes('.') ? '.' : '')

  return (
    <Card className="border-blue-100 shadow-md bg-white overflow-hidden mb-8">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      <CardHeader className="bg-blue-50/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-[#213874] flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Quick Snapshot
          </CardTitle>
          <div className="flex gap-2">
            {difficulty === 'ADVANCED' && (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">
                <AlertCircle className="w-3 h-3 mr-1" />
                Advanced
              </Badge>
            )}
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
              <Thermometer className="w-3 h-3 mr-1" />
              Common
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">
              <ShieldAlert className="w-3 h-3 mr-1" />
              High Yield
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Definition</h4>
            <p className="text-lg text-[#213874] font-medium leading-relaxed">
              {oneSentenceSummary}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Emergency?
              </div>
              <div className="font-semibold text-gray-700">Depends on severity</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> Common Sex
              </div>
              <div className="font-semibold text-gray-700">Equal</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Peak Age
              </div>
              <div className="font-semibold text-gray-700">Variable</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Baby className="w-3 h-3" /> Pediatric?
              </div>
              <div className="font-semibold text-gray-700">Possible</div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100/50 flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-bold text-lg">!</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">Clinical Pearl</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Always consider the most life-threatening differential first. Early diagnosis and prompt intervention significantly improve outcomes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
