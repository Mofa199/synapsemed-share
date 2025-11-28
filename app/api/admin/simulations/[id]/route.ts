import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/admin/simulations/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch the simulation
    const simulation = await prisma.topic.findUnique({
      where: {
        id,
        type: "INTERACTIVE",
      },
    })

    if (!simulation) {
      return new NextResponse("Simulation not found", { status: 404 })
    }

    // Parse tags from JSON string
    const simulationWithTags = {
      ...simulation,
      tags: simulation.tags ? JSON.parse(simulation.tags) : []
    };

    return NextResponse.json({ success: true, data: simulationWithTags })
  } catch (error) {
    console.error("Error fetching simulation:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// PUT /api/admin/simulations/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()
    
    const { 
      title, 
      description, 
      content, 
      type, 
      difficulty, 
      duration, 
      category, 
      tags, 
      isPublished 
    } = body

    // Update the simulation
    const simulation = await prisma.topic.update({
      where: {
        id,
        type: "INTERACTIVE",
      },
      data: {
        title,
        description,
        content: content || "",
        type: type || "INTERACTIVE",
        difficulty: difficulty as any,
        duration: duration || null,
        category: category || null,
        tags: JSON.stringify(tags), // Convert to JSON string for SQLite
        isPublished,
      },
    })

    return NextResponse.json({ success: true, data: simulation })
  } catch (error) {
    console.error("Error updating simulation:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// DELETE /api/admin/simulations/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete the simulation
    await prisma.topic.delete({
      where: {
        id,
        type: "INTERACTIVE",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting simulation:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}