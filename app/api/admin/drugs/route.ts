import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/drugs - Get all drugs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const drugClassId = searchParams.get('drugClassId')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}
    if (drugClassId) where.drugClassId = drugClassId
    if (category) where.drugClass = { category }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const drugs = await prisma.drug.findMany({
      where,
      include: {
        drugClass: {
          select: { id: true, name: true, category: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: drugs
    });
  } catch (error) {
    console.error('Error fetching drugs:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch drugs'
    }, { status: 500 });
  }
}

// POST /api/admin/drugs - Create new drug
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      warnings,
      sideEffectsCommon,
      sideEffectsSerious,
      sideEffectsRare,
      interactions,
      monitoring,
      storage,
      pregnancy,
      administrationRoute,
      isActive = true,
      curriculumId,
      moduleId
    } = body

    if (!name || !drugClassId) {
      return NextResponse.json({
        success: false,
        error: 'Name and drug class ID are required'
      }, { status: 400 })
    }

    const drug = await prisma.drug.create({
      data: {
        name,
        genericName: genericName || null,
        brandNames: Array.isArray(brandNames) ? brandNames.join(', ') : (brandNames || ''),
        drugClassId,
        description: description || null,
        mechanism: mechanism || null,
        indications: Array.isArray(indications) ? indications.join('\n') : (indications || ''),
        dosageAdult: dosageAdult || null,
        dosagePediatric: dosagePediatric || null,
        dosageElderly: dosageElderly || null,
        contraindications: Array.isArray(contraindications) ? contraindications.join('\n') : (contraindications || ''),
        warnings: Array.isArray(warnings) ? warnings.join('\n') : (warnings || ''),
        sideEffectsCommon: Array.isArray(sideEffectsCommon) ? sideEffectsCommon.join('\n') : (sideEffectsCommon || ''),
        sideEffectsSerious: Array.isArray(sideEffectsSerious) ? sideEffectsSerious.join('\n') : (sideEffectsSerious || ''),
        sideEffectsRare: Array.isArray(sideEffectsRare) ? sideEffectsRare.join('\n') : (sideEffectsRare || ''),
        interactions: Array.isArray(interactions) ? interactions.join('\n') : (interactions || ''),
        monitoring: Array.isArray(monitoring) ? monitoring.join('\n') : (monitoring || ''),
        storage: storage || null,
        pregnancy: pregnancy || null,
        administrationRoute: administrationRoute || null,
        isActive,
        curriculumId: curriculumId || null,
        moduleId: moduleId || null,
      },
      include: {
        drugClass: {
          select: { id: true, name: true, category: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: drug
    });
  } catch (error) {
    console.error('Error creating drug:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create drug'
    }, { status: 500 });
  }
}

// PUT /api/admin/drugs - Update drug
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Drug ID is required'
      }, { status: 400 })
    }

    // Process array fields to strings if they are arrays
    const processedData: any = { ...updateData }
    const arrayFields = [
      'brandNames', 'indications', 'contraindications', 'warnings', 
      'sideEffectsCommon', 'sideEffectsSerious', 'sideEffectsRare', 
      'interactions', 'monitoring'
    ]
    
    arrayFields.forEach(field => {
      if (Array.isArray(processedData[field])) {
        processedData[field] = processedData[field].join(field === 'brandNames' ? ', ' : '\n')
      }
    })

    const drug = await prisma.drug.update({
      where: { id },
      data: processedData,
      include: {
        drugClass: {
          select: { id: true, name: true, category: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: drug
    });
  } catch (error) {
    console.error('Error updating drug:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update drug'
    }, { status: 500 });
  }
}

// DELETE /api/admin/drugs - Delete drug
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
        error: 'Drug ID is required'
      }, { status: 400 })
    }

    await prisma.drug.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Drug deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting drug:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete drug'
    }, { status: 500 });
  }
}