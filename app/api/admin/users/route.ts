import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// GET /api/admin/users - Get all users for admin dashboard
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role as string)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const role = searchParams.get('role')
    const field = searchParams.get('field')

    let whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (role) {
      whereClause.role = role
    }

    if (field) {
      whereClause.field = field
    }

    const skip = (page - 1) * limit

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          field: true,
          level: true,
          points: true,
          streak: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.user.count({ where: whereClause })
    ])

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER'].includes(user.role as string)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, password, role, field } = body

    if (!name || !email || !password || !role || !field) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 400 })
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        field,
        level: 1,
        points: 0,
        streak: 0,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        field: true,
        level: true,
        points: true,
        isActive: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: newUser
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create user'
    }, { status: 500 })
  }
}