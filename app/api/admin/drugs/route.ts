import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// GET /api/admin/drugs - Get all drugs
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const drugClassId = searchParams.get('drugClassId')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let whereClause: any = {}

    if (drugClassId) {
      whereClause.drugClassId = drugClassId
    }

    if (category) {
      whereClause.drugClass = {
        category: category
      }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } }
      ]
    }

    const drugs = await prisma.drug.findMany({
      where: whereClause,
      include: {
        drugClass: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: drugs
    })
  } catch (error) {
    console.error('Error fetching drugs:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch drugs'
    }, { status: 500 })
  }
}

// POST /api/admin/drugs - Create new drug
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role as string)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      genericName,
      brandNames,
      drugClassId,
      description,
      mechanism,
      indications,
      dosageAdult,
      dosagePediatric,
      dosageElderly,
      contraindications,
      interactions
    } = body

    if (!name || !genericName || !drugClassId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const drug = await prisma.drug.create({
      data: {
        name,
        genericName,
        brandNames: JSON.stringify(brandNames || []),
        drugClassId,
        description,
        mechanism,
        indications: JSON.stringify(indications || []),
        dosageAdult,
        dosagePediatric,
        dosageElderly,
        contraindications: JSON.stringify(contraindications || []),
        warnings: JSON.stringify([]),
        sideEffectsCommon: JSON.stringify([]),
        sideEffectsSerious: JSON.stringify([]),
        sideEffectsRare: JSON.stringify([]),
        interactions: JSON.stringify(interactions || []),
        monitoring: JSON.stringify([])
      },
      include: {
        drugClass: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: drug
    })
  } catch (error) {
    console.error('Error creating drug:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create drug'
    }, { status: 500 })
  }
}

// PUT /api/admin/drugs - Update drug
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role as string)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      name,
      genericName,
      brandNames,
      drugClassId,
      description,
      mechanism,
      indications,
      dosageAdult,
      dosagePediatric,
      dosageElderly,
      contraindications,
      interactions
    } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Drug ID is required'
      }, { status: 400 })
    }

    const drug = await prisma.drug.update({
      where: { id },
      data: {
        name,
        genericName,
        brandNames: brandNames ? JSON.stringify(brandNames) : undefined,
        drugClassId,
        description,
        mechanism,
        indications: indications ? JSON.stringify(indications) : undefined,
        dosageAdult,
        dosagePediatric,
        dosageElderly,
        contraindications: contraindications ? JSON.stringify(contraindications) : undefined,
        interactions: interactions ? JSON.stringify(interactions) : undefined,
        updatedAt: new Date()
      },
      include: {
        drugClass: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: drug
    })
  } catch (error) {
    console.error('Error updating drug:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update drug'
    }, { status: 500 })
  }
}

// DELETE /api/admin/drugs - Delete drug
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
        error: 'Drug ID is required'
      }, { status: 400 })
    }

    await prisma.drug.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Drug deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting drug:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete drug'
    }, { status: 500 })
  }
}