import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, count, context, studentLevel, difficulty, pageContent } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `
You are SynapseMedAI, an expert medical professor creating practice exams.
Student Level: ${studentLevel || 'General'}
Difficulty: ${difficulty || 'intermediate'}
User Context: ${context || 'General'}

Website Context (Current Page Data):
${pageContent ? pageContent.substring(0, 3000) : 'No page data provided.'}

Topic to generate exam questions for: ${topic}
Number of questions: ${count || 5}

Instructions:
Generate exactly ${count || 5} multiple-choice exam questions. Use the website context if relevant.
Return the output strictly in the following JSON schema:
{
  "topic": "${topic}",
  "questions": [
    {
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // index of correct option (0-3)
      "explanation": "Detailed explanation of why this is correct..."
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return NextResponse.json(data)
  } catch (error) {
    console.error('AI Exam Questions service error:', error)
    return NextResponse.json(
      { error: 'Failed to generate exam questions', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}