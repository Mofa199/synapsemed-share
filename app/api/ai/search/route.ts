import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || searchParams.get('q')
    const context = searchParams.get('context') || 'general'
    const filters = searchParams.get('filters')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

    const prompt = `
You are SynapseMedAI, an intelligent search assistant for medical education.
Help the user find relevant information and resources.

Search Query: ${query}
Context: ${context}
Filters: ${filters || 'None'}

Provide a helpful response that:
1. Explains the topic briefly
2. Suggests related concepts to explore
3. Recommends study approaches for this topic
4. Lists key subtopics worth investigating

Format your response clearly with headings.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    return NextResponse.json({
      query: query,
      results: [{
        title: `Search Results for "${query}"`,
        content: responseText,
        relevance: 1.0
      }],
      suggestions: [`Explore ${query} in detail`, `Practice questions on ${query}`, `View related topics`]
    })
  } catch (error) {
    console.error('AI Smart Search service error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to perform smart search',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, context, filters } = body
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

    const prompt = `
You are SynapseMedAI, an intelligent search assistant for medical education.
Help the user find relevant information and resources.

Search Query: ${query}
Context: ${context || 'General'}
Filters: ${filters || 'None'}

Provide a helpful response that:
1. Explains the topic briefly
2. Suggests related concepts to explore
3. Recommends study approaches for this topic
4. Lists key subtopics worth investigating

Format your response clearly with headings.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    return NextResponse.json({
      query: query,
      results: [{
        title: `Search Results for "${query}"`,
        content: responseText,
        relevance: 1.0
      }],
      suggestions: [`Explore ${query} in detail`, `Practice questions on ${query}`, `View related topics`]
    })
  } catch (error) {
    console.error('AI Smart Search service error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to perform smart search',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
