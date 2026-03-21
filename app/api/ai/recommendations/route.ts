import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentContext, level, weakAreas, preferences, pageContent } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `
You are SynapseMedAI, a personalized learning coach for medical students.
Student Level: ${level || 'General'}
Current Context: ${currentContext || 'General'}
Weak Areas: ${weakAreas ? weakAreas.join(', ') : 'None specified'}

Website Context (Current Page Data):
${pageContent ? pageContent.substring(0, 3000) : 'No page data provided.'}

Instructions:
Analyze the student's profile and current website page data to suggest EXACTLY 3 powerful study recommendations.
Return the output strictly in the following JSON schema:
{
  "recommendations": [
    {
      "title": "Clear action title",
      "description": "Detailed explanation of what to do and why.",
      "priority": "high" | "medium" | "low",
      "resources": ["Resource 1", "Resource 2"]
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return NextResponse.json(data)
  } catch (error) {
    console.error('AI Recommendations service error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}