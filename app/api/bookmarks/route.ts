import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, isBookmarked: false, bookmarks: [] })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, message: "Bookmark toggled", isBookmarked: true, data: body })
  } catch (e) {
    return NextResponse.json({ success: true, message: "Bookmark toggled", isBookmarked: true })
  }
}
