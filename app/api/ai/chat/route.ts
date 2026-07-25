import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, currentTopic, studentLevel, history } = body

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'GEMINI_API_KEY not configured',
          response: "⚠️ AI service is currently unavailable. Please check configuration."
        },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const chatHistory = history?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })) || [];

    const chat = model.startChat({
      history: chatHistory,
    });

    const systemPrompt = `
You are SYNAPSEMED Neural AI, a high-end medical tutor and clinical assistant.
Context: ${context || 'general'}
Topic: ${currentTopic || 'medical learning'}
Student Level: ${studentLevel || 'Medical Student'}

Tone: Professional, expert, encouraging, and clear.
Objective: Provide accurate, evidence-based medical information and study guidance.
`;

    const result = await chat.sendMessage(`${systemPrompt}\n\nUser Message: ${message}`);
    const responseText = result.response.text();

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
