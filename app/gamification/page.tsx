"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AIHelper } from "@/components/ai-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { LevelProgress } from "@/components/gamification/level-progress"
import { Challenges } from "@/components/gamification/challenges"
import { Leaderboard } from "@/components/gamification/leaderboard"
import { BadgeCollection } from "@/components/gamification/badge-collection"
import { Trophy, Star, Target, Gift, Zap, Award } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  field: string
  level: number
  points: number
  streak: number
  avatarUrl?: string
}

interface GamificationData {
  level: number
  points: number
  pointsForNextLevel: number
  progressToNextLevel: number
  streak: number
  totalBadges: number
  completionRate: number
  completedItems: number
  totalItems: number
}

interface Challenge {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'ongoing'
  target: number
  current: number
  reward: number
  expiresAt: Date | null
}

interface LeaderboardUser {
  id: string
  name: string
  level: number
  points: number
  field: string
  avatarUrl?: string
  rank: number
  isCurrentUser: boolean
}

interface BadgeData {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  category?: string
  earnedAt: Date
}

export default function GamificationPage() {
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [userRank, setUserRank] = useState(0)
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProfile()
    fetchGamificationData()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUser(result.data.user)
          setGamificationData(result.data.gamification)
          setBadges(result.data.badges)
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    }
  }

  const fetchGamificationData = async () => {
    try {
      const response = await fetch('/api/user/gamification')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setLeaderboard(result.data.leaderboard)
          setUserRank(result.data.userRank)
          setChallenges(result.data.challenges.map((c: any) => ({
            ...c,
            expiresAt: c.expiresAt ? new Date(c.expiresAt) : null
          })))
        }
      }
    } catch (error) {
      console.error('Error fetching gamification data:', error)
      toast({
        title: "Error",
        description: "Failed to load gamification data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId)
      if (!challenge) return

      const response = await fetch('/api/user/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete_challenge',
          points: challenge.reward,
          resourceType: 'CHALLENGE',
          resourceId: challengeId
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast({
            title: "Challenge Completed!",
            description: `You earned ${challenge.reward} XP!`,
          })
          
          // Update local state
          if (gamificationData) {
            setGamificationData({
              ...gamificationData,
              points: result.data.newPoints,
              level: result.data.newLevel
            })
          }
          
          // Remove completed challenge
          setChallenges(prev => prev.filter(c => c.id !== challengeId))
          
          // Show level up notification if applicable
          if (result.data.leveledUp) {
            toast({
              title: "Level Up!",
              description: `Congratulations! You reached level ${result.data.newLevel}!`,
            })
          }
          
          // Show new badges if any
          if (result.data.newBadges && result.data.newBadges.length > 0) {
            result.data.newBadges.forEach((badge: any) => {
              toast({
                title: "New Badge Earned!",
                description: `You earned the "${badge.name}" badge!`,
              })
            })
          }
        }
      }
    } catch (error) {
      console.error('Error completing challenge:', error)
      toast({
        title: "Error",
        description: "Failed to complete challenge",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({length: 6}).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !gamificationData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-bold text-gray-700 mb-2">Login Required</h2>
              <p className="text-gray-600">Please log in to view your gamification progress.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#213874] mb-2">Your Progress</h1>
              <p className="text-gray-600">Track your learning journey and compete with peers</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-[#213874] text-white px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Level {gamificationData.level}
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Trophy className="h-4 w-4 mr-2" />
                Rank #{userRank}
              </Badge>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#213874]">{gamificationData.points}</div>
                <div className="text-xs text-gray-600">Total XP</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#213874]">{gamificationData.streak}</div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#213874]">{gamificationData.totalBadges}</div>
                <div className="text-xs text-gray-600">Badges</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#213874]">{gamificationData.completionRate}%</div>
                <div className="text-xs text-gray-600">Completion</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LevelProgress
                  level={gamificationData.level}
                  points={gamificationData.points}
                  pointsForNextLevel={gamificationData.pointsForNextLevel}
                  progressToNextLevel={gamificationData.progressToNextLevel}
                  streak={gamificationData.streak}
                  totalBadges={gamificationData.totalBadges}
                  completionRate={gamificationData.completionRate}
                />
              </div>
              <div>
                <Challenges 
                  challenges={challenges.slice(0, 3)} 
                  onCompleteChallenge={handleCompleteChallenge}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Challenges 
              challenges={challenges} 
              onCompleteChallenge={handleCompleteChallenge}
            />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard users={leaderboard} currentUserRank={userRank} />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <BadgeCollection 
              badges={badges.map(b => ({
                ...b,
                earnedAt: new Date(b.earnedAt)
              }))} 
              totalEarned={badges.length}
              totalAvailable={50}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AIHelper />
    </div>
  )
}