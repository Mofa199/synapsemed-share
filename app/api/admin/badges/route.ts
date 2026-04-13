import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/badges - Get all badges
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const badges = await prisma.badge.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: badges,
      total: badges.length
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch badges' }, { status: 500 })
  }
}

// POST /api/admin/badges - Create new badge
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { 
      name, description, icon, color, 
      category, criteria, pointsRequired, isActive 
    } = data
    
    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      )
    }

    const badge = await prisma.badge.create({
      data: {
        name,
        description: description || null,
        icon: icon || null,
        color: color || null,
        category: category || null,
        criteria: criteria || null,
        pointsRequired: pointsRequired ? parseInt(pointsRequired) : null,
        isActive: isActive !== undefined ? !!isActive : true,
      }
    });

    return NextResponse.json({
      success: true,
      data: badge,
      message: 'Badge created successfully'
    });
  } catch (error) {
    console.error('Error creating badge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create badge' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/badges - Update badge
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Badge ID is required' }, { status: 400 })
    }

    const processedData: any = { ...updateData }
    if (processedData.pointsRequired !== undefined) {
      processedData.pointsRequired = parseInt(processedData.pointsRequired)
    }

    const badge = await prisma.badge.update({
      where: { id },
      data: processedData
    })

    return NextResponse.json({ success: true, data: badge })
  } catch (error) {
    console.error('Error updating badge:', error)
    return NextResponse.json({ success: false, error: 'Failed to update badge' }, { status: 500 })
  }
}

// DELETE /api/admin/badges - Delete badge
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Badge ID is required' }, { status: 400 })
    }

    await prisma.badge.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Badge deleted successfully' })
  } catch (error) {
    console.error('Error deleting badge:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete badge' }, { status: 500 })
  }
}