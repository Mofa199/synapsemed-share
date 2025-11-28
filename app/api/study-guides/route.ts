import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const studyGuides = await prisma.studyGuide.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ studyGuides })
  } catch (error) {
    console.error('Error fetching study guides:', error)
    return NextResponse.json(
      { error: 'Failed to fetch study guides' },
      { status: 500 }
    )
  }
}