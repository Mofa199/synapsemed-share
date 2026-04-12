import { NextRequest, NextResponse } from 'next/server'
import { getAllRatings } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get('resourceType')
    const userId = searchParams.get('userId')

    let ratings = await getAllRatings()

    if (resourceType) {
      ratings = ratings.filter((r: any) => r.resourceType === resourceType)
    }

    if (userId) {
      ratings = ratings.filter((r: any) => r.userId === userId)
    }

    return NextResponse.json({
      success: true,
      data: ratings,
      total: ratings.length
    })
  } catch (error) {
    console.error('Error fetching ratings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ratings' },
      { status: 500 }
    )
  }
}