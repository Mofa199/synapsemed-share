"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Flame, Award, Zap, TrendingUp, ShieldCheck } from "lucide-react"

export interface LeaderboardUser {
  rank: number
  name: string
  avatar?: string
  school: string
  xp: number
  streak: number
  osceScore: number
}

const sampleLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Dr. Amina Hassan", school: "MUHAS (Tanzania)", xp: 2450, streak: 14, osceScore: 98 },
  { rank: 2, name: "Kevin Ochieng", school: "University of Nairobi (Kenya)", xp: 2180, streak: 11, osceScore: 94 },
  { rank: 3, name: "Sarah Al-Mansoor", school: "Makerere University (Uganda)", xp: 1950, streak: 9, osceScore: 92 },
  { rank: 4, name: "You (Student)", school: "SynapseMed Academy", xp: 1820, streak: 5, osceScore: 88 },
  { rank: 5, name: "David Botha", school: "UCT (South Africa)", xp: 1640, streak: 7, osceScore: 86 },
]

export function ClinicalLeaderboard() {
  return (
    <Card className="border-gray-200 shadow-lg bg-white overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
      <CardHeader className="bg-slate-50/50 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mb-1">
              Weekly Medical League
            </Badge>
            <CardTitle className="text-2xl text-[#213874] flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Clinical Mastery Leaderboard
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Compete with medical students across cohorts based on XP, OSCE practical scores, and streaks.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-3">
        {sampleLeaderboard.map((student) => {
          const isCurrentUser = student.name.includes("You")

          return (
            <div
              key={student.rank}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                isCurrentUser
                  ? "bg-amber-50/80 border-amber-300 shadow-md ring-2 ring-amber-200"
                  : "bg-gray-50/50 border-gray-100 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    student.rank === 1
                      ? "bg-amber-500 text-white shadow-md"
                      : student.rank === 2
                      ? "bg-gray-400 text-white"
                      : student.rank === 3
                      ? "bg-amber-700 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  #{student.rank}
                </div>

                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarFallback className="bg-[#213874] text-white font-bold text-xs">
                    {student.name[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#213874]">{student.name}</span>
                    {isCurrentUser && <Badge className="bg-[#213874] text-white text-[10px]">You</Badge>}
                  </div>
                  <span className="text-xs text-gray-500">{student.school}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1 text-orange-600">
                  <Flame className="w-3.5 h-3.5 fill-current" /> {student.streak}d
                </div>
                <div className="flex items-center gap-1 text-blue-700">
                  <Zap className="w-3.5 h-3.5 fill-current" /> {student.xp} XP
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
