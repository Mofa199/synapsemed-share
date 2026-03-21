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

    // Fetch full user profile from database
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        userBadges: {
          include: {
            badge: true
          }
        },
        progress: true,
      }
    })

    if (!fullUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Calculate XP needed for next level
    const currentLevel = fullUser.level || 1
    const currentPoints = fullUser.points || 0
    const pointsForNextLevel = calculatePointsForLevel(currentLevel + 1)
    const pointsForCurrentLevel = calculatePointsForLevel(currentLevel)
    const progressToNextLevel = ((currentPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100

    // Calculate completion statistics
    const completedItems = fullUser.progress ? fullUser.progress.filter(p => p.status === 'COMPLETED').length : 0
    const totalItems = fullUser.progress ? fullUser.progress.length : 0
    const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: fullUser.id,
          name: fullUser.name,
          email: fullUser.email,
          role: fullUser.role,
          field: fullUser.field,
          level: fullUser.level,
          points: fullUser.points,
          streak: fullUser.streak,
          avatarUrl: fullUser.avatarUrl,
          lastLoginAt: fullUser.lastLoginAt,
          createdAt: fullUser.createdAt
        },
        gamification: {
          level: currentLevel,
          points: currentPoints,
          pointsForNextLevel,
          progressToNextLevel: Math.round(progressToNextLevel),
          streak: fullUser.streak,
          totalBadges: fullUser.userBadges?.length || 0,
          completionRate: Math.round(completionRate),
          completedItems,
          totalItems
        },
        badges: fullUser.userBadges?.map(ub => ({
          id: ub.badge.id,
          name: ub.badge.name,
          description: ub.badge.description,
          icon: ub.badge.icon,
          color: ub.badge.color,
          category: ub.badge.category,
          earnedAt: ub.earnedAt
        })) || [],
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
    const { name, avatarUrl, field } = body

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : undefined,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
        field: field !== undefined ? field : undefined,
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
// Helper function to calculate points needed for a specific level
function calculatePointsForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5))
}