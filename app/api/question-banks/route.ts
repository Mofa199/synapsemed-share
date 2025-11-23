import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const questionBanks = await prisma.questionBank.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    })

    return NextResponse.json({ questionBanks })
  } catch (error) {
    console.error('Error fetching question banks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question banks' },
      { status: 500 }
    )
  }
}