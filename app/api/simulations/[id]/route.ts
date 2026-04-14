import { type NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const simulationId = (await params).id
    
    // Fetch simulation from database
    const simulation = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      }
    })

    if (!simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 })
    }

    return NextResponse.json({ simulation })
  } catch (error) {
    console.error("Simulations API Error:", error)
    return NextResponse.json({ error: "Failed to get simulation" }, { status: 500 })
  }
}