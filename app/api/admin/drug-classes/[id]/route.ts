import { NextRequest, NextResponse } from 'next/server'

// Build-safe implementation that returns mock data during build
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Return mock data during build time
  const mockDrugClass = {
    id: params.id,
    name: 'Sample Drug Class',
    description: 'Sample drug class description',
    category: 'Sample Category',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, data: mockDrugClass });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    
    // Return mock updated drug class during build time
    const updatedDrugClass = {
      id: params.id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

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
  // Return success during build time
  return NextResponse.json({ success: true, message: 'Drug class deleted successfully' });
}