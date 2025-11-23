import { type NextRequest, NextResponse } from "next/server"
import { getModuleById, updateModule, deleteModule } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const module = await getModuleById(params.moduleId)
    
    if (!module) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: module })
  } catch (error) {
    console.error("Error fetching module:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch module" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const body = await request.json()

    const moduleData = {
      name: body.name,
      description: body.description,
      duration: body.duration,
      difficulty: body.difficulty,
      prerequisites: body.prerequisites,
      isActive: body.isActive,
    }

    // Remove undefined values
    Object.keys(moduleData).forEach(key => {
      if (moduleData[key as keyof typeof moduleData] === undefined) {
        delete moduleData[key as keyof typeof moduleData]
      }
    })

    const module = await updateModule(params.moduleId, moduleData)

    return NextResponse.json({
      success: true,
      data: module,
      message: "Module updated successfully",
    })
  } catch (error) {
    console.error("Error updating module:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update module" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    await deleteModule(params.moduleId)

    return NextResponse.json({
      success: true,
      message: "Module deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting module:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete module" },
      { status: 500 }
    )
  }
}