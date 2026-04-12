import { NextRequest, NextResponse } from 'next/server'
import { getAllHighlights } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let highlights = await getAllHighlights()

    if (userId) {
      highlights = highlights.filter((h: any) => h.userId === userId)
    }

    return NextResponse.json({
      success: true,
      data: highlights,
      total: highlights.length
    })
  } catch (error) {
    console.error('Error fetching highlights:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch highlights' },
      { status: 500 }
    )
  }
}