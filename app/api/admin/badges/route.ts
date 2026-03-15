import { NextRequest, NextResponse } from 'next/server'

// Build-safe implementation that returns mock data during build
export async function GET(request: NextRequest) {
  // Return mock data during build time
  const mockBadges = [
    {
      id: '1',
      name: 'Sample Badge',
      description: 'Sample badge description',
      category: 'Sample Category',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
  
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const category = searchParams.get('category')

  let badges = mockBadges

  if (category && category !== 'all') {
    badges = badges.filter(badge => badge.category === category)
  }

  if (search) {
    badges = badges.filter(badge => 
      badge.name.toLowerCase().includes(search.toLowerCase()) ||
      (badge.description && badge.description.toLowerCase().includes(search.toLowerCase()))
    )
  }

  return NextResponse.json({
    success: true,
    data: badges,
    total: badges.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Create mock badge during build time
    const mockBadge = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      category: data.category,
      criteria: data.criteria,
      pointsRequired: data.pointsRequired ? parseInt(data.pointsRequired) : undefined,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockBadge,
      message: 'Badge created successfully'
    });
  } catch (error) {
    console.error('Error creating badge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create badge' },
      { status: 500 }
    );
  }
}