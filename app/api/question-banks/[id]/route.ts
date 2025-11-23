import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const questionBankId = params.id
    
    // Fetch question bank from database
    const questionBank = await prisma.questionBank.findUnique({
      where: { id: questionBankId },
      include: {
        questions: {
          orderBy: { createdAt: 'asc' },
        },
      }
    })

    if (!questionBank) {
      return NextResponse.json({ error: "Question bank not found" }, { status: 404 })
    }

    return NextResponse.json({ questionBank })
  } catch (error) {
    console.error("Question Banks API Error:", error)
    return NextResponse.json({ error: "Failed to get question bank" }, { status: 500 })
  }
}