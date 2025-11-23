import { NextRequest, NextResponse } from 'next/server';

// Mock user XP data
const mockUserXP: Record<string, any> = {
  'default': {
    totalXP: 2450,
    level: 5,
    currentLevelXP: 450,
    nextLevelXP: 1000,
    recentTransactions: [
      {
        id: '1',
        amount: 130,
        source: 'EXAM_COMPLETION',
        description: 'Completed USMLE Step 1 Practice Exam',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        amount: 50,
        source: 'QUIZ_COMPLETION',
        description: 'Completed Cardiology Quiz',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        amount: 10,
        source: 'DAILY_LOGIN',
        description: 'Daily login bonus',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        amount: 100,
        source: 'ACHIEVEMENT_UNLOCK',
        description: 'Unlocked "Expert Level" achievement',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        amount: 25,
        source: 'STREAK_BONUS',
        description: '7-day study streak bonus',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
};

// GET - Fetch user XP data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';

    const userData = mockUserXP[userId] || mockUserXP['default'];

    return NextResponse.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error fetching user XP:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user XP data' },
      { status: 500 }
    );
  }
}

// POST - Award XP to user
export async function POST(request: NextRequest) {
  try {
    const { userId, amount, source, description } = await request.json();
    
    const newTransaction = {
      id: String(Date.now()),
      amount,
      source,
      description,
      createdAt: new Date().toISOString()
    };

    // In a real app, this would update the database
    // For now, just return success
    return NextResponse.json({
      success: true,
      transaction: newTransaction,
      message: `+${amount} XP earned!`
    });
  } catch (error) {
    console.error('Error awarding XP:', error);
    return NextResponse.json(
      { error: 'Failed to award XP' },
      { status: 500 }
    );
  }
}
