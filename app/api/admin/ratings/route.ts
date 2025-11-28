import { NextRequest, NextResponse } from 'next/server'
import { getAllRatings } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get('resourceType')

    let ratings = await getAllRatings()

    if (resourceType) {
      ratings = ratings.filter(r => r.resourceType === resourceType)
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