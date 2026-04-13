import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/user/profile - Get current user profile with gamification data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch full user profile from database
    const fullUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        userBadges: {
          include: {
            badge: true
          }
        },
        progress: {
          orderBy: { lastAccessedAt: 'desc' },
          take: 5
        },
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
    const completedItems = await prisma.progress.count({
      where: { userId: fullUser.id, status: 'COMPLETED' }
    })
    const totalItems = await prisma.progress.count({
      where: { userId: fullUser.id }
    })
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
          progressToNextLevel: Math.round(Math.max(0, Math.min(100, progressToNextLevel))),
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
        recentProgress: fullUser.progress
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
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, avatarUrl, field } = body

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: {
        ...(name !== undefined && { name }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(field !== undefined && { field }),
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
  return Math.floor(100 * Math.pow(level, 1.5))
}