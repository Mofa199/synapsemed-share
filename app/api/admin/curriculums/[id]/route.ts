import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const curriculum = await prisma.curriculum.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: {
            order: 'asc'
          },
          include: {
            _count: {
              select: {
                topics: true
              }
            }
          }
        },
        _count: {
          select: {
            modules: true
          }
        }
      }
    })

    if (!curriculum) {
      return NextResponse.json({ success: false, error: 'Curriculum not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: curriculum })
  } catch (error) {
    console.error('Error fetching curriculum:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch curriculum' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    const updatedCurriculum = await prisma.curriculum.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        field: body.field,
        isActive: body.isActive,
      }
    })

    return NextResponse.json({ success: true, data: updatedCurriculum })
  } catch (error) {
    console.error('Error updating curriculum:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update curriculum' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    await prisma.curriculum.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Curriculum deleted successfully' })
  } catch (error) {
    console.error('Error deleting curriculum:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete curriculum' },
      { status: 500 }
    )
  }
}
