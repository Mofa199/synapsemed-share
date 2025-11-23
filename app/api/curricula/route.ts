import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const curricula = await prisma.curriculum.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            modules: true,
            topics: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ curricula })
  } catch (error) {
    console.error('Error fetching curricula:', error)
    return NextResponse.json(
      { error: 'Failed to fetch curricula' },
      { status: 500 }
    )
  }
}