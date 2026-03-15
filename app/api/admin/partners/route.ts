import { NextRequest, NextResponse } from 'next/server'

// Build-safe implementation that returns mock data during build
export async function GET() {
  // Return mock data during build time
  const mockPartners = [
    {
      id: '1',
      name: 'Sample Partner',
      description: 'Sample partner description',
      type: 'ORGANIZATION',
      contactEmail: 'sample@example.com',
      contactName: 'Sample Contact',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
  
  return NextResponse.json({ success: true, data: mockPartners });
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

    // Create mock partner during build time
    const mockPartner = {
      id: Math.random().toString(36).substring(7),
      name,
      description,
      type: type || 'ORGANIZATION',
      website,
      contactName,
      contactEmail,
      contactPhone,
      partnershipType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: mockPartner });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}
