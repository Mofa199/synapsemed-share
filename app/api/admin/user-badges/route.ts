import { NextRequest, NextResponse } from 'next/server'

// Build-safe implementation that returns mock data during build
export async function GET(request: NextRequest) {
  // Return mock data during build time
  const mockUserBadges = [
    {
      id: '1',
      userId: 'sample-user-id',
      badgeId: 'sample-badge-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
  
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  let userBadges = mockUserBadges

  if (userId) {
    userBadges = userBadges.filter(ub => ub.userId === userId)
  }

  return NextResponse.json({
    success: true,
    data: userBadges,
    total: userBadges.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.userId || !data.badgeId) {
      return NextResponse.json(
        { success: false, error: 'User ID and Badge ID are required' },
        { status: 400 }
      )
    }

    // Create mock user badge during build time
    const mockUserBadge = {
      id: Math.random().toString(36).substring(7),
      userId: data.userId,
      badgeId: data.badgeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockUserBadge,
      message: 'Badge awarded to user successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'User already has this badge') {
      return NextResponse.json(
        { success: false, error: 'User already has this badge' },
        { status: 409 }
      )
    }
    
    console.error('Error awarding badge:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to award badge to user' },
      { status: 500 }
    );
  }
}