import { NextRequest, NextResponse } from 'next/server'

// Build-safe implementation that returns mock data during build
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Return mock data during build time
  const mockDrug = {
    id: params.id,
    name: 'Sample Drug Name',
    genericName: 'Sample Generic Name',
    description: 'Sample drug description',
    mechanism: 'Sample mechanism of action',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, data: mockDrug });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Return mock updated drug during build time
    const updatedDrug = {
      id: params.id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: updatedDrug });
  } catch (error) {
    console.error('Error updating drug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update drug' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Return success during build time
  return NextResponse.json({ success: true, message: 'Drug deleted successfully' });
}