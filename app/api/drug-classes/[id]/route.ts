import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const drugClassId = params.id
    
    // Fetch drug class from database
    const drugClass = await prisma.drugClass.findUnique({
      where: { id: drugClassId },
      include: {
        drugs: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      }
    })

    if (!drugClass) {
      return NextResponse.json({ error: "Drug class not found" }, { status: 404 })
    }

    return NextResponse.json({ drugClass })
  } catch (error) {
    console.error("Drug Classes API Error:", error)
    return NextResponse.json({ error: "Failed to get drug class" }, { status: 500 })
  }
}