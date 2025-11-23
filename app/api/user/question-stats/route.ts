import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get user question statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'student-001';

    // Try to fetch from database
    // In real implementation, calculate from user's question attempts
    
    // For now, return mock data with realistic stats
    const stats = {
      totalQuestions: 1250,
      avgAccuracy: 78,
      hoursPracticed: 24,
      streakDays: 85,
      totalAttempts: 450,
      correctAnswers: 351,
      incorrectAnswers: 99,
      questionsToReview: 30,
      avgTimePerQuestion: 90, // seconds
      lastPracticeDate: new Date(),
      topCategories: [
        { category: 'Cardiology', accuracy: 85 },
        { category: 'Anatomy', accuracy: 82 },
        { category: 'Pharmacology', accuracy: 75 }
      ],
      weakAreas: [
        { category: 'Biochemistry', accuracy: 65 },
        { category: 'Pathology', accuracy: 68 }
      ]
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching question stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
