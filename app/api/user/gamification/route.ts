import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// POST /api/user/gamification - Award points and handle level progression
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, points: awardedPoints, resourceType, resourceId } = body

    if (!action || !awardedPoints) {
      return NextResponse.json({
        success: false,
        error: 'Action and points are required'
      }, { status: 400 })
    }

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        level: true,
        points: true,
        streak: true,
        lastLoginAt: true
      }
    })

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const newPoints = currentUser.points + awardedPoints
    const currentLevel = currentUser.level
    const newLevel = calculateLevelFromPoints(newPoints)
    const leveledUp = newLevel > currentLevel

    // Update user points and level
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: newPoints,
        level: newLevel,
        lastLoginAt: new Date()
      }
    })

    // Check for new badges to award
    const newBadges = await checkAndAwardBadges(user.id, {
      points: newPoints,
      level: newLevel,
      action,
      resourceType
    })

    // Create activity log (simplified for now - would use a proper logging system)
    console.log(`User ${user.id} earned ${awardedPoints} points for ${action}`, {
      leveledUp,
      newLevel,
      resourceType,
      resourceId
    })

    return NextResponse.json({
      success: true,
      data: {
        pointsAwarded: awardedPoints,
        newPoints,
        previousLevel: currentLevel,
        newLevel,
        leveledUp,
        newBadges,
        user: {
          id: updatedUser.id,
          level: updatedUser.level,
          points: updatedUser.points,
          streak: updatedUser.streak
        }
      }
    })
  } catch (error) {
    console.error('Error updating gamification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update gamification data'
    }, { status: 500 })
  }
}

// GET /api/user/gamification - Get leaderboard and challenges
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get leaderboard (top 10 users by points)
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        level: true,
        points: true,
        field: true,
        avatarUrl: true
      },
      orderBy: {
        points: 'desc'
      },
      take: 10,
      where: {
        isActive: true
      }
    })

    // Get current user for points comparison
    const currentUserData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { points: true }
    })
    
    // Get user's rank
    const userRank = await prisma.user.count({
      where: {
        points: {
          gt: currentUserData?.points || 0
        },
        isActive: true
      }
    }) + 1

    // Get active challenges
    const challenges = await getActiveChallenges(user.id)

    // Get recent activity (simplified for now)
    const recentEvents = [
      {
        action: 'complete_topic',
        pointsAwarded: 50,
        leveledUp: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
      },
      {
        action: 'complete_quiz',
        pointsAwarded: 30,
        leveledUp: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        leaderboard: leaderboard.map((u, index) => ({
          ...u,
          rank: index + 1,
          isCurrentUser: u.id === user.id
        })),
        userRank,
        challenges,
        recentActivity: recentEvents
      }
    })
  } catch (error) {
    console.error('Error fetching gamification data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch gamification data'
    }, { status: 500 })
  }
}

// Helper function to calculate level from points
function calculateLevelFromPoints(points: number): number {
  let level = 1
  while (calculatePointsForLevel(level + 1) <= points) {
    level++
  }
  return level
}

function calculatePointsForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5))
}

// Helper function to check and award badges
async function checkAndAwardBadges(userId: string, data: {
  points: number
  level: number
  action: string
  resourceType?: string
}) {
  const newBadges = []

  // Get all available badges
  const badges = await prisma.badge.findMany({
    where: { isActive: true }
  })

  // Get user's current badges
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true }
  })

  const userBadgeIds = userBadges.map(ub => ub.badgeId)

  for (const badge of badges) {
    // Skip if user already has this badge
    if (userBadgeIds.includes(badge.id)) continue

    let shouldAward = false

    // Check badge criteria
    if (badge.pointsRequired && data.points >= badge.pointsRequired) {
      shouldAward = true
    }

    // Level-based badges
    if (badge.criteria === 'level_5' && data.level >= 5) shouldAward = true
    if (badge.criteria === 'level_10' && data.level >= 10) shouldAward = true
    if (badge.criteria === 'level_20' && data.level >= 20) shouldAward = true

    // Action-based badges
    if (badge.criteria === 'first_completion' && data.action === 'complete_topic') shouldAward = true
    if (badge.criteria === 'quiz_master' && data.action === 'complete_quiz') shouldAward = true

    if (shouldAward) {
      try {
        const userBadge = await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id
          },
          include: {
            badge: true
          }
        })
        newBadges.push(userBadge.badge)
      } catch (error) {
        // Ignore if badge already exists (race condition)
        console.warn(`Failed to award badge ${badge.id} to user ${userId}:`, error)
      }
    }
  }

  return newBadges
}

// Helper function to get active challenges
async function getActiveChallenges(userId: string) {
  // For now, return some static challenges
  // In a real implementation, these would come from the database
  const staticChallenges = [
    {
      id: 'daily_study',
      title: 'Daily Scholar',
      description: 'Complete 3 topics today',
      type: 'daily',
      target: 3,
      current: 0,
      reward: 50,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    },
    {
      id: 'quiz_streak',
      title: 'Quiz Master',
      description: 'Complete 5 quizzes this week',
      type: 'weekly',
      target: 5,
      current: 0,
      reward: 200,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
      id: 'pharmacology_focus',
      title: 'Drug Expert',
      description: 'Study 10 pharmacology topics',
      type: 'ongoing',
      target: 10,
      current: 0,
      reward: 300,
      expiresAt: null
    }
  ]

  return staticChallenges
}