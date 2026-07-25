import { NextRequest, NextResponse } from 'next/server'
import { validateUser } from '@/lib/db-utils'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate user credentials
    const user = await validateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // TEMPORARY: Bypass OTP verification for development
    // if (user.isVerified === false) {
    //   return NextResponse.json(
    //     { error: 'Please verify your account to continue', requireOtp: true, userId: user.id },
    //     { status: 403 }
    //   )
    // }

    // Update last login time
    // (Implementation would go here)

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: rememberMe ? '30d' : '7d' } // 30 days for remember me, 7 days otherwise
    )

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        field: user.field,
        level: user.level,
        points: user.points,
        streak: user.streak,
      },
      success: true,
      message: 'Login successful'
    })

    // Set httpOnly cookie with appropriate expiration
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60 // 30 days or 7 days in seconds

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    })

    // Also set a non-httpOnly cookie for client-side user data
    response.cookies.set('synapse-user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      field: user.field,
      level: user.level,
      points: user.points,
      streak: user.streak,
    }), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}