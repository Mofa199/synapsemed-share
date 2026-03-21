import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// GET /api/admin/magazines - Get all magazines
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    const magazines = await prisma.magazine.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      } : {},
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: magazines })
  } catch (error) {
    console.error('Error fetching magazines:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/magazines - Create new magazine
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, issue, volume, description, coverUrl, category, tags, isPublished } = body

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    }

    const magazine = await prisma.magazine.create({
      data: {
        title,
        issue,
        volume,
        description,
        coverUrl,
        category,
        tags: JSON.stringify(tags || []),
        isPublished: isPublished || false,
      }
    })

    return NextResponse.json({ success: true, data: magazine })
  } catch (error) {
    console.error('Error creating magazine:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
