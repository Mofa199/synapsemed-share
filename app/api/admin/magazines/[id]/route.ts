import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// GET /api/admin/magazines/[id] - Get specific magazine
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const magazine = await prisma.magazine.findUnique({
      where: { id: params.id },
      include: {
        articles: true
      }
    })

    if (!magazine) {
      return NextResponse.json({ success: false, error: 'Magazine not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: magazine })
  } catch (error) {
    console.error('Error fetching magazine:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/magazines/[id] - Update magazine
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, issue, volume, description, coverUrl, category, tags, isPublished } = body

    const magazine = await prisma.magazine.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(issue !== undefined && { issue }),
        ...(volume !== undefined && { volume }),
        ...(description !== undefined && { description }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(isPublished !== undefined && { isPublished }),
      }
    })

    return NextResponse.json({ success: true, data: magazine })
  } catch (error) {
    console.error('Error updating magazine:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/magazines/[id] - Delete magazine
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.magazine.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true, message: 'Magazine deleted successfully' })
  } catch (error) {
    console.error('Error deleting magazine:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
