import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/db-utils'
import { prisma } from '@/lib/prisma'

// GET /api/user/preferences - Get user preferences
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user with preferences from database
    const userData = await prisma.user.findUnique({
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
        updatedAt: true,
      }
    })

    if (!userData) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Return user data as preferences
    const preferences = {
      qotdNotifications: false,
      emailNotifications: true,
      theme: 'light',
      language: 'en',
      preferredLanguage: 'english',
      studyField: userData.field,
      difficultyLevel: 'intermediate',
      studyGoal: '2',
      autoplay: true,
      soundEffects: true,
      profileVisibility: 'public',
      showProgress: true,
      showBadges: true,
      allowMessages: true,
      dataCollection: true,
      emailNotificationsEnabled: true,
      pushNotifications: true,
      studyReminders: true,
      courseUpdates: true,
      achievementAlerts: true,
      weeklyProgress: false,
      marketingEmails: false,
    }

    return NextResponse.json({
      success: true,
      data: preferences
    })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch preferences'
    }, { status: 500 })
  }
}

// PUT /api/user/preferences - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // In a real implementation, we would store preferences in a dedicated table
    // For now, we'll just return the updated preferences
    return NextResponse.json({
      success: true,
      data: body
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update preferences'
    }, { status: 500 })
  }
}