/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm Implementation
 * Calculates card review intervals, ease factor, and next review date.
 */

export interface SM2Input {
  repetitions: number   // Number of consecutive correct answers
  easeFactor: number    // Current ease factor (default 2.5)
  interval: number      // Current interval in days
  grade: number         // Rating: 1 = Again/Blackout, 2 = Hard, 3 = Good, 4 = Easy, 5 = Perfect
}

export interface SM2Output {
  repetitions: number
  easeFactor: number
  interval: number
  nextReviewDate: Date
}

export function calculateSM2({ repetitions, easeFactor, interval, grade }: SM2Input): SM2Output {
  let nextRepetitions = repetitions
  let nextEaseFactor = easeFactor
  let nextInterval = interval

  // Normalize grade (1-5)
  const q = Math.max(1, Math.min(5, grade))

  if (q >= 3) {
    // Correct response
    if (repetitions === 0) {
      nextInterval = 1
    } else if (repetitions === 1) {
      nextInterval = 6
    } else {
      nextInterval = Math.round(interval * easeFactor)
    }
    nextRepetitions += 1
  } else {
    // Incorrect response (reset sequence)
    nextRepetitions = 0
    nextInterval = 1
  }

  // Update Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  nextEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  if (nextEaseFactor < 1.3) {
    nextEaseFactor = 1.3
  }

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval)

  return {
    repetitions: nextRepetitions,
    easeFactor: Math.round(nextEaseFactor * 100) / 100,
    interval: nextInterval,
    nextReviewDate
  }
}
