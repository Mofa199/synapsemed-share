import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'
import { prisma } from '@/lib/prisma'

// GET /api/user/profile/[id] - Get user profile data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user || user.id !== (await params).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to find user in our database
    const dbUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        role: true,
        field: true,
        level: true,
        points: true,
        streak: true,
        userBadges: {
          include: {
            badge: true
          }
        }
      }
    })

    if (dbUser) {
      return NextResponse.json({
        role: dbUser.role,
        field: dbUser.field,
        level: dbUser.level,
        points: dbUser.points,
        streak: dbUser.streak,
        badges: dbUser.userBadges.map(ub => ub.badge.name),
      })
    } else {
      // Return default values for new users
      return NextResponse.json({
        role: 'STUDENT',
        field: 'MEDICAL',
        level: 1,
        points: 0,
        streak: 0,
        badges: [],
      })
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/user/profile/[id] - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser()
    if (!user || user.id !== (await params).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { role, field, level, points, streak } = body

    // Upsert user in our database
    const updatedUser = await prisma.user.upsert({
      where: { id: params.id },
      update: {
        role,
        field,
        level,
        points,
        streak,
      },
      create: {
        id: params.id,
        email: user.primaryEmail || '',
        name: user.displayName || 'User',
        password: '', // Not used for Stack Auth users
        role: role || 'STUDENT',
        field: field || 'MEDICAL',
        level: level || 1,
        points: points || 0,
        streak: streak || 0,
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}