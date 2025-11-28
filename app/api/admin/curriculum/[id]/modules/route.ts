import { type NextRequest, NextResponse } from "next/server"
import { getModulesByCurriculum, createModule } from '@/lib/db-utils'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const modules = await getModulesByCurriculum(params.id)
    return NextResponse.json(modules)
  } catch (error) {
    console.error("Error fetching modules:", error)
    return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const moduleData = {
      name: body.name,
      description: body.description,
      duration: body.duration,
      difficulty: body.difficulty,
      prerequisites: body.prerequisites,
      objectives: body.objectives,
      curriculumId: params.id,
      isActive: body.isActive !== undefined ? body.isActive : true,
    }

    // Remove undefined values
    Object.keys(moduleData).forEach(key => {
      if (moduleData[key as keyof typeof moduleData] === undefined) {
        delete moduleData[key as keyof typeof moduleData]
      }
    })

    const module = await createModule(moduleData)

    return NextResponse.json({
      success: true,
      data: module,
      message: "Module created successfully",
    })
  } catch (error) {
    console.error("Error creating module:", error)
    return NextResponse.json({ success: false, error: "Failed to create module" }, { status: 500 })
  }
}