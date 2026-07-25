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
    const drugClass = await prisma.drugClass.findUnique({
      where: { id },
      include: {
        drugs: {
          select: { name: true }
        }
      }
    })

    if (!drugClass) {
      return NextResponse.json({ success: false, error: 'Drug class not found' }, { status: 404 })
    }

    // Transform string arrays back to arrays for frontend
    const formattedData = {
      ...drugClass,
      therapeuticUses: drugClass.therapeuticUses ? drugClass.therapeuticUses.split('\n') : [],
      commonSideEffects: drugClass.commonSideEffects ? drugClass.commonSideEffects.split('\n') : [],
      contraindications: drugClass.contraindications ? drugClass.contraindications.split('\n') : [],
      drugs: drugClass.drugs.map(d => d.name)
    }

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error fetching drug class:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch drug class' }, { status: 500 });
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
    const body = await request.json();
    
    // Process array fields into strings
    const updateData: any = { ...body }
    delete updateData.id
    delete updateData.drugs // Can't update related drugs directly here easily
    
    const arrayFields = ['therapeuticUses', 'commonSideEffects', 'contraindications']
    arrayFields.forEach(field => {
      if (Array.isArray(updateData[field])) {
        updateData[field] = updateData[field].join('\n')
      }
    })

    const updatedDrugClass = await prisma.drugClass.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: updatedDrugClass });
  } catch (error) {
    console.error('Error updating drug class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update drug class' },
      { status: 500 }
    );
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
    await prisma.drugClass.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true, message: 'Drug class deleted successfully' });
  } catch (error) {
    console.error('Error deleting drug class:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete drug class' }, { status: 500 });
  }
}