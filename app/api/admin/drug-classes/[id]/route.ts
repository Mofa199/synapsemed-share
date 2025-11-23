import { NextRequest, NextResponse } from 'next/server'
import { getDrugClassById, updateDrugClass, deleteDrugClass } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const drugClass = await getDrugClassById(params.id)
    
    if (!drugClass) {
      return NextResponse.json(
        { success: false, error: 'Drug class not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: drugClass })
  } catch (error) {
    console.error('Error fetching drug class:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch drug class' },
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
      description, 
      category,
      mechanism,
      indications,
      contraindications,
      sideEffects,
      isActive
    } = body

    if (!name || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and category are required' },
        { status: 400 }
      )
    }

    const drugClass = await updateDrugClass(params.id, {
      name,
      description,
      category,
      mechanism,
      indications,
      contraindications,
      sideEffects,
      isActive,
    })

    return NextResponse.json({ success: true, data: drugClass })
  } catch (error) {
    console.error('Error updating drug class:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update drug class' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDrugClass(params.id)
    return NextResponse.json({ success: true, message: 'Drug class deleted successfully' })
  } catch (error) {
    console.error('Error deleting drug class:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete drug class' },
      { status: 500 }
    )
  }
}