import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, duration, level, objectives, pageContent } = body

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", generationConfig: { responseMimeType: "application/json" } })

    const prompt = `
You are SynapseMedAI, an expert medical education curriculum designer.
Create a comprehensive lesson plan for medical educators.
Topic: ${topic}
Duration: ${duration || '60 minutes'}
Student Level: ${level || 'Intermediate'}
Learning Objectives: ${objectives || 'Not specified'}

Website Context (Current Page Data):
${pageContent ? pageContent.substring(0, 3000) : 'No page data provided.'}

Instructions:
Generate a detailed lesson plan with clear structure and timing.
Return the output strictly in the following JSON schema:
{
  "title": "Lesson Plan: ${topic}",
  "duration": "Total time",
  "objectives": ["Objective 1", "Objective 2"],
  "materials": ["Materials needed"],
  "activities": [
    {
      "phase": "Introduction/Body/Conclusion",
      "time": "X minutes",
      "description": "What to do",
      "teachingMethod": "Lecture/Discussion/Activity"
    }
  ],
  "assessment": "How to evaluate understanding"
}
`

    const result = await model.generateContent(prompt)
    let responseText = result.response.text()
    
    // Clean up potential markdown formatting
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
    
    const data = JSON.parse(responseText)

    return NextResponse.json(data)
  } catch (error) {
    console.error('AI Lesson Plan service error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate lesson plan',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
