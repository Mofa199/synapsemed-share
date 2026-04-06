import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/modules - Get modules for a curriculum
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const curriculumId = searchParams.get('curriculumId')

    if (!curriculumId) {
      return NextResponse.json(
        { error: 'Curriculum ID is required' },
        { status: 400 }
      )
    }

    const modules = await prisma.module.findMany({
      where: { 
        curriculumId,
      },
      include: {
        curriculum: {
          select: { name: true, field: true }
        },
        _count: { select: { topics: true } }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: modules,
    })
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

// POST /api/admin/modules - Create new module
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      description,
      curriculumId,
      order = 0,
      isActive = true,
    } = await request.json()

    if (!name || !curriculumId) {
      return NextResponse.json(
        { error: 'Name and curriculum ID are required' },
        { status: 400 }
      )
    }

    const module = await prisma.module.create({
      data: {
        name,
        description,
        curriculumId,
        order,
        isActive,
      },
      include: {
        curriculum: {
          select: { name: true, field: true }
        },
        _count: { select: { topics: true } }
      }
    })

    return NextResponse.json({
      success: true,
      data: module,
      message: 'Module created successfully',
    })
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/modules - Update module
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      )
    }

    const module = await prisma.module.update({
      where: { id },
      data: updateData,
      include: {
        curriculum: {
          select: { name: true, field: true }
        },
        _count: { select: { topics: true } }
      }
    })

    return NextResponse.json({
      success: true,
      data: module,
      message: 'Module updated successfully',
    })
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/modules - Delete module
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      )
    }

    await prisma.module.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Module deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    )
  }
}