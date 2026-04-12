import { NextRequest, NextResponse } from 'next/server'
import { getAllBookmarks } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const resourceType = searchParams.get('resourceType')

    let bookmarks = await getAllBookmarks()

    if (userId) {
      bookmarks = bookmarks.filter((b: any) => b.userId === userId)
    }

    if (resourceType) {
      bookmarks = bookmarks.filter((b: any) => b.resourceType === resourceType)
    }

    return NextResponse.json({
      success: true,
      data: bookmarks,
      total: bookmarks.length
    })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}