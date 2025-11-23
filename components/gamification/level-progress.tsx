"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Zap, Target } from "lucide-react"

interface LevelProgressProps {
  level: number
  points: number
  pointsForNextLevel: number
  progressToNextLevel: number
  streak: number
  totalBadges: number
  completionRate: number
}

export function LevelProgress({
  level,
  points,
  pointsForNextLevel,
  progressToNextLevel,
  streak,
  totalBadges,
  completionRate
}: LevelProgressProps) {
  const getLevelTitle = (level: number) => {
    if (level >= 50) return "Grandmaster"
    if (level >= 30) return "Expert"
    if (level >= 20) return "Advanced"
    if (level >= 10) return "Intermediate"
    if (level >= 5) return "Novice"
    return "Beginner"
  }

  const getLevelColor = (level: number) => {
    if (level >= 50) return "text-purple-600"
    if (level >= 30) return "text-yellow-600"
    if (level >= 20) return "text-orange-600"
    if (level >= 10) return "text-blue-600"
    if (level >= 5) return "text-green-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Level and Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className={`h-5 w-5 ${getLevelColor(level)}`} />
            Level {level} - {getLevelTitle(level)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{points} XP</span>
              <span>{pointsForNextLevel} XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              {pointsForNextLevel - points} XP to next level
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-[#213874]">{streak}</div>
            <div className="text-xs text-gray-600">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-[#213874]">{totalBadges}</div>
            <div className="text-xs text-gray-600">Badges</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-[#213874]">{completionRate}%</div>
            <div className="text-xs text-gray-600">Completion</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-[#213874]">{points}</div>
            <div className="text-xs text-gray-600">Total XP</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Level Up!</p>
                <p className="text-xs text-gray-600">Reached level {level}</p>
              </div>
              <Badge variant="outline" className="text-xs">+100 XP</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Daily Goal</p>
                <p className="text-xs text-gray-600">Completed 3 topics today</p>
              </div>
              <Badge variant="outline" className="text-xs">+50 XP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}