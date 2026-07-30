import { NextRequest, NextResponse } from 'next/server'
import { callNVIDIAAI } from '@/lib/nvidia-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, context, studentLevel, pageContent } = body

    const systemPrompt = `You are SynapseMed Neural AI, an expert medical professor and clinical decision support tutor.
Student Level: ${studentLevel || 'General'}
User Context: ${context || 'General'}

Page Context:
${pageContent ? pageContent.substring(0, 3000) : 'No page data provided.'}
`

    const responseText = await callNVIDIAAI({
      prompt: question,
      systemPrompt,
      temperature: 0.2,
      maxTokens: 1500,
    })

    return NextResponse.json({
      question: question,
      answer: responseText,
      sources: ["SynapseMed Neural AI Engine (NVIDIA NIM / Gemini)"]
    })
  } catch (error) {
    console.error('AI Answer service error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI answer', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
