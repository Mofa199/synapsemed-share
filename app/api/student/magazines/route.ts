import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const whereClause: any = {
      isPublished: true,
    }

    if (category && category !== 'All') {
      whereClause.category = category
    }

    const magazines = await prisma.magazine.findMany({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
      include: {
        articles: {
          select: { id: true, title: true, pageNumber: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: magazines
    })
  } catch (error) {
    console.error('Error fetching magazines:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch magazines'
    }, { status: 500 })
  }
}
