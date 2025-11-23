"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Award, Trophy, Medal, Zap, Target, Book, Brain } from "lucide-react"

interface BadgeData {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  category?: string
  earnedAt: Date
}

interface BadgeCollectionProps {
  badges: BadgeData[]
  totalEarned: number
  totalAvailable?: number
}

export function BadgeCollection({ badges, totalEarned, totalAvailable = 50 }: BadgeCollectionProps) {
  const getBadgeIcon = (iconName?: string, category?: string) => {
    if (iconName) {
      switch (iconName.toLowerCase()) {
        case 'trophy':
          return Trophy
        case 'medal':
          return Medal
        case 'star':
          return Star
        case 'award':
          return Award
        case 'zap':
          return Zap
        case 'target':
          return Target
        case 'book':
          return Book
        case 'brain':
          return Brain
        default:
          return Award
      }
    }
    
    // Fallback based on category
    switch (category?.toLowerCase()) {
      case 'achievement':
        return Trophy
      case 'learning':
        return Book
      case 'streak':
        return Zap
      case 'completion':
        return Target
      default:
        return Award
    }
  }

  const getBadgeColor = (color?: string, category?: string) => {
    if (color) return color
    
    switch (category?.toLowerCase()) {
      case 'achievement':
        return 'text-yellow-600'
      case 'learning':
        return 'text-blue-600'
      case 'streak':
        return 'text-orange-600'
      case 'completion':
        return 'text-green-600'
      default:
        return 'text-purple-600'
    }
  }

  const getBadgeBackground = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'achievement':
        return 'bg-yellow-50 border-yellow-200'
      case 'learning':
        return 'bg-blue-50 border-blue-200'
      case 'streak':
        return 'bg-orange-50 border-orange-200'
      case 'completion':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-purple-50 border-purple-200'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Sort badges by earned date (most recent first)
  const sortedBadges = [...badges].sort((a, b) => 
    new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-[#213874]" />
          Badge Collection
          <Badge variant="outline" className="ml-auto">
            {totalEarned}/{totalAvailable}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No badges earned yet</p>
            <p className="text-sm">Complete activities to earn your first badge!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Recent Badges */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortedBadges.slice(0, 4).map((badge) => {
                  const IconComponent = getBadgeIcon(badge.icon, badge.category)
                  const iconColor = getBadgeColor(badge.color, badge.category)
                  const bgColor = getBadgeBackground(badge.category)
                  
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${bgColor}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-white shadow-sm">
                          <IconComponent className={`h-5 w-5 ${iconColor}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {badge.name}
                          </h4>
                          {badge.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {badge.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {badge.category && (
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {badge.category}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatDate(badge.earnedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* All Badges */}
            {badges.length > 4 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">All Badges ({badges.length})</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {sortedBadges.map((badge) => {
                    const IconComponent = getBadgeIcon(badge.icon, badge.category)
                    const iconColor = getBadgeColor(badge.color, badge.category)
                    
                    return (
                      <div
                        key={badge.id}
                        className="group relative"
                        title={`${badge.name} - ${formatDate(badge.earnedAt)}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                          <IconComponent className={`h-6 w-6 ${iconColor}`} />
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {badge.name}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Collection Progress</span>
                <span>{Math.round((totalEarned / totalAvailable) * 100)}% Complete</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}