import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const curricula = await prisma.curriculum.findMany({
      where: {
        isActive: true,
        // Optional: filter by user.field if needed, but for now we return all active
      },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            topics: { select: { id: true, title: true, type: true } },
            videos: { select: { id: true, title: true } }
          }
        },
        books: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: curricula
    })
  } catch (error) {
    console.error('Error fetching curricula:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch curricula'
    }, { status: 500 })
  }
}
