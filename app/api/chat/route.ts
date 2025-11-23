import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    // Use DeepSeek API instead of OpenAI
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are a helpful medical education assistant for Synapse Med, an online learning platform for medical, nursing, and pharmacy students. 

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
- Focus on learning and education, not diagnosis or treatment advice`,
          },
          ...history,
          { role: "user", content: message },
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || "I'm sorry, I couldn't process your request."

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
