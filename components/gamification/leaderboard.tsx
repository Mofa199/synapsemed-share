"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Medal, Trophy, Star } from "lucide-react"

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

interface LeaderboardProps {
  users: LeaderboardUser[]
  currentUserRank: number
}

export function Leaderboard({ users, currentUserRank }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Trophy className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const getRankColor = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-blue-50 border-blue-200'
    
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200'
      case 2:
        return 'bg-gray-50 border-gray-200'
      case 3:
        return 'bg-amber-50 border-amber-200'
      default:
        return 'bg-white border-gray-100'
    }
  }

  const getFieldColor = (field: string) => {
    switch (field.toLowerCase()) {
      case 'medical':
        return 'bg-red-100 text-red-700'
      case 'nursing':
        return 'bg-blue-100 text-blue-700'
      case 'pharmacy':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatPoints = (points: number) => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`
    } else if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`
    }
    return points.toString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#213874]" />
          Leaderboard
          <Badge variant="outline" className="ml-auto">
            Your rank: #{currentUserRank}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${getRankColor(user.rank, user.isCurrentUser)}`}
          >
            <div className="flex items-center justify-center w-8 h-8">
              {getRankIcon(user.rank)}
            </div>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-[#213874] text-white text-sm">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-medium truncate ${user.isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                  {user.name}
                  {user.isCurrentUser && (
                    <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">You</Badge>
                  )}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-xs ${getFieldColor(user.field)}`}>
                  {user.field}
                </Badge>
                <span className="text-xs text-gray-500">Level {user.level}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-[#213874]">
                {formatPoints(user.points)}
              </div>
              <div className="text-xs text-gray-500">XP</div>
            </div>
            
            {user.rank <= 3 && (
              <div className="flex items-center">
                <Star className={`h-4 w-4 ${
                  user.rank === 1 ? 'text-yellow-500' :
                  user.rank === 2 ? 'text-gray-400' :
                  'text-amber-600'
                }`} />
              </div>
            )}
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No users in leaderboard yet</p>
            <p className="text-sm">Be the first to earn points!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}