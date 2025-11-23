import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// GET /api/admin/users/[id] - Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role as string)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        field: true,
        level: true,
        points: true,
        streak: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        userBadges: {
          include: {
            badge: true
          }
        },
        progress: {
          select: {
            resourceType: true,
            completionPercentage: true,
            status: true,
            completedAt: true
          }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: targetUser
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user'
    }, { status: 500 })
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER'].includes(user.role as string)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id
    const body = await request.json()
    const { name, email, role, field, level, points, isActive } = body

    // Additional permission check: only SUPER_ADMIN can modify other admins
    if ((user.role as string) !== 'SUPER_ADMIN') {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })

      if (targetUser && ['SUPER_ADMIN', 'LECTURER'].includes(targetUser.role)) {
        return NextResponse.json({
          success: false,
          error: 'Insufficient permissions to modify this user'
        }, { status: 403 })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
        field,
        level,
        points,
        isActive,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        field: true,
        level: true,
        points: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update user'
    }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] - Delete user (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || (user.role as string) !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    // Prevent self-deletion
    if (userId === user.id) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete your own account'
      }, { status: 400 })
    }

    // Soft delete by deactivating the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user'
    }, { status: 500 })
  }
}