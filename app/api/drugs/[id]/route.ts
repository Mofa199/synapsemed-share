import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const drugId = params.id
    
    // Fetch drug from database
    const drug = await prisma.drug.findUnique({
      where: { id: drugId },
      include: {
        drugClass: {
          select: {
            name: true,
            category: true,
          }
        }
      }
    })

    if (!drug) {
      return NextResponse.json({ error: "Drug not found" }, { status: 404 })
    }

    return NextResponse.json({ drug })
  } catch (error) {
    console.error("Drugs API Error:", error)
    return NextResponse.json({ error: "Failed to get drug" }, { status: 500 })
  }
}