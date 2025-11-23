import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// SuperMemo SM-2 Algorithm implementation
function calculateNextReview(easeFactor: number, repetitions: number, interval: number, quality: number) {
  // quality: 0-5 (0=complete blackout, 5=perfect response)
  let newEaseFactor = easeFactor
  let newRepetitions = repetitions
  let newInterval = interval

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      newInterval = 1
    } else if (repetitions === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * easeFactor)
    }
    newRepetitions = repetitions + 1
  } else {
    // Incorrect response - reset
    newRepetitions = 0
    newInterval = 1
  }

  // Update ease factor
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3
  }

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000)
  }
}

// GET /api/user/spaced-repetition/review - Get cards to review
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Mock data - in production, query cards due for review
    const mockCards = [
      {
        id: '1',
        front: 'What are the four chambers of the heart?',
        back: 'The four chambers are: Left atrium, Right atrium, Left ventricle, and Right ventricle. The atria receive blood while the ventricles pump blood out.',
        category: 'Cardiovascular System',
        tags: ['anatomy', 'heart', 'cardiovascular'],
        difficulty: 'Beginner',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReviewDate: new Date().toISOString()
      },
      {
        id: '2',
        front: 'What is the mechanism of action of beta-blockers?',
        back: 'Beta-blockers competitively inhibit beta-adrenergic receptors, reducing heart rate, contractility, and blood pressure. They are used in hypertension, angina, and arrhythmias.',
        category: 'Pharmacology',
        tags: ['beta blockers', 'cardiovascular drugs', 'mechanism'],
        difficulty: 'Intermediate',
        easeFactor: 2.5,
        interval: 3,
        repetitions: 1,
        nextReviewDate: new Date().toISOString()
      },
      {
        id: '3',
        front: 'Name the layers of the epidermis from superficial to deep',
        back: 'Stratum Corneum, Stratum Lucidum (only in thick skin), Stratum Granulosum, Stratum Spinosum, Stratum Basale. Mnemonic: Come, Let\'s Get Sun Burned.',
        category: 'Anatomy',
        tags: ['skin', 'histology', 'integumentary'],
        difficulty: 'Intermediate',
        easeFactor: 2.3,
        interval: 2,
        repetitions: 1,
        nextReviewDate: new Date().toISOString()
      },
      {
        id: '4',
        front: 'What is the difference between Type 1 and Type 2 Diabetes Mellitus?',
        back: 'Type 1 DM is autoimmune destruction of pancreatic beta cells causing absolute insulin deficiency. Type 2 DM is insulin resistance with relative insulin deficiency. Type 1 typically occurs in younger patients, while Type 2 is associated with obesity and older age.',
        category: 'Pathophysiology',
        tags: ['diabetes', 'endocrine', 'metabolism'],
        difficulty: 'Advanced',
        easeFactor: 2.6,
        interval: 5,
        repetitions: 2,
        nextReviewDate: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockCards
    })
  } catch (error) {
    console.error('Error fetching review cards:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch review cards'
    }, { status: 500 })
  }
}

// POST /api/user/spaced-repetition/review - Submit review response
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { cardId, quality } = body

    if (cardId === undefined || quality === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Card ID and quality are required'
      }, { status: 400 })
    }

    // In production, fetch the card from database
    // For now, simulate the calculation
    const currentCard = {
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0
    }

    const nextReview = calculateNextReview(
      currentCard.easeFactor,
      currentCard.repetitions,
      currentCard.interval,
      quality
    )

    // In production, update the card in database with new values
    // await prisma.spacedRepetitionCard.update({
    //   where: { id: cardId },
    //   data: nextReview
    // })

    return NextResponse.json({
      success: true,
      data: {
        nextReviewDate: nextReview.nextReviewDate,
        interval: nextReview.interval,
        message: quality >= 3 ? 'Great job!' : 'Keep practicing!'
      }
    })
  } catch (error) {
    console.error('Error submitting review:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to submit review'
    }, { status: 500 })
  }
}
