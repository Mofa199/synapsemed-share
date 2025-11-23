import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// GET /api/user/spaced-repetition/stats - Get user's spaced repetition stats
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // In production, this would query the database
    // For now, return mock data
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const stats = {
      overdue: 5,
      dueToday: 12,
      upcoming: 24
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stats'
    }, { status: 500 })
  }
}
