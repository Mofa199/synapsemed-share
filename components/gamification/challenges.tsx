"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Star, Gift, Clock, Target } from "lucide-react"

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

interface ChallengesProps {
  challenges: Challenge[]
  onCompleteChallenge?: (challengeId: string) => void
}

export function Challenges({ challenges, onCompleteChallenge }: ChallengesProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return Clock
      case 'weekly':
        return Trophy
      case 'ongoing':
        return Target
      default:
        return Medal
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'text-orange-500'
      case 'weekly':
        return 'text-blue-500'
      case 'ongoing':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const getTypeBackground = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-orange-50 border-orange-200'
      case 'weekly':
        return 'bg-blue-50 border-blue-200'
      case 'ongoing':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatTimeRemaining = (expiresAt: Date | null) => {
    if (!expiresAt) return 'No expiry'
    
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} left`
    } else {
      return `${hours} hour${hours === 1 ? '' : 's'} left`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-[#213874]" />
          Active Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Gift className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No active challenges</p>
            <p className="text-sm">Check back later for new challenges!</p>
          </div>
        ) : (
          challenges.map((challenge) => {
            const TypeIcon = getTypeIcon(challenge.type)
            const progress = (challenge.current / challenge.target) * 100
            const isCompleted = challenge.current >= challenge.target
            
            return (
              <div
                key={challenge.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${getTypeBackground(challenge.type)} ${
                  isCompleted ? 'opacity-75' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 ${
                    isCompleted ? 'border-green-500' : 'border-gray-200'
                  }`}>
                    {isCompleted ? (
                      <Trophy className="h-5 w-5 text-green-600" />
                    ) : (
                      <TypeIcon className={`h-5 w-5 ${getTypeColor(challenge.type)}`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                      <Badge 
                        variant={challenge.type === 'daily' ? 'default' : 'outline'} 
                        className={`text-xs ${
                          challenge.type === 'daily' ? 'bg-orange-100 text-orange-700' :
                          challenge.type === 'weekly' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}
                      >
                        {challenge.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Progress: {challenge.current}/{challenge.target}
                        </span>
                        <span className="font-medium text-[#213874]">
                          +{challenge.reward} XP
                        </span>
                      </div>
                      
                      <Progress 
                        value={Math.min(progress, 100)} 
                        className="h-2"
                      />
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{formatTimeRemaining(challenge.expiresAt)}</span>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Star className="h-3 w-3 mr-1" />
                            Completed!
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {isCompleted && onCompleteChallenge && (
                      <Button 
                        onClick={() => onCompleteChallenge(challenge.id)}
                        className="w-full mt-3 bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Claim Reward
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}