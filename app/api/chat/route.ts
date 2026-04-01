import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `You are a helpful medical education assistant for Synapse Med, an online learning platform for medical, nursing, and pharmacy students. 

Your role is to:
- Answer medical and healthcare-related questions accurately
- Provide educational explanations suitable for students
- Help with study techniques and learning strategies
- Explain complex medical concepts in simple terms
- Suggest relevant resources and study materials
- Always emphasize the importance of consulting healthcare professionals for medical advice

Guidelines:
- Be encouraging and supportive
- Use clear, educational language
- Provide evidence-based information
- Include disclaimers when appropriate
- Focus on learning and education, not diagnosis or treatment advice

Conversation History:
${history?.map((h: any) => `${h.role}: ${h.content}`).join('\n') || 'No previous conversation'}

Current Question: ${message}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const aiMessage = responseText || "I'm sorry, I couldn't process your request."

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json(
      {
        message:
          "I'm experiencing some technical difficulties. Please try again later or contact support if the issue persists.",
      },
      { status: 500 },
    )
  }
}
