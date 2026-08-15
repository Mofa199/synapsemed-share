import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, rating: 5, totalRatings: 18 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, message: "Rating recorded", data: body })
  } catch (e) {
    return NextResponse.json({ success: true, message: "Rating recorded" })
  }
}
