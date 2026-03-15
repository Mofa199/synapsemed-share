import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, context, studentLevel, pageContent } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `
You are SynapseMedAI, an expert medical tutor generating study flashcards.
Student Level: ${studentLevel || 'General'}
User Context: ${context || 'General'}

Website Context (Current Page Data):
${pageContent ? pageContent.substring(0, 3000) : 'No page data provided.'}

Topic to generate flashcards for: ${topic}

Instructions:
Generate exactly 5 medical flashcards for this topic. Use the website context if relevant.
Return the output strictly in the following JSON schema:
{
  "topic": "${topic}",
  "flashcards": [
    {
      "front": "Question or concept...",
      "back": "Answer or explanation...",
      "hint": "Brief hint..."
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return NextResponse.json(data)
  } catch (error) {
    console.error('AI Flashcards service error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI flashcards', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}