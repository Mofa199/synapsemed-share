import { NextRequest, NextResponse } from 'next/server'
import { getAllProgress } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let progress = await getAllProgress()

    if (userId) {
      progress = progress.filter((p: any) => p.userId === userId)
    }

    return NextResponse.json({
      success: true,
      data: progress,
      total: progress.length
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}