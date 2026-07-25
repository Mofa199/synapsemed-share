import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { topic, duration, level, preferences, pageContent } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `
You are SynapseMed Neural AI, a master medical education strategist powered by Google Gemini.
Create a personalized study plan for a medical student.
Topic: ${topic}
Duration: ${duration || '4 weeks'}
Student Level: ${level || 'Intermediate'}
Preferences: ${preferences || 'Balanced'}

Website Context (Current Page Data):
${pageContent ? pageContent.substring(0, 3000) : 'No page data provided.'}

Instructions:
Generate a structured weekly study plan. Use the website context if relevant.
Return the output strictly in the following JSON schema:
{
  "title": "Study Plan for ${topic}",
  "weeks": [
    {
      "week": 1,
      "focus": "Focus of the week",
      "tasks": [
        { "day": "Monday", "task": "Task description", "resource": "Resource type" }
      ]
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up potential markdown formatting from Gemini
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(responseText);

    return NextResponse.json(data)
  } catch (error) {
    console.error('AI Study Plan service error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create study plan',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
