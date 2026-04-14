import { NextRequest, NextResponse } from 'next/server'
import { getPartnerById, updatePartner, deletePartner } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const partner = await getPartnerById(params.id)
    
    if (!partner) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: partner })
  } catch (error) {
    console.error('Error fetching partner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch partner' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { name, description, type, status, website, contactName, contactEmail, contactPhone, partnershipType } = body

    if (!name || !description || !type || !status || !contactName || !contactEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const partner = await updatePartner(params.id, {
      name,
      description,
      type,
      status,
      website,
      contactName,
      contactEmail,
      contactPhone,
      partnershipType,
    })

    return NextResponse.json({ success: true, data: partner })
  } catch (error) {
    console.error('Error updating partner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update partner' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await deletePartner(params.id)
    return NextResponse.json({ success: true, message: 'Partner deleted successfully' })
  } catch (error) {
    console.error('Error deleting partner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete partner' },
      { status: 500 }
    )
  }
}