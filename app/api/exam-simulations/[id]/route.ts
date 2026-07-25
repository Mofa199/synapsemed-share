import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/server-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const examId = (await params).id;

    // Get exam and its questions from the database
    const exam = await prisma.examSimulation.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Process questions: map options string back to array if it's stored as JSON string
    const questions = exam.questions.map(q => {
      let parsedOptions = [];
      try {
        parsedOptions = JSON.parse(q.options);
      } catch (e) {
        parsedOptions = q.options.split('\n').filter(o => o.trim() !== '');
      }
      return {
        ...q,
        options: parsedOptions
      };
    });

    return NextResponse.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam questions' },
      { status: 500 }
    );
  }
}

// POST - Submit exam attempt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'anonymous';
    
    const examId = (await params).id;
    const { answers, timeUsed } = await request.json();
    
    // Fetch exam and questions from DB
    const exam = await prisma.examSimulation.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const questions = exam.questions;
    
    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questions.length;
    
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const passed = score >= exam.passingScore;
    
    // Calculate XP earned
    const baseXP = 100;
    const scoreBonus = Math.floor(score / 10) * 10;
    const speedBonus = timeUsed < (exam.duration / 2) ? 20 : 0; // Bonus for completing in under half time
    const xpEarned = baseXP + scoreBonus + speedBonus;
    
    // Check achievements
    const achievementsEarned = [];
    if (score === 100) achievementsEarned.push('perfect_score');
    if (score >= 90) achievementsEarned.push('expert_level');
    if (score >= 80) achievementsEarned.push('advanced_learner');
    if (timeUsed < (exam.duration / 3)) achievementsEarned.push('speed_demon');
    
    // If user is logged in, save the attempt
    if (session?.user?.id) {
      await prisma.examAttempt.create({
        data: {
          userId: session.user.id,
          examId,
          answers: JSON.stringify(answers),
          score,
          totalQuestions,
          correctAnswers,
          timeUsed,
          completed: true,
          xpEarned,
          achievementsEarned: achievementsEarned.join(','),
        }
      });
      
      // Update user XP
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          points: { increment: xpEarned }
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      result: {
        score,
        correctAnswers,
        totalQuestions,
        passed,
        xpEarned,
        achievementsEarned,
        timeUsed
      }
    });
  } catch (error) {
    console.error('Error submitting exam attempt:', error);
    return NextResponse.json(
      { error: 'Failed to submit exam attempt' },
      { status: 500 }
    );
  }
}
