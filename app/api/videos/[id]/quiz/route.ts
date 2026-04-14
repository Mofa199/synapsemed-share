import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get quiz for video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const videoId = (await params).id;

    const quiz = await prisma.videoQuiz.findFirst({
      where: { videoId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // If no quiz in database, return mock quiz
    if (!quiz) {
      return NextResponse.json({
        id: `quiz-${videoId}`,
        videoId,
        title: "Cardiac Physiology Quiz",
        description: "Test your understanding of cardiac physiology concepts",
        passingScore: 70,
        questions: [
          {
            id: '1',
            question: "During which phase of the cardiac cycle does ventricular filling occur?",
            options: JSON.stringify([
              "Systole",
              "Diastole",
              "Isovolumetric contraction",
              "Ejection phase"
            ]),
            correctAnswer: 1,
            explanation: "Ventricular filling occurs during diastole when the ventricles are relaxed and the AV valves are open.",
            order: 0
          },
          {
            id: '2',
            question: "What is the primary pacemaker of the heart?",
            options: JSON.stringify([
              "AV node",
              "Bundle of His",
              "SA node",
              "Purkinje fibers"
            ]),
            correctAnswer: 2,
            explanation: "The SA (sinoatrial) node is the primary pacemaker, initiating the electrical impulse that causes the heart to beat.",
            order: 1
          },
          {
            id: '3',
            question: "What happens during isovolumetric contraction?",
            options: JSON.stringify([
              "All valves are open",
              "All valves are closed and ventricular pressure increases",
              "Blood is being ejected from ventricles",
              "Atria contract"
            ]),
            correctAnswer: 1,
            explanation: "During isovolumetric contraction, all valves are closed and ventricular pressure increases rapidly without any change in volume.",
            order: 2
          },
          {
            id: '4',
            question: "What does the P wave on an ECG represent?",
            options: JSON.stringify([
              "Ventricular depolarization",
              "Atrial depolarization",
              "Ventricular repolarization",
              "Atrial repolarization"
            ]),
            correctAnswer: 1,
            explanation: "The P wave represents atrial depolarization, which triggers atrial contraction.",
            order: 3
          },
          {
            id: '5',
            question: "What is the typical resting heart rate range for adults?",
            options: JSON.stringify([
              "40-50 bpm",
              "60-100 bpm",
              "100-120 bpm",
              "120-140 bpm"
            ]),
            correctAnswer: 1,
            explanation: "The normal resting heart rate for adults ranges from 60 to 100 beats per minute.",
            order: 4
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

// POST - Submit quiz attempt
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const videoId = (await params).id;
    const body = await request.json();
    const { userId, quizId, answers } = body;

    if (!userId || !quizId || !answers) {
      return NextResponse.json(
        { error: 'User ID, quiz ID, and answers are required' },
        { status: 400 }
      );
    }

    // Calculate score
    const quiz = await prisma.videoQuiz.findUnique({
      where: { id: quizId },
      include: { questions: true }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await prisma.videoQuizAttempt.create({
      data: {
        userId,
        videoQuizId: quizId,
        score,
        totalQuestions,
        answers: JSON.stringify(answers),
        passed
      }
    });

    return NextResponse.json({
      success: true,
      attempt,
      score,
      correctCount,
      totalQuestions,
      passed
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
