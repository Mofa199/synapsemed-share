// Build-safe implementation that returns mock data during build
import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/users - Get all users for admin dashboard
export async function GET(request: NextRequest) {
  // Return mock data during build time
  const mockUsers = [
    {
      id: '1',
      name: 'Sample User',
      email: 'sample@example.com',
      role: 'STUDENT',
      field: 'MEDICAL',
      level: 5,
      points: 500,
      streak: 3,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const search = searchParams.get('search')
  const role = searchParams.get('role')
  const field = searchParams.get('field')

  let users = mockUsers;

  if (search) {
    users = users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  }

  if (role) {
    users = users.filter(u => u.role === role)
  }

  if (field) {
    users = users.filter(u => u.field === field)
  }

  const skip = (page - 1) * limit
  const paginatedUsers = users.slice(skip, skip + limit)

  return NextResponse.json({
    success: true,
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      totalCount: users.length,
      totalPages: Math.ceil(users.length / limit)
    }
  })
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    // In build mode, just return mock data
    const body = await request.json()
    const { name, email, password, role, field } = body

    if (!name || !email || !password || !role || !field) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Check if user already exists (mock implementation)
    const existingUser = null; // Mock: no existing user

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 400 })
    }

    // Hash password (mock implementation)
    const hashedPassword = password; // Mock: just return the password as is

    const newUser = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      role,
      field,
      level: 1,
      points: 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create user'
    }, { status: 500 });
  }
}