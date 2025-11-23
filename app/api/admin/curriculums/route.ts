import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAllCurriculums, createCurriculum } from '@/lib/db-utils'

export async function GET() {
  try {
    const curricula = await getAllCurriculums()

    return NextResponse.json({
      success: true,
      data: curricula,
    })
  } catch (error) {
    console.error('Error fetching curricula:', error)
    return NextResponse.json(
      { error: 'Failed to fetch curricula' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      field,
      level,
      duration,
      isActive = true,
    } = await request.json()

    if (!name || !field) {
      return NextResponse.json(
        { error: 'Name and field are required' },
        { status: 400 }
      )
    }

    const curriculum = await createCurriculum({
      name,
      description,
      field: field as 'MEDICAL' | 'NURSING' | 'PHARMACY',
      level: level || undefined,
      duration: duration || undefined,
      isActive,
    })

    return NextResponse.json({
      success: true,
      data: curriculum,
      message: 'Curriculum created successfully',
    })
  } catch (error) {
    console.error('Error creating curriculum:', error)
    return NextResponse.json(
      { error: 'Failed to create curriculum' },
      { status: 500 }
    )
  }
}