import { NextRequest, NextResponse } from 'next/server'
import { callNVIDIAAI } from '@/lib/nvidia-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, currentTopic, studentLevel } = body

    const systemPrompt = `You are SYNAPSEMED Neural AI, a high-end medical tutor and clinical assistant.
Context: ${context || 'general'}
Topic: ${currentTopic || 'medical learning'}
Student Level: ${studentLevel || 'Medical Student'}
`

    const responseText = await callNVIDIAAI({
      prompt: message,
      systemPrompt,
      temperature: 0.2,
      maxTokens: 1500,
    })

    return NextResponse.json({
      success: true,
      response: responseText,
      context,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process AI request',
        response: `⚠️ I encountered an error processing your request. Please try again.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    )
  }
}
