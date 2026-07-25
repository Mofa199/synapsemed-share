import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, examType, difficulty, studyTips, pageContent } = body

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

    const prompt = `
You are SynapseMed Neural AI, an expert medical exam preparation mentor powered by Google Gemini.
Help students prepare for their medical exams on this topic.
Topic: ${topic}
Exam Type: ${examType || 'General medical exam'}
Difficulty: ${difficulty || 'Intermediate'}

Website Context (Current Page Data):
${pageContent ? pageContent.substring(0, 3000) : 'No page data provided.'}

Provide comprehensive exam mentoring including:
1. Key concepts to focus on
2. Common exam question patterns
3. Study strategies specific to this topic
4. Time management tips for the exam
5. Memory techniques for complex information

Format your response in a clear, structured way with headings and bullet points.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    return NextResponse.json({
      topic: topic,
      mentorship: responseText,
      tips: ["Review key concepts", "Practice with sample questions", "Use active recall techniques"]
    })
  } catch (error) {
    console.error('AI Exam Mentor service error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get exam mentoring',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
