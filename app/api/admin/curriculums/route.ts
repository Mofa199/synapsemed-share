import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, UserField } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/curriculums - Get all curricula
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const curricula = await prisma.curriculum.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            modules: true,
            topics: true,
            books: true,
            videos: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: curricula,
    });
  } catch (error) {
    console.error('Error fetching curricula:', error);
    return NextResponse.json(
      { error: 'Failed to fetch curricula' },
      { status: 500 }
    );
  }
}

// POST /api/admin/curriculums - Create new curriculum
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      name,
      description,
      field,
      isActive = true,
    } = await request.json()

    if (!name || !field) {
      return NextResponse.json(
        { error: 'Name and field are required' },
        { status: 400 }
      )
    }

    const curriculum = await prisma.curriculum.create({
      data: {
        name,
        description,
        field: field as UserField,
        isActive,
      },
    })

    return NextResponse.json({
      success: true,
      data: curriculum,
      message: 'Curriculum created successfully',
    });
  } catch (error) {
    console.error('Error creating curriculum:', error);
    return NextResponse.json(
      { error: 'Failed to create curriculum' },
      { status: 500 }
    );
  }
}