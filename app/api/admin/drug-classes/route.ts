import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// GET /api/admin/drug-classes - Get all drug classes
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const drugClasses = await prisma.drugClass.findMany({
      include: {
        drugs: {
          select: {
            id: true,
            name: true,
            genericName: true,
            brandNames: true
          }
        }
      },
      orderBy: {
        category: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: drugClasses
    })
  } catch (error) {
    console.error('Error fetching drug classes:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch drug classes'
    }, { status: 500 })
  }
}

// POST /api/admin/drug-classes - Create new drug class
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
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
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const drugClass = await prisma.drugClass.create({
      data: {
        name,
        category,
        description: description || ''
      }
    })

    return NextResponse.json({
      success: true,
      data: drugClass
    })
  } catch (error) {
    console.error('Error creating drug class:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create drug class'
    }, { status: 500 })
  }
}

// PUT /api/admin/drug-classes - Update drug class
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      category,
      description,
      mechanism,
      therapeuticUses,
      commonSideEffects,
      contraindications,
      drugs
    } = body

    // Extract ID from URL
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Drug class ID is required'
      }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {}
    if (name) updateData.name = name
    if (category) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (mechanism !== undefined) updateData.mechanism = mechanism
    if (therapeuticUses) updateData.therapeuticUses = therapeuticUses
    if (commonSideEffects) updateData.commonSideEffects = commonSideEffects
    if (contraindications) updateData.contraindications = contraindications
    if (drugs) updateData.drugs = drugs
    updateData.updatedAt = new Date()

    const drugClass = await prisma.drugClass.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: drugClass
    })
  } catch (error) {
    console.error('Error updating drug class:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update drug class'
    }, { status: 500 })
  }
}

// DELETE /api/admin/drug-classes - Delete drug class
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN'].includes(user.role as string)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Drug class ID is required'
      }, { status: 400 })
    }

    // Check if there are associated drugs
    const drugCount = await prisma.drug.count({
      where: { drugClassId: id }
    })

    if (drugCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete drug class with associated drugs'
      }, { status: 400 })
    }

    await prisma.drugClass.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Drug class deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting drug class:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete drug class'
    }, { status: 500 })
  }
}