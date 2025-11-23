import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/admin/simulations
export async function GET(req: NextRequest) {
  try {
    // Fetch all simulations
    const simulations = await prisma.topic.findMany({
      where: {
        type: "INTERACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Parse tags from JSON strings
    const simulationsWithTags = simulations.map(simulation => ({
      ...simulation,
      tags: simulation.tags ? JSON.parse(simulation.tags) : []
    }));

    return NextResponse.json({ success: true, data: simulationsWithTags })
  } catch (error) {
    console.error("Error fetching simulations:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// POST /api/admin/simulations
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const content = formData.get('content') as string
    const type = formData.get('type') as string
    const difficulty = formData.get('difficulty') as string
    const duration = formData.get('duration') as string
    const category = formData.get('category') as string
    const tags = JSON.parse(formData.get('tags') as string || '[]')
    const isPublished = formData.get('isPublished') === 'true'

    // Create the simulation as a topic with interactive type
    const simulation = await prisma.topic.create({
      data: {
        title,
        description,
        content: content || "",
        type: "INTERACTIVE",
        difficulty: difficulty as any,
        duration: duration || null,
        category: category || null,
        tags: JSON.stringify(tags), // Convert to JSON string for SQLite
        isPublished,
        views: 0,
      },
    })

    return NextResponse.json({ success: true, data: simulation })
  } catch (error) {
    console.error("Error creating simulation:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}