import { NextRequest, NextResponse } from 'next/server';

// Mock achievements data
const mockAchievements = [
  {
    id: 'perfect_score',
    name: 'perfect_score',
    title: 'Perfect Score',
    description: 'Score 100% on any exam',
    icon: 'Trophy',
    category: 'EXAM',
    xpReward: 200,
    tier: 'GOLD',
    condition: { type: 'exam_score', value: 100 }
  },
  {
    id: 'expert_level',
    name: 'expert_level',
    title: 'Expert Level',
    description: 'Score 90% or higher on an exam',
    icon: 'Award',
    category: 'EXAM',
    xpReward: 100,
    tier: 'SILVER',
    condition: { type: 'exam_score_min', value: 90 }
  },
  {
    id: 'advanced_learner',
    name: 'advanced_learner',
    title: 'Advanced Learner',
    description: 'Score 80% or higher on an exam',
    icon: 'Star',
    category: 'EXAM',
    xpReward: 50,
    tier: 'BRONZE',
    condition: { type: 'exam_score_min', value: 80 }
  },
  {
    id: 'speed_demon',
    name: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete an exam in under 10 minutes',
    icon: 'Zap',
    category: 'EXAM',
    xpReward: 75,
    tier: 'SILVER',
    condition: { type: 'exam_time_max', value: 600 }
  },
  {
    id: 'completion_master',
    name: 'completion_master',
    title: 'Completion Master',
    description: 'Answer all questions in an exam',
    icon: 'CheckCircle',
    category: 'EXAM',
    xpReward: 25,
    tier: 'BRONZE',
    condition: { type: 'exam_completion', value: 100 }
  },
  {
    id: 'exam_veteran',
    name: 'exam_veteran',
    title: 'Exam Veteran',
    description: 'Complete 10 exam simulations',
    icon: 'Target',
    category: 'EXAM',
    xpReward: 150,
    tier: 'GOLD',
    condition: { type: 'exam_count', value: 10 }
  },
  {
    id: 'week_streak',
    name: 'week_streak',
    title: '7-Day Streak',
    description: 'Study for 7 consecutive days',
    icon: 'Flame',
    category: 'STREAK',
    xpReward: 100,
    tier: 'SILVER',
    condition: { type: 'streak_days', value: 7 }
  },
  {
    id: 'month_streak',
    name: 'month_streak',
    title: '30-Day Streak',
    description: 'Study for 30 consecutive days',
    icon: 'Flame',
    category: 'STREAK',
    xpReward: 500,
    tier: 'PLATINUM',
    condition: { type: 'streak_days', value: 30 }
  }
];

// Mock user achievements
const mockUserAchievements: Record<string, any[]> = {
  'default': [
    {
      id: '1',
      achievementId: 'expert_level',
      unlockedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      progress: 100
    },
    {
      id: '2',
      achievementId: 'advanced_learner',
      unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 100
    },
    {
      id: '3',
      achievementId: 'completion_master',
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 100
    },
    {
      id: '4',
      achievementId: 'week_streak',
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 100
    }
  ]
};

// GET - Fetch all achievements or user's achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Fetch user's unlocked achievements
      const userAchievements = mockUserAchievements[userId] || mockUserAchievements['default'];
      
      const enrichedAchievements = userAchievements.map(ua => {
        const achievement = mockAchievements.find(a => a.id === ua.achievementId);
        return {
          ...ua,
          ...achievement
        };
      });

      return NextResponse.json({
        success: true,
        achievements: enrichedAchievements,
        totalUnlocked: enrichedAchievements.length,
        totalAvailable: mockAchievements.length
      });
    } else {
      // Fetch all available achievements
      return NextResponse.json({
        success: true,
        achievements: mockAchievements
      });
    }
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST - Unlock achievement for user
export async function POST(request: NextRequest) {
  try {
    const { userId, achievementId } = await request.json();
    
    const achievement = mockAchievements.find(a => a.id === achievementId);
    
    if (!achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      );
    }

    const newUserAchievement = {
      id: String(Date.now()),
      achievementId,
      unlockedAt: new Date().toISOString(),
      progress: 100
    };

    return NextResponse.json({
      success: true,
      achievement: {
        ...newUserAchievement,
        ...achievement
      },
      message: `Achievement unlocked: ${achievement.title}!`,
      xpEarned: achievement.xpReward
    });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return NextResponse.json(
      { error: 'Failed to unlock achievement' },
      { status: 500 }
    );
  }
}
