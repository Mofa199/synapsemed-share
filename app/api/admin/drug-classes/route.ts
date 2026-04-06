import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/drug-classes - Get all drug classes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const drugClasses = await prisma.drugClass.findMany({
      where: category ? { category } : {},
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { drugs: true } }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: drugClasses
    });
  } catch (error) {
    console.error('Error fetching drug classes:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch drug classes'
    }, { status: 500 });
  }
}

// POST /api/admin/drug-classes - Create new drug class
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      category,
      description
    } = body

    if (!name || !category) {
      return NextResponse.json({
        success: false,
        error: 'Name and category are required'
      }, { status: 400 })
    }

    const drugClass = await prisma.drugClass.create({
      data: {
        name,
        category,
        description: description || null,
      }
    });

    return NextResponse.json({
      success: true,
      data: drugClass
    });
  } catch (error) {
    console.error('Error creating drug class:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create drug class'
    }, { status: 500 });
  }
}

// PUT /api/admin/drug-classes - Update drug class
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      name,
      category,
      description,
    } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Drug class ID is required'
      }, { status: 400 })
    }

    const drugClass = await prisma.drugClass.update({
      where: { id },
      data: {
        name,
        category,
        description,
      }
    });

    return NextResponse.json({
      success: true,
      data: drugClass
    });
  } catch (error) {
    console.error('Error updating drug class:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update drug class'
    }, { status: 500 });
  }
}

// DELETE /api/admin/drug-classes - Delete drug class
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Drug class ID is required'
      }, { status: 400 })
    }

    await prisma.drugClass.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Drug class deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting drug class:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete drug class'
    }, { status: 500 });
  }
}