import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// GET /api/user/profile - Get current user profile with gamification data
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        field: true,
        level: true,
        points: true,
        streak: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
        userBadges: {
          include: {
            badge: true
          },
          orderBy: {
            earnedAt: 'desc'
          }
        },
        progress: {
          select: {
            resourceType: true,
            completionPercentage: true,
            status: true,
            completedAt: true
          }
        }
      }
    })

    if (!userProfile) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Calculate XP needed for next level
    const currentLevel = userProfile.level
    const currentPoints = userProfile.points
    const pointsForNextLevel = calculatePointsForLevel(currentLevel + 1)
    const pointsForCurrentLevel = calculatePointsForLevel(currentLevel)
    const progressToNextLevel = ((currentPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100

    // Calculate completion statistics
    const completedItems = userProfile.progress.filter(p => p.status === 'COMPLETED').length
    const totalItems = userProfile.progress.length
    const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    // Get recent badges (last 5)
    const recentBadges = userProfile.userBadges.slice(0, 5)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          role: userProfile.role,
          field: userProfile.field,
          level: userProfile.level,
          points: userProfile.points,
          streak: userProfile.streak,
          avatarUrl: userProfile.avatarUrl,
          lastLoginAt: userProfile.lastLoginAt,
          createdAt: userProfile.createdAt
        },
        gamification: {
          level: currentLevel,
          points: currentPoints,
          pointsForNextLevel,
          progressToNextLevel: Math.round(progressToNextLevel),
          streak: userProfile.streak,
          totalBadges: userProfile.userBadges.length,
          completionRate: Math.round(completionRate),
          completedItems,
          totalItems
        },
        badges: userProfile.userBadges.map(ub => ({
          id: ub.badge.id,
          name: ub.badge.name,
          description: ub.badge.description,
          icon: ub.badge.icon,
          color: ub.badge.color,
          category: ub.badge.category,
          earnedAt: ub.earnedAt
        })),
        recentBadges
      }
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user profile'
    }, { status: 500 })
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, avatarUrl } = body

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || undefined,
        avatarUrl: avatarUrl || undefined,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        field: true,
        level: true,
        points: true,
        streak: true,
        avatarUrl: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update user profile'
    }, { status: 500 })
  }
}

// Helper function to calculate points needed for a specific level
function calculatePointsForLevel(level: number): number {
  // Exponential growth: level 1 = 100 points, level 2 = 250 points, etc.
  return Math.floor(100 * Math.pow(level, 1.5))
}