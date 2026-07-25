import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const modules = await prisma.module.findMany({
      where: { curriculumId: id },
      include: {
        _count: {
          select: { topics: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    
    return NextResponse.json(modules);
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch modules" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json()

    const moduleData = {
      name: body.title || body.name,
      description: body.description,
      curriculumId: id,
      isActive: body.isActive !== undefined ? body.isActive : true,
    }

    // Remove undefined values
    Object.keys(moduleData).forEach(key => {
      if (moduleData[key as keyof typeof moduleData] === undefined) {
        delete moduleData[key as keyof typeof moduleData]
      }
    })

    const newModule = await prisma.module.create({
      data: moduleData
    });

    return NextResponse.json({
      success: true,
      data: newModule,
      message: "Module created successfully",
    });
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json({ success: false, error: "Failed to create module" }, { status: 500 });
  }
}