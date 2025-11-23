import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const drugClasses = await prisma.drugClass.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            drugs: true,
          },
        },
      },
      take: limit,
    })

    return NextResponse.json({ drugClasses })
  } catch (error) {
    console.error('Error fetching drug classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drug classes' },
      { status: 500 }
    )
  }
}