import { NextRequest, NextResponse } from 'next/server'
import { getDrugById, updateDrug, deleteDrug } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const drug = await getDrugById(params.id)
    
    if (!drug) {
      return NextResponse.json(
        { success: false, error: 'Drug not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: drug })
  } catch (error) {
    console.error('Error fetching drug:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch drug' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      name,
      genericName,
      brandNames,
      drugClassId,
      description,
      mechanism,
      indications,
      contraindications,
      sideEffects,
      dosage,
      administration,
      halfLife,
      metabolism,
      interactions,
      precautions,
      isActive
    } = body

    if (!name || !drugClassId) {
      return NextResponse.json(
        { success: false, error: 'Name and drug class ID are required' },
        { status: 400 }
      )
    }

    const drug = await updateDrug(params.id, {
      name,
      genericName,
      brandNames,
      drugClassId,
      description,
      mechanism,
      indications,
      contraindications,
      sideEffects,
      dosage,
      administration,
      halfLife,
      metabolism,
      interactions,
      precautions,
      isActive,
    })

    return NextResponse.json({ success: true, data: drug })
  } catch (error) {
    console.error('Error updating drug:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update drug' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDrug(params.id)
    return NextResponse.json({ success: true, message: 'Drug deleted successfully' })
  } catch (error) {
    console.error('Error deleting drug:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete drug' },
      { status: 500 }
    )
  }
}