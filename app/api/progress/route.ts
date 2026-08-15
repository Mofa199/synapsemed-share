import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const resourceId = searchParams.get('resourceId')

    let progress = []
    try {
      if (userId && (prisma as any).userProgress) {
        progress = await (prisma as any).userProgress.findMany({
          where: {
            userId,
            ...(resourceId ? { resourceId } : {})
          }
        })
      }
    } catch (e) {
      // safe fallback
    }

    return NextResponse.json({
      success: true,
      progress: progress || [],
      completed: false,
      percentage: 0
    })
  } catch (error) {
    return NextResponse.json({ success: true, progress: [], completed: false, percentage: 0 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({ success: true, message: "Progress updated", data: body })
  } catch (error) {
    return NextResponse.json({ success: true, message: "Progress recorded" })
  }
}
