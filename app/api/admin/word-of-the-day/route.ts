import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// import { checkAndRotateIfNeeded } from '@/lib/word-of-the-day-service'

export async function GET() {
  try {
    // TODO: Enable after Prisma client regeneration
    // await checkAndRotateIfNeeded()

    // Get today's date in EAT (East Africa Time - UTC+3)
    const now = new Date()
    const eatOffset = 3 * 60 * 60 * 1000 // 3 hours in milliseconds
    const eatDate = new Date(now.getTime() + eatOffset)
    const today = new Date(eatDate.getFullYear(), eatDate.getMonth(), eatDate.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    // For now, return a default word until the database is set up
    const defaultWord = {
      id: 'default-1',
      word: 'Synapse',
      definition: 'A structure that permits a neuron to pass an electrical or chemical signal to another neuron.',
      pronunciation: '/ˈsaɪnæps/',
      etymology: 'From Greek synapsis, meaning "conjunction"',
      category: 'Neurology',
      difficulty: 'INTERMEDIATE',
      example: 'The synapse is the fundamental communication structure in the nervous system.',
      dateScheduled: today.toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: defaultWord,
    })
  } catch (error) {
    console.error('Error fetching word of the day:', error)
    return NextResponse.json(
      { error: 'Failed to fetch word of the day' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // TODO: Enable after Prisma migration
  return NextResponse.json(
    { error: 'Feature not yet available - database migration pending' },
    { status: 501 }
  )
}

export async function PUT(request: NextRequest) {
  // TODO: Enable after Prisma migration
  return NextResponse.json(
    { error: 'Feature not yet available - database migration pending' },
    { status: 501 }
  )
}

export async function DELETE(request: NextRequest) {
  // TODO: Enable after Prisma migration
  return NextResponse.json(
    { error: 'Feature not yet available - database migration pending' },
    { status: 501 }
  )
}