import { NextRequest, NextResponse } from 'next/server'
import { getAllBadges, createBadge } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    let badges = await getAllBadges()

    if (category && category !== 'all') {
      badges = badges.filter(badge => badge.category === category)
    }

    if (search) {
      badges = badges.filter(badge => 
        badge.name.toLowerCase().includes(search.toLowerCase()) ||
        (badge.description && badge.description.toLowerCase().includes(search.toLowerCase()))
      )
    }

    return NextResponse.json({
      success: true,
      data: badges,
      total: badges.length
    })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch badges' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Create new badge
    const badge = await createBadge({
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      category: data.category,
      criteria: data.criteria,
      pointsRequired: data.pointsRequired ? parseInt(data.pointsRequired) : undefined,
      isActive: data.isActive !== undefined ? data.isActive : true,
    })

    return NextResponse.json({
      success: true,
      data: badge,
      message: 'Badge created successfully'
    })
  } catch (error) {
    console.error('Error creating badge:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create badge' },
      { status: 500 }
    )
  }
}