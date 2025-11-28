import { NextRequest, NextResponse } from 'next/server'
import { getAllUserBadges, awardBadgeToUser } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let userBadges = await getAllUserBadges()

    if (userId) {
      userBadges = userBadges.filter(ub => ub.userId === userId)
    }

    return NextResponse.json({
      success: true,
      data: userBadges,
      total: userBadges.length
    })
  } catch (error) {
    console.error('Error fetching user badges:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user badges' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.userId || !data.badgeId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Badge ID are required' },
        { status: 400 }
      )
    }

    const userBadge = await awardBadgeToUser(data.userId, data.badgeId)

    return NextResponse.json({
      success: true,
      data: userBadge,
      message: 'Badge awarded to user successfully'
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'User already has this badge') {
      return NextResponse.json(
        { success: false, error: 'User already has this badge' },
        { status: 409 }
      )
    }
    
    console.error('Error awarding badge:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to award badge to user' },
      { status: 500 }
    )
  }
}