import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const drugs = await prisma.drug.findMany({
      where: { isActive: true },
      include: {
        drugClass: {
          select: {
            name: true,
            category: true,
          },
        },
      },
      orderBy: { name: 'asc' },
      take: limit,
    })

    return NextResponse.json({ drugs })
  } catch (error) {
    console.error('Error fetching drugs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drugs' },
      { status: 500 }
    )
  }
}