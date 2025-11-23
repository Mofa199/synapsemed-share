import { NextRequest, NextResponse } from 'next/server'
import { getAllPartners, createPartner } from '@/lib/db-utils'

export async function GET() {
  try {
    const partners = await getAllPartners()
    return NextResponse.json({ success: true, data: partners })
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch partners' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const website = formData.get('website') as string
    const contactEmail = formData.get('contactEmail') as string
    const contactPhone = formData.get('contactPhone') as string
    const contactName = formData.get('contactName') as string
    const partnershipType = formData.get('partnershipType') as string
    const type = formData.get('type') as 'UNIVERSITY' | 'HOSPITAL' | 'PHARMACEUTICAL' | 'ORGANIZATION'

    if (!name || !description || !contactEmail || !contactName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const partner = await createPartner({
      name,
      description,
      type: type || 'ORGANIZATION',
      website,
      contactName,
      contactEmail,
      contactPhone,
      partnershipType,
    })

    return NextResponse.json({ success: true, data: partner })
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create partner' },
      { status: 500 }
    )
  }
}
