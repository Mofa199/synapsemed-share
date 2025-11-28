import { NextRequest, NextResponse } from 'next/server';

// Mock exam questions data
const mockExamQuestions: Record<string, any[]> = {
  '1': [ // USMLE Step 1
    {
      id: 1,
      question: "A 65-year-old man presents to the emergency department with sudden onset of severe chest pain that radiates to his back. His blood pressure is 180/110 mmHg in the right arm and 150/90 mmHg in the left arm. Which of the following is the most likely diagnosis?",
      options: [
        "A. Myocardial infarction",
        "B. Pulmonary embolism",
        "C. Aortic dissection",
        "D. Pericarditis",
        "E. Pneumothorax"
      ],
      correctAnswer: 2,
      explanation: "The combination of severe chest pain radiating to the back and unequal blood pressures (a sign of pulse deficit) is classic for aortic dissection. The sudden onset and severe nature of the pain also support this diagnosis.",
      category: "Cardiology",
      difficulty: "ADVANCED"
    },
    {
      id: 2,
      question: "Which of the following enzymes is most specific for myocardial injury?",
      options: [
        "A. Creatine kinase (CK)",
        "B. Lactate dehydrogenase (LDH)",
        "C. Aspartate aminotransferase (AST)",
        "D. Troponin I",
        "E. Myoglobin"
      ],
      correctAnswer: 3,
      explanation: "Troponin I is the most specific marker for myocardial injury. While other markers like CK-MB and myoglobin may also be elevated in myocardial infarction, troponin I has both high sensitivity and specificity for myocardial damage.",
      category: "Cardiology",
      difficulty: "INTERMEDIATE"
    },
    {
      id: 3,
      question: "A 45-year-old woman with a history of Graves' disease presents with palpitations and heat intolerance. Which of the following medications is most appropriate for initial treatment of her condition?",
      options: [
        "A. Propranolol",
        "B. Methimazole",
        "C. Radioactive iodine",
        "D. Levothyroxine",
        "E. Propylthiouracil"
      ],
      correctAnswer: 0,
      explanation: "Propranolol, a beta-blocker, is the most appropriate initial treatment for symptomatic relief of palpitations, tremor, and heat intolerance in hyperthyroidism. It provides rapid symptom control while other definitive treatments like methimazole take effect.",
      category: "Endocrinology",
      difficulty: "INTERMEDIATE"
    },
    {
      id: 4,
      question: "Which of the following is the most common cause of secondary hypertension?",
      options: [
        "A. Renal artery stenosis",
        "B. Primary aldosteronism",
        "C. Pheochromocytoma",
        "D. Cushing's syndrome",
        "E. Coarctation of the aorta"
      ],
      correctAnswer: 1,
      explanation: "Primary aldosteronism (Conn's syndrome) is the most common cause of secondary hypertension, accounting for approximately 5-10% of all hypertension cases. It results from autonomous aldosterone production, leading to sodium retention and potassium wasting.",
      category: "Nephrology",
      difficulty: "ADVANCED"
    },
    {
      id: 5,
      question: "A 30-year-old man presents with sudden onset of severe headache described as 'the worst headache of my life.' Physical examination reveals nuchal rigidity. Which of the following is the most appropriate initial diagnostic test?",
      options: [
        "A. CT scan of the head",
        "B. MRI of the brain",
        "C. Lumbar puncture",
        "D. Cerebral angiography",
        "E. EEG"
      ],
      correctAnswer: 0,
      explanation: "In a patient presenting with sudden severe headache (thunderclap headache) and signs of meningeal irritation, non-contrast CT scan of the head is the most appropriate initial test to evaluate for subarachnoid hemorrhage. It is highly sensitive when performed within 6 hours of symptom onset.",
      category: "Neurology",
      difficulty: "ADVANCED"
    }
  ],
  '2': [ // NCLEX-RN - Placeholder (would have different questions)
    // Add NCLEX questions here
  ],
  '3': [ // Pharmacology - Placeholder
    // Add pharmacy questions here
  ],
  '4': [ // Cardiology - Placeholder
    // Reuse cardiology questions or add new ones
  ],
  '5': [ // Nursing Fundamentals - Placeholder
    // Add nursing fundamental questions here
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;

    // Get questions for this exam
    const questions = mockExamQuestions[examId] || mockExamQuestions['1'];

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
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;
    const { userId, answers, timeUsed } = await request.json();
    
    const questions = mockExamQuestions[examId] || mockExamQuestions['1'];
    
    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questions.length;
    
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70; // Default passing score
    
    // Calculate XP earned
    const baseXP = 100;
    const scoreBonus = Math.floor(score / 10) * 10;
    const speedBonus = timeUsed < 900 ? 20 : 0; // Bonus for completing in under 15 mins
    const xpEarned = baseXP + scoreBonus + speedBonus;
    
    // Check achievements
    const achievementsEarned = [];
    if (score === 100) {
      achievementsEarned.push('perfect_score');
    }
    if (score >= 90) {
      achievementsEarned.push('expert_level');
    }
    if (score >= 80) {
      achievementsEarned.push('advanced_learner');
    }
    if (timeUsed < 600) {
      achievementsEarned.push('speed_demon');
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
