import { NextRequest, NextResponse } from 'next/server';

// Mock data - will be replaced with database queries
const mockExamSimulations = [
  {
    id: '1',
    title: 'USMLE Step 1 Practice Exam',
    description: 'Comprehensive practice exam covering all basic sciences for USMLE Step 1 preparation',
    field: 'MEDICAL',
    duration: 1800, // 30 minutes
    totalQuestions: 5,
    passingScore: 70,
    difficulty: 'ADVANCED',
    category: 'USMLE Step 1',
    isActive: true,
    isPublic: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'NCLEX-RN Comprehensive Review',
    description: 'Full-length NCLEX-RN practice exam with real-world scenarios',
    field: 'NURSING',
    duration: 2400, // 40 minutes
    totalQuestions: 8,
    passingScore: 75,
    difficulty: 'ADVANCED',
    category: 'NCLEX-RN',
    isActive: true,
    isPublic: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Pharmacology Quick Assessment',
    description: 'Quick pharmacology assessment covering major drug classes',
    field: 'PHARMACY',
    duration: 900, // 15 minutes
    totalQuestions: 3,
    passingScore: 70,
    difficulty: 'INTERMEDIATE',
    category: 'Pharmacology',
    isActive: true,
    isPublic: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Cardiology Intensive Exam',
    description: 'Advanced cardiology exam for medical students and residents',
    field: 'MEDICAL',
    duration: 2100, // 35 minutes
    totalQuestions: 7,
    passingScore: 80,
    difficulty: 'ADVANCED',
    category: 'Cardiology',
    isActive: true,
    isPublic: false, // Assigned by lecturers only
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Nursing Fundamentals Review',
    description: 'Basic nursing fundamentals for first-year nursing students',
    field: 'NURSING',
    duration: 1200, // 20 minutes
    totalQuestions: 4,
    passingScore: 70,
    difficulty: 'BEGINNER',
    category: 'Nursing Fundamentals',
    isActive: true,
    isPublic: true,
    createdAt: new Date().toISOString()
  }
];

// GET - Fetch all available exam simulations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');

    let filteredExams = mockExamSimulations.filter(exam => exam.isActive);

    if (field) {
      filteredExams = filteredExams.filter(exam => exam.field === field);
    }

    if (difficulty) {
      filteredExams = filteredExams.filter(exam => exam.difficulty === difficulty);
    }

    if (category) {
      filteredExams = filteredExams.filter(exam => exam.category === category);
    }

    return NextResponse.json(filteredExams);
  } catch (error) {
    console.error('Error fetching exam simulations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam simulations' },
      { status: 500 }
    );
  }
}

// POST - Create new exam simulation (admin/lecturer only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newExam = {
      id: String(mockExamSimulations.length + 1),
      ...body,
      createdAt: new Date().toISOString()
    };

    mockExamSimulations.push(newExam);

    return NextResponse.json({ 
      success: true, 
      exam: newExam 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating exam simulation:', error);
    return NextResponse.json(
      { error: 'Failed to create exam simulation' },
      { status: 500 }
    );
  }
}
